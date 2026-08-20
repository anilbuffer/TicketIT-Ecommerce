// src/lib/hooks/useTemplates.ts
import { useState, useEffect, useCallback } from 'react';
import type { PrintTemplate } from '@/lib/services/types';
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  duplicateTemplate,
  deleteTemplate,
  publishTemplate,
  unpublishTemplate,
  archiveTemplate,
} from '@/lib/services/templates.service';

export function useTemplates(params?: {
  category?: string;
  productId?: string;
  status?: PrintTemplate['status'] | 'ALL';
  theme?: string;
  search?: string;
}) {
  const [data, setData] = useState<PrintTemplate[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTemplates(params);
      setData(res.items);
      setTotal(res.total);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.productId, params?.status, params?.theme, params?.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, total, isLoading, error, refetch: fetchData };
}

export function useTemplate(id: string | undefined) {
  const [template, setTemplate] = useState<PrintTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplate = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTemplateById(id);
      setTemplate(res);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  return { template, isLoading, error, refetch: fetchTemplate };
}

export function useTemplateMutations() {
  const [isPending, setIsPending] = useState(false);

  const handleCreate = async (
    data: Omit<PrintTemplate, 'id' | 'createdAt' | 'updatedAt' | 'version'>
  ) => {
    setIsPending(true);
    try {
      return await createTemplate(data);
    } finally {
      setIsPending(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<PrintTemplate>) => {
    setIsPending(true);
    try {
      return await updateTemplate(id, data);
    } finally {
      setIsPending(false);
    }
  };

  const handleDuplicate = async (id: string, newName?: string) => {
    setIsPending(true);
    try {
      return await duplicateTemplate(id, newName);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsPending(true);
    try {
      return await deleteTemplate(id);
    } finally {
      setIsPending(false);
    }
  };

  const handlePublish = async (id: string) => {
    setIsPending(true);
    try {
      return await publishTemplate(id);
    } finally {
      setIsPending(false);
    }
  };

  const handleUnpublish = async (id: string) => {
    setIsPending(true);
    try {
      return await unpublishTemplate(id);
    } finally {
      setIsPending(false);
    }
  };

  const handleArchive = async (id: string) => {
    setIsPending(true);
    try {
      return await archiveTemplate(id);
    } finally {
      setIsPending(false);
    }
  };

  return {
    createTemplate: handleCreate,
    updateTemplate: handleUpdate,
    duplicateTemplate: handleDuplicate,
    deleteTemplate: handleDelete,
    publishTemplate: handlePublish,
    unpublishTemplate: handleUnpublish,
    archiveTemplate: handleArchive,
    isPending,
  };
}
