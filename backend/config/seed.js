const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const College = require('../models/College');
const Course = require('../models/Course');
const Setting = require('../models/Setting');

const connectDB = require('./db');

const seed = async () => {
  await connectDB();

  // Clear existing
  await Admin.deleteMany();
  await College.deleteMany();
  await Course.deleteMany();
  await Setting.deleteMany();

  // Create admin
  await Admin.create({ name: 'Admin', email: 'admin@yourcollege.com', password: 'admin123' });

  // Create sample courses
  await Course.insertMany([
    { name: 'BBA', duration: '3 Years', eligibility: '10+2 in any stream', description: 'Bachelor of Business Administration - a comprehensive management program.' },
    { name: 'BCA', duration: '3 Years', eligibility: '10+2 with Maths', description: 'Bachelor of Computer Applications - focused on computer science and IT.' },
    { name: 'B.Com', duration: '3 Years', eligibility: '10+2 with Commerce', description: 'Bachelor of Commerce - covers accounting, finance and business studies.' },
    { name: 'MBA', duration: '2 Years', eligibility: 'Any graduation + entrance exam', description: 'Master of Business Administration - advanced management program.' },
    { name: 'MCA', duration: '2 Years', eligibility: 'BCA/B.Sc (CS/IT)', description: 'Master of Computer Applications - advanced computer science program.' },
  ]);

  // Create sample colleges
  await College.insertMany([
    {
      name: 'Delhi Institute of Management', image: '', city: 'New Delhi', state: 'Delhi',
      location: 'New Delhi, Delhi', type: 'Private', description: 'A leading management institute in the capital city offering world-class education.',
      courses: ['BBA', 'MBA'], fees: '₹1.5 - 3 Lakhs/Year', eligibility: '10+2 for UG, Graduation for PG',
      admissionInfo: 'Admission based on merit and entrance test. Apply online or visit campus.',
      website: 'https://example.com', featured: true, status: 'active'
    },
    {
      name: 'Mumbai College of Technology', image: '', city: 'Mumbai', state: 'Maharashtra',
      location: 'Mumbai, Maharashtra', type: 'Private', description: 'Top technology and computer science college offering cutting-edge programs.',
      courses: ['BCA', 'MCA'], fees: '₹1 - 2.5 Lakhs/Year', eligibility: '10+2 with Maths',
      admissionInfo: 'Entrance test + merit-based selection. Scholarships available.',
      website: '', featured: true, status: 'active'
    },
    {
      name: 'Bangalore Commerce College', image: '', city: 'Bangalore', state: 'Karnataka',
      location: 'Bangalore, Karnataka', type: 'Government', description: 'Prestigious government college offering commerce and business studies.',
      courses: ['B.Com', 'BBA'], fees: '₹50,000 - 1 Lakh/Year', eligibility: '10+2 with Commerce',
      admissionInfo: 'Merit-based admission. Government quota seats available.',
      website: '', featured: false, status: 'active'
    },
  ]);

  // Create default settings
  await Setting.create({
    websiteName: 'Your College', phone: '+91 98765 43210',
    email: 'info@yourcollege.com', address: 'New Delhi, India'
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin Email: admin@yourcollege.com');
  console.log('🔑 Admin Password: admin123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
