const Sequelize = require('sequelize');
const db = require('../config/database');

const Proposal = db.define('proposal', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email_content: {
        type: Sequelize.TEXT('long'),
        allowNull: false
    },
    extracted_data: {
        type: Sequelize.JSON,
        allowNull: true
    },
    score: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    ai_analysis: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    received_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

module.exports = Proposal;
