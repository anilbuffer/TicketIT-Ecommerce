// src/lib/services/templates.service.ts
import type { PrintTemplate, PaginatedResult } from './types';
import * as mockTemplates from '@/lib/data-source/mock/mock-templates.adapter';

export async function getTemplates(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  productId?: string;
  status?: PrintTemplate['status'] | 'ALL';
  theme?: string;
  search?: string;
}): Promise<PaginatedResult<PrintTemplate>> {
  return mockTemplates.list(params);
}

export async function getTemplateById(id: string): Promise<PrintTemplate | null> {
  return mockTemplates.getById(id);
}

export async function createTemplate(
  data: Omit<PrintTemplate, 'id' | 'createdAt' | 'updatedAt' | 'version'>
): Promise<PrintTemplate> {
  return mockTemplates.create(data);
}

export async function updateTemplate(
  id: string,
  data: Partial<PrintTemplate>
): Promise<PrintTemplate> {
  return mockTemplates.update(id, data);
}

export async function duplicateTemplate(id: string, newName?: string): Promise<PrintTemplate> {
  return mockTemplates.duplicate(id, newName);
}

export async function deleteTemplate(id: string): Promise<void> {
  return mockTemplates.remove(id);
}

export async function publishTemplate(id: string): Promise<PrintTemplate> {
  return mockTemplates.setStatus(id, 'PUBLISHED');
}

export async function unpublishTemplate(id: string): Promise<PrintTemplate> {
  return mockTemplates.setStatus(id, 'DRAFT');
}

export async function archiveTemplate(id: string): Promise<PrintTemplate> {
  return mockTemplates.setStatus(id, 'ARCHIVED');
}
