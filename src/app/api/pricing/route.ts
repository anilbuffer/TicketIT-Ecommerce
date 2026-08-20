// src/app/api/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getRateCards, createRateCard } from '@/lib/services/pricing.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = {
      accountId: searchParams.get('accountId') || undefined,
      search: searchParams.get('search') || undefined,
      status: (searchParams.get('status') as any) || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : undefined,
    };
    const result = await getRateCards(params);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rateCard = await createRateCard(body);
    return NextResponse.json(rateCard, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
