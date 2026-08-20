// src/app/admin/integrations/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Webhook,
  Radio,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Send,
  RefreshCw,
  Code2,
  Server,
  Layers,
  Settings2,
  Zap,
  Globe,
  Lock,
  ArrowUpRight,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import type { TargetIntegrationSystem, IntegrationWebhook, WebhookDeliveryLog } from '@/lib/services/types';

const INITIAL_WEBHOOKS: IntegrationWebhook[] = [
  {
    id: 'wh-print-01',
    name: 'PrintFlow Production Webhook (CMYK Dispatch)',
    targetSystem: 'PRINT_PRODUCTION',
    url: 'https://api.printflow.production.net/v2/orders/inbound',
    events: ['ORDER_APPROVED', 'ORDER_CONFIRMED'],
    status: 'ACTIVE',
    secretKey: 'sec_live_99482019ab9284102',
    lastTriggeredAt: '2026-08-20T08:12:00.000Z',
    successRatePct: 99.4,
    totalCalls: 1420,
  },
  {
    id: 'wh-3pl-02',
    name: 'Rahhawan 3PL WMS Automated Dispatch',
    targetSystem: 'WAREHOUSE_3PL',
    url: 'https://wms.rahhawan-logistics.io/api/v1/fulfillment/create-pick',
    events: ['ORDER_PROCESSING', 'INVENTORY_RESERVED'],
    status: 'ACTIVE',
    secretKey: 'sec_live_38291048bc7193021',
    lastTriggeredAt: '2026-08-20T09:45:00.000Z',
    successRatePct: 100.0,
    totalCalls: 3890,
  },
  {
    id: 'wh-erp-03',
    name: 'SAP S/4HANA & NetSuite Billing Ingest',
    targetSystem: 'ERP_FINANCE',
    url: 'https://finance-gw.enterprise-erp.com/odata/v4/JournalEntries',
    events: ['MONTHLY_BILLING_CONSOLIDATED', 'ORDER_DELIVERED'],
    status: 'ACTIVE',
    secretKey: 'sec_live_77192840ac8291045',
    lastTriggeredAt: '2026-08-19T23:59:00.000Z',
    successRatePct: 98.8,
    totalCalls: 540,
  },
];

const INITIAL_LOGS: WebhookDeliveryLog[] = [
  {
    id: 'log-001',
    webhookId: 'wh-3pl-02',
    webhookName: 'Rahhawan 3PL WMS Automated Dispatch',
    targetSystem: 'WAREHOUSE_3PL',
    event: 'ORDER_PROCESSING',
    status: 'SUCCESS',
    httpCode: 200,
    payloadSummary: '{"orderNumber":"ORD-2026-0891","siteCode":"APX-MID-101","items":3}',
    timestamp: '2026-08-20T09:45:12.110Z',
    responseTimeMs: 142,
  },
  {
    id: 'log-002',
    webhookId: 'wh-print-01',
    webhookName: 'PrintFlow Production Webhook',
    targetSystem: 'PRINT_PRODUCTION',
    event: 'ORDER_APPROVED',
    status: 'SUCCESS',
    httpCode: 201,
    payloadSummary: '{"orderNumber":"ORD-2026-0998","template":"POS-WND-BANNER-01","bleedMm":3}',
    timestamp: '2026-08-20T08:12:04.450Z',
    responseTimeMs: 210,
  },
  {
    id: 'log-003',
    webhookId: 'wh-erp-03',
    webhookName: 'SAP S/4HANA & NetSuite Billing Ingest',
    targetSystem: 'ERP_FINANCE',
    event: 'MONTHLY_BILLING_CONSOLIDATED',
    status: 'SUCCESS',
    httpCode: 200,
    payloadSummary: '{"period":"August 2026","accountId":"acc-001","totalAmount":28450.00}',
    timestamp: '2026-08-19T23:59:10.000Z',
    responseTimeMs: 380,
  },
];

export default function AdminIntegrationsPage() {
  const [webhooks, setWebhooks] = useState<IntegrationWebhook[]>(INITIAL_WEBHOOKS);
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>(INITIAL_LOGS);
  const [isTesting, setIsTesting] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<IntegrationWebhook | null>(null);
  const [testResult, setTestResult] = useState<{
    status: 'SUCCESS' | 'FAILED';
    code: number;
    responseTimeMs: number;
    requestPayload: any;
    responseBody: any;
  } | null>(null);

  // Inbound Simulation
  const [inboundCarrier, setInboundCarrier] = useState('Rahhawan Direct Logistics');
  const [inboundTracking, setInboundTracking] = useState('RH-EXP-99210');
  const [inboundStatus, setInboundStatus] = useState<'DISPATCHED' | 'DELIVERED'>('DISPATCHED');
  const [inboundFeedback, setInboundFeedback] = useState<string | null>(null);

  const handleTestTrigger = async (wh: IntegrationWebhook) => {
    setSelectedWebhook(wh);
    setIsTesting(true);
    setTestResult(null);

    const payload = {
      event: wh.events[0],
      timestamp: new Date().toISOString(),
      order: {
        orderNumber: 'ORD-2026-TEST',
        accountId: 'acc-001',
        accountName: 'Apex Healthcare Group',
        siteCode: 'APX-MID-101',
        totalAmount: 1420.0,
        poReference: 'PO-TEST-9921',
      },
    };

    setTimeout(() => {
      const responseTime = Math.floor(90 + Math.random() * 120);
      const newLog: WebhookDeliveryLog = {
        id: `log-${Date.now()}`,
        webhookId: wh.id,
        webhookName: wh.name,
        targetSystem: wh.targetSystem,
        event: wh.events[0],
        status: 'SUCCESS',
        httpCode: 200,
        payloadSummary: JSON.stringify(payload),
        timestamp: new Date().toISOString(),
        responseTimeMs: responseTime,
      };

      setLogs([newLog, ...logs]);
      setTestResult({
        status: 'SUCCESS',
        code: 200,
        responseTimeMs: responseTime,
        requestPayload: payload,
        responseBody: {
          success: true,
          message: 'Payload ingested and queued for processing',
          queueId: `q_${Math.random().toString(36).substring(2, 9)}`,
        },
      });
      setIsTesting(false);
    }, 600);
  };

  const handleInboundSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setInboundFeedback(
      `✓ Inbound Webhook Received: Carrier "${inboundCarrier}" updated order with status "${inboundStatus}" (Tracking: ${inboundTracking}). Synced to audit ledger.`
    );
    setTimeout(() => setInboundFeedback(null), 5000);
  };

  return (
    <>
      <AdminHeader
        title="Enterprise Integration & Webhook Hub"
        subtitle="Configure outbound REST/Webhook endpoints for Print, 3PL Warehousing, and ERP/Finance systems"
        actionButton={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#047857',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            <Zap size={16} />
            <span>3 Endpoints Active (100% Health)</span>
          </div>
        }
      />

      <main style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* 1. Integration Endpoints Grid */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
            Active Outbound Endpoints
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(43, 37, 62, 0.08)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor:
                            wh.targetSystem === 'PRINT_PRODUCTION'
                              ? '#FDF2F8'
                              : wh.targetSystem === 'WAREHOUSE_3PL'
                              ? '#EEF2FF'
                              : '#F0FDF4',
                          color:
                            wh.targetSystem === 'PRINT_PRODUCTION'
                              ? '#DB2777'
                              : wh.targetSystem === 'WAREHOUSE_3PL'
                              ? '#4F46E5'
                              : '#16A34A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {wh.targetSystem === 'PRINT_PRODUCTION' ? (
                          <Layers size={18} />
                        ) : wh.targetSystem === 'WAREHOUSE_3PL' ? (
                          <Server size={18} />
                        ) : (
                          <Globe size={18} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{wh.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{wh.targetSystem}</div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#ECFDF5',
                        color: '#065F46',
                        border: '1px solid #A7F3D0',
                      }}
                    >
                      {wh.status}
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#334155',
                      overflowX: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '10px',
                    }}
                  >
                    {wh.url}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {wh.events.map((ev) => (
                      <span
                        key={ev}
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                        }}
                      >
                        {ev}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                    <span>Success Rate: <strong style={{ color: '#059669' }}>{wh.successRatePct}%</strong></span>
                    <span>Total Calls: <strong>{wh.totalCalls.toLocaleString()}</strong></span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleTestTrigger(wh)}
                    disabled={isTesting}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Play size={12} fill="#fff" />
                    <span>Send Test Payload</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Result Inspector Modal / Panel */}
        <AnimatePresence>
          {selectedWebhook && testResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #A7F3D0',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#10B981" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Webhook Response Test: {selectedWebhook.name}
                  </span>
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#ECFDF5', color: '#047857', fontWeight: 700 }}>
                    HTTP {testResult.code} OK ({testResult.responseTimeMs}ms)
                  </span>
                </div>
                <button
                  onClick={() => setSelectedWebhook(null)}
                  style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontWeight: 700 }}
                >
                  ✕ Close
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Request Payload Sent (JSON)
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#0F172A',
                      color: '#38BDF8',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      maxHeight: '160px',
                      overflowY: 'auto',
                    }}
                  >
                    {JSON.stringify(testResult.requestPayload, null, 2)}
                  </pre>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Remote Server Response (JSON)
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#0F172A',
                      color: '#4ADE80',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      maxHeight: '160px',
                      overflowY: 'auto',
                    }}
                  >
                    {JSON.stringify(testResult.responseBody, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Inbound Webhook Simulator */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(43, 37, 62, 0.08)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Radio size={20} color="#2563EB" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Inbound Webhook Simulator (Carrier & 3PL Status Push)
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px' }}>
            Simulate external partners (Print Shop or 3PL Fleet) posting tracking numbers and fulfillment updates back to TicketIT.
          </p>

          {inboundFeedback && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '16px',
              }}
            >
              {inboundFeedback}
            </div>
          )}

          <form onSubmit={handleInboundSimulate} style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Carrier / External Partner
              </label>
              <input
                type="text"
                value={inboundCarrier}
                onChange={(e) => setInboundCarrier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Tracking Reference Number
              </label>
              <input
                type="text"
                value={inboundTracking}
                onChange={(e) => setInboundTracking(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ flex: '1 1 160px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Fulfillment Status
              </label>
              <select
                value={inboundStatus}
                onChange={(e) => setInboundStatus(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  outline: 'none',
                  backgroundColor: '#fff',
                }}
              >
                <option value="DISPATCHED">DISPATCHED (In Transit)</option>
                <option value="DELIVERED">DELIVERED (Proof of Delivery)</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Simulate Inbound POST
            </button>
          </form>
        </div>

        {/* 3. Delivery Audit Logs */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(43, 37, 62, 0.08)',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.04)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>
            Webhook Transmission & Delivery Ledger
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Timestamp</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Target System</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Webhook Endpoint</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Event</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>HTTP Status</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Latency</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700 }}>Payload Preview</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 18px', color: '#64748B', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '12px 18px', fontWeight: 700, color: '#0F172A' }}>
                      {log.targetSystem}
                    </td>
                    <td style={{ padding: '12px 18px', color: '#334155' }}>
                      {log.webhookName}
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#EEF2FF',
                          color: '#4338CA',
                        }}
                      >
                        {log.event}
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#ECFDF5',
                          color: '#065F46',
                        }}
                      >
                        {log.httpCode} OK
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#64748B', fontWeight: 600 }}>
                      {log.responseTimeMs}ms
                    </td>
                    <td style={{ padding: '12px 18px', fontFamily: 'monospace', fontSize: '11px', color: '#64748B' }}>
                      {log.payloadSummary.slice(0, 45)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
