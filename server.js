const express = require("express");
const bodyParser = require("body-parser");
const getConnection = require("./config/database");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Handle form submission
app.post("/submit", async (req, res) => {
    const { username, email, password} = req.body;
    let connection;

    try {
        connection = await getConnection();
        const result = await connection.execute(
            `INSERT INTO users (username, email, password) VALUES ( :username, :email, :password)`,
            [ username, email, password],
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

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
