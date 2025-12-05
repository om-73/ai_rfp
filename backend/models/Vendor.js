const Sequelize = require('sequelize');
const db = require('../config/database');

const Vendor = db.define('vendor', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    specialized_categories: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Comma separated list of categories'
    }
});

module.exports = Vendor;
