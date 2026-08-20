// src/lib/services/types.ts
// Domain Types and DTOs matching the Prisma schema and service layer contract

export type ProductStatus = 'ACTIVE' | 'UNAVAILABLE' | 'SUPERSEDED';

export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  categoryId: string;
  categoryName?: string;
  packSize: string;
  uom: string;
  basePrice: number;
  moq: number;
  orderMultiple: number;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  code: string;
  description: string;
  itemCount: number;
};

export type Address = {
  street: string;
  suite?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Site = {
  id: string;
  accountId: string;
  accountName?: string;
  name: string;
  code: string;
  billToAddress: Address;
  shipToAddress: Address;
  activeUsersCount?: number;
  totalOrdersCount?: number;
  monthlySpend?: number;
  createdAt?: string;
};

export type Account = {
  id: string;
  name: string;
  accountCode: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  contactEmail: string;
  contactPhone?: string;
  sitesCount?: number;
  activeRateCardId?: string;
  activeRateCardName?: string;
  totalMonthlySpend?: number;
  createdAt?: string;
};

export type UserRole = 'ADMIN' | 'HEAD_OFFICE' | 'SITE_USER';

export type PortalUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  siteId?: string;
  siteName?: string;
  siteCode?: string;
  accountId?: string;
  accountName?: string;
  department?: string;
  monthlyBudgetCap?: number;
  poPrefix?: string;
  status: 'ACTIVE' | 'INVITED' | 'DISABLED';
  createdAt?: string;
};

export type OrderStatus = 'RECEIVED' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED';

export type OrderLineItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  thumbnailUrl?: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  packSize?: string;
  uom?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  accountId: string;
  accountName: string;
  siteId: string;
  siteCode: string;
  siteName: string;
  userId: string;
  userName: string;
  userEmail: string;
  poReference?: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
  carrier?: string;
  trackingNumber?: string;
  lineItems: OrderLineItem[];
};

export type RateCardItem = {
  id: string;
  rateCardId: string;
  productId: string;
  productSku: string;
  productName: string;
  basePrice: number;
  fixedPrice?: number;
  discountPct?: number;
  effectivePrice: number;
};

export type RateCard = {
  id: string;
  accountId: string;
  accountName: string;
  name: string;
  effectiveFrom: string;
  effectiveTo?: string;
  defaultDiscountPct: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  itemCount: number;
  items: RateCardItem[];
};

export type AuditLogEntry = {
  id: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  entityType: 'ORDER' | 'PRODUCT' | 'ACCOUNT' | 'SITE' | 'RATE_CARD' | 'USER' | 'SYSTEM';
  entityId: string;
  entityName?: string;
  ipAddress?: string;
  details?: Record<string, any>;
  timestamp: string;
};

export type MonthlyBillingSiteSummary = {
  siteId: string;
  siteCode: string;
  siteName: string;
  accountName: string;
  ordersCount: number;
  purchaseOrdersCount: number;
  totalSpend: number;
  topCategory: string;
  status: 'SETTLED' | 'PENDING' | 'DISPUTED';
};

export type MonthlyBillingReport = {
  period: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalSpend: number;
  totalOrders: number;
  activeSitesCount: number;
  siteBreakdowns: MonthlyBillingSiteSummary[];
  categoryBreakdown: { category: string; spend: number; percentage: number }[];
};

export type DashboardKPIs = {
  totalRevenueMonth: number;
  revenueDeltaPct: number;
  activeOrdersCount: number;
  ordersDeltaPct: number;
  pendingFulfilmentCount: number;
  activeSitesCount: number;
  activeAccountsCount: number;
  recentOrders: Order[];
  statusDistribution: { status: OrderStatus; count: number; value: number }[];
  revenueTrend: { month: string; spend: number; orders: number }[];
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ServiceError = {
  code: string;
  message: string;
  field?: string;
};
