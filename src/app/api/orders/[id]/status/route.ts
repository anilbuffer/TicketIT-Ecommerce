// src/app/api/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/services/orders.service';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, carrier, trackingNumber, deliveryNotes } = await req.json();
    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await updateOrderStatus(params.id, status, {
      carrier,
      trackingNumber,
      deliveryNotes,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
