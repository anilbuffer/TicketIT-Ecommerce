// src/lib/export/csv.ts
import type { MonthlyBillingReport, Order } from '@/lib/services/types';

export function exportBillingReportCSV(report: MonthlyBillingReport): string {
  const headers = [
    'Period',
    'Invoice Reference',
    'Account Name',
    'Site Code',
    'Site Name',
    'Orders Count',
    'POs Count',
    'Primary Category',
    'Total Spend (USD)',
    'Status',
  ];

  const rows = report.siteBreakdowns.map((s) => [
    `"${report.period}"`,
    `"${report.invoiceNumber}"`,
    `"${s.accountName}"`,
    `"${s.siteCode}"`,
    `"${s.siteName}"`,
    s.ordersCount,
    s.purchaseOrdersCount,
    `"${s.topCategory}"`,
    s.totalSpend.toFixed(2),
    `"${s.status}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportOrdersCSV(orders: Order[]): string {
  const headers = [
    'Order #',
    'Date Created',
    'Account',
    'Site Code',
    'Site Name',
    'PO Reference',
    'Status',
    'Items Qty',
    'Total Amount ($)',
    'Carrier',
    'Tracking #',
  ];

  const rows = orders.map((o) => [
    `"${o.orderNumber}"`,
    `"${new Date(o.createdAt).toLocaleDateString()}"`,
    `"${o.accountName}"`,
    `"${o.siteCode}"`,
    `"${o.siteName}"`,
    `"${o.poReference || 'N/A'}"`,
    `"${o.status}"`,
    o.itemCount,
    o.totalAmount.toFixed(2),
    `"${o.carrier || 'Pending'}"`,
    `"${o.trackingNumber || 'Pending'}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
