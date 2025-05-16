const express = require("express");
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(express.static("public")); // Serve static files like html,js, CSS, etc. in the public folder of the repo

// Routes
app.use("/", authRoutes);
app.use('/', bookingRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// Notes to better understand the code

/*
 The connection between your server.js (typically a backend server) and 
 your HTML main page (frontend) is established through HTTP requests and responses. 

 * The backend (server.js) serves the HTML, CSS, and JavaScript files to the client (browser)
 and handles various HTTP requests such as GET, POST, PUT, DELETE, etc.

 * When user visits the browser, the browser sends the get GET request to the server
   - the server handles the GET request and sends back the html file along with its 
      css file and javascript files to render the page in the browesr



 * The form in the HTML page (like a login form or registration form),
       the frontend will send HTTP requests (e.g., GET, POST, PUT, DELETE) 
       to the backend to retrieve or send data.
 * The backend (your server.js) will process the request, 
       interact with the database (if needed), and send back a response (often in JSON format)
        which the frontend can then use to update the user interface.
 * 
 * 
 * 
 * 
 * 
 */