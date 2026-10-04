/**
 * src/services/storage/driveSessionHandoff.ts
 * [EFECTO] Traspaso efímero de sesión de Google Drive entre Landing Page y Editor.
 *
 * SECURITY (CWE-312 / CWE-922): El token solo reside en sessionStorage durante la transición
 * de navegación (TTL máximo de 60 segundos) y es destruido inmediatamente tras su consumo en /editor.
 * Trazabilidad: US-12 (Criterio 12.5), TASK-8.4, specs/08-rediseno-landing.md
 */

import type { DriveSessionHandoff } from '../../types/landing';

const HANDOFF_STORAGE_KEY = 'cv_facil_drive_session_handoff';
const HANDOFF_MAX_TTL_MS = 60 * 1000; // 60 segundos de validez de traspaso

interface StoredHandoffPayload extends DriveSessionHandoff {
  createdAt: number;
}

/**
 * [EFECTO] Guarda temporalmente el token de sesión en sessionStorage antes de redirigir al editor.
 *
 * @param accessToken Token de acceso OAuth2 emitido por Google Identity Services
 * @param expiresInSeconds Duración de vida del token en segundos
 * @param user Datos de perfil del usuario autenticado
 */
export function saveDriveHandoff(
  accessToken: string,
  expiresInSeconds: number,
  user: { email: string; name: string }
): void {
  if (typeof window === 'undefined' || !window.sessionStorage) return;

  const payload: StoredHandoffPayload = {
    accessToken,
    expiresAt: Date.now() + expiresInSeconds * 1000,
    createdAt: Date.now(),
    user: {
      email: user.email || 'usuario@google.com',
      name: user.name || 'Usuario Google',
    },
  };

  try {
    sessionStorage.setItem(HANDOFF_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('[driveSessionHandoff] Error al persistir handoff en sessionStorage:', err);
  }
}

/**
 * [EFECTO] Lee y elimina inmediatamente el token efímero de sessionStorage al inicializar el editor.
 *
 * @returns El objeto de traspaso si es válido y no ha superado el TTL, o null en caso contrario
 */
export function consumeDriveHandoff(): DriveSessionHandoff | null {
  if (typeof window === 'undefined' || !window.sessionStorage) return null;

  try {
    const raw = sessionStorage.getItem(HANDOFF_STORAGE_KEY);
    if (!raw) return null;

    // Destrucción inmediata para prevenir lecturas posteriores o replay
    sessionStorage.removeItem(HANDOFF_STORAGE_KEY);

    const parsed: StoredHandoffPayload = JSON.parse(raw);

    // Validación estricta de tiempo de vida del traspaso (TTL <= 60s)
    if (!parsed.createdAt || Date.now() - parsed.createdAt > HANDOFF_MAX_TTL_MS) {
      console.warn('[driveSessionHandoff] Traspaso expirado (TTL > 60s), descartando.');
      return null;
    }

    // Validación de expiración del token de Google
    if (parsed.expiresAt && Date.now() >= parsed.expiresAt) {
      console.warn('[driveSessionHandoff] Token expirado en origen, descartando.');
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      expiresAt: parsed.expiresAt,
      user: parsed.user,
    };
  } catch (err) {
    console.warn('[driveSessionHandoff] Error al consumir handoff:', err);
    return null;
  }
}
