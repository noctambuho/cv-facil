import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumePdfDocument } from '../components/pdf/ResumePdfDocument';
import type { CVData } from '../types/cv';

/**
 * Genera un Blob binario real de alta calidad (application/pdf) utilizando @react-pdf/renderer.
 * Ejecutado 100% en el navegador (client-side) protegiendo la privacidad del usuario.
 */
export async function generatePdfBlob(data: CVData): Promise<Blob> {
  const element = React.createElement(ResumePdfDocument, { data });
  const instance = pdf(element as React.ReactElement<any>);
  const blob = await instance.toBlob();
  return blob;
}

/**
 * Compila y descarga automáticamente el CV como archivo PDF vectorial nativo.
 */
export async function downloadPdfFile(data: CVData, filename: string): Promise<void> {
  const blob = await generatePdfBlob(data);
  const safeName = (filename || data.profile.fullName || 'Curriculum_Vitae')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_');

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${safeName}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, 2000);
}
