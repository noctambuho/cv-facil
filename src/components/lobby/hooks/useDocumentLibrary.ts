/**
 * src/components/lobby/hooks/useDocumentLibrary.ts
 * Hook para la gestión integral de la biblioteca de documentos del usuario.
 * Trazabilidad: US-07, TASK-7.6
 */

import { useState, useEffect, useCallback } from 'react';
import type { CVMetadata } from '../../../types/storage';
import type { CVData } from '../../../types/cv';
import { getStorageAdapter } from '../../../services/storage';
import { goToEditor } from '../../../services/browser/navigation';
import { initialData } from '../../../data/initialData';
import { sampleData } from '../../../data/sampleData';

/**
 * [HOOK] Administra el ciclo de vida y operaciones CRUD de la colección de documentos.
 */
export function useDocumentLibrary() {
  const [documents, setDocuments] = useState<CVMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const adapter = getStorageAdapter();
      const list = await adapter.listDocuments();
      setDocuments(list);
    } catch (err) {
      console.error('Error al cargar documentos en Lobby:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();

    const handleLibraryUpdate = () => loadDocuments();
    window.addEventListener('cv_facil_library_updated', handleLibraryUpdate);

    return () => {
      window.removeEventListener('cv_facil_library_updated', handleLibraryUpdate);
    };
  }, [loadDocuments]);

  const handleCreateBlank = async () => {
    try {
      const adapter = getStorageAdapter();
      const blankData: CVData = {
        ...initialData,
        profile: {
          ...initialData.profile,
          fullName: 'Nuevo Currículum',
          headline: 'Título Profesional',
        },
      };
      const created = await adapter.saveDocument(blankData, 'Nuevo Currículum');
      goToEditor(created.id);
    } catch (err) {
      console.error('Error al crear documento en blanco:', err);
    }
  };

  const handleChooseTemplate = async () => {
    try {
      const adapter = getStorageAdapter();
      const created = await adapter.saveDocument(sampleData, 'CV Plantilla Moderna');
      goToEditor(created.id);
    } catch (err) {
      console.error('Error al crear documento con plantilla:', err);
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      const adapter = getStorageAdapter();
      await adapter.renameDocument(id, newTitle.trim());
      await loadDocuments();
    } catch (err) {
      console.error('Error al renombrar documento:', err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const adapter = getStorageAdapter();
      await adapter.duplicateDocument(id);
      await loadDocuments();
    } catch (err) {
      console.error('Error al duplicar documento:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const adapter = getStorageAdapter();
      await adapter.deleteDocument(id);
      await loadDocuments();
    } catch (err) {
      console.error('Error al eliminar documento:', err);
    }
  };

  return {
    documents,
    isLoading,
    loadDocuments,
    handleCreateBlank,
    handleChooseTemplate,
    handleRename,
    handleDuplicate,
    handleDelete,
  };
}
