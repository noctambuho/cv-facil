/**
 * src/services/storage/driveTokenStore.ts
 * Gestor en memoria volátil de tokens OAuth2 de Google.
 * SECURITY (CWE-312 / CWE-922): Prohíbe almacenar tokens de autenticación en localStorage o cookies accesibles por JavaScript.
 * Trazabilidad: TASK-7.2, US-08
 */

import type { DriveAuthState } from '../../types/storage';

/**
 * [CLASE] Gestor de tokens OAuth2 en memoria volátil de sesión.
 */
export class VolatileTokenStore {
  private static accessToken: string | null = null;
  private static tokenExpiry: number | null = null;
  private static authState: DriveAuthState = { isAuthenticated: false };

  /**
   * [EFECTO] Registra un nuevo token y notifica a las islas reactivas.
   */
  static setToken(token: string, expiresInSeconds: number, user?: { email: string; name: string }): void {
    this.accessToken = token;
    this.tokenExpiry = Date.now() + expiresInSeconds * 1000;
    this.authState = {
      isAuthenticated: true,
      userEmail: user?.email,
      userName: user?.name,
    };
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cv_facil_drive_auth_changed', { detail: this.authState }));
    }
  }

  /**
   * [PURA] Obtiene el token activo si no ha expirado.
   */
  static getToken(): string | null {
    if (!this.accessToken || !this.tokenExpiry) return null;
    if (Date.now() >= this.tokenExpiry) {
      this.clear();
      return null;
    }
    return this.accessToken;
  }

  /**
   * [PURA] Retorna el estado actual de autenticación.
   */
  static getAuthState(): DriveAuthState {
    return this.authState;
  }

  /**
   * [EFECTO] Revoca y purga el token activo en memoria.
   */
  static clear(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.authState = { isAuthenticated: false };
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cv_facil_drive_auth_changed', { detail: this.authState }));
    }
  }
}
