const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://grounmoetezhechmi_db_user:BtDPWFi8atdJhABr@cluster0.mmfyety.mongodb.net/service-db?retryWrites=true&w=majority&appName=Cluster0";

async function check() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const plomberie = await db.collection('services').findOne({ key: 'plomberie' });
        console.log('Plomberie Service:', JSON.stringify(plomberie, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
check();
