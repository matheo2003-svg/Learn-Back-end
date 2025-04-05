const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const getConnection = require("./config/database");

require('dotenv').config();  // Ensure dotenv is loaded
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files (HTML, CSS, JS)

// Serve front-end.html as the homepage
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/front-end.html");
});

// Handle form submission (Registration)
app.post("/submit", async (req, res) => {
    const { username, email, password } = req.body;
    let connection;

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid email format");
    }

    // Password Hashing
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        return res.status(500).send("Error hashing password");
    }

    try {
        connection = await getConnection();

        const result = await connection.execute(
            `INSERT INTO users (username, email, password) VALUES (:username, :email, :password)`,
            [username, email, hashedPassword],
            { autoCommit: true }
        );

        res.send(`<h1>Thank you, ${username}!</h1><p>We received your email: ${email}</p>`);
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error saving data");
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let connection;

    try {
        connection = await getConnection();

        // Query for the user based on the email
        const result = await connection.execute(
            `SELECT username, email, password FROM users WHERE email = :email`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).send("Invalid email or password");
        }

        const user = result.rows[0];

        // Compare the password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user[2]); // user[2] is the hashed password

        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        // Create a JWT token with both username and email
        const token = jwt.sign(
            { username: user[0], email: user[1] },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the token in the response and redirect to the dashboard
        res.redirect(`/dashboard?token=${token}`);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error during login");
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// Dashboard Route (Protected)
app.get("/dashboard", (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Render the dashboard with the decoded user data
        res.send(`
            <h1>Welcome, <span id="username">${decoded.username}</span>!</h1>
            <p>Email: <span id="email">${decoded.email}</span></p>
            <button onclick="logout()">Logout</button>

            <script>
                function logout() {
                    // Clear the token from client storage and redirect to login
                    localStorage.removeItem('token');
                    window.location.href = '/front-end.html';
                }
            </script>
        `);
    } catch (error) {
        return res.status(401).send("Unauthorized: Invalid token");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
