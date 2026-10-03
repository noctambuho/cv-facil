/**
 * src/components/preview/hooks/useLivePdfPreview.ts
 * Hook para la compilación en vivo con debounce del PDF en modo playground.
 * Trazabilidad: US-09, TASK-7.5
 */

import { useState, useEffect, useRef } from 'react';
import type { CVData } from '../../../types/cv';
import { generatePdfBlob } from '../../../services/pdf/pdfRenderer';

/**
 * [HOOK] Compila asíncronamente el documento PDF para el visor en tiempo real.
 */
export function useLivePdfPreview(data: CVData, viewMode: 'html' | 'pdf') {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompilingPdf, setIsCompilingPdf] = useState(false);
  const [pdfCompileError, setPdfCompileError] = useState<string | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const compilePdf = async () => {
    setIsCompilingPdf(true);
    setPdfCompileError(null);
    try {
      const blob = await generatePdfBlob(data);
      const nextUrl = URL.createObjectURL(blob);
      const oldUrl = currentUrlRef.current;
      currentUrlRef.current = nextUrl;
      setPdfUrl(nextUrl);

      if (oldUrl) {
        setTimeout(() => URL.revokeObjectURL(oldUrl), 1500);
      }
    } catch (err: any) {
      console.error('Error generando vista previa PDF en vivo:', err);
      setPdfCompileError(err?.message || 'Error al compilar PDF');
    } finally {
      setIsCompilingPdf(false);
    }
  };

  useEffect(() => {
    if (viewMode !== 'pdf') return;

    let isCancelled = false;
    setIsCompilingPdf(true);
    setPdfCompileError(null);

    const timer = setTimeout(async () => {
      try {
        const blob = await generatePdfBlob(data);
        if (isCancelled) return;

        const nextUrl = URL.createObjectURL(blob);
        const oldUrl = currentUrlRef.current;
        currentUrlRef.current = nextUrl;
        setPdfUrl(nextUrl);

        if (oldUrl) {
          setTimeout(() => URL.revokeObjectURL(oldUrl), 1500);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setPdfCompileError(err?.message || 'Error al compilar PDF');
        }
      } finally {
        if (!isCancelled) {
          setIsCompilingPdf(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [data, viewMode]);

  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
    };
  }, []);

  return {
    pdfUrl,
    isCompilingPdf,
    pdfCompileError,
    retryCompile: compilePdf,
  };
}
