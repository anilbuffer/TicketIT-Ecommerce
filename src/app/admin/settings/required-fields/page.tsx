// src/app/admin/settings/required-fields/page.tsx
'use client';

import React, { useState } from 'react';
import { CheckSquare, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function RequiredFieldsSettingsPage() {
  const [requirePoNumber, setRequirePoNumber] = useState(true);
  const [poPrefixEnforced, setPoPrefixEnforced] = useState(true);
  const [requireDeliveryNotes, setRequireDeliveryNotes] = useState(false);
  const [enforceMoq, setEnforceMoq] = useState(true);
  const [enforceOrderMultiples, setEnforceOrderMultiples] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <AdminHeader
        title="Purchase Order Validation & Checkout Rules"
        subtitle="Configure mandatory checkout fields, automated PO prefix verification, and MOQ constraints"
      />

      <main style={{ padding: '28px', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#2B253E' }}>
            Checkout & Requisition Validation Rules
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={requirePoNumber}
                onChange={(e) => setRequirePoNumber(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#F73582' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                  Require Purchase Order (PO) Number on Checkout
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Site users cannot submit collateral orders without entering an approved PO reference number.
                </div>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={poPrefixEnforced}
                onChange={(e) => setPoPrefixEnforced(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#F73582' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                  Enforce Branch PO Prefix (e.g. RX-APX104-*)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Validates that the entered PO reference starts with the branch site's designated prefix code.
                </div>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={enforceMoq}
                onChange={(e) => setEnforceMoq(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#F73582' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                  Enforce Minimum Order Quantities (MOQ)
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Prevents branch users from entering basket quantities lower than the item MOQ defined in catalogue.
                </div>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={enforceOrderMultiples}
                onChange={(e) => setEnforceOrderMultiples(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#F73582' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2B253E' }}>
                  Enforce Order Multiples Increment Step
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Restricts quantity increments to pack size multiples (e.g. 2, 4, 6 or 10, 20, 30).
                </div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '18px' }}>
            {saved ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#58B97D', fontSize: '0.85rem', fontWeight: 700 }}>
                <CheckCircle size={16} />
                <span>Validation rules updated!</span>
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
              <span>Apply Rules</span>
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
