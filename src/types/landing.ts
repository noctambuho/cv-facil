/**
 * src/types/landing.ts
 * [CONTRATO] Tipos e interfaces inmutables para el rediseño de la Landing Page de CV Fácil.
 * Trazabilidad: US-11 a US-19, TASK-8.1, specs/08-rediseno-landing.md
 */

/**
 * [CONTRATO] Enlace externo seguro con atributos requeridos de navegación.
 */
export interface ExternalLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

/**
 * [CONTRATO] Parámetros para la construcción de URLs mailto seguras.
 */
export interface MailtoParams {
  to: string;
  subject?: string;
  body?: string;
}

/**
 * [CONTRATO] Paso interactivo de la sección "Cómo funciona".
 */
export interface HowItWorksStep {
  id: 'fill' | 'design' | 'download';
  icon: 'ClipboardList' | 'Palette' | 'Download';
  title: string;
  description: string;
  comingSoon?: string[];
}

/**
 * [CONTRATO] Frame de captura para la secuencia animada de la demo.
 */
export interface DemoFrame {
  stepId: HowItWorksStep['id'];
  alt: string;
  badge: string;
}

/**
 * [CONTRATO] Insignia descriptiva de formato de descarga.
 */
export interface FormatBadge {
  label: 'PDF' | 'JSON' | 'DOCX' | 'Markdown';
  comingSoon: boolean;
}

/**
 * [CONTRATO] Tarjeta de característica del Bento Grid.
 */
export interface FeatureCard {
  id: 'ats' | 'drive' | 'privacy' | 'formats' | 'free';
  title: string;
  description: string;
  layout: 'wide' | 'narrow' | 'half' | 'full';
  formats?: FormatBadge[];
  withRotatingCta?: boolean;
}

/**
 * [CONTRATO] Elemento desplegable de la narrativa "Sobre el proyecto".
 */
export interface AboutItem {
  id: 'origin' | 'problem' | 'solution' | 'contribute';
  summary: string;
  body: string | null;
}

/**
 * [CONTRATO] Traspaso de sesión efímero de Google Drive entre Landing y Editor.
 */
export interface DriveSessionHandoff {
  accessToken: string;
  expiresAt: number;
  user: {
    email: string;
    name: string;
  };
}
