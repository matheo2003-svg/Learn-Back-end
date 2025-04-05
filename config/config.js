require('dotenv').config(); // Load .env file

// Use the environment variables in your application
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;

module.exports = {
    DB_USER,
    DB_PASSWORD,
    DB_HOST
};
