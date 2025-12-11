const { del } = require('@vercel/blob');
const { connectDB } = require('./_lib/db');
const { verifyAuth } = require('./_lib/auth');
const Image = require('./_models/Image');

module.exports = async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (auth.error) return res.status(auth.status).json({ message: auth.error });

  await connectDB();
  const { id } = req.query;

  // GET /api/images
  if (req.method === 'GET' && !id) {
    const { search, date } = req.query;
    const query = { user: auth.user._id };
    if (search) query.patientName = { $regex: search, $options: 'i' };
    if (date) {
      const start = new Date(date); start.setHours(0,0,0,0);
      const end = new Date(date); end.setHours(23,59,59,999);
      query.date = { $gte: start, $lte: end };
    }
    const images = await Image.find(query).sort({ date: -1, createdAt: -1 }).populate('user', 'name email');
    return res.status(200).json(images);
  }

  // GET /api/images?id=xxx
  if (req.method === 'GET' && id) {
    const image = await Image.findById(id).populate('user', 'name email');
    if (!image) return res.status(404).json({ message: 'Image not found' });
    if (image.user._id.toString() !== auth.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    return res.status(200).json(image);
  }

  // DELETE /api/images?id=xxx
  if (req.method === 'DELETE' && id) {
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    if (image.user.toString() !== auth.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    if (image.url?.includes('blob.vercel-storage.com')) { try { await del(image.url); } catch(e) {} }
    await Image.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Image deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

