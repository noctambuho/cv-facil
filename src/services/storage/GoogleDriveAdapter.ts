/**
 * src/services/storage/GoogleDriveAdapter.ts
 * Implementación del adaptador de almacenamiento BYOS (Bring Your Own Storage) con Google Drive.
 * Utiliza el alcance de mínimo privilegio 'https://www.googleapis.com/auth/drive.file'
 * y sincroniza dentro de la carpeta visible 'CV Data/'.
 * Trazabilidad: US-08 (Criterio 8.2), TASK-2.2.3, TASK-2.2.4
 */

import type { IStorageAdapter } from './IStorageAdapter';
import type { CVData } from '../../types/cv';
import type { CVMetadata, DriveAuthState } from '../../types/storage';
import { sanitizeDocumentId } from '../../utils/security';

const DRIVE_FOLDER_NAME = 'CV Data';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const CLIENT_ID_STORAGE_KEY = 'cv_facil_google_client_id';

/**
 * Gestor en memoria volátil de tokens OAuth2 de Google.
 * SECURITY (CWE-312 / CWE-922): Prohíbe almacenar tokens de autenticación en localStorage o cookies accesibles por JavaScript.
 */
class VolatileTokenStore {
  private static accessToken: string | null = null;
  private static tokenExpiry: number | null = null;
  private static authState: DriveAuthState = { isAuthenticated: false };

  static setToken(token: string, expiresInSeconds: number, user?: { email: string; name: string }) {
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

  static getToken(): string | null {
    if (!this.accessToken || !this.tokenExpiry) return null;
    if (Date.now() >= this.tokenExpiry) {
      this.clear();
      return null;
    }
    return this.accessToken;
  }

  static getAuthState(): DriveAuthState {
    return this.authState;
  }

  static clear() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.authState = { isAuthenticated: false };
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cv_facil_drive_auth_changed', { detail: this.authState }));
    }
  }
}

export class GoogleDriveAdapter implements IStorageAdapter {
  private static clientId: string = '';
  private static folderId: string | null = null;

  constructor(clientId?: string) {
    if (clientId) {
      GoogleDriveAdapter.clientId = clientId.trim();
    } else if (!GoogleDriveAdapter.clientId) {
      const envClientId =
        (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_GOOGLE_CLIENT_ID) ||
        (typeof process !== 'undefined' ? process.env?.PUBLIC_GOOGLE_CLIENT_ID : '');
      const storedClientId =
        typeof window !== 'undefined' ? localStorage.getItem(CLIENT_ID_STORAGE_KEY) || '' : '';
      GoogleDriveAdapter.clientId = (envClientId || storedClientId || '').trim();
    }
  }

  /**
   * Obtiene el Google Client ID configurado (de entorno o de localStorage).
   */
  getClientId(): string {
    if (!GoogleDriveAdapter.clientId && typeof window !== 'undefined') {
      const stored = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
      if (stored) GoogleDriveAdapter.clientId = stored.trim();
    }
    return GoogleDriveAdapter.clientId;
  }

  /**
   * Configura y persiste el Client ID en el navegador.
   */
  setClientId(id: string): void {
    const cleanId = id.trim();
    GoogleDriveAdapter.clientId = cleanId;
    if (typeof window !== 'undefined') {
      if (cleanId) {
        localStorage.setItem(CLIENT_ID_STORAGE_KEY, cleanId);
      } else {
        localStorage.removeItem(CLIENT_ID_STORAGE_KEY);
      }
    }
  }

  /**
   * Obtiene el estado actual de autenticación en memoria.
   */
  getAuthState(): DriveAuthState {
    return VolatileTokenStore.getAuthState();
  }

  /**
   * Espera a que el SDK de Google Identity Services (GIS) termine de cargarse en el navegador.
   */
  private async ensureGoogleLoaded(): Promise<any> {
    if (typeof window === 'undefined') return null;
    if ((window as any).google?.accounts?.oauth2) {
      return (window as any).google;
    }

    return new Promise((resolve, reject) => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if ((window as any).google?.accounts?.oauth2) {
          clearInterval(interval);
          resolve((window as any).google);
        } else if (attempts >= 30) {
          clearInterval(interval);
          reject(
            new Error(
              'No se pudo conectar con el servicio Google Identity. Comprueba tu conexión a internet o desactiva bloqueadores que impidan scripts externos.'
            )
          );
        }
      }, 100);
    });
  }

  /**
   * Inicia el flujo oficial de autenticación Google OAuth2 vía Google Identity Services (GIS).
   * Scope estricto de mínimo privilegio: https://www.googleapis.com/auth/drive.file
   */
  async authenticate(customClientId?: string): Promise<DriveAuthState> {
    if (typeof window === 'undefined') {
      return { isAuthenticated: false };
    }

    if (customClientId) {
      this.setClientId(customClientId);
    }

    const cid = this.getClientId();
    if (!cid) {
      throw new Error('MISSING_CLIENT_ID');
    }

    const google = await this.ensureGoogleLoaded();
    if (!google?.accounts?.oauth2) {
      throw new Error('Google Identity Services SDK no disponible en window.google');
    }

    return new Promise((resolve, reject) => {
      try {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: cid,
          scope: DRIVE_SCOPE,
          callback: async (response: any) => {
            if (response.error) {
              reject(new Error(response.error_description || response.error));
              return;
            }

            try {
              let userEmail = '';
              let userName = '';

              // Consultar perfil del usuario autenticado vía endpoint oficial de Drive API
              try {
                const aboutRes = await fetch(
                  'https://www.googleapis.com/drive/v3/about?fields=user(emailAddress,displayName)',
                  {
                    headers: { Authorization: `Bearer ${response.access_token}` },
                  }
                );

                if (aboutRes.ok) {
                  const aboutData = await aboutRes.json();
                  if (aboutData.user?.emailAddress) userEmail = aboutData.user.emailAddress;
                  if (aboutData.user?.displayName) userName = aboutData.user.displayName;
                }
              } catch (profileErr) {
                console.warn('GoogleDriveAdapter: No se pudo recuperar email de perfil:', profileErr);
              }

              VolatileTokenStore.setToken(response.access_token, response.expires_in || 3600, {
                email: userEmail || 'usuario@google.com',
                name: userName || 'Usuario Google',
              });

              // Aprovisionamiento transparente de la carpeta 'CV Data'
              await this.getOrCreateCVDataFolder(response.access_token);
              resolve(VolatileTokenStore.getAuthState());
            } catch (authErr) {
              reject(authErr);
            }
          },
        });

        // Solicita el consentimiento explícito de permisos de Google Drive
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Cierra la sesión activa revocando el token en memoria.
   */
  disconnect(): void {
    VolatileTokenStore.clear();
    GoogleDriveAdapter.folderId = null;
  }

  /**
   * Consulta o crea automáticamente la carpeta 'CV Data' en la raíz de Google Drive del usuario.
   */
  async getOrCreateCVDataFolder(token?: string): Promise<string> {
    const authToken = token || VolatileTokenStore.getToken();
    if (!authToken) throw new Error('No hay sesión activa de Google Drive');

    if (GoogleDriveAdapter.folderId) return GoogleDriveAdapter.folderId;

    // Consultar si la carpeta 'CV Data' ya existe en Google Drive
    const query = encodeURIComponent(
      `name = '${DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name)`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (res.status === 401) {
      VolatileTokenStore.clear();
      throw new Error('Sesión de Google Drive expirada. Por favor vuelve a conectar tu cuenta.');
    }

    if (res.ok) {
      const data = await res.json();
      if (data.files && data.files.length > 0) {
        GoogleDriveAdapter.folderId = data.files[0].id;
        return GoogleDriveAdapter.folderId!;
      }
    }

    // Crear la carpeta si no existe
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: DRIVE_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    if (createRes.status === 401) {
      VolatileTokenStore.clear();
      throw new Error('Sesión de Google Drive expirada.');
    }

    if (!createRes.ok) {
      throw new Error('Error al crear la carpeta CV Data en Google Drive');
    }

    const folder = await createRes.json();
    GoogleDriveAdapter.folderId = folder.id;
    return GoogleDriveAdapter.folderId!;
  }

  /**
   * Lista los documentos JSON almacenados en la carpeta 'CV Data'.
   */
  async listDocuments(): Promise<CVMetadata[]> {
    const token = VolatileTokenStore.getToken();
    if (!token) return [];

    const folderId = await this.getOrCreateCVDataFolder(token);
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and name contains '.json'`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name, modifiedTime, size)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 401) {
      VolatileTokenStore.clear();
      return [];
    }

    if (!res.ok) return [];

    const json = await res.json();
    const files = json.files || [];

    return files.map((file: any) => ({
      id: file.id,
      title: file.name.replace(/\.json$/i, ''),
      updatedAt: file.modifiedTime,
      sizeBytes: parseInt(file.size, 10) || 0,
      isDriveSynced: true,
      hasExportedPDF: false,
    }));
  }

  /**
   * Obtiene y parsea un documento CV específico por su File ID.
   */
  async getDocument(id: string): Promise<CVData> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID inválido');

    const token = VolatileTokenStore.getToken();
    if (!token) throw new Error('Sesión de Google Drive expirada');

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${safeId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      VolatileTokenStore.clear();
      throw new Error('Sesión de Google Drive expirada. Vuelve a iniciar sesión.');
    }

    if (!res.ok) {
      throw new Error(`Error al leer archivo de Google Drive (${res.status})`);
    }

    return await res.json();
  }

  /**
   * Guarda un documento en formato JSON en 'CV Data/'.
   * Utiliza subida multipart/related asignando parents: [cvDataFolderId].
   */
  async saveDocument(doc: CVData, customName?: string, id?: string): Promise<CVMetadata> {
    const token = VolatileTokenStore.getToken();
    if (!token) throw new Error('No hay sesión de Google Drive activa');

    const safeId = id ? sanitizeDocumentId(id) : null;
    const title = (customName || (doc.profile.fullName ? `CV ${doc.profile.fullName}` : 'Nuevo CV')).trim();
    const filename = `${title}.json`;

    const folderId = await this.getOrCreateCVDataFolder(token);
    const metadataBody: any = {
      name: filename,
      mimeType: 'application/json',
    };

    if (!safeId) {
      metadataBody.parents = [folderId];
    }

    const multipartBoundary = '-------314159265358979323846';
    const delimiter = `\r\n--${multipartBoundary}\r\n`;
    const closeDelimiter = `\r\n--${multipartBoundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadataBody) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(doc, null, 2) +
      closeDelimiter;

    const endpoint = safeId
      ? `https://www.googleapis.com/upload/drive/v3/files/${safeId}?uploadType=multipart`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

    const res = await fetch(endpoint, {
      method: safeId ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${multipartBoundary}`,
      },
      body: multipartRequestBody,
    });

    if (res.status === 401) {
      VolatileTokenStore.clear();
      throw new Error('Sesión de Google Drive expirada.');
    }

    if (!res.ok) {
      throw new Error('Error al sincronizar documento con Google Drive');
    }

    const result = await res.json();
    return {
      id: result.id,
      title,
      updatedAt: new Date().toISOString(),
      isDriveSynced: true,
      hasExportedPDF: false,
    };
  }

  /**
   * Guarda el archivo binario PDF compilado en 'CV Data/'.
   * Asigna parents: [cvDataFolderId] mediante subida multipart.
   */
  async savePDF(_id: string, pdfBlob: Blob, filename: string): Promise<string> {
    const token = VolatileTokenStore.getToken();
    if (!token) throw new Error('No hay sesión de Google Drive');

    const folderId = await this.getOrCreateCVDataFolder(token);
    const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    const metadata = {
      name: pdfFilename,
      mimeType: 'application/pdf',
      parents: [folderId],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', pdfBlob);

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (res.status === 401) {
      VolatileTokenStore.clear();
      throw new Error('Sesión de Google Drive expirada.');
    }

    if (!res.ok) {
      throw new Error('Error al subir PDF a Google Drive');
    }

    const data = await res.json();
    return `https://drive.google.com/file/d/${data.id}/view`;
  }

  /**
   * Persistencia dual: guarda tanto el archivo .json como el archivo .pdf en 'CV Data/'.
   */
  async saveDocumentWithPDF(
    doc: CVData,
    pdfBlob: Blob,
    customName?: string,
    id?: string
  ): Promise<{ metadata: CVMetadata; pdfUrl: string }> {
    const title = (customName || doc.profile.fullName || 'Curriculum_Vitae').trim();
    const metadata = await this.saveDocument(doc, title, id);
    const pdfUrl = await this.savePDF(metadata.id, pdfBlob, `${title}.pdf`);
    return { metadata, pdfUrl };
  }

  async renameDocument(id: string, newTitle: string): Promise<void> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID no válido');

    const token = VolatileTokenStore.getToken();
    if (!token) throw new Error('No hay sesión de Google Drive');

    const filename = `${newTitle.trim()}.json`;

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${safeId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: filename }),
    });

    if (!res.ok) {
      throw new Error('Error al renombrar archivo en Google Drive');
    }
  }

  async duplicateDocument(id: string): Promise<CVMetadata> {
    const doc = await this.getDocument(id);
    return this.saveDocument(doc, `${doc.profile.fullName || 'CV'} (Copia)`);
  }

  async deleteDocument(id: string): Promise<void> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID no válido');

    const token = VolatileTokenStore.getToken();
    if (!token) throw new Error('No hay sesión de Google Drive');

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${safeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok && res.status !== 404) {
      throw new Error('Error al eliminar archivo en Google Drive');
    }
  }
}
