const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://grounmoetezhechmi_db_user:BtDPWFi8atdJhABr@cluster0.mmfyety.mongodb.net/service-db?retryWrites=true&w=majority&appName=Cluster0";

const ArtisanSchema = new mongoose.Schema({
    name: String,
    service_key: String,
    phone: String,
    status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now }
});

const Artisan = mongoose.models.Artisan || mongoose.model('Artisan', ArtisanSchema);

const ARTISANS_DATA = [
    { name: 'Jean Dupont', service_key: 'electricite', phone: '06 11 22 33 44', status: 'verified' },
    { name: 'Pierre Martin', service_key: 'plomberie', phone: '06 22 33 44 55', status: 'verified' },
    { name: 'Marie Dubois', service_key: 'menage', phone: '06 33 44 55 66', status: 'verified' },
    { name: 'Lucas Petit', service_key: 'jardinage', phone: '06 44 55 66 77', status: 'verified' },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Dropping the collection is safer to remove all old indexes and corrupt data
        try {
            await mongoose.connection.db.collection('artisans').drop();
            console.log('Dropped artisans collection to clear old indexes');
        } catch (e) {
            console.log('Artisans collection did not exist or already dropped');
        }

        // Insert new artisans
        await Artisan.insertMany(ARTISANS_DATA);
        console.log('Seeded artisans successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seed();
