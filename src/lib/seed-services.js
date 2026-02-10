const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://grounmoetezhechmi_db_user:BtDPWFi8atdJhABr@cluster0.mmfyety.mongodb.net/service-db?retryWrites=true&w=majority&appName=Cluster0";

const SubServiceSchema = new mongoose.Schema({
    id: String,
    title: String,
    desc: String,
    price: Number,
    unit: String,
    icon: String
});

const ServiceSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    title: String,
    desc: String,
    icon: String,
    bgColor: String,
    iconColor: String,
    sub_services: [SubServiceSchema],
    problems: [String]
});

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

const SERVICES_DATA = [
    {
        key: 'menage',
        title: 'Ménage',
        desc: 'Nettoyage régulier, repassage ou grand ménage de printemps.',
        icon: '🧹',
        bgColor: '#fce7f3',
        iconColor: '#db2777',
        sub_services: [
            { id: 'menage-express', title: 'Ménage Express (2h)', desc: 'Nettoyage standard des pièces de vie.', price: 50, unit: 'FORFAIT', icon: '🧹' },
            { id: 'grand-nettoyage', title: 'Grand Nettoyage', desc: 'Nettoyage approfondi (vitres, placards...).', price: 120, unit: 'À PARTIR DE', icon: '✨' },
            { id: 'repassage', title: 'Repassage', desc: 'Repassage de votre linge à domicile.', price: 25, unit: '/ HEURE', icon: '👔' },
        ]
    },
    {
        key: 'plomberie',
        title: 'Plomberie',
        desc: 'Fuites, débouchage, installation de robinetterie ou chauffe-eau.',
        icon: '🔧',
        bgColor: '#eff6ff',
        iconColor: '#3b82f6',
        sub_services: [
            { id: 'fuite', title: 'Réparation de Fuite', desc: 'Intervention urgente sous évier ou lavabo.', price: 89, unit: 'À PARTIR DE', icon: '🔧' },
            { id: 'debouchage', title: 'Débouchage', desc: 'Débouchage canalisation WC ou évier.', price: 110, unit: 'FORFAIT', icon: '🪠' },
        ]
    },
    {
        key: 'jardinage',
        title: 'Jardinage',
        desc: 'Tonte de pelouse, taille de haies et entretien d\'espaces verts.',
        icon: '🌳',
        bgColor: '#dcfce7',
        iconColor: '#16a34a',
        sub_services: [
            { id: 'tonte', title: 'Tonte de Pelouse', desc: 'Entretien régulier de votre gazon.', price: 45, unit: 'À PARTIR DE', icon: '🌳' },
            { id: 'taille', title: 'Taille de Haies', desc: 'Taille de formation et d\'entretien.', price: 35, unit: '/ HEURE', icon: '✂️' },
        ]
    },
    {
        key: 'electricite',
        title: 'Électricité',
        desc: 'Mise aux normes, prises, luminaires et pannes de courant.',
        icon: '⚡',
        bgColor: '#fef3c7',
        iconColor: '#d97706',
        sub_services: [
            { id: 'panne', title: 'Dépannage Électrique', desc: 'Recherche de panne et réparation.', price: 95, unit: 'À PARTIR DE', icon: '⚡' },
            { id: 'installation', title: 'Nouvelle Installation', desc: 'Pose de prises, luminaires ou interrupteurs.', price: 65, unit: '/ HEURE', icon: '🔌' },
        ]
    },
    {
        key: 'bricolage',
        title: 'Bricolage',
        desc: 'Montage de meubles, fixation d\'étagères et petits travaux.',
        icon: '🔨',
        bgColor: '#f1f5f9',
        iconColor: '#475569',
        sub_services: [
            { id: 'montage', title: 'Montage de Meubles', desc: 'Assemblage de meubles en kit.', price: 40, unit: '/ HEURE', icon: '📦' },
            { id: 'fixation', title: 'Fixations Murales', desc: 'Étagères, cadres, TV, luminaires.', price: 35, unit: '/ HEURE', icon: '🔨' },
        ]
    },
    {
        key: 'peinture',
        title: 'Peinture',
        desc: 'Rafraîchissement de murs, plafonds ou rénovation complète.',
        icon: '🖌️',
        bgColor: '#f3e8ff',
        iconColor: '#9333ea',
        sub_services: [
            { id: 'murs', title: 'Peinture Murs', desc: 'Préparation et mise en peinture.', price: 30, unit: '/ M²', icon: '🖌️' },
            { id: 'plafond', title: 'Peinture Plafond', desc: 'Peinture spécifique pour plafonds.', price: 35, unit: '/ M²', icon: '🏠' },
        ]
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing services
        await Service.deleteMany({});
        console.log('Cleared existing services');

        // Insert new services
        await Service.insertMany(SERVICES_DATA);
        console.log('Seeded services successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

seed();
