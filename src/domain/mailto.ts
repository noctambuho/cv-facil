/**
 * src/domain/mailto.ts
 * Lógica pura para la generación segura de enlaces mailto (RFC 6068).
 * Trazabilidad: TASK-8.1, US-15, US-16, specs/08-rediseno-landing.md
 */

import type { MailtoParams } from '../types/landing';

/**
 * [PURA] Sanitiza una cadena eliminando retornos de carro y saltos de línea para prevenir header injection.
 * SECURITY (CWE-93 / CWE-113): Previene inyección CRLF en cabeceras de correo.
 */
export function sanitizeEmailHeader(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/[\r\n]+/g, ' ').trim();
}

/**
 * [PURA] Construye una URL mailto válida y codificada según RFC 6068.
 *
 * @param params Parámetros de destinatario, asunto y cuerpo opcional
 * @returns Cadena con el esquema mailto: o '#' si el destinatario es inválido
 */
export function buildMailtoHref(params: MailtoParams): string {
  const cleanTo = sanitizeEmailHeader(params.to);
  if (!cleanTo || !cleanTo.includes('@')) {
    return '#';
  }

  const encodedTo = cleanTo
    .split(',')
    .map((addr) => addr.trim())
    .filter(Boolean)
    .map((addr) => encodeURIComponent(addr).replace(/%40/g, '@'))
    .join(',');

  const queryParts: string[] = [];

  if (params.subject) {
    const cleanSubject = sanitizeEmailHeader(params.subject);
    if (cleanSubject) {
      queryParts.push(`subject=${encodeURIComponent(cleanSubject)}`);
    }
  }

  if (params.body) {
    queryParts.push(`body=${encodeURIComponent(params.body)}`);
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return `mailto:${encodedTo}${queryString}`;
}

