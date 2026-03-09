const { connectDB } = require('./_lib/db');
const { verifyAuth } = require('./_lib/auth');
const Invoice = require('./_models/Invoice');

module.exports = async function handler(req, res) {
  const auth = await verifyAuth(req);
  if (auth.error) return res.status(auth.status).json({ message: auth.error });

  await connectDB();
  const { id } = req.query;

  // GET /api/invoices - all invoices
  if (req.method === 'GET' && !id) {
    const invoices = await Invoice.find({ user: auth.user._id }).populate('user', 'name email');
    return res.status(200).json(invoices);
  }

  // GET /api/invoices?id=xxx
  if (req.method === 'GET' && id) {
    const invoice = await Invoice.findById(id).populate('user', 'name email');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (invoice.user._id.toString() !== auth.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    return res.status(200).json(invoice);
  }

  // POST /api/invoices
  if (req.method === 'POST') {
    try {
      const { invoiceNumber, invoiceDate, dueDate, billFrom, billTo, items, notes, paymentTerms } = req.body;
      let subtotal = 0, taxTotal = 0;
      items.forEach(item => { subtotal += item.unitPrice * item.quantity; taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100; });
      const invoice = new Invoice({ user: auth.user._id, invoiceNumber, invoiceDate, dueDate, billFrom, billTo, items, notes, paymentTerms, subtotal, taxTotal, total: subtotal + taxTotal });
      await invoice.save();
      return res.status(201).json(invoice);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/invoices?id=xxx
  if (req.method === 'PUT' && id) {
    try {
      const { invoiceNumber, invoiceDate, dueDate, billFrom, billTo, items, notes, paymentTerms, status } = req.body;
      let subtotal = 0, taxTotal = 0;
      if (items?.length) items.forEach(item => { subtotal += item.unitPrice * item.quantity; taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100; });
      const updated = await Invoice.findByIdAndUpdate(id, { invoiceNumber, invoiceDate, dueDate, billFrom, billTo, items, notes, paymentTerms, status, subtotal, taxTotal, total: subtotal + taxTotal }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Invoice not found' });
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/invoices?id=xxx
  if (req.method === 'DELETE' && id) {
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    return res.status(200).json({ message: 'Invoice deleted' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};

