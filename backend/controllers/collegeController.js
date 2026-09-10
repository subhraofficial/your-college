const College = require('../models/College');
const mongoose = require('mongoose');
const slugify = require('../utils/slugify');
const { submitToIndexNow } = require('../utils/indexNow');


// ======================================================
// GET ALL COLLEGES
// ======================================================
exports.getColleges = async (req, res) => {
  try {
    const { search, location, featured } = req.query;

    const filter = {};

    // Public users only see active colleges
    // Admin can see all colleges
    if (!req.admin) {
      filter.status = 'active';
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (location) {
      filter.$or = [
        { city: new RegExp(location, 'i') },
        { state: new RegExp(location, 'i') }
      ];
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
        { courses: new RegExp(search, 'i') }
      ];
    }

    const colleges = await College
      .find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: colleges.length,
      colleges
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ======================================================
// GET SINGLE COLLEGE
// Supports BOTH:
// /colleges/:mongodb_id
// /colleges/:slug
// ======================================================
exports.getCollege = async (req, res) => {
  try {
    const identifier = req.params.id;

    let college = null;

    // First try MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      college = await College.findById(identifier);
    }

    // If not found, try slug
    if (!college) {
      college = await College.findOne({
        slug: identifier.toLowerCase()
      });
    }

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      college
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ======================================================
// CREATE COLLEGE
// Automatically generates SEO-friendly slug
// ======================================================
exports.createCollege = async (req, res) => {
  try {
    const data = { ...req.body };

    // Generate slug from college name
    if (data.name) {
      let baseSlug = slugify(data.name);
      let slug = baseSlug;
      let counter = 2;

      // Prevent duplicate slugs
      while (await College.exists({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      data.slug = slug;
    }

    const college = await College.create(data);
    if (college.slug && college.status === 'active') {
  submitToIndexNow([
    `https://yourcollege.in/colleges/${college.slug}`,
  ]);
}

    res.status(201).json({
      success: true,
      college
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


// ======================================================
// UPDATE COLLEGE
// Existing slug stays unchanged.
// This is important for SEO stability.
// ======================================================
exports.updateCollege = async (req, res) => {
  try {
    const existingCollege = await College.findById(req.params.id);

    if (!existingCollege) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    const data = { ...req.body };

    // If college already has a slug, keep it.
    // This prevents old Google links from breaking.
    if (!existingCollege.slug) {
      if (data.name || existingCollege.name) {
        const nameForSlug = data.name || existingCollege.name;

        let baseSlug = slugify(nameForSlug);
        let slug = baseSlug;
        let counter = 2;

        while (
          await College.exists({
            slug,
            _id: { $ne: existingCollege._id }
          })
        ) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        data.slug = slug;
      }
    }

    const college = await College.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true
      }
    );

    if (college?.slug) {
      submitToIndexNow([
        `https://yourcollege.in/colleges/${college.slug}`,
      ]);
    }

    res.json({
      success: true,
      college
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


// ======================================================
// DELETE COLLEGE
// ======================================================
exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.json({
      success: true,
      message: 'College deleted'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};