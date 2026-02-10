import { NextResponse } from 'next/server';
import { dbConnect, Artisan } from '@/lib/db';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const service = searchParams.get('service');

        let artisans;
        if (service) {
            artisans = await Artisan.find({ service_key: service });
        } else {
            artisans = await Artisan.find({});
        }

        return NextResponse.json(artisans);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { name, service_key, phone } = body;

        if (!name || !service_key || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newArtisan = await Artisan.create({
            name,
            service_key,
            phone,
            status: 'pending'
        });

        return NextResponse.json({ success: true, id: newArtisan._id });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
