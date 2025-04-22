const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const getConnection = require("./config/database");

const nodemailer = require('nodemailer'); // This node is for  sending emails 



require('dotenv').config();  // Ensure dotenv is loaded

const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;


const transporter = nodemailer.createTransport({  // The transporter for the email
    service: 'gmail',
    auth: {
      user: process.env.My_Email,
      pass: process.env.Email_password
    }
  });






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
  
      await connection.execute(
        `INSERT INTO users (username, email, password) VALUES (:username, :email, :password)`,
        [username, email, hashedPassword],
        { autoCommit: true }
      );
  
      res.send(`<h1>Thank you, ${username}!</h1><p>We received your registration EMAIL: ${email}</p>`);
  
      // Send confirmation email
      const mailOptions = {
        from: process.env.My_Email,
        to: email,
        subject: 'Welcome to  GlideConnex!',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden;">
              <div style="background-color: #4CAF50; color: white; padding: 20px 30px;">
                <h1 style="margin: 0;">Welcome, ${username}!</h1>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; color: #333;">Thanks for registering with glide connex.</p>
                <p style="font-size: 16px; color: #333;">We're excited to have you on board!</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 14px; color: #999;">If you have any questions, just reply to this email.</p>
              </div>
              <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #aaa;">
                &copy; ${new Date().getFullYear()} Your Platform. All rights reserved.
              </div>
            </div>
          </div>
        `
      };
      
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });// Ends of confirmation email
  
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
