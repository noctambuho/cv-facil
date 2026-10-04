/**
 * src/data/siteLinks.ts
 * [CONSTANTE] Enlaces externos canónicos, donaciones y contacto comunitario.
 * Trazabilidad: TASK-8.1, US-11, US-15, US-16, US-18, specs/08-rediseno-landing.md
 */

import { buildMailtoHref } from '../domain/mailto';

/**
 * [CONSTANTE] Repositorio oficial del proyecto de código abierto en GitHub.
 */
export const GITHUB_REPO_URL = 'https://github.com/noctambuho/cv-facil';

/**
 * [CONSTANTE] Correo electrónico oficial de contacto profesional.
 */
export const CONTACT_EMAIL = 'jcnunezgrandal@gmail.com';

/**
 * [CONSTANTE] Asunto predefinido para la solicitud de desarrollo web.
 */
export const CONTACT_MAILTO_SUBJECT = '[IMPORTANTE] Quiero un sitio web';

/**
 * [CONSTANTE] Enlace mailto codificado y saneado para contacto directo.
 */
export const CONTACT_MAILTO_HREF = buildMailtoHref({
  to: CONTACT_EMAIL,
  subject: CONTACT_MAILTO_SUBJECT,
});

/**
 * [CONSTANTE] Plataforma de apoyo voluntario Cafecito (LATAM).
 */
export const CAFECITO_URL = 'https://cafecito.app';

/**
 * [CONSTANTE] Plataforma de apoyo voluntario PayPal (Global).
 */
export const PAYPAL_URL = 'https://paypal.me';
