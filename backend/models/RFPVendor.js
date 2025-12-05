const Sequelize = require('sequelize');
const db = require('../config/database');

const RFPVendor = db.define('rfp_vendor', {
    // attributes can be added here if we want to track status per vendor (e.g. sent, opened, replied)
    status: {
        type: Sequelize.ENUM('PENDING', 'SENT', 'RESPONDED'),
        defaultValue: 'PENDING'
    }
});

module.exports = RFPVendor;
