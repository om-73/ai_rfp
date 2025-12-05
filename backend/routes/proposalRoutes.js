const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

router.post('/check-emails', proposalController.checkEmailsAndProcess);
router.get('/rfp/:rfpId', proposalController.getProposalsForRFP);
router.get('/rfp/:rfpId/recommendation', proposalController.getProposalRecommendation);

module.exports = router;
