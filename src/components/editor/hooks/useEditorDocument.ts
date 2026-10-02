/**
 * src/components/editor/hooks/useEditorDocument.ts
 * Hook de responsabilidad única para el ciclo de vida, carga y sincronización
 * del documento activo en el Editor (/editor).
 *
 * Trazabilidad: US-07, US-08, TASK-2.5.1
 */

import { useState, useEffect, useCallback } from 'react';
import type { CVData } from '../../../types/cv';
import { initialData } from '../../../data/initialData';
import { sampleData } from '../../../data/sampleData';
import { sanitizeDocumentId, generateSecureId } from '../../../utils/security';
import { getStorageAdapter } from '../../../services/storage';

export interface UseEditorDocumentReturn {
  documentId: string;
  documentTitle: string;
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData>>;
  isLoading: boolean;
  isAutoExportRequested: boolean;
  handleTitleChange: (newTitle: string) => Promise<void>;
}

/**
 * Gestiona la carga inicial del documento mediante ?id=, fallbacks seguros
 * ante IDs inexistentes y el renombramiento reactivo.
 */
export function useEditorDocument(): UseEditorDocumentReturn {
  const [documentId, setDocumentId] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('Mi Currículum');
  const [data, setData] = useState<CVData>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAutoExportRequested, setIsAutoExportRequested] = useState<boolean>(false);

  const updateUrlId = useCallback((id: string) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const fallbackToExistingOrCreate = useCallback(async () => {
    const adapter = getStorageAdapter();
    const list = await adapter.listDocuments();
    if (list && list.length > 0) {
      const first = list[0];
      const loaded = await adapter.getDocument(first.id);
      setData(loaded);
      setDocumentId(first.id);
      setDocumentTitle(first.title);
      updateUrlId(first.id);
    } else {
      const newId = generateSecureId();
      const created = await adapter.saveDocument(sampleData, 'CV Desarrollador 2026', newId);
      setData(sampleData);
      setDocumentId(created.id);
      setDocumentTitle(created.title);
      updateUrlId(created.id);
    }
  }, [updateUrlId]);

  useEffect(() => {
    const initializeDocument = async () => {
      setIsLoading(true);
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const rawId = urlParams.get('id');
        const autoExport = urlParams.get('export') === 'true';

        if (autoExport) {
          setIsAutoExportRequested(true);
        }

        // SECURITY (CWE-20): Sanitizar ID estrictamente
        const safeId = sanitizeDocumentId(rawId);
        const adapter = getStorageAdapter();

        if (safeId) {
          try {
            const loaded = await adapter.getDocument(safeId);
            setData(loaded);
            setDocumentId(safeId);
            setDocumentTitle(
              loaded.profile.fullName ? `CV ${loaded.profile.fullName}` : 'Mi Currículum'
            );
          } catch {
            await fallbackToExistingOrCreate();
          }
        } else {
          await fallbackToExistingOrCreate();
        }
      } catch (err) {
        console.error('Error al inicializar editor:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDocument();
  }, [fallbackToExistingOrCreate]);

  const handleTitleChange = async (newTitle: string) => {
    setDocumentTitle(newTitle);
    if (documentId) {
      try {
        const adapter = getStorageAdapter();
        await adapter.renameDocument(documentId, newTitle);
      } catch (err) {
        console.error('Error al renombrar documento:', err);
      }
    }
  };

  return {
    documentId,
    documentTitle,
    data,
    setData,
    isLoading,
    isAutoExportRequested,
    handleTitleChange,
  };
}
