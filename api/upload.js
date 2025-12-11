const { put } = require('@vercel/blob');
const { connectDB } = require('./_lib/db');
const { verifyAuth } = require('./_lib/auth');
const Image = require('./_models/Image');

// Disable body parsing for file uploads
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const auth = await verifyAuth(req);
  if (auth.error) return res.status(auth.status).json({ message: auth.error });

  await connectDB();

  try {
    // Get form data from the request
    const contentType = req.headers['content-type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ message: 'Content-Type must be multipart/form-data' });
    }

    // Parse multipart form data manually
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Parse boundary from content-type
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      return res.status(400).json({ message: 'No boundary found in content-type' });
    }

    // Parse the multipart data
    const parts = parseMultipart(buffer, boundary);
    
    const filePart = parts.find(p => p.filename);
    const patientNamePart = parts.find(p => p.name === 'patientName');
    const datePart = parts.find(p => p.name === 'date');
    const notesPart = parts.find(p => p.name === 'notes');

    if (!filePart) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const patientName = patientNamePart?.value || 'Unknown';
    const date = datePart?.value ? new Date(datePart.value) : new Date();
    const notes = notesPart?.value || '';

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = filePart.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blobPath = `images/${auth.user._id}/${timestamp}-${safeName}`;

    // Upload to Vercel Blob
    const blob = await put(blobPath, filePart.data, {
      access: 'public',
      contentType: filePart.contentType || 'application/octet-stream',
    });

    // Save to database
    const image = await Image.create({
      user: auth.user._id,
      patientName,
      date,
      description: notes,
      filename: safeName,
      originalName: filePart.filename,
      url: blob.url,
      mimeType: filePart.contentType || 'image/jpeg',
      size: filePart.data.length,
    });

    return res.status(201).json(image);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: error.message || 'Upload failed' });
  }
};

// Helper function to parse multipart form data
function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const endBoundaryBuffer = Buffer.from(`--${boundary}--`);
  
  let start = 0;
  let end = buffer.indexOf(boundaryBuffer, start);
  
  while (end !== -1) {
    start = end + boundaryBuffer.length;
    
    // Skip CRLF after boundary
    if (buffer[start] === 13 && buffer[start + 1] === 10) {
      start += 2;
    }
    
    // Find end of this part
    end = buffer.indexOf(boundaryBuffer, start);
    if (end === -1) break;
    
    // Extract part content (excluding trailing CRLF)
    let partEnd = end - 2;
    if (buffer[partEnd] === 10) partEnd--;
    if (buffer[partEnd] === 13) partEnd--;
    
    const partBuffer = buffer.slice(start, partEnd + 1);
    
    // Parse headers and content
    const headerEnd = partBuffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    
    const headers = partBuffer.slice(0, headerEnd).toString();
    const content = partBuffer.slice(headerEnd + 4);
    
    // Parse Content-Disposition
    const dispositionMatch = headers.match(/Content-Disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i);
    if (!dispositionMatch) continue;
    
    const part = {
      name: dispositionMatch[1],
      filename: dispositionMatch[2] || null,
    };
    
    // Parse Content-Type if present
    const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
    if (contentTypeMatch) {
      part.contentType = contentTypeMatch[1].trim();
    }
    
    if (part.filename) {
      part.data = content;
    } else {
      part.value = content.toString();
    }
    
    parts.push(part);
  }
  
  return parts;
}

