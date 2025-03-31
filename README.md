# Learn-Back-end
Form-Oracle Application Documentation
Overview
This project is a simple Node.js application that uses Express to handle form submissions and Oracle Database (oracledb) to store user data. The form collects a user's username, email, and password, then stores this data in the Oracle Database.

Prerequisites
Before starting, ensure that you have the following installed on your machine:

Node.js: Download and Install Node.js

Oracle Database: Make sure your Oracle Database is set up and running (locally or remotely).

Installation Steps
1. Clone or Download the Repository
Clone or download this project to your local machine.


git clone <your-repository-url>
cd form-oracle

2. Install Dependencies
Run the following command to install all necessary dependencies:

npm install

This will install:

express: To create the server and handle HTTP requests.

body-parser: To parse incoming form data.

oracledb: To interact with the Oracle Database.

3. Set Up Oracle Database
Ensure you have an Oracle Database running and that you have access to it. You’ll need to create a table to store the form data.

Create the Table in Oracle Database:
Open SQL*Plus or Oracle SQL Developer and execute the following SQL command to create a table:

CREATE TABLE users (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    password VARCHAR2(100) NOT NULL
);

Make sure to modify the database connection details as needed to match your setup.

4. Configure Oracle Database Connection
Create a configuration file to store the database credentials.

File: config/config.js

module.exports = {
    DB_USER: " ",           // Oracle DB username
    DB_PASS: " ",        // Oracle DB password
    DB_HOST: " ", // Oracle DB host and SID
};
You may change the DB_USER, DB_PASS, and DB_HOST values to match your Oracle Database configuration.

5. Set Up the Server
Create the main server file that will handle form submissions and interact with the Oracle Database.

File: server.js

const express = require("express");
const bodyParser = require("body-parser");
const getConnection = require("./config/database");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));  // Serve static files from the "public" folder

// Handle form submission
app.post("/submit", async (req, res) => {
    const { username, email, password } = req.body;
    let connection;

    try {
        connection = await getConnection();
        const result = await connection.execute(
            `INSERT INTO users (username, email, password) VALUES (:username, :email, :password)`,
            [username, email, password],
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

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


6. Create the Front-End Form
The form will send POST data to the server for storage in the Oracle Database.

File: public/front-end.html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form with Oracle</title>
</head>
<body>
    <h2>Contact Form</h2>
    <form action="/submit" method="POST">
        <label for="username">User Name:</label>
        <input type="text" id="username" name="username" required>
        <br><br>

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <br><br>

        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br><br>

        <button type="submit">Submit</button>
    </form>
</body>
</html>


7. Organize Your Project Structure
Ensure that your project directory looks like this:


form-oracle/
│-- config/
│   ├── database.js
│   └── config.js
│-- public/                <-- Contains the HTML form
│   └── front-end.html
│-- server.js              <-- Main server logic
│-- package.json           <-- Dependencies and scripts
│-- node_modules/          <-- Installed dependencies
8. Run the Server
Start the server using the following command:


node server.js
The server will run on http://localhost:3000.

9. Access the Form in the Browser
Open a browser and visit http://localhost:3000/front-end.html to view and submit the form.

10. Test the Form
Fill out the form and submit it. Check your Oracle Database to verify that the submitted data is stored correctly.

Notes
Oracle Database Credentials: Credentials are stored directly in the config/config.js file.

Security: Ensure that in a production environment, you secure your Oracle Database credentials and consider using secure authentication methods.


