import { NextResponse } from 'next/server';
import { dbConnect, Artisan } from '@/lib/db';

export async function PATCH(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const updatedArtisan = await Artisan.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedArtisan) {
            return NextResponse.json({ error: 'Artisan not found' }, { status: 404 });
        }

        return NextResponse.json(updatedArtisan);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        await Artisan.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
