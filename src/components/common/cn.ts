/**
 * src/components/common/cn.ts
 * Utilidad unificada para combinación y resolución de colisiones en clases CSS de Tailwind.
 * Trazabilidad: TASK-7.3, specs/07-refactor-legibilidad.md
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * [PURA] Combina clases condicionales y resuelve conflictos de especificidad en Tailwind.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
