/**
 * src/domain/security.ts
 * Reglas de seguridad puras y sanitización agnóstica de frameworks.
 * Trazabilidad: TASK-7.1, specs/05-arquitectura-cv-facil-v2.md (Sección 5 y 7)
 */

/**
 * [CONSTANTE] Expresión regular que admite exclusivamente UUIDs v4 o IDs seguros de Google Drive.
 * Longitud entre 10 y 64 caracteres alfanuméricos, guiones o guiones bajos.
 * SECURITY (CWE-20 / CWE-94): Evita inyecciones de código, SQL, path traversal o scripts.
 */
export const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{10,64}$/;

/**
 * [CONSTANTE] Expresión regular para validar colores hexadecimales (#RGB o #RRGGBB).
 */
export const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

/**
 * [PURA] Sanitiza y valida un identificador de documento recibido en la URL o cliente.
 * SECURITY (CWE-20): Valida estrictamente parámetros como /editor?id=...
 *
 * @param rawId Identificador sin procesar
 * @returns Identificador sanitizado o null si es inválido
 */
export function sanitizeDocumentId(rawId: string | null | undefined): string | null {
  if (!rawId) return null;
  const trimmed = rawId.trim();
  if (!SAFE_ID_REGEX.test(trimmed)) {
    return null;
  }
  return encodeURIComponent(trimmed);
}

/**
 * [PURA] Genera un identificador opaco y criptográficamente seguro.
 *
 * @param prefix Prefijo opcional para trazabilidad semántica (ej. 'exp', 'edu')
 * @returns Identificador seguro que cumple con SAFE_ID_REGEX
 */
export function generateSecureId(prefix?: string): string {
  let uniquePart = '';
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    uniquePart = crypto.randomUUID();
  } else if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    uniquePart = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    uniquePart = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  return prefix ? `${prefix}_${uniquePart.replace(/[^a-zA-Z0-9_-]/g, '')}` : uniquePart;
}

/**
 * [PURA] Sanitiza una URL externa ingresada por el usuario o leída de un JSON.
 * Bloquea esquemas peligrosos como javascript:, data:, vbscript:, file: o malformadas.
 * SECURITY (CWE-79): Mitigación de Cross-Site Scripting (XSS).
 *
 * @param rawUrl URL suministrada por el usuario o archivo
 * @returns URL sanitizada con protocolo seguro http: o https:, o cadena vacía si es inválida
 */
export function sanitizeExternalUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Prohibir explícitamente esquemas peligrosos
  const dangerousPatterns = /^(javascript:|data:|vbscript:|file:)/i;
  if (dangerousPatterns.test(trimmed)) {
    return '';
  }

  // Si no tiene esquema, asumir https://
  let normalized = trimmed;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * [PURA] Valida si una cadena corresponde a un Data URL seguro de imagen rasterizada (JPEG, PNG, WebP).
 * SECURITY (CWE-434): Bloquea SVG o scripts incrustados en data: URLs.
 *
 * @param dataUrl Cadena DataURL a evaluar
 * @returns true si es una imagen base64 permitida
 */
export function isSafeImageDataUrl(dataUrl: string | null | undefined): boolean {
  if (!dataUrl) return false;
  const safeDataUrlPrefix = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
  return safeDataUrlPrefix.test(dataUrl.trim());
}

/**
 * [PURA] Valida si una cadena es un código de color hexadecimal válido.
 *
 * @param color Cadena a comprobar
 * @returns true si es un hex válido (#fff o #ffffff)
 */
export function isHexColor(color: string | null | undefined): boolean {
  if (!color) return false;
  return HEX_COLOR_REGEX.test(color.trim());
}
