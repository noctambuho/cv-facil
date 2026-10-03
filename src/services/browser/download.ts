/**
 * src/services/browser/download.ts
 * Utilidad única para la descarga de archivos Blob o JSON en el cliente.
 * Trazabilidad: TASK-7.2, US-09
 */

import type { CVData } from '../../types/cv';
import { toSafeFilename } from '../../domain/cvFormatters';

/**
 * [EFECTO] Dispara la descarga de un objeto Blob en el navegador.
 *
 * @param blob Archivo binario o de texto
 * @param filename Nombre con extensión del archivo a guardar
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * [EFECTO] Exporta los datos estructurados del CV como archivo JSON descargable.
 *
 * @param data Contenido del currículum
 * @param customName Nombre opcional para el archivo
 */
export function exportToJSON(data: CVData, customName?: string): void {
  const title = customName || (data.profile.fullName ? `CV_${data.profile.fullName}` : 'Curriculum_Vitae');
  const filename = toSafeFilename(title, '.json');
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadBlob(blob, filename);
}
