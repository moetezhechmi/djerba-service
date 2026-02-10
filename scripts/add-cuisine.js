
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://grounmoetezhechmi_db_user:BtDPWFi8atdJhABr@cluster0.mmfyety.mongodb.net/service-db?retryWrites=true&w=majority&appName=Cluster0";

const ServiceSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    name: String,
    icon: String,
    problems: [String]
});

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

async function addCuisine() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');

    const cuisine = {
        key: 'cuisine',
        name: 'Cuisine',
        icon: '🥘',
        problems: [
            'Installation électroménager',
            'Réparation hotte',
            'Plomberie cuisine',
            'Montage meubles de cuisine',
            'Pose de plan de travail',
            'Autre problème'
        ]
    };

    try {
        await Service.findOneAndUpdate({ key: 'cuisine' }, cuisine, { upsert: true, new: true });
        console.log('Service Cuisine ajouté/mis à jour avec succès !');
    } catch (err) {
        console.error('Erreur lors de l\'ajout du service :', err);
    } finally {
        await mongoose.disconnect();
    }
}

addCuisine();
