const express = require('express');
const router = express.Router();
const {
  getColleges, getCollege, createCollege, updateCollege, deleteCollege
} = require('../controllers/collegeController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getColleges);
router.get('/:id', getCollege);

// Protected
router.post('/', protect, createCollege);
router.put('/:id', protect, updateCollege);
router.delete('/:id', protect, deleteCollege);

module.exports = router;
