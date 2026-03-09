const { put, del } = require('@vercel/blob');
const { connectDB } = require('./_lib/db');
const { verifyAuth } = require('./_lib/auth');
const User = require('./_models/User');

// Disable body parsing for file uploads
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (auth.error) return res.status(auth.status).json({ message: auth.error });

  await connectDB();

  // DELETE /api/avatar - remove avatar
  if (req.method === 'DELETE') {
    try {
      const user = await User.findById(auth.user._id);
      if (user.avatar && user.avatar.includes('blob.vercel-storage.com')) {
        try { await del(user.avatar); } catch(e) {}
      }
      user.avatar = '';
      await user.save();
      return res.status(200).json({ message: 'Avatar removed', avatar: '' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // POST /api/avatar - upload avatar
  if (req.method === 'POST') {
    try {
      const contentType = req.headers['content-type'] || '';
      
      if (!contentType.includes('multipart/form-data')) {
        return res.status(400).json({ message: 'Content-Type must be multipart/form-data' });
      }

      // Parse multipart form data
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        return res.status(400).json({ message: 'No boundary found' });
      }

      const parts = parseMultipart(buffer, boundary);
      const filePart = parts.find(p => p.filename);

      if (!filePart) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(filePart.contentType)) {
        return res.status(400).json({ message: 'Only JPEG, PNG, GIF, and WebP images are allowed' });
      }

      // Delete old avatar if exists
      const user = await User.findById(auth.user._id);
      if (user.avatar && user.avatar.includes('blob.vercel-storage.com')) {
        try { await del(user.avatar); } catch(e) {}
      }

      // Upload to Vercel Blob
      const timestamp = Date.now();
      const ext = filePart.filename.split('.').pop() || 'jpg';
      const blobPath = `avatars/${auth.user._id}-${timestamp}.${ext}`;

      const blob = await put(blobPath, filePart.data, {
        access: 'public',
        contentType: filePart.contentType,
      });

      // Update user
      user.avatar = blob.url;
      await user.save();

      return res.status(200).json({ message: 'Avatar updated', avatar: blob.url });
    } catch (error) {
      console.error('Avatar upload error:', error);
      return res.status(500).json({ message: error.message || 'Upload failed' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

// Helper function to parse multipart form data
function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  
  let start = 0;
  let end = buffer.indexOf(boundaryBuffer, start);
  
  while (end !== -1) {
    start = end + boundaryBuffer.length;
    if (buffer[start] === 13 && buffer[start + 1] === 10) start += 2;
    
    end = buffer.indexOf(boundaryBuffer, start);
    if (end === -1) break;
    
    let partEnd = end - 2;
    if (buffer[partEnd] === 10) partEnd--;
    if (buffer[partEnd] === 13) partEnd--;
    
    const partBuffer = buffer.slice(start, partEnd + 1);
    const headerEnd = partBuffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    
    const headers = partBuffer.slice(0, headerEnd).toString();
    const content = partBuffer.slice(headerEnd + 4);
    
    const dispositionMatch = headers.match(/Content-Disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i);
    if (!dispositionMatch) continue;
    
    const part = { name: dispositionMatch[1], filename: dispositionMatch[2] || null };
    
    const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
    if (contentTypeMatch) part.contentType = contentTypeMatch[1].trim();
    
    if (part.filename) part.data = content;
    else part.value = content.toString();
    
    parts.push(part);
  }
  
  return parts;
}

