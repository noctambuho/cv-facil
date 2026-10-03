/**
 * [CONTRATO] Tipos e interfaces para la importación y validación de archivos de currículum.
 * Trazabilidad: US-07, TASK-7.1
 */

import type { CVData } from './cv';

/**
 * [CONTRATO] Resultado de procesar y validar un archivo de importación JSON.
 */
export interface ImportResult {
  /** Indica si el archivo fue validado y parseado exitosamente */
  valid: boolean;
  /** Datos normalizados y saneados del currículum (si valid es true) */
  data?: CVData;
  /** Nombre sugerido para el documento importado */
  suggestedTitle?: string;
  /** Mensaje de error descriptivo en caso de fallo */
  error?: string;
}
