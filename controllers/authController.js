const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getConnection = require("../config/database");
const { sendWelcomeEmail } = require("../utils/mailer");

// Register User
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    let connection;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send("Invalid email format");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        connection = await getConnection();

        await connection.execute(
            `INSERT INTO users (username, email, password) VALUES (:username, :email, :password)`,
            [username, email, hashedPassword],
            { autoCommit: true }
        );
         // on this section write code for what you want to happen in successful registration
        //res.send(`<h1>Thank you, ${username}!</h1><p>We received your registration EMAIL: ${email}</p>`);
        
        try {
            await sendWelcomeEmail(email, username);
            console.log("Welcome email sent successfully.");
        } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
        }

    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).send("Error saving data");
    } finally {
        if (connection) await connection.close();
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    let connection;

    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT id, username, email, password FROM users WHERE email = :email`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).send("Invalid email or password");
        }
       
        const user = result.rows[0];
        const userId = user[0]; // id
        const username = user[1];
        const userEmail = user[2];
        const hashedPassword = user[3];

        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        const token = jwt.sign(
            { userId: userId, username: username, email: userEmail },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set true if using HTTPS
            maxAge: 3600000 // 1 hour
        });

      //  res.redirect(`/dashboard?token=${token}`);
        res.redirect(`/dashboard.html?token=${token}`);

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Error during login");
    } finally {
        if (connection) await connection.close();
    }
};

// Dashboard
/*exports.dashboard = (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.send(`
            <h1>Welcome, <span id="username">${decoded.username}</span>!</h1>
            <p>Email: <span id="email">${decoded.email}</span></p>
            <button onclick="logout()">Logout</button>

            <script>
                function logout() {
                    localStorage.removeItem('token');
                    window.location.href = '/front-end.html';
                }
            </script>
        `);
    } catch (error) {
        res.status(401).send("Unauthorized: Invalid token");
    }
};*/
