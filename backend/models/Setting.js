const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  websiteName: { type: String, default: 'Your College' },
  logo: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
