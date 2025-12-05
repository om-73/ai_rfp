const Sequelize = require('sequelize');
const db = require('../config/database');

const RFP = db.define('rfp', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_prompt: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    structured_data: {
        type: Sequelize.JSON,
        allowNull: true
    },
    status: {
        type: Sequelize.ENUM('DRAFT', 'SENT', 'COMPLETED'),
        defaultValue: 'DRAFT'
    }
});

module.exports = RFP;
