import { NextResponse } from 'next/server';
import { dbConnect, Artisan } from '@/lib/db';
import { sendArtisanApplicationEmail } from '@/lib/mail';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const service = searchParams.get('service');

        let artisans;
        if (service) {
            artisans = await Artisan.find({ service_key: service }).sort({ created_at: -1 }).lean();
        } else {
            artisans = await Artisan.find({}).sort({ created_at: -1 }).lean();
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
        const { name, email, service_key, phone } = body;

        if (!name || !email || !service_key || !phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newArtisan = await Artisan.create({
            name,
            email,
            service_key,
            phone,
            status: 'pending'
        });

        // Send confirmation email to the professional
        try {
            await sendArtisanApplicationEmail(email, {
                name,
                service_key,
                phone
            });
        } catch (mailError) {
            console.error('Failed to send application email:', mailError);
            // We don't fail the request if email fails
        }

        return NextResponse.json({ success: true, id: newArtisan._id });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
