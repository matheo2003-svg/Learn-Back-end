const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Route for booking
router.post('/book', bookingController.bookRide);

module.exports = router;
