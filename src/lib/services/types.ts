// src/lib/services/types.ts
// Domain Types and DTOs matching the Prisma schema and service layer contract

export type ProductStatus = 'ACTIVE' | 'UNAVAILABLE' | 'SUPERSEDED';

export type ProductSizeOption = {
  id: string;
  label: string;
  dimensions: string;
  widthInches: number;
  heightInches: number;
  priceMultiplier: number;
  isPopular?: boolean;
};

export type ProductMaterialOption = {
  id: string;
  name: string;
  description: string;
  priceAddon: number;
  recommendedFor?: string;
};

export type ProductFinishOption = {
  id: string;
  name: string;
  description: string;
  priceAddon: number;
};

export type ProductVolumeDiscount = {
  minQty: number;
  discountPercent: number;
};

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
  stockRemaining?: number;
  lowStockThreshold?: number;
  isPersonalizable?: boolean;
  personalizationTemplate?: string;
  artworkUrl?: string;
  printCategory?: 'Signs' | 'Posters' | 'Banners' | 'Flyers' | 'Business Cards' | 'Brochures' | 'Marketing Materials' | 'Promotional Products';
  availableSizes?: ProductSizeOption[];
  materials?: ProductMaterialOption[];
  finishingOptions?: ProductFinishOption[];
  volumeDiscounts?: ProductVolumeDiscount[];
  turnaroundDays?: number;
  templatesCount?: number;
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

// ─── Master Design Template Types (Admin & Site User) ───────────────────────

export type TemplateFieldKey =
  | 'businessName'
  | 'contactName'
  | 'phone'
  | 'email'
  | 'website'
  | 'address'
  | 'hours'
  | 'logo'
  | 'tagline'
  | 'promoOffer'
  | 'qrCode'
  | 'customNotes';

export type TemplateLayerType = 'text' | 'image' | 'logo' | 'shape' | 'badge' | 'qrcode' | 'divider';

export type TemplateLayerStyle = {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: 'normal' | 'italic';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'uppercase' | 'lowercase' | 'none';
  boxShadow?: string;
  padding?: number;
};

export type TemplateLayer = {
  id: string;
  type: TemplateLayerType;
  name: string;
  isEditableBySiteUser: boolean; // Admin defines this rule!
  fieldKey?: TemplateFieldKey;
  label: string;
  helperText?: string;
  x: number; // percentage (0-100) or pixels
  y: number; // percentage (0-100) or pixels
  width: number; // percentage (0-100) or pixels
  height: number; // percentage (0-100) or pixels
  content: string; // text string, image url, svg, or qr payload
  style: TemplateLayerStyle;
  zIndex?: number;
  isRequired?: boolean;
};

export type TemplateTheme =
  | 'modern'
  | 'corporate'
  | 'healthcare'
  | 'promotional'
  | 'minimalist'
  | 'luxury'
  | 'vibrant'
  | 'retail'
  | 'grand-opening';

export type PrintTemplate = {
  id: string;
  productId: string;
  productName: string;
  category: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  previewMockupUrl?: string;
  orientation: 'landscape' | 'portrait' | 'square';
  aspectRatio: string; // e.g. "4:3", "16:9", "1:1", "2:3", "3:4"
  dimensions: {
    width: number;
    height: number;
    unit: 'in' | 'mm' | 'px';
  };
  bleedMargin: number; // e.g. 0.125 inches (trim margin)
  safeMargin: number; // e.g. 0.25 inches (content safe area)
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  theme: TemplateTheme;
  canvasConfig: {
    backgroundColor: string;
    backgroundImageUrl?: string;
    bgGradient?: string;
    bgPattern?: string;
  };
  layers: TemplateLayer[];
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
};

export type CustomizedArtworkData = {
  templateId: string;
  templateName: string;
  previewUrl: string;
  fields: Record<TemplateFieldKey | string, string>;
  selectedSize?: ProductSizeOption;
  selectedMaterial?: ProductMaterialOption;
  selectedFinish?: ProductFinishOption;
  customizedAt: string;
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
  approvalThreshold?: number;
  requirePoNumber?: boolean;
  poPrefix?: string;
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

export type OrderStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PAID'
  | 'ORDER_PLACED'
  | 'IN_PRODUCTION'
  | 'RECEIVED'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PAYMENT_PENDING' | 'PAID' | 'REFUNDED';

export type CorporatePaymentMethod =
  | 'CORPORATE_INVOICE'
  | 'PURCHASING_CARD'
  | 'CORPORATE_ACH'
  | 'PREAPPROVED_CREDIT';

export type OrderStatusHistory = {
  status: OrderStatus;
  timestamp: string;
  actorName: string;
  actorRole: string;
  comment?: string;
};

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
  customizations?: Record<string, string>;
  templateId?: string;
  templateName?: string;
  selectedSize?: string;
  selectedMaterial?: string;
  selectedFinish?: string;
  customizedArtworkUrl?: string;
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
  campaignCode?: string;
  projectCode?: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: CorporatePaymentMethod;
  paymentReference?: string;
  paidBy?: string;
  paidAt?: string;
  totalAmount: number;
  itemCount: number;
  requiresApproval?: boolean;
  approvalNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  changesRequestedNotes?: string;
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
  carrier?: string;
  trackingNumber?: string;
  requestedDeliveryDate?: string;
  deliveryAddress?: Address;
  recipientContact?: {
    name: string;
    phone?: string;
    email?: string;
  };
  customizedArtwork?: CustomizedArtworkData;
  statusHistory?: OrderStatusHistory[];
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

// ─── Head Office Module Types ────────────────────────────────────────────────

export type HOSpendBysite = {
  siteId: string;
  siteCode: string;
  siteName: string;
  ordersCount: number;
  totalSpend: number;
  percentageOfTotal: number;
};

export type HOSpendTrend = {
  month: string;
  spend: number;
  orders: number;
};

export type HODashboardKPIs = {
  accountId: string;
  accountName: string;
  totalSpendThisMonth: number;
  totalSpendLastMonth: number;
  spendDeltaPct: number;
  orderCountThisMonth: number;
  orderCountLastMonth: number;
  ordersDeltaPct: number;
  activeSitesCount: number;
  topSite: { siteName: string; siteCode: string; spend: number };
  recentOrders: Order[];
  spendBySite: HOSpendBysite[];
  spendTrend: HOSpendTrend[];
};

export type HOBillingLineItem = {
  // Identity
  orderNumber: string;
  orderDate: string;
  // Account / Site
  accountName: string;
  accountId: string;
  siteName: string;
  siteId: string;
  siteCode: string;
  // User / Contact
  orderedByUser: string;
  orderedByEmail: string;
  // PO Reference
  poReference: string;
  // Product
  productName: string;
  sku: string;
  packSize: string;
  uom: string;
  // Qty / Pricing
  qty: number;
  unitPrice: number;
  lineValue: number;
  taxTreatment: string;
  // Order totals
  orderTotal: number;
  // Addresses
  shipToAddress: string;
  deliveryContact: string;
  deliveryInstructions: string;
  billToAddress: string;
  billToEntity: string;
  // Status
  status: OrderStatus;
  notes: string;
};

export type HOMonthlyBillingReport = {
  accountId: string;
  accountName: string;
  period: string;
  periodLabel: string;
  generatedAt: string;
  invoiceRef: string;
  totalSpend: number;
  totalOrders: number;
  totalLineItems: number;
  activeSitesCount: number;
  siteBreakdowns: HOSpendBysite[];
  lineItems: HOBillingLineItem[];
  categoryBreakdown: { category: string; spend: number; percentage: number }[];
};

// ─── Site User / Shop Module Types ──────────────────────────────────────────

export type AccountOrderRules = {
  accountId: string;
  accountName: string;
  requirePoNumber: boolean;
  poPrefix?: string;
  allowCustomDeliveryAddress: boolean;
  monthlyBudgetCap?: number;
  requireDeliveryNotes?: boolean;
  defaultCarrier?: string;
};

export type EffectiveProduct = Product & {
  effectivePrice: number;
  discountPct: number;
  rateCardName?: string;
  isCustomPriced: boolean;
};

export type OrderDeliveryDetails = {
  billToAddress: Address;
  shipToAddress: Address;
  deliveryContactName: string;
  deliveryContactPhone?: string;
  deliveryInstructions?: string;
  isCustomShippingAddress?: boolean;
};

// ─── Enterprise Integrations & Webhooks ─────────────────────────────────────

export type TargetIntegrationSystem = 'PRINT_PRODUCTION' | 'WAREHOUSE_3PL' | 'ERP_FINANCE';

export type IntegrationWebhook = {
  id: string;
  name: string;
  targetSystem: TargetIntegrationSystem;
  url: string;
  events: string[];
  status: 'ACTIVE' | 'PAUSED';
  secretKey: string;
  lastTriggeredAt?: string;
  successRatePct: number;
  totalCalls: number;
};

export type WebhookDeliveryLog = {
  id: string;
  webhookId: string;
  webhookName: string;
  targetSystem: TargetIntegrationSystem;
  event: string;
  status: 'SUCCESS' | 'FAILED' | 'RETRYING';
  httpCode: number;
  payloadSummary: string;
  timestamp: string;
  responseTimeMs: number;
};


