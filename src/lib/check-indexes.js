const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://grounmoetezhechmi_db_user:BtDPWFi8atdJhABr@cluster0.mmfyety.mongodb.net/service-db?retryWrites=true&w=majority&appName=Cluster0";

async function checkIndexes() {
    try {
        await mongoose.connect(MONGODB_URI);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        for (let col of collections) {
            console.log(`\nIndexes for collection: ${col.name}`);
            const indexes = await db.collection(col.name).indexes();
            console.log(JSON.stringify(indexes, null, 2));
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
checkIndexes();
