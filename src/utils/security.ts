/**
 * src/utils/security.ts
 * Utilidades de sanitización y hardening de seguridad para la plataforma CV Fácil.
 * Trazabilidad: TASK-2.2.3, TASK-2.2.4, specs/05-arquitectura-cv-facil-v2.md (Sección 5 y 7)
 */

/**
 * Expresión regular que admite exclusivamente UUIDs v4 o IDs seguros de Google Drive.
 * Longitud entre 10 y 64 caracteres alfanuméricos, guiones o guiones bajos.
 * // SECURITY (CWE-20 / CWE-94): Evita inyecciones de código, SQL, path traversal o scripts en URLs y consultas de almacenamiento.
 */
export const SAFE_ID_REGEX = /^[a-zA-Z0-9_-]{10,64}$/;

/**
 * Sanitiza y valida un identificador de documento recibido en la URL o cliente.
 * 
 * // SECURITY (CWE-20): Valida estrictamente parámetros como /editor?id=...
 * 
 * @param rawId Identificador sin procesar
 * @returns Identificador sanitizado o null si es inválido
 */
export function sanitizeDocumentId(rawId: string | null): string | null {
  if (!rawId) return null;
  const trimmed = rawId.trim();
  if (!SAFE_ID_REGEX.test(trimmed)) {
    console.warn('// SECURITY (CWE-20): ID de documento inválido o potencialmente malicioso bloqueado:', rawId);
    return null;
  }
  return encodeURIComponent(trimmed);
}

/**
 * Genera un identificador opaco y seguro garantizado para coincidir con SAFE_ID_REGEX.
 * 
 * @returns UUID v4 o identificador aleatorio criptográficamente seguro
 */
export function generateSecureId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback seguro con crypto.getRandomValues
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitiza una URL externa ingresada por el usuario (web, LinkedIn, GitHub).
 * Bloquea esquemas peligrosos como javascript:, data:, vbscript: o URLs malformadas.
 * 
 * // SECURITY (CWE-79): Mitigación de Cross-Site Scripting (XSS) y Secuestro de Enlaces
 * 
 * @param rawUrl URL suministrada por el usuario
 * @returns URL sanitizada con protocolo seguro http: o https:, o cadena vacía si es inválida
 */
export function sanitizeExternalUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Prohibir explícitamente esquemas peligrosos
  const dangerousPatterns = /^(javascript:|data:|vbscript:|file:)/i;
  if (dangerousPatterns.test(trimmed)) {
    console.warn('// SECURITY (CWE-79): Intento de inyección de esquema peligroso bloqueado:', trimmed);
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
    console.warn('// SECURITY (CWE-79): URL malformada descartada:', rawUrl);
    return '';
  }
}

/**
 * Valida los magic bytes de un archivo de imagen en el cliente para verificar que sea
 * un archivo JPEG o PNG auténtico, bloqueando la carga de SVGs con scripts o binarios ejecutables.
 * 
 * // SECURITY (CWE-434): Verificación de firmas binarias para prevenir Image Payload Ingestion
 * 
 * @param file Archivo File o Blob a inspeccionar
 * @returns Objeto con resultado de validación y mensaje de error si aplica
 */
export async function validateImageFile(file: File | Blob): Promise<{ valid: boolean; error?: string }> {
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB límite de subida
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'El archivo excede el tamaño máximo permitido (5MB).' };
  }

  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Firma JPEG: FF D8 FF
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    // Firma PNG: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;

    // Firma WebP: RIFF ... WEBP
    const isWebp =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return {
        valid: false,
        error: '// SECURITY (CWE-434): Formato no permitido. Solo se admiten fotos en formato JPEG, PNG o WebP auténticos (no SVG).',
      };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: 'No se pudo leer la firma binaria del archivo: ' + err.message };
  }
}

/**
 * Comprime y rasteriza una imagen de foto de perfil usando Canvas.
 * Esto no solo asegura que el tamaño sea óptimo (< 200KB) para mantener el PDF < 2MB,
 * sino que neutraliza cualquier metadato o script incrustado en el archivo original.
 * 
 * // SECURITY (CWE-434 / CWE-79): Sanitización de imagen por rasterización forzada
 * 
 * @param file Archivo de imagen validado
 * @param maxWidth Ancho máximo en píxeles (default: 400px)
 * @param maxHeight Alto máximo en píxeles (default: 400px)
 * @param quality Calidad de compresión JPEG (0.1 a 1.0, default: 0.85)
 * @returns Cadena DataURL (base64) de la imagen comprimida y segura
 */
export async function compressProfileImage(
  file: File,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.85
): Promise<string> {
  const validation = await validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Archivo de imagen no válido');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Mantener relación de aspecto cuadrada o proporcional
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo inicializar el contexto Canvas 2D'));
        return;
      }

      // Dibujar imagen rasterizada limpia
      ctx.drawImage(img, 0, 0, width, height);

      // Exportar en JPEG optimizado
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Error al decodificar la imagen en el navegador'));
    };

    img.src = objectUrl;
  });
}
