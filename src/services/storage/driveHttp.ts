/**
 * src/services/storage/driveHttp.ts
 * Cliente HTTP centralizado para llamadas a la API v3 de Google Drive.
 * Centraliza manejo de cabeceras, detección de errores 401 y ensamblado de peticiones multipart.
 * Trazabilidad: TASK-7.2, US-08
 */

import { VolatileTokenStore } from './driveTokenStore';

export const MULTIPART_BOUNDARY = '-------314159265358979323846';

/**
 * [EFECTO] Realiza una llamada autenticada a la API de Google Drive.
 * Controla expiración automática de sesión ante respuestas HTTP 401.
 */
export async function driveFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = VolatileTokenStore.getToken();
  if (!token) {
    throw new Error('No hay sesión de Google Drive activa');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    VolatileTokenStore.clear();
    throw new Error('Sesión de Google Drive expirada. Por favor vuelve a conectar tu cuenta.');
  }

  return res;
}

/**
 * [PURA] Construye el cuerpo multipart/related para subir metadatos y contenido JSON a Google Drive.
 */
export function buildJsonMultipartBody(metadata: object, jsonContent: object): string {
  const delimiter = `\r\n--${MULTIPART_BOUNDARY}\r\n`;
  const closeDelimiter = `\r\n--${MULTIPART_BOUNDARY}--`;

  return (
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(jsonContent, null, 2) +
    closeDelimiter
  );
}
