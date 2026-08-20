// src/app/api/reports/monthly-billing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMonthlyBillingReport } from '@/lib/services/reports.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'August 2026';
    const report = await getMonthlyBillingReport(period);
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
