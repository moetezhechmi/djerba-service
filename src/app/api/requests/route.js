import { NextResponse } from 'next/server';
import { dbConnect, Request, Artisan } from '@/lib/db';

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const {
            service_key, sub_service, service_price, service_unit,
            date, time, frequency,
            description, images,
            client_name, client_email, client_phone,
            client_address, client_city, client_zip,
            payment_method, total_price
        } = body;

        const newRequest = await Request.create({
            service_key,
            sub_service,
            service_price,
            service_unit,
            date,
            time,
            frequency,
            description,
            images,
            client_name,
            client_email,
            client_phone,
            client_address,
            client_city,
            client_zip,
            payment_method,
            total_price
        });

        return NextResponse.json({ success: true, id: newRequest._id });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        // Use sort at DB level
        const requests = await Request.find({}).sort({ created_at: -1 }).lean();
        // Only fetch artisan names and IDs
        const artisans = await Artisan.find({}, { name: 1, _id: 1 }).lean();

        // Create a map for O(1) lookup
        const artisanMap = new Map(artisans.map(a => [a._id.toString(), a.name]));

        const enrichedRequests = requests.map(r => ({
            ...r,
            id: r._id,
            artisan_name: r.artisan_id ? (artisanMap.get(r.artisan_id.toString()) || null) : null
        }));

        return NextResponse.json(enrichedRequests);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
