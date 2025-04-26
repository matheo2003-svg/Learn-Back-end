const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.My_Email,
        pass: process.env.Email_password
    }
});

const sendWelcomeEmail = (to, username) => {
    const mailOptions = {
        from: process.env.My_Email,
        to,
        subject: 'Welcome to GlideConnex!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden;">
                <div style="background-color: #4CAF50; color: white; padding: 20px 30px;">
                  <h1 style="margin: 0;">Welcome, ${username}!</h1>
                </div>
                <div style="padding: 30px;">
                  <p style="font-size: 16px; color: #333;">Thanks for registering with Glide Connex.</p>
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

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendWelcomeEmail
};
