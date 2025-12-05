const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash'); // make sure to install lodash if not present or replace usage
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Setup Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

exports.sendEmail = async (to, subject, htmlBody) => {
    try {
        const info = await transporter.sendMail({
            from: `"RFP AI System" <${process.env.SMTP_USER}>`,
            to: to,
            subject: subject,
            html: htmlBody,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

exports.checkInboxForProposals = async () => {
    const config = {
        imap: {
            user: process.env.IMAP_USER,
            password: process.env.IMAP_PASSWORD,
            host: process.env.IMAP_HOST,
            port: process.env.IMAP_PORT,
            tls: process.env.IMAP_TLS === 'true',
            authTimeout: 3000
        }
    };

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN']; // Only check unseen messages
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        const parsedEmails = [];

        for (const item of messages) {
            const all = _.find(item.parts, { "which": "TEXT" });
            const id = item.attributes.uid;
            const idHeader = "Imap-Id: " + id + "\r\n";
            const mail = await simpleParser(idHeader + all.body);

            parsedEmails.push({
                from: mail.from.value[0].address,
                subject: mail.subject,
                text: mail.text,
                html: mail.html,
                date: mail.date
            });
        }

        connection.end();
        return parsedEmails;
    } catch (error) {
        console.error("Error checking inbox:", error);
        return [];
    }
}
