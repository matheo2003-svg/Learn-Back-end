const bookingModel = require('../models/bookingModel');

async function bookRide(req, res) {
    const { userId, time, direction } = req.body;

    if (!userId || !time || !direction) {
        return res.status(400).json({ message: 'Missing booking data.' });
    }

    const result = await bookingModel.createBooking(userId, time, direction);

    if (result.success) {
        res.json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
}

module.exports = {
    bookRide,
};
