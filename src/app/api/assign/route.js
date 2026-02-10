import { NextResponse } from 'next/server';
import { dbConnect, Request } from '@/lib/db';

export async function POST(request) {
    try {
        await dbConnect();
        const { request_id, artisan_id } = await request.json();

        const result = await Request.findByIdAndUpdate(request_id, {
            artisan_id: parseInt(artisan_id),
            status: 'assigned'
        });

        if (!result) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
