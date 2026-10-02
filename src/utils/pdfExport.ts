/**
 * src/utils/pdfExport.ts
 * Utilidades para el control de compresión, cálculo de peso estimado y exportación de PDFs.
 * Trazabilidad: US-09 (Criterios 9.1 y 9.2), TASK-2.5.2
 */

import type { CVData } from '../types/cv';

export type ExportQualityProfile = 'ats-web' | 'vectorial';

export interface ExportProfileDetails {
  id: ExportQualityProfile;
  title: string;
  description: string;
  targetMaxMB: number;
  badge: string;
}

export const EXPORT_PROFILES: Record<ExportQualityProfile, ExportProfileDetails> = {
  'ats-web': {
    id: 'ats-web',
    title: 'Optimizado para Portales ATS (< 2MB)',
    description: 'Comprime activos gráficos y optimiza recursos para asegurar admisión en portales con límites de 2MB o 5MB.',
    targetMaxMB: 2,
    badge: 'Recomendado para postular',
  },
  'vectorial': {
    id: 'vectorial',
    title: 'Máxima Calidad Vectorial',
    description: 'Mantiene la resolución original para impresión en papel o envío directo a reclutadores por correo o LinkedIn.',
    targetMaxMB: 5,
    badge: 'Impresión y Diseño',
  },
};

/**
 * Estima el peso aproximado del PDF generado según el contenido y activos gráficos.
 * 
 * @param doc Datos del CV
 * @param profile Perfil de calidad seleccionado
 * @returns Peso estimado en bytes
 */
export function estimatePdfSizeBytes(doc: CVData, profile: ExportQualityProfile): number {
  // Base del motor de impresión HTML/PDF (~180KB para maquetación y fuentes vectoriales embebidas)
  let baseBytes = 185 * 1024;

  // Contenido de texto estructurado (~2 bytes por caracter)
  const textContent = JSON.stringify({
    profile: doc.profile,
    experiences: doc.experiences,
    education: doc.education,
    skills: doc.skills,
    languages: doc.languages,
  });
  baseBytes += textContent.length * 1.5;

  // Activos gráficos (Foto de perfil en base64)
  if (doc.profile.avatarUrl && doc.settings.showPhoto !== false) {
    const rawImageBytes = Math.round(doc.profile.avatarUrl.length * 0.75); // Conversión aproximada base64 -> binario
    if (profile === 'ats-web') {
      // Perfil optimizado comprime la imagen a ~60KB - 90KB
      baseBytes += Math.min(rawImageBytes, 95 * 1024);
    } else {
      // Perfil vectorial mantiene la resolución completa
      baseBytes += rawImageBytes;
    }
  }

  return baseBytes;
}

/**
 * Formatea un tamaño en bytes a una representación legible (KB / MB).
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Emite la orden de impresión estándar en el navegador asegurando nombre de archivo limpio.
 * 
 * @param filename Nombre del archivo sugerido
 */
export function triggerBrowserPrint(filename: string): void {
  const originalTitle = document.title;
  const safeName = filename.trim().replace(/\s+/g, '_');
  document.title = `${safeName}_CV`;

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}

/**
 * Genera un Blob sintético simulado del PDF para fallback en entornos donde no se requiera cómputo.
 * 
 * @param doc Datos del CV
 * @returns Blob representativo en application/pdf
 */
export function generateSyntheticPdfBlob(doc: CVData): Blob {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>${doc.profile.fullName || 'CV'}</title></head>
      <body>
        <h1>${doc.profile.fullName || 'Currículum'}</h1>
        <p>${doc.profile.headline || ''}</p>
        <p>${doc.profile.summary || ''}</p>
      </body>
    </html>
  `;
  return new Blob([htmlContent], { type: 'application/pdf' });
}

export { generatePdfBlob, downloadPdfFile } from './pdfRenderer';
