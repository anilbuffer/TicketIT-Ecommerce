// src/lib/data-source/index.ts
import * as mockProducts from './mock/mock-products.adapter';
import * as mockAccounts from './mock/mock-accounts.adapter';
import * as mockOrders from './mock/mock-orders.adapter';
import * as mockPricing from './mock/mock-pricing.adapter';
import * as mockReports from './mock/mock-reports.adapter';
import * as mockAudit from './mock/mock-audit.adapter';

import * as dbProducts from './production/db-products.adapter';
import * as dbAccounts from './production/db-accounts.adapter';
import * as dbOrders from './production/db-orders.adapter';
import * as dbPricing from './production/db-pricing.adapter';

import * as mockTemplates from './mock/mock-templates.adapter';

// Flag to switch data source: default is mock
const isProduction = process.env.NEXT_PUBLIC_DATA_SOURCE === 'production';

export function getDataSource() {
  if (!isProduction) {
    return {
      products: mockProducts,
      templates: mockTemplates,
      accounts: mockAccounts,
      orders: mockOrders,
      pricing: mockPricing,
      reports: mockReports,
      audit: mockAudit,
      isMock: true,
    };
  }

  return {
    products: dbProducts,
    templates: mockTemplates,
    accounts: dbAccounts,
    orders: dbOrders,
    pricing: dbPricing,
    reports: mockReports, // fallback until DB reports are wired
    audit: mockAudit,     // fallback until DB audit is wired
    isMock: false,
  };
}
