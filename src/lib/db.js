import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://grounmoetezhechmi_db_user:BtDPWFi8atdJhABr@cluster0.mmfyety.mongodb.net/service-db?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

// Schemas
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

const ArtisanSchema = new mongoose.Schema({
    name: String,
    service_key: { type: String, index: true },
    phone: String,
    status: { type: String, default: 'pending', index: true },
    created_at: { type: Date, default: Date.now, index: true }
});

const RequestSchema = new mongoose.Schema({
    // Step 1: Service
    service_key: { type: String, index: true },
    sub_service: String,
    service_price: Number,
    service_unit: String,
    description: String,
    images: [String],

    // Step 2: Planning
    date: { type: String, index: true },
    time: String,
    frequency: String,

    // Step 3: Client Info & Address
    client_name: String,
    client_email: { type: String, index: true },
    client_phone: String,
    client_address: String,
    client_city: String,
    client_zip: String,

    // Payment & Status
    payment_method: String,
    total_price: Number,
    status: { type: String, default: 'pending', index: true },
    artisan_id: { type: String, index: true },
    created_at: { type: Date, default: Date.now, index: true }
});

// Safe model export for Next.js (ensures schema updates aren't blocked by model caching)
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
if (mongoose.models.Artisan) {
    delete mongoose.models.Artisan;
}
const Artisan = mongoose.model('Artisan', ArtisanSchema);

if (mongoose.models.Request) {
    delete mongoose.models.Request;
}
const Request = mongoose.model('Request', RequestSchema);

export { dbConnect, Service, Artisan, Request };
