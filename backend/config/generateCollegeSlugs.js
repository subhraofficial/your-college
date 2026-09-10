require('dotenv').config({
  path: require('path').join(__dirname, '../.env')
});

const dns = require('dns');

// Use reliable public DNS servers for MongoDB Atlas SRV lookup
dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);

const mongoose = require('mongoose');
const College = require('../models/College');
const slugify = require('../utils/slugify');

const MONGODB_URI = process.env.MONGODB_URI;


async function generateCollegeSlugs() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not configured');
    }

    console.log('Connecting to MongoDB...');

    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');
    console.log('Starting college slug migration...\n');

    const colleges = await College.find({});

    let updated = 0;
    let skipped = 0;

    for (const college of colleges) {

      // Keep existing slugs unchanged
      if (college.slug) {
        console.log(
          `SKIPPED: ${college.name} → ${college.slug}`
        );

        skipped++;
        continue;
      }

      // Skip colleges without a name
      if (!college.name) {
        console.log(
          `SKIPPED: College has no name (${college._id})`
        );

        skipped++;
        continue;
      }

      const baseSlug = slugify(college.name);

      if (!baseSlug) {
        console.log(
          `SKIPPED: Could not create slug for ${college.name}`
        );

        skipped++;
        continue;
      }

      let slug = baseSlug;
      let counter = 2;

      // Make sure the slug is unique
      while (
        await College.exists({
          slug,
          _id: { $ne: college._id }
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      college.slug = slug;

      await college.save();

      console.log(
        `UPDATED: ${college.name} → ${slug}`
      );

      updated++;
    }

    console.log('\n--------------------------------');
    console.log('College slug migration completed');
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total:   ${colleges.length}`);
    console.log('--------------------------------');

  } catch (error) {

    console.error('\nMigration failed:');
    console.error(error.message);

    process.exitCode = 1;

  } finally {

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

  }
}


generateCollegeSlugs();