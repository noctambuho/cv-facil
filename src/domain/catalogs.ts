/**
 * src/domain/catalogs.ts
 * Catálogos inmutables, constantes de configuración y metadatos de presentación.
 * Trazabilidad: TASK-7.1, specs/07-refactor-legibilidad.md
 */

import type { TemplateId, FontFamily, SkillLevel } from '../types/cv';

/**
 * [CONSTANTE] Definición de plantilla disponible en el sistema.
 */
export interface TemplateOption {
  id: TemplateId;
  name: string;
  description: string;
  badge?: string;
}

/**
 * [CONSTANTE] Lista inmutable de plantillas soportadas.
 */
export const TEMPLATES: readonly TemplateOption[] = [
  {
    id: 'modern',
    name: 'Moderna',
    description: 'Diseño en 2 columnas con barra lateral de acento y avatar.',
    badge: 'Popular',
  },
  {
    id: 'classic',
    name: 'Clásica',
    description: 'Estructura tradicional cronológica recomendada para empresas corporativas.',
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Líneas limpias, tipografía sobria y máxima densidad de información.',
  },
] as const;

/**
 * [CONSTANTE] Definición de familia tipográfica disponible.
 */
export interface FontOption {
  id: FontFamily;
  name: string;
  className: string;
  pdfFontName: string;
}

/**
 * [CONSTANTE] Opciones tipográficas admitidas por el editor y el motor PDF.
 */
export const FONTS: readonly FontOption[] = [
  {
    id: 'sans',
    name: 'Inter (Sans)',
    className: 'font-sans',
    pdfFontName: 'Inter',
  },
  {
    id: 'serif',
    name: 'Merriweather (Serif)',
    className: 'font-serif',
    pdfFontName: 'Merriweather',
  },
  {
    id: 'mono',
    name: 'JetBrains (Mono)',
    className: 'font-mono',
    pdfFontName: 'JetBrains Mono',
  },
] as const;

/**
 * [CONSTANTE] Paleta de colores de acento corporativos sugeridos.
 */
export const ACCENT_COLORS: readonly string[] = [
  '#1e40af', // Azul marino corporativo (por defecto)
  '#0f766e', // Verde azulado / Teal
  '#4338ca', // Índigo moderno
  '#7c2d12', // Terracota / Ámbar oscuro
  '#0f172a', // Gris pizarra oscuro / Neutral
  '#831843', // Borgoña / Carmesí elegante
] as const;

/**
 * [CONSTANTE] Mapeo unificado de etiquetas de nivel de habilidad en español.
 * Estandarizado a "Intermedio" para todas las plantillas.
 */
export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

/**
 * [CONSTANTE] Clases Tailwind para badges según nivel de habilidad.
 */
export const SKILL_LEVEL_BADGE_CLASSES: Record<SkillLevel, string> = {
  basic: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  intermediate: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
  advanced: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
};
