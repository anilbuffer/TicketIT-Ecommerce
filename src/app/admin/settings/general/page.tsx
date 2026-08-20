// src/app/admin/settings/general/page.tsx
'use client';

import React, { useState } from 'react';
import { Settings, Save, CheckCircle, Database, Shield, Globe } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function GeneralSettingsPage() {
  const [platformName, setPlatformName] = useState('TicketIT Enterprise Platform');
  const [currency, setCurrency] = useState('USD ($)');
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(60);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <AdminHeader
        title="Platform General Configuration"
        subtitle="Global environment parameters, brand identifiers, and data-source architecture status"
      />

      <main style={{ padding: '28px', maxWidth: '850px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Architecture Notice Box */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#EAF8EF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Database size={20} color="#58B97D" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>
              Service Layer Boundary Architecture Active
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>
              UI components import exclusively from <code>/lib/services/*</code>. The data layer adapter currently routes to high-fidelity in-memory mock adapters with simulated latency. When ready for production database, set <code>NEXT_PUBLIC_DATA_SOURCE=production</code> without altering any UI components.
            </p>
          </div>
        </div>

        {/* Configuration Form */}
        <form
          onSubmit={handleSave}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 12px rgba(43, 37, 62, 0.06)',
            border: '1px solid rgba(43, 37, 62, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2B253E', margin: 0 }}>
            Global System Parameters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Platform Display Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Default Master Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                >
                  <option value="USD ($)">USD ($) - United States Dollar</option>
                  <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Session Inactivity Timeout (Minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="480"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value, 10) || 60)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '20px', marginTop: '10px' }}>
            {saved ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#58B97D', fontSize: '0.85rem', fontWeight: 700 }}>
                <CheckCircle size={16} />
                <span>Configuration saved successfully!</span>
              </div>
            ) : <span />}

            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                backgroundColor: '#F73582',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(247, 53, 130, 0.3)',
              }}
            >
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
