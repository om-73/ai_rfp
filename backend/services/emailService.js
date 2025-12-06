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

const pdf = require('pdf-parse');
const mammoth = require('mammoth');

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

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''], // Fetch full body for attachments
            markSeen: true,
            struct: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        const parsedEmails = [];

        for (const item of messages) {
            const all = _.find(item.parts, { "which": "" }); // Use complete message part
            const id = item.attributes.uid;
            const idHeader = "Imap-Id: " + id + "\r\n";

            // If fetching full message, 'all.body' might be what we need, but imap-simple works a bit differently for attachments.
            // Using simpleParser on the full raw source is safer.
            const rawSource = all.body;

            const mail = await simpleParser(rawSource);

            let combinedText = mail.text || "";
            if (mail.html) {
                // Ideally strip HTML tags if text is missing, but usually text is present.
                // combinedText += ... 
            }

            // Process Attachments
            if (mail.attachments && mail.attachments.length > 0) {
                for (const attachment of mail.attachments) {
                    const filename = attachment.filename || "";
                    const lowerFilename = filename.toLowerCase();

                    if (lowerFilename.endsWith('.pdf')) {
                        try {
                            const data = await pdf(attachment.content);
                            combinedText += `\n\n--- Attachment: ${filename} ---\n${data.text}`;
                        } catch (err) {
                            console.error(`Error parsing PDF ${filename}:`, err);
                            combinedText += `\n\n[Error parsing attachment ${filename}]`;
                        }
                    } else if (lowerFilename.endsWith('.docx')) {
                        try {
                            const result = await mammoth.extractRawText({ buffer: attachment.content });
                            combinedText += `\n\n--- Attachment: ${filename} ---\n${result.value}`;
                        } catch (err) {
                            console.error(`Error parsing DOCX ${filename}:`, err);
                            combinedText += `\n\n[Error parsing attachment ${filename}]`;
                        }
                    }
                }
            }

            parsedEmails.push({
                from: mail.from.value[0].address,
                subject: mail.subject,
                text: combinedText, // Combined text used for AI analysis
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
