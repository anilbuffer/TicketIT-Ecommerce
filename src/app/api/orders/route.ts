// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/services/orders.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
      status: (searchParams.get('status') as any) || undefined,
      siteId: searchParams.get('siteId') || undefined,
      accountId: searchParams.get('accountId') || undefined,
      search: searchParams.get('search') || undefined,
    };
    const result = await getOrders(params);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
