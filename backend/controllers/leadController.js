const Lead = require('../models/Lead');
const College = require('../models/College');
const Course = require('../models/Course');

exports.createLead = async (req, res) => {
  try {
    const { studentName, mobile, email, city, course, college, message } = req.body;
    if (!studentName || !mobile)
      return res.status(400).json({ success: false, message: 'Name and mobile are required' });
    const lead = await Lead.create({ studentName, mobile, email, city, course, college, message });
    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { studentName: new RegExp(search, 'i') },
        { mobile: new RegExp(search, 'i') },
        { college: new RegExp(search, 'i') },
        { course: new RegExp(search, 'i') },
      ];
    }
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalColleges, totalCourses, totalLeads, newLeads, recentLeads] = await Promise.all([
      require('../models/College').countDocuments(),
      require('../models/Course').countDocuments(),
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      Lead.find().sort({ createdAt: -1 }).limit(10),
    ]);
    res.json({ success: true, stats: { totalColleges, totalCourses, totalLeads, newLeads }, recentLeads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
