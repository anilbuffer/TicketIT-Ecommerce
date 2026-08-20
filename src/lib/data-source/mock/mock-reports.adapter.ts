// src/lib/data-source/mock/mock-reports.adapter.ts
import initialOrders from './fixtures/orders.json';
import initialSites from './fixtures/sites.json';
import initialAccounts from './fixtures/accounts.json';
import type {
  MonthlyBillingReport,
  DashboardKPIs,
  Order,
  OrderStatus,
  Site,
  Account,
} from '@/lib/services/types';
import { simulateLatency } from './utils';

export async function getMonthlyBillingReport(period = 'August 2026'): Promise<MonthlyBillingReport> {
  await simulateLatency();

  const siteBreakdowns = [
    {
      siteId: 'site-101',
      siteCode: 'APX-MID-101',
      siteName: 'Apex Midtown Central Pharmacy',
      accountName: 'Apex Healthcare Group',
      ordersCount: 42,
      purchaseOrdersCount: 38,
      totalSpend: 9450.00,
      topCategory: 'Specialized Packaging',
      status: 'SETTLED' as const,
    },
    {
      siteId: 'site-102',
      siteCode: 'APX-BK-102',
      siteName: 'Apex Brooklyn Hub & Infusion',
      accountName: 'Apex Healthcare Group',
      ordersCount: 28,
      purchaseOrdersCount: 28,
      totalSpend: 6800.00,
      topCategory: 'Point of Sale',
      status: 'SETTLED' as const,
    },
    {
      siteId: 'site-105',
      siteCode: 'BCN-SF-105',
      siteName: 'Beacon Bay Area Biologics Center',
      accountName: 'Beacon Clinic & Biologics',
      ordersCount: 22,
      purchaseOrdersCount: 21,
      totalSpend: 8200.00,
      topCategory: 'Regulatory Documents',
      status: 'PENDING' as const,
    },
    {
      siteId: 'site-103',
      siteCode: 'MET-CHI-103',
      siteName: 'Metro Chicago West Loop Dispensary',
      accountName: 'Metro Dispensaries Network',
      ordersCount: 35,
      purchaseOrdersCount: 32,
      totalSpend: 7250.00,
      topCategory: 'Merchandise & Uniforms',
      status: 'SETTLED' as const,
    },
    {
      siteId: 'site-104',
      siteCode: 'PHARM-NYC-104',
      siteName: 'Downtown Dispensing Hub #104',
      accountName: 'Metro Dispensaries Network',
      ordersCount: 19,
      purchaseOrdersCount: 19,
      totalSpend: 5150.00,
      topCategory: 'Specialized Packaging',
      status: 'SETTLED' as const,
    },
  ];

  const totalSpend = siteBreakdowns.reduce((acc, s) => acc + s.totalSpend, 0);
  const totalOrders = siteBreakdowns.reduce((acc, s) => acc + s.ordersCount, 0);

  return {
    period,
    invoiceNumber: 'INV-RH-2026-08',
    invoiceDate: '2026-08-01',
    dueDate: '2026-08-31',
    totalSpend,
    totalOrders,
    activeSitesCount: siteBreakdowns.length,
    siteBreakdowns,
    categoryBreakdown: [
      { category: 'Specialized Packaging', spend: 14600.00, percentage: 39.6 },
      { category: 'Regulatory Documents', spend: 8200.00, percentage: 22.3 },
      { category: 'Point of Sale', spend: 6800.00, percentage: 18.5 },
      { category: 'Merchandise & Uniforms', spend: 7250.00, percentage: 19.6 },
    ],
  };
}

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  await simulateLatency();

  const orders = initialOrders as Order[];
  const sites = initialSites as Site[];
  const accounts = initialAccounts as Account[];

  const statusMap: Record<OrderStatus, { count: number; value: number }> = {
    RECEIVED: { count: 0, value: 0 },
    PROCESSING: { count: 0, value: 0 },
    DISPATCHED: { count: 0, value: 0 },
    DELIVERED: { count: 0, value: 0 },
  };

  orders.forEach((o) => {
    if (statusMap[o.status]) {
      statusMap[o.status].count += 1;
      statusMap[o.status].value += o.totalAmount;
    }
  });

  return {
    totalRevenueMonth: 36850.00,
    revenueDeltaPct: 14.8,
    activeOrdersCount: orders.filter((o) => o.status === 'RECEIVED' || o.status === 'PROCESSING').length,
    ordersDeltaPct: 8.2,
    pendingFulfilmentCount: orders.filter((o) => o.status === 'PROCESSING').length,
    activeSitesCount: sites.length,
    activeAccountsCount: accounts.filter((a) => a.status === 'ACTIVE').length,
    recentOrders: orders.slice(0, 5),
    statusDistribution: (Object.keys(statusMap) as OrderStatus[]).map((st) => ({
      status: st,
      count: statusMap[st].count,
      value: statusMap[st].value,
    })),
    revenueTrend: [
      { month: 'Mar 26', spend: 28400, orders: 112 },
      { month: 'Apr 26', spend: 31200, orders: 124 },
      { month: 'May 26', spend: 29800, orders: 118 },
      { month: 'Jun 26', spend: 33500, orders: 135 },
      { month: 'Jul 26', spend: 35100, orders: 140 },
      { month: 'Aug 26', spend: 36850, orders: 146 },
    ],
  };
}
