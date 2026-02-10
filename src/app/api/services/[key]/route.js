import { NextResponse } from 'next/server';
import { dbConnect, Service } from '@/lib/db';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { key } = await params;
        const service = await Service.findOne({ key });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { key: oldKey } = await params;
        const body = await request.json();

        // If key is changed, ensure uniqueness
        if (body.key && body.key !== oldKey) {
            const existing = await Service.findOne({ key: body.key });
            if (existing) {
                return NextResponse.json({ error: 'Service key already exists' }, { status: 400 });
            }
        }

        const updatedService = await Service.findOneAndUpdate(
            { key: oldKey },
            body,
            { new: true }
        );

        if (!updatedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json(updatedService);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { key } = await params;
        await Service.findOneAndDelete({ key });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
