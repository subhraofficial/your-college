const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  city: { type: String, trim: true },
  course: { type: String, trim: true },
  college: { type: String, trim: true },
  message: { type: String },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Follow-up', 'Converted', 'Not Interested'],
    default: 'New',
  },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
