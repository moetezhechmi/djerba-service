const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://grounmoetezhechmi_db_user:BtDPWFi8atdJhABr@cluster0.mmfyety.mongodb.net/service-db?retryWrites=true&w=majority&appName=Cluster0";

async function clearRequests() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        await db.collection('requests').deleteMany({});
        console.log('Cleared all requests');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
clearRequests();
