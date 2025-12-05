const { Proposal, RFP, Vendor } = require('../models');
const emailService = require('../services/emailService');
const aiService = require('../services/aiService');

exports.checkEmailsAndProcess = async (req, res) => {
    try {
        const emails = await emailService.checkInboxForProposals();
        let newProposalsCount = 0;

        for (const email of emails) {
            // Logic to link email to RFP could be subject-based or improved.
            // Simplified: Subject must contain "Proposal" and maybe RFP ID?
            // For MVP: We will check if the sender is a known vendor, and maybe find the ACTIVE RFP sent to them.

            const vendor = await Vendor.findOne({ where: { email: email.from } });
            if (!vendor) continue; // Skip if not from a known vendor

            // Find an RFP that was SENT to this vendor
            // (Process simplification: Match the latest SENT RFP)
            // Real implementation would parse ID from subject or use message-id tracking.
            const rfp = await RFP.findOne({
                order: [['createdAt', 'DESC']],
                where: { status: 'SENT' }
            });

            if (!rfp) continue;

            const aiAnalysis = await aiService.parseProposal(email.text || email.html);

            await Proposal.create({
                rfpId: rfp.id,
                vendorId: vendor.id,
                email_content: email.text || email.html,
                extracted_data: aiAnalysis,
                score: aiAnalysis ? aiAnalysis.confidence_score : 0,
                received_at: new Date()
            });
            newProposalsCount++;
        }

        res.status(200).json({ message: `Processed ${emails.length} emails. Created ${newProposalsCount} new proposals.` });

    } catch (error) {
        console.error("Error processing emails:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProposalsForRFP = async (req, res) => {
    try {
        const { rfpId } = req.params;
        const proposals = await Proposal.findAll({
            where: { rfpId },
            include: [{ model: Vendor }]
        });
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProposalRecommendation = async (req, res) => {
    try {
        const { rfpId } = req.params;
        const rfp = await RFP.findByPk(rfpId);
        if (!rfp) return res.status(404).json({ message: 'RFP not found' });

        const proposals = await Proposal.findAll({
            where: { rfpId },
            include: [{ model: Vendor }]
        });

        if (proposals.length === 0) return res.status(200).json({ message: 'No proposals to compare.' });

        const recommendation = await aiService.compareProposals(rfp.user_prompt, proposals);
        res.status(200).json(recommendation);

    } catch (error) {
        console.error("Error getting recommendation:", error);
        res.status(500).json({ error: error.message });
    }
};
