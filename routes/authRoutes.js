const express = require("express");
const path = require("path"); // <-- Import path module
const router = express.Router();
const { registerUser, loginUser, dashboard } = require("../controllers/authController");

// Homepage
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/front-end.html"));
});

// Register
router.post("/submit", registerUser);


// Login
router.post("/login", loginUser);

// Dashboard
router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/dashboard.html"));
});

module.exports = router;
