import { NextResponse } from 'next/server';
import { dbConnect, Service } from '@/lib/db';

export async function GET() {
    try {
        await dbConnect();
        const services = await Service.find({}).lean();
        return NextResponse.json(services);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        if (!body.key || !body.title) {
            return NextResponse.json({ error: 'Key and title are required' }, { status: 400 });
        }

        const existing = await Service.findOne({ key: body.key });
        if (existing) {
            return NextResponse.json({ error: 'Service with this key already exists' }, { status: 400 });
        }

        const newService = await Service.create(body);
        return NextResponse.json(newService, { status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
