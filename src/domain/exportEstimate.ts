/**
 * src/domain/exportEstimate.ts
 * Cálculo heurístico de peso de exportación y perfiles de calidad para PDF.
 * Trazabilidad: US-09, TASK-7.1
 */

import type { CVData } from '../types/cv';

/**
 * [CONTRATO] Perfiles de calidad disponibles para la exportación de PDF.
 */
export type ExportQualityProfile = 'ats-web' | 'vectorial';

/**
 * [CONTRATO] Metadatos y límites de un perfil de exportación.
 */
export interface ExportProfileDetails {
  id: ExportQualityProfile;
  title: string;
  description: string;
  targetMaxMB: number;
  badge: string;
}

/**
 * [CONSTANTE] Catálogo inmutable de perfiles de calidad de exportación.
 */
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
 * [PURA] Estima el peso aproximado del PDF generado según el contenido y activos gráficos.
 *
 * @param doc Datos del CV
 * @param profile Perfil de calidad seleccionado
 * @returns Peso estimado en bytes
 */
export function estimatePdfSizeBytes(doc: CVData, profile: ExportQualityProfile): number {
  // Base del motor de impresión HTML/PDF (~185KB para maquetación y fuentes vectoriales embebidas)
  let baseBytes = 185 * 1024;

  // Contenido de texto estructurado (~1.5 bytes por caracter serializado)
  const textContent = JSON.stringify({
    profile: doc.profile,
    experiences: doc.experiences,
    education: doc.education,
    skills: doc.skills,
    languages: doc.languages,
  });
  const textBytes = Math.round(textContent.length * 1.5);

  // Estimación de peso de la foto de perfil en base64 si existe
  let photoBytes = 0;
  if (doc.profile.avatarUrl && doc.profile.avatarUrl.startsWith('data:')) {
    const base64Length = doc.profile.avatarUrl.length;
    const rawPhotoBytes = Math.round(base64Length * 0.75);

    if (profile === 'ats-web') {
      // En perfil ATS se asume compresión JPEG a 0.8 y 300px (tope ~95KB)
      photoBytes = Math.min(rawPhotoBytes, 95 * 1024);
    } else {
      photoBytes = rawPhotoBytes;
    }
  }

  return baseBytes + textBytes + photoBytes;
}

/**
 * [PURA] Formatea una cantidad de bytes a una cadena legible (KB o MB).
 *
 * @param bytes Cantidad de bytes
 * @returns Cadena formateada ej. "245 KB" o "1.8 MB"
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
