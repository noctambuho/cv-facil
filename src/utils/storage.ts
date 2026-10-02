/**
 * src/utils/storage.ts
 * Utilidad de descarga y respaldo de documentos CV en formato JSON.
 *
 * Responsabilidad única: generar y descargar un archivo .json con los datos
 * del currículum para respaldo local del usuario.
 *
 * Nota: La persistencia del documento (lectura/escritura) se gestiona a través
 * de la capa de servicios IStorageAdapter (src/services/storage/).
 *
 * Trazabilidad: US-09 (Criterio 9.2), TASK-2.5.2
 */

import type { CVData } from '../types/cv';

/**
 * Descarga el estado del CV como archivo .json para respaldo local.
 *
 * @param data - Datos completos del currículum a exportar
 */
export function exportToJSON(data: CVData): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  const safeName = (data.profile.fullName || 'cv-backup')
    .toLowerCase()
    .replace(/\s+/g, '-');

  anchor.href = url;
  anchor.download = `${safeName}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}
