const sequelize = require('../config/database');
const Vendor = require('./Vendor');
const RFP = require('./RFP');
const Proposal = require('./Proposal');
const RFPVendor = require('./RFPVendor');

// Associations

// Vendor <-> RFP (Many-to-Many)
Vendor.belongsToMany(RFP, { through: RFPVendor });
RFP.belongsToMany(Vendor, { through: RFPVendor });

// RFP <-> Proposal (One-to-Many)
RFP.hasMany(Proposal);
Proposal.belongsTo(RFP);

// Vendor <-> Proposal (One-to-Many)
Vendor.hasMany(Proposal);
Proposal.belongsTo(Vendor);

module.exports = {
    sequelize,
    Vendor,
    RFP,
    Proposal,
    RFPVendor
};
