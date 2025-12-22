const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Test DB Connection and Sync
sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync({ alter: true });
    })
    .then(() => console.log('Database synced...'))
    .catch(err => console.log('Error: ' + err));

// Basic Route
app.get('/', (req, res) => {
    res.send('RFP AI System API is running');
});

// Import Routes (will be added later)
const vendorRoutes = require('./routes/vendorRoutes');
const rfpRoutes = require('./routes/rfpRoutes');
const proposalRoutes = require('./routes/proposalRoutes');

app.use('/api/vendors', vendorRoutes);
app.use('/api/rfps', rfpRoutes);
app.use('/api/proposals', proposalRoutes);

// Serve Static Frontend Assets (Production)
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
