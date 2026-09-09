const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const connectDB = require('./config/db');

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
