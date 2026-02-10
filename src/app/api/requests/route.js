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
        const requests = await Request.find({}).lean();
        const artisans = await Artisan.find({}).lean();

        // Map artisan names
        const enrichedRequests = requests.map(r => {
            // Match using _id since numeric id is removed
            const artisan = artisans.find(a => a._id.toString() === r.artisan_id?.toString());
            return {
                ...r,
                id: r._id, // Ensure frontend receives 'id'
                artisan_name: artisan ? artisan.name : null
            };
        }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return NextResponse.json(enrichedRequests);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
