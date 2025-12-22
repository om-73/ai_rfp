const { RFP, Vendor, RFPVendor } = require('../models');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');
const pdfService = require('../services/pdfService');


exports.createRFP = async (req, res) => {
    try {
        const { user_prompt } = req.body;

        let structured_data = {};
        try {
            structured_data = await aiService.parseRFPRequirements(user_prompt);
        } catch (err) {
            console.warn("AI parsing failed, using raw prompt only", err);
        }

        const title = structured_data.title || "Untitled RFP";

        const rfp = await RFP.create({
            title,
            user_prompt,
            structured_data,
            status: 'DRAFT'
        });

        res.status(201).json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRFPs = async (req, res) => {
    try {
        const rfps = await RFP.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(rfps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRFPById = async (req, res) => {
    try {
        const rfp = await RFP.findByPk(req.params.id);
        if (!rfp) return res.status(404).json({ message: 'RFP not found' });
        res.status(200).json(rfp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.sendRFPToVendors = async (req, res) => {
    try {
        const { rfpId, vendorIds } = req.body;
        const rfp = await RFP.findByPk(rfpId);

        if (!rfp) return res.status(404).json({ message: 'RFP not found' });

        const vendors = await Vendor.findAll({ where: { id: vendorIds } });

        // Update RFP status
        rfp.status = 'SENT';
        await rfp.save();

        // Generate RFP PDF
        const pdfBuffer = await pdfService.generateRFPPDF(rfp);

        const results = {
            success: [],
            failed: []
        };

        const emailPromises = vendors.map(async (vendor) => {
            // Create junction record if not exists
            await RFPVendor.findOrCreate({
                where: {
                    rfpId: rfp.id,
                    vendorId: vendor.id
                },
                defaults: {
                    status: 'SENT'
                }
            });

            // Send Email with PDF Attachment
            const subject = `RFP Invitation: ${rfp.title}`;
            const attachments = [
                {
                    filename: `${rfp.title || 'RFP'}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ];

            const html = `
                <h2>Request for Proposal</h2>
                <p>Dear ${vendor.name},</p>
                <p>We are inviting you to submit a proposal for the following requirements:</p>
                <pre>${rfp.user_prompt}</pre>
                <p><strong>Timeline:</strong> ${rfp.structured_data.timeline || 'ASAP'}</p>
                <p>Please find the formal RFP document attached.</p>
                <p>Please reply to this email with your proposal.</p>
                <br>
                <p>Best regards,<br>Procurement Team</p>
            `;

            try {
                await emailService.sendEmail(vendor.email, subject, html, attachments);
                results.success.push(vendor.id);
            } catch (emailErr) {
                console.error(`Failed to send email to vendor ${vendor.id}:`, emailErr.message);
                results.failed.push({ vendorId: vendor.id, error: emailErr.message });
            }
        });

        await Promise.all(emailPromises);

        res.status(200).json({
            message: `Processed ${vendors.length} vendors in parallel.`,
            results
        });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
