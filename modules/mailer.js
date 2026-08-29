const nodemailer = require('nodemailer');
require('dotenv').config();

// Створюємо транспортер для відправки листів через Gmail
const gmailTransporter = nodemailer.createTransport({
    service: process.env.GMAIL_SERVICE,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Створюємо транспортер для відправки попереджувальних листів
const warningTransporter = nodemailer.createTransport({
    name: process.env.GMAIL_NAME,
    host: process.env.GMAIL_HOST,
    port: parseInt(process.env.GMAIL_PORT, 10),
    secure: process.env.GMAIL_SECURE === 'true',
    pool: process.env.GMAIL_POOL === 'true'
});

// Функція для відправки листів
function sendMail(mailOptions, type = process.env.MAIL_TYPE) {
    const transporter = type === 'warning'
        ? warningTransporter
        : gmailTransporter;

    return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
