const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');

router.post('/send', rfpController.sendRFPToVendors);
router.post('/', rfpController.createRFP);
router.get('/', rfpController.getAllRFPs);
router.get('/:id', rfpController.getRFPById);

module.exports = router;
