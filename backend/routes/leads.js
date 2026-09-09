const express = require('express');
const router = express.Router();
const {
  createLead, getLeads, getLead, updateLead, deleteLead, getDashboardStats
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

// Public
router.post('/', createLead);

// Protected
router.get('/dashboard', protect, getDashboardStats);
router.get('/', protect, getLeads);
router.get('/:id', protect, getLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

module.exports = router;
