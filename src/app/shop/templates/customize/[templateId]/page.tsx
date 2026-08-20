// src/app/shop/templates/customize/[templateId]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTemplate } from '@/lib/hooks/useTemplates';
import { TemplateCustomizerStudio } from '@/components/shop/TemplateCustomizerStudio';

export default function ShopTemplateCustomizePage() {
  const params = useParams();
  const templateId = params?.templateId as string;
  const { template, isLoading } = useTemplate(templateId);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748b' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '3px solid #fbcfe8',
              borderTopColor: '#f73582',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Loading Personalization Studio...</span>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#ef4444' }}>
        Template not found or not published.
      </div>
    );
  }

  return <TemplateCustomizerStudio template={template} />;
}
