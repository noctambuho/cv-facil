/**
 * src/domain/cvFormatters.ts
 * Funciones puras de formateo de texto, fechas y etiquetas para plantillas y vistas.
 * Trazabilidad: TASK-7.1, specs/07-refactor-legibilidad.md
 */

import type { FontFamily, SkillLevel } from '../types/cv';
import { SKILL_LEVEL_LABELS, FONTS } from './catalogs';

/**
 * [PURA] Formatea un rango de fechas con soporte para empleos o estudios vigentes.
 * Estandarizado con separador guion largo '—'.
 *
 * @param start Fecha de inicio (ej. '2022-03')
 * @param end Fecha de fin (ej. '2024-01')
 * @param current Indica si es el puesto actual
 * @param separator Separador tipográfico (por defecto '—')
 * @returns Cadena formateada ej. "2022-03 — Presente" o "2022-03 — 2024-01"
 */
export function formatDateRange(
  start?: string,
  end?: string,
  current = false,
  separator = '—'
): string {
  const safeStart = start?.trim() || '';
  const safeEnd = current ? 'Presente' : end?.trim() || '';

  if (safeStart && safeEnd) {
    return `${safeStart} ${separator} ${safeEnd}`;
  }
  return safeStart || safeEnd;
}

/**
 * [PURA] Formatea el título educativo combinando titulación y campo de estudio.
 *
 * @param degree Grado o título (ej. "Grado en Informática")
 * @param fieldOfStudy Especialidad opcional (ej. "Inteligencia Artificial")
 * @returns Cadena ej. "Grado en Informática en Inteligencia Artificial"
 */
export function formatEducationDegree(degree?: string, fieldOfStudy?: string): string {
  const safeDegree = degree?.trim() || '';
  const safeField = fieldOfStudy?.trim() || '';
  if (safeDegree && safeField) {
    return `${safeDegree} en ${safeField}`;
  }
  return safeDegree || safeField;
}

/**
 * [PURA] Extrae las iniciales del nombre completo para el fallback del avatar.
 *
 * @param fullName Nombre completo del usuario
 * @param fallback Iniciales por defecto si el nombre está vacío
 * @returns Hasta 2 caracteres en mayúsculas (ej. "Juan Pérez" -> "JP")
 */
export function getProfileInitials(fullName?: string, fallback = 'CV'): string {
  if (!fullName?.trim()) return fallback;
  const parts = fullName.trim().split(/\s+/);
  const initials = parts.map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return initials || fallback;
}

/**
 * [PURA] Limpia prefijos de protocolo http://, https:// o www. para presentación legible en pantalla.
 *
 * @param url Dirección URL completa
 * @returns URL legible sin protocolos redundantes
 */
export function toDisplayUrl(url?: string): string {
  if (!url) return '';
  return url.trim().replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

/**
 * [PURA] Retorna la etiqueta en español correspondiente a un nivel de habilidad.
 *
 * @param level Nivel de habilidad ('basic', 'intermediate', 'advanced')
 * @returns Etiqueta amigable o valor original como fallback
 */
export function getSkillLevelLabel(level?: string): string {
  if (!level) return '';
  return (SKILL_LEVEL_LABELS as Record<string, string>)[level] || level;
}

/**
 * [PURA] Comprueba si existen habilidades o idiomas disponibles para renderizar su bloque.
 */
export function hasSkillsOrLanguages(skills?: unknown[], languages?: unknown[]): boolean {
  return (Array.isArray(skills) && skills.length > 0) || (Array.isArray(languages) && languages.length > 0);
}

/**
 * [PURA] Convierte una marca de tiempo ISO a formato legible en español.
 *
 * @param isoString Fecha en formato ISO 8601
 * @returns Fecha en formato local ej. "3 oct 2026, 20:30"
 */
export function formatDisplayDate(isoString?: string): string {
  if (!isoString) return 'Sin fecha';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Fecha inválida';
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * [PURA] Genera un nombre de archivo seguro para descarga en el sistema de archivos.
 *
 * @param rawName Nombre o título sin procesar
 * @param extension Extensión opcional (ej. '.pdf', '.json')
 * @returns Nombre limpio solo con caracteres alfanuméricos, guiones y guiones bajos
 */
export function toSafeFilename(rawName?: string, extension = ''): string {
  const base = (rawName || 'Curriculum_Vitae')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 80) || 'Curriculum_Vitae';

  if (!extension) return base;
  const cleanExt = extension.startsWith('.') ? extension : `.${extension}`;
  return base.endsWith(cleanExt) ? base : `${base}${cleanExt}`;
}

/**
 * [PURA] Retorna la clase CSS de fuente para una familia tipográfica dada.
 */
export function getFontClass(fontFamily?: FontFamily): string {
  const match = FONTS.find((f) => f.id === fontFamily);
  return match?.className || 'font-sans';
}

/**
 * [PURA] Retorna el nombre de fuente registrado en PDF para una familia dada.
 */
export function getPdfFontName(fontFamily?: FontFamily): string {
  const match = FONTS.find((f) => f.id === fontFamily);
  return match?.pdfFontName || 'Inter';
}
