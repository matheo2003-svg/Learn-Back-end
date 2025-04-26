const express = require("express");
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(express.static("public")); // Serve static files like booking.js, CSS, etc.

// Routes
app.use("/", authRoutes);
app.use('/', bookingRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
