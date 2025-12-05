const { sequelize } = require('../models');

async function initDb() {
    try {
        await sequelize.sync({ force: true }); // WARNING: This drops tables!
        console.log('Database synced successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to sync database:', error);
        process.exit(1);
    }
}

initDb();
