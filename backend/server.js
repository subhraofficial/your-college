const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const connectDB = require('./config/db');
const College = require('./models/College');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', require('./routes/auth'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/settings', require('./routes/settings'));

// ================================
// SEO - Dynamic XML Sitemap
// ================================

app.get('/sitemap.xml', async (req, res) => {
  try {
    const colleges = await College.find(
      { status: 'active' },
      { slug: 1, updatedAt: 1 }
    ).sort({ name: 1 });

    const baseUrl = 'https://yourcollege.in';

    const staticUrls = [
      {
        loc: `${baseUrl}/`,
        priority: '1.0',
        changefreq: 'weekly',
      },
      {
        loc: `${baseUrl}/colleges`,
        priority: '0.9',
        changefreq: 'daily',
      },
      {
        loc: `${baseUrl}/courses`,
        priority: '0.8',
        changefreq: 'weekly',
      },
      {
        loc: `${baseUrl}/about`,
        priority: '0.5',
        changefreq: 'monthly',
      },
      {
        loc: `${baseUrl}/contact`,
        priority: '0.5',
        changefreq: 'monthly',
      },
    ];

    const collegeUrls = colleges
      .filter((college) => college.slug)
      .map((college) => ({
        loc: `${baseUrl}/colleges/${college.slug}`,
        lastmod: college.updatedAt
          ? new Date(college.updatedAt).toISOString()
          : undefined,
        priority: '0.8',
        changefreq: 'weekly',
      }));

    const urls = [...staticUrls, ...collegeUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation failed:', error.message);

    res.status(500).send(
      '<?xml version="1.0" encoding="UTF-8"?><error>Sitemap generation failed</error>'
    );
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Your College API is running' }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: "error",
        server: "online",
        database: "disconnected"
      });
    }

    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      status: "ok",
      server: "online",
      database: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check failed:", error.message);

    res.status(503).json({
      status: "error",
      server: "online",
      database: "disconnected"
    });
  }
});
