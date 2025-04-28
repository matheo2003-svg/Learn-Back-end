const oracledb = require('oracledb');
const getConnection = require('../config/database');

async function createBooking(userId, time, direction) {
    let connection;
    try {
        connection = await getConnection();

        // Ensure time and direction are strings
        time = String(time);
        direction = String(direction);

        // First, find the matching schedule
        const scheduleResult = await connection.execute(
            `SELECT schedule_id FROM bus_schedule
             WHERE departure_time = :time AND direction = :direction`,
            { time, direction } // Passing both as strings
        );

        if (scheduleResult.rows.length === 0) {
            return { success: false, message: 'No matching schedule found.' };
        }

        const scheduleId = scheduleResult.rows[0][0]; // Oracle returns rows as arrays

        // Now, insert the booking
        const insertSql = `
            INSERT INTO bookings (user_id, schedule_id)
            VALUES (:userId, :scheduleId)
        `;

        await connection.execute(insertSql, { userId, scheduleId }, { autoCommit: true });

        return { success: true, message: 'Booking created successfully.' };

    } catch (error) {
        console.error('Database error:', error); // Log full error for debugging
        return { success: false, message: `Database error: ${error.message}` }; // Return specific error message
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = {
    createBooking,
};
