/**
 * src/services/pdf/pdfRenderer.ts
 * Motor de compilación, descarga e impresión de documentos PDF vectoriales.
 * Trazabilidad: US-09, TASK-7.2
 */

import React from 'react';
import { pdf } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import { ResumePdfDocument } from '../../components/pdf/ResumePdfDocument';
import { toSafeFilename } from '../../domain/cvFormatters';
import { downloadBlob } from '../browser/download';
import { registerPdfFonts } from './pdfFonts';

/**
 * [EFECTO] Compila los datos estructurados del CV en un Blob PDF vectorial en cliente.
 */
export async function generatePdfBlob(data: CVData): Promise<Blob> {
  registerPdfFonts();
  const element = React.createElement(ResumePdfDocument, { data });
  return await pdf(element).toBlob();
}

/**
 * [EFECTO] Genera y descarga el archivo PDF vectorial en el dispositivo del usuario.
 */
export async function downloadPdfFile(data: CVData, customName?: string): Promise<void> {
  const blob = await generatePdfBlob(data);
  const title = customName || data.profile.fullName || 'Curriculum_Vitae';
  const filename = toSafeFilename(title, '.pdf');
  downloadBlob(blob, filename);
}

/**
 * [EFECTO] Dispara el cuadro de diálogo de impresión del navegador.
 */
export function triggerBrowserPrint(docTitle?: string): void {
  if (typeof window === 'undefined') return;

  const originalTitle = document.title;
  if (docTitle) {
    document.title = toSafeFilename(docTitle);
  }

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
