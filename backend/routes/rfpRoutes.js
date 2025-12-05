const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');

router.post('/', rfpController.createRFP);
router.get('/', rfpController.getAllRFPs);
router.get('/:id', rfpController.getRFPById);
router.post('/send', rfpController.sendRFPToVendors);

module.exports = router;
