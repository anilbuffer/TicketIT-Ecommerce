// src/app/admin/templates/[templateId]/edit/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTemplate } from '@/lib/hooks/useTemplates';
import { TemplateBuilderStudio } from '@/components/admin/TemplateBuilderStudio';

export default function AdminTemplateEditPage() {
  const params = useParams();
  const templateId = params?.templateId as string;
  const { template, isLoading } = useTemplate(templateId);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#94a3b8' }}>
        Loading Template Builder Studio...
      </div>
    );
  }

  if (!template) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#ef4444' }}>
        Template not found.
      </div>
    );
  }

  return <TemplateBuilderStudio initialTemplate={template} isNew={false} />;
}
