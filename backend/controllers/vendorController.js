const { Vendor } = require('../models');

exports.createVendor = async (req, res) => {
    try {
        const { name, email, specialized_categories } = req.body;
        const vendor = await Vendor.create({ name, email, specialized_categories });
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.findAll();
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateVendor = async (req, res) => {
    try {
        const { name, email, specialized_categories } = req.body;
        const vendor = await Vendor.findByPk(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        vendor.name = name;
        vendor.email = email;
        vendor.specialized_categories = specialized_categories;
        await vendor.save();

        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        await vendor.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
