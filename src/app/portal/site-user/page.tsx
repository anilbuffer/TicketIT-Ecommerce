'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Package,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle,
  FileText,
  Clock,
  Truck,
  Sparkles,
  Info,
  Layers,
  Search,
  Filter,
  Check,
} from 'lucide-react';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { useAuth } from '../../../context/AuthContext';
import { SaaSLayout } from '../../../components/layout/SaaSLayout';
import { Container } from '../../../components/layout/Container';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  MARKETING_ASSETS,
  MOCK_ORDERS,
  MarketingAsset,
  SiteOrder,
} from '../../../data/marketingAssets';

function SiteUserPortalContent() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart for collateral ordering
  const [orderBasket, setOrderBasket] = useState<
    { asset: MarketingAsset; quantity: number }[]
  >([]);

  // Site Orders state
  const [orders, setOrders] = useState<SiteOrder[]>(MOCK_ORDERS);

  // Order submission modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [poNumber, setPoNumber] = useState(
    user?.poPrefix ? `${user.poPrefix}-${Math.floor(1000 + Math.random() * 9000)}` : 'PO-APX104-9450'
  );
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<SiteOrder | null>(null);

  // Cart handlers
  const handleAddToCart = (asset: MarketingAsset) => {
    setOrderBasket((prev) => {
      const existing = prev.find((item) => item.asset.id === asset.id);
      if (existing) {
        return prev.map((item) =>
          item.asset.id === asset.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { asset, quantity: 1 }];
    });
  };

  const handleUpdateQty = (assetId: string, delta: number) => {
    setOrderBasket((prev) =>
      prev
        .map((item) => {
          if (item.asset.id === assetId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { asset: MarketingAsset; quantity: number }[]
    );
  };

  const basketSubtotal = orderBasket.reduce(
    (sum, item) => sum + item.asset.unitCost * item.quantity,
    0
  );
  const totalItemsCount = orderBasket.reduce((sum, item) => sum + item.quantity, 0);

  // Filter assets
  const filteredAssets = MARKETING_ASSETS.filter((asset) => {
    const matchCat = selectedCategory === 'All' || asset.category === selectedCategory;
    const matchQuery =
      searchQuery === '' ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const categories = ['All', 'Point of Sale', 'Digital & Signage', 'Apparel & Uniforms', 'Print Collateral', 'Branded Merch'];

  // Handle Order Submit (Zero Payment, Consolidated Billing)
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderBasket.length === 0) return;

    setIsSubmittingOrder(true);

    setTimeout(() => {
      const newOrder: SiteOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        poNumber: poNumber.trim() || `PO-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
        siteCode: user?.siteCode || 'APEX-NYC-104',
        siteName: user?.siteName || 'Downtown Flagship #104 (5th Ave, NY)',
        orderedBy: user?.name || 'Marcus Vance',
        orderedByEmail: user?.email || 'marcus.vance@apexretail.com',
        createdAt: new Date().toISOString(),
        status: 'In Production',
        items: orderBasket.map((item) => ({
          assetId: item.asset.id,
          sku: item.asset.sku,
          title: item.asset.title,
          quantity: item.quantity,
          unitPrice: item.asset.unitCost,
          totalPrice: item.asset.unitCost * item.quantity,
          thumbnail: item.asset.thumbnail,
        })),
        subtotal: basketSubtotal,
        deliveryFee: 0.0,
        totalValue: basketSubtotal,
        deliveryAddress: '740 5th Avenue, Suite 104, New York, NY 10019',
        recipientContact: `${user?.name} (+1 212-555-0199)`,
        billingPeriod: 'August 2026',
        notes: deliveryNotes,
      };

      setOrders([newOrder, ...orders]);
      setOrderPlacedSuccess(newOrder);
      setOrderBasket([]);
      setIsSubmittingOrder(false);
      setIsCheckoutOpen(false);
    }, 1200);
  };

  return (
    <div style={{ padding: '2rem 0 5rem 0' }}>
      <Container>
        {/* Portal Header & Site Profile Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #2b253e 0%, #1e192c 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem',
            color: '#ffffff',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(88, 185, 125, 0.2)',
                color: '#58b97d',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                marginBottom: '0.75rem',
                border: '1px solid rgba(88, 185, 125, 0.4)',
              }}
            >
              <Store size={14} />
              <span>ROLE 01 • CUSTOMER / SITE USER PORTAL</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', color: '#ffffff', marginBottom: '0.5rem' }}>
              Marketing Asset Ordering & Collateral Hub
            </h1>
            <p style={{ color: '#c3bfd4', fontSize: 'var(--font-size-sm)', maxWidth: '650px', lineHeight: 1.5 }}>
              Browse approved marketing collateral, submit orders for fulfillment under your branch PO, with zero upfront payment via monthly consolidated account billing.
            </p>
          </div>

          {/* Branch Metadata Badge */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              minWidth: '260px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#a09ab5', fontWeight: 700, textTransform: 'uppercase' }}>
              ASSIGNED SITE BRANCH
            </div>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>
              {user?.siteName || 'Downtown Flagship #104'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#c3bfd4', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
              <span>Monthly Budget Cap:</span>
              <strong style={{ color: '#58b97d' }}>${(user?.monthlyBudgetCap || 8500).toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Basket Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              background: 'rgba(231, 234, 239, 0.8)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              onClick={() => setActiveTab('catalog')}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: 'var(--font-size-sm)',
                background: activeTab === 'catalog' ? 'var(--color-secondary)' : 'transparent',
                color: activeTab === 'catalog' ? '#ffffff' : 'var(--color-text-main)',
                transition: 'all 0.2s',
              }}
            >
              Approved Collateral Catalogue ({MARKETING_ASSETS.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: 'var(--font-size-sm)',
                background: activeTab === 'orders' ? 'var(--color-secondary)' : 'transparent',
                color: activeTab === 'orders' ? '#ffffff' : 'var(--color-text-main)',
                transition: 'all 0.2s',
              }}
            >
              My Branch Orders ({orders.length})
            </button>
          </div>

          {/* Active Basket Pill Button */}
          {orderBasket.length > 0 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsCheckoutOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #58b97d 0%, #3e965f 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: 'var(--font-size-sm)',
                boxShadow: '0 8px 20px rgba(88, 185, 125, 0.35)',
                cursor: 'pointer',
              }}
            >
              <ShoppingCart size={18} />
              <span>Review Cart ({totalItemsCount} items • ${basketSubtotal.toFixed(2)})</span>
              <span
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                }}
              >
                No Payment Required
              </span>
            </motion.button>
          )}
        </div>

        {/* Tab 1: Catalogue */}
        {activeTab === 'catalog' && (
          <div>
            {/* Search & Category Filter */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 700,
                      background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: selectedCategory === cat ? '#ffffff' : 'var(--color-text-main)',
                      border: '1px solid var(--color-border)',
                      boxShadow: selectedCategory === cat ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search SKU, name, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem 0.55rem 2.25rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>

            {/* Asset Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {filteredAssets.map((asset) => {
                const inCart = orderBasket.find((i) => i.asset.id === asset.id);

                return (
                  <motion.div
                    key={asset.id}
                    whileHover={{ y: -5 }}
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      border: inCart ? '2px solid #58b97d' : '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-md)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Thumbnail Image */}
                    <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
                      <Image
                        src={asset.thumbnail}
                        alt={asset.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(43, 37, 62, 0.85)',
                          backdropFilter: 'blur(8px)',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}
                      >
                        {asset.sku}
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(88, 185, 125, 0.9)',
                          color: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}
                      >
                        Approved DAM
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        {asset.category}
                      </div>

                      <h3 style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-secondary)', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                        {asset.title}
                      </h3>

                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)', lineHeight: 1.4, marginBottom: '0.85rem', flex: 1 }}>
                        {asset.description}
                      </p>

                      <div
                        style={{
                          background: 'rgba(231, 234, 239, 0.5)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.72rem',
                          color: 'var(--color-text-muted)',
                          marginBottom: '1rem',
                        }}
                      >
                        <strong>Specs:</strong> {asset.specifications}
                      </div>

                      {/* Pricing & Add to Basket */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem' }}>
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                            BILLING VALUE
                          </div>
                          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 900, color: 'var(--color-secondary)' }}>
                            {asset.unitCost === 0 ? 'Free (Digital)' : `$${asset.unitCost.toFixed(2)}`}
                          </div>
                        </div>

                        {inCart ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', border: '1px solid #86efac', padding: '4px 8px', borderRadius: 'var(--radius-full)' }}>
                            <button
                              onClick={() => handleUpdateQty(asset.id, -1)}
                              style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #86efac', cursor: 'pointer' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: '#166534', minWidth: '18px', textAlign: 'center' }}>
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(asset.id, 1)}
                              style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #86efac', cursor: 'pointer' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddToCart(asset)}
                            leftIcon={<Plus size={14} />}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Orders History */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 900, fontSize: 'var(--font-size-md)', color: 'var(--color-secondary)' }}>
                          {order.orderNumber}
                        </span>
                        <span
                          style={{
                            background:
                              order.status === 'Delivered'
                                ? '#ecfdf5'
                                : order.status === 'In Production'
                                ? '#eff6ff'
                                : '#fef3c7',
                            color:
                              order.status === 'Delivered'
                                ? '#059669'
                                : order.status === 'In Production'
                                ? '#2563eb'
                                : '#d97706',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                        PO Number: <strong>{order.poNumber}</strong> • Date: {new Date(order.createdAt).toLocaleDateString()} • Billing Period: {order.billingPeriod}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                        ORDER TOTAL (CONSOLIDATED INVOICE)
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 900, color: 'var(--color-secondary)' }}>
                        ${order.totalValue.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', background: 'rgba(231, 234, 239, 0.4)', padding: '0.65rem 1rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{item.quantity}x</span>
                          <span style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{item.title}</span>
                          <code style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>({item.sku})</code>
                        </div>
                        <span style={{ fontWeight: 800, color: 'var(--color-secondary)' }}>${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--color-text-sub)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Delivery Target: {order.deliveryAddress}</span>
                    <span>Recipient: {order.recipientContact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Placement / Checkout Modal */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                background: 'rgba(43, 37, 62, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '2rem',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-secondary)' }}>
                      Submit Collateral Order
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-sub)' }}>
                      Site: {user?.siteName}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Order Items summary */}
                  <div style={{ background: 'rgba(231, 234, 239, 0.5)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>
                      ORDER BASKET ITEMS ({totalItemsCount})
                    </div>
                    {orderBasket.map((i) => (
                      <div key={i.asset.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                        <span>{i.quantity}x {i.asset.title}</span>
                        <strong>${(i.asset.unitCost * i.quantity).toFixed(2)}</strong>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', marginTop: '0.5rem', fontWeight: 800 }}>
                      <span>Total Account Billing Amount:</span>
                      <span style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-md)' }}>${basketSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* PO Number Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                      Purchase Order (PO) Number *
                    </label>
                    <input
                      type="text"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      required
                      placeholder="e.g. PO-APX104-9450"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontWeight: 700,
                      }}
                    />
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Required for Head Office monthly consolidated billing reconciliation.
                    </div>
                  </div>

                  {/* Delivery Notes */}
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '0.35rem' }}>
                      Fulfillment & Special Delivery Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Deliver to rear loading bay before 10 AM..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        fontSize: 'var(--font-size-xs)',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Billing Explainer Callout */}
                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: '#065f46' }}>
                    <strong>✓ No Payment Due at Checkout:</strong> Order data will be captured for central fulfillment and added to Apex Retail Group&apos;s consolidated monthly billing extract.
                  </div>

                  {/* Submit buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      style={{ flex: 1 }}
                      onClick={() => setIsCheckoutOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="green"
                      size="md"
                      style={{ flex: 2 }}
                      isLoading={isSubmittingOrder}
                      leftIcon={<CheckCircle size={16} />}
                    >
                      Confirm & Submit Order
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Order Placed Success Alert */}
        <AnimatePresence>
          {orderPlacedSuccess && (
            <div
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 1000,
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
                border: '1.5px solid #58b97d',
                maxWidth: '400px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', color: '#065f46' }}>
                    Order Submitted Successfully!
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {orderPlacedSuccess.orderNumber} • {orderPlacedSuccess.poNumber}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)', marginBottom: '0.75rem' }}>
                Dispatched to print fulfillment team. Consolidated under August 2026 billing.
              </p>
              <button
                onClick={() => {
                  setOrderPlacedSuccess(null);
                  setActiveTab('orders');
                }}
                style={{
                  width: '100%',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                View in My Orders
              </button>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
}

export default function SiteUserPortalPage() {
  return (
    <AuthGuard allowedRoles={['site_user', 'admin']} requiredPermission="order_collateral">
      <SaaSLayout>
        <SiteUserPortalContent />
      </SaaSLayout>
    </AuthGuard>
  );
}
