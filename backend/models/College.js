const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  location: { type: String, trim: true },
  type: { type: String, enum: ['Government', 'Private', 'Deemed', 'Autonomous'], default: 'Private' },
  description: { type: String },
  courses: [{ type: String }],
  fees: { type: String },
  eligibility: { type: String },
  admissionInfo: { type: String },
  website: { type: String },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema);
