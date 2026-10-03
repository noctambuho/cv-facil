/**
 * src/domain/cvNormalizer.ts
 * Normalizador y filtro de integridad para todas las puertas de entrada de datos externos.
 * SECURITY (CWE-79 / CWE-434 / CWE-20): Valida esquemas, sanea URLs, filtra imágenes y asegura tipos de unión.
 * Trazabilidad: TASK-7.1, specs/07-refactor-legibilidad.md
 */

import type {
  CVData,
  Profile,
  ExperienceItem,
  EducationItem,
  SkillItem,
  LanguageItem,
  CVSettings,
  TemplateId,
  FontFamily,
  SkillLevel,
} from '../types/cv';
import type { ImportResult } from '../types/import';
import { initialData } from '../data/initialData';
import {
  sanitizeExternalUrl,
  isSafeImageDataUrl,
  isHexColor,
  generateSecureId,
} from './security';

const VALID_TEMPLATES = new Set<TemplateId>(['modern', 'classic', 'minimal']);
const VALID_FONTS = new Set<FontFamily>(['sans', 'serif', 'mono']);
const VALID_SKILL_LEVELS = new Set<SkillLevel>(['basic', 'intermediate', 'advanced']);

/**
 * [PURA] Normaliza y sanea el perfil de usuario garantizando strings seguros.
 */
function normalizeProfile(raw: any): Profile {
  const base = initialData.profile;
  if (!raw || typeof raw !== 'object') return { ...base };

  const avatarUrl =
    typeof raw.avatarUrl === 'string' && isSafeImageDataUrl(raw.avatarUrl)
      ? raw.avatarUrl.trim()
      : undefined;

  return {
    fullName: typeof raw.fullName === 'string' ? raw.fullName.trim() : base.fullName,
    headline: typeof raw.headline === 'string' ? raw.headline.trim() : base.headline,
    email: typeof raw.email === 'string' ? raw.email.trim() : base.email,
    phone: typeof raw.phone === 'string' ? raw.phone.trim() : base.phone,
    location: typeof raw.location === 'string' ? raw.location.trim() : base.location,
    website: sanitizeExternalUrl(raw.website),
    linkedin: sanitizeExternalUrl(raw.linkedin),
    github: sanitizeExternalUrl(raw.github),
    summary: typeof raw.summary === 'string' ? raw.summary.trim() : base.summary,
    avatarUrl,
  };
}

/**
 * [PURA] Normaliza el arreglo de experiencia laboral.
 */
function normalizeExperiences(raw: any): ExperienceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : generateSecureId('exp'),
      company: typeof item.company === 'string' ? item.company.trim() : '',
      role: typeof item.role === 'string' ? item.role.trim() : '',
      location: typeof item.location === 'string' ? item.location.trim() : '',
      startDate: typeof item.startDate === 'string' ? item.startDate.trim() : '',
      endDate: typeof item.endDate === 'string' ? item.endDate.trim() : '',
      current: Boolean(item.current),
      description: typeof item.description === 'string' ? item.description.trim() : '',
    }));
}

/**
 * [PURA] Normaliza el arreglo de formación académica.
 */
function normalizeEducation(raw: any): EducationItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : generateSecureId('edu'),
      institution: typeof item.institution === 'string' ? item.institution.trim() : '',
      degree: typeof item.degree === 'string' ? item.degree.trim() : '',
      fieldOfStudy: typeof item.fieldOfStudy === 'string' ? item.fieldOfStudy.trim() : '',
      startDate: typeof item.startDate === 'string' ? item.startDate.trim() : '',
      endDate: typeof item.endDate === 'string' ? item.endDate.trim() : '',
      description: typeof item.description === 'string' ? item.description.trim() : undefined,
    }));
}

/**
 * [PURA] Normaliza la lista de habilidades técnicas.
 */
function normalizeSkills(raw: any): SkillItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const level: SkillLevel = VALID_SKILL_LEVELS.has(item.level) ? item.level : 'intermediate';
      return {
        id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : generateSecureId('sk'),
        name: typeof item.name === 'string' ? item.name.trim() : '',
        level,
      };
    });
}

/**
 * [PURA] Normaliza la lista de idiomas.
 */
function normalizeLanguages(raw: any): LanguageItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : generateSecureId('lang'),
      name: typeof item.name === 'string' ? item.name.trim() : '',
      level: typeof item.level === 'string' ? item.level.trim() : 'Intermedio',
    }));
}

/**
 * [PURA] Normaliza la configuración visual del documento.
 */
function normalizeSettings(raw: any): CVSettings {
  const base = initialData.settings;
  if (!raw || typeof raw !== 'object') return { ...base };

  const templateId: TemplateId = VALID_TEMPLATES.has(raw.templateId) ? raw.templateId : base.templateId;
  const fontFamily: FontFamily = VALID_FONTS.has(raw.fontFamily) ? raw.fontFamily : base.fontFamily;
  const accentColor =
    typeof raw.accentColor === 'string' && isHexColor(raw.accentColor)
      ? raw.accentColor.trim()
      : base.accentColor;

  return {
    templateId,
    fontFamily,
    accentColor,
  };
}

/**
 * [PURA] Valida y normaliza cualquier objeto para garantizar que cumpla el contrato formal CVData.
 * Esta función es la puerta de enlace universal previa a renderizar o almacenar un currículum.
 *
 * @param raw Objeto o estructura sin tipar proveniente de JSON, localStorage o API
 * @returns Estructura garantizada y saneada de tipo CVData
 */
export function normalizeCVData(raw: unknown): CVData {
  if (!raw || typeof raw !== 'object') {
    return { ...initialData };
  }
  const obj = raw as Record<string, any>;
  return {
    profile: normalizeProfile(obj.profile),
    experiences: normalizeExperiences(obj.experiences),
    education: normalizeEducation(obj.education),
    skills: normalizeSkills(obj.skills),
    languages: normalizeLanguages(obj.languages),
    settings: normalizeSettings(obj.settings),
  };
}

/**
 * [PURA] Parsea y sanea el contenido de un archivo JSON subido por el usuario.
 *
 * @param jsonText Contenido en texto plano del archivo
 * @param originalFileName Nombre opcional del archivo importado
 * @returns Resultado con documento saneado o mensaje de error legible
 */
export function parseAndSanitizeCVImport(
  jsonText: string,
  originalFileName?: string
): ImportResult {
  if (!jsonText || !jsonText.trim()) {
    return { valid: false, error: 'El archivo JSON está vacío.' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err: any) {
    return { valid: false, error: `Error de sintaxis JSON: ${err?.message || 'Archivo malformado'}` };
  }

  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'El JSON no contiene un objeto válido de currículum.' };
  }

  const normalized = normalizeCVData(parsed);

  // Deducir nombre sugerido para el archivo
  let suggestedTitle = '';
  if (originalFileName) {
    suggestedTitle = originalFileName.replace(/\.json$/i, '').trim();
  } else if (normalized.profile.fullName) {
    suggestedTitle = `CV ${normalized.profile.fullName}`;
  } else {
    suggestedTitle = 'Currículum Importado';
  }

  return {
    valid: true,
    data: normalized,
    suggestedTitle,
  };
}
