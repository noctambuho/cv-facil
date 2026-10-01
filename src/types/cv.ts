/**
 * Tipos estrictos del modelo de dominio del CV.
 * Definido en SDD Fase 2 (specs/02-architecture-design.md)
 */

export interface Profile {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  avatarUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export type SkillLevel = 'basic' | 'intermediate' | 'advanced';

export interface SkillItem {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string; // ej: "Nativo", "C1 Avanzado", "B2 Intermedio", "A2 Básico"
}

export type TemplateId = 'modern' | 'classic' | 'minimal';
export type FontFamily = 'sans' | 'serif' | 'mono';

export interface CVSettings {
  templateId: TemplateId;
  accentColor: string; // Hexadecimal, ej: "#1e40af"
  fontFamily: FontFamily;
  showIcons: boolean;
}

export interface CVData {
  profile: Profile;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  settings: CVSettings;
}

export interface TemplateProps {
  data: CVData;
}
