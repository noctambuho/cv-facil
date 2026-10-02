/**
 * src/components/editor/hooks/useAutoSave.ts
 * Hook de responsabilidad única para el autoguardado reactivo con debounce
 * de 500 ms hacia el adaptador de almacenamiento activo (IStorageAdapter).
 *
 * Trazabilidad: US-08, TASK-2.5.1
 */

import { useState, useEffect, useRef } from 'react';
import type { CVData } from '../../../types/cv';
import { getStorageAdapter } from '../../../services/storage';

export interface UseAutoSaveOptions {
  data: CVData;
  documentTitle: string;
  documentId: string;
  delayMs?: number;
}

export interface UseAutoSaveReturn {
  lastSavedText: string;
}

/**
 * Gestiona el debounce y la persistencia automática de las modificaciones en el CV.
 *
 * @param options - Datos del documento, título, ID y retraso en milisegundos
 * @returns Estado legible del último guardado
 */
export function useAutoSave({
  data,
  documentTitle,
  documentId,
  delayMs = 500,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [lastSavedText, setLastSavedText] = useState<string>('Guardado automático');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    // Evitar disparo en el primer render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!documentId) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setLastSavedText('Guardando...');

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const adapter = getStorageAdapter();
        await adapter.saveDocument(data, documentTitle, documentId);
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedText(`Guardado a las ${timeStr}`);
      } catch (err) {
        console.error('Error en autoguardado:', err);
        setLastSavedText('Error al guardar');
      }
    }, delayMs);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [data, documentTitle, documentId, delayMs]);

  return { lastSavedText };
}
