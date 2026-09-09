const College = require('../models/College');

exports.getColleges = async (req, res) => {
  try {
    const { search, location, featured } = req.query;
    const filter = {};
    // For public, only show active; admin can see all
    if (!req.admin) filter.status = 'active';
    if (featured === 'true') filter.featured = true;
    if (location) filter.$or = [{ city: new RegExp(location, 'i') }, { state: new RegExp(location, 'i') }];
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { city: new RegExp(search, 'i') }, { courses: new RegExp(search, 'i') }];
    const colleges = await College.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: colleges.length, colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });
    res.json({ success: true, college });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json({ success: true, college });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });
    res.json({ success: true, college });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return res.status(404).json({ success: false, message: 'College not found' });
    res.json({ success: true, message: 'College deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
