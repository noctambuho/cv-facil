/**
 * src/services/storage/GoogleDriveAdapter.ts
 * Implementación del adaptador de almacenamiento BYOS (Bring Your Own Storage) con Google Drive.
 * Utiliza el alcance de mínimo privilegio 'https://www.googleapis.com/auth/drive.file'
 * y sincroniza dentro de la carpeta visible 'CV Data/'.
 * Trazabilidad: US-08, TASK-7.2
 */

import type { IStorageAdapter } from './IStorageAdapter';
import type { CVData } from '../../types/cv';
import type { CVMetadata, DriveAuthState } from '../../types/storage';
import { sanitizeDocumentId } from '../../domain/security';
import { normalizeCVData } from '../../domain/cvNormalizer';
import { VolatileTokenStore } from './driveTokenStore';
import { driveFetch, buildJsonMultipartBody, MULTIPART_BOUNDARY } from './driveHttp';

const DRIVE_FOLDER_NAME = 'CV Data';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const CLIENT_ID_STORAGE_KEY = 'cv_facil_google_client_id';

/**
 * [CLASE] Adaptador para sincronización directa con Google Drive (BYOS).
 */
export class GoogleDriveAdapter implements IStorageAdapter {
  private static clientId = '';
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
   * [PURA] Obtiene el Google Client ID configurado (de entorno o de localStorage).
   */
  getClientId(): string {
    if (!GoogleDriveAdapter.clientId && typeof window !== 'undefined') {
      const stored = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
      if (stored) GoogleDriveAdapter.clientId = stored.trim();
    }
    return GoogleDriveAdapter.clientId;
  }

  /**
   * [EFECTO] Configura y persiste el Client ID en el navegador.
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
   * [PURA] Obtiene el estado actual de autenticación en memoria volátil.
   */
  getAuthState(): DriveAuthState {
    return VolatileTokenStore.getAuthState();
  }

  /**
   * [EFECTO] Cierra la sesión activa revocando el token en memoria.
   */
  disconnect(): void {
    VolatileTokenStore.clear();
    GoogleDriveAdapter.folderId = null;
  }

  /**
   * [EFECTO] Espera a que el SDK de Google Identity Services (GIS) termine de cargarse.
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
              'No se pudo conectar con el servicio Google Identity. Comprueba tu conexión o desactiva bloqueadores.'
            )
          );
        }
      }, 100);
    });
  }

  /**
   * [EFECTO] Inicia el flujo de autenticación Google OAuth2 vía Google Identity Services (GIS).
   */
  async authenticate(customClientId?: string): Promise<DriveAuthState> {
    if (typeof window === 'undefined') return { isAuthenticated: false };
    if (customClientId) this.setClientId(customClientId);

    const cid = this.getClientId();
    if (!cid) throw new Error('MISSING_CLIENT_ID');

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
              try {
                const aboutRes = await fetch(
                  'https://www.googleapis.com/drive/v3/about?fields=user(emailAddress,displayName)',
                  { headers: { Authorization: `Bearer ${response.access_token}` } }
                );
                if (aboutRes.ok) {
                  const aboutData = await aboutRes.json();
                  userEmail = aboutData.user?.emailAddress || '';
                  userName = aboutData.user?.displayName || '';
                }
              } catch {
                // Perfil opcional
              }

              VolatileTokenStore.setToken(response.access_token, response.expires_in || 3600, {
                email: userEmail || 'usuario@google.com',
                name: userName || 'Usuario Google',
              });

              await this.getOrCreateCVDataFolder();
              resolve(VolatileTokenStore.getAuthState());
            } catch (authErr) {
              reject(authErr);
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: 'consent' });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * [EFECTO] Obtiene o crea la carpeta 'CV Data' en la raíz de Google Drive del usuario.
   */
  async getOrCreateCVDataFolder(): Promise<string> {
    if (GoogleDriveAdapter.folderId) return GoogleDriveAdapter.folderId;

    const query = encodeURIComponent(
      `name = '${DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const res = await driveFetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name)`);

    if (res.ok) {
      const data = await res.json();
      if (data.files && data.files.length > 0) {
        GoogleDriveAdapter.folderId = data.files[0].id;
        return GoogleDriveAdapter.folderId!;
      }
    }

    const createRes = await driveFetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: DRIVE_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });

    if (!createRes.ok) {
      throw new Error('Error al crear la carpeta CV Data en Google Drive');
    }

    const folder = await createRes.json();
    GoogleDriveAdapter.folderId = folder.id;
    return GoogleDriveAdapter.folderId!;
  }

  /**
   * [EFECTO] Lista los documentos JSON almacenados en la carpeta 'CV Data'.
   */
  async listDocuments(): Promise<CVMetadata[]> {
    if (!VolatileTokenStore.getToken()) return [];

    try {
      const folderId = await this.getOrCreateCVDataFolder();
      const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and name contains '.json'`);
      const res = await driveFetch(
        `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id, name, modifiedTime, size)`
      );

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
    } catch {
      return [];
    }
  }

  /**
   * [EFECTO] Obtiene y normaliza un documento CV específico por su ID.
   */
  async getDocument(id: string): Promise<CVData> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID inválido');

    const res = await driveFetch(`https://www.googleapis.com/drive/v3/files/${safeId}?alt=media`);
    if (!res.ok) {
      throw new Error(`Error al leer archivo de Google Drive (${res.status})`);
    }

    const rawData = await res.json();
    return normalizeCVData(rawData);
  }

  /**
   * [EFECTO] Guarda un documento en formato JSON en 'CV Data/'.
   */
  async saveDocument(doc: CVData, customName?: string, id?: string): Promise<CVMetadata> {
    const safeId = id ? sanitizeDocumentId(id) : null;
    const title = (customName || (doc.profile.fullName ? `CV ${doc.profile.fullName}` : 'Nuevo CV')).trim();
    const filename = `${title}.json`;
    const folderId = await this.getOrCreateCVDataFolder();

    const metadataBody: any = {
      name: filename,
      mimeType: 'application/json',
    };
    if (!safeId) {
      metadataBody.parents = [folderId];
    }

    const multipartRequestBody = buildJsonMultipartBody(metadataBody, doc);
    const endpoint = safeId
      ? `https://www.googleapis.com/upload/drive/v3/files/${safeId}?uploadType=multipart`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

    const res = await driveFetch(endpoint, {
      method: safeId ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': `multipart/related; boundary=${MULTIPART_BOUNDARY}`,
      },
      body: multipartRequestBody,
    });

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
   * [EFECTO] Sube un archivo binario PDF a 'CV Data/'.
   */
  async savePDF(_id: string, pdfBlob: Blob, filename: string): Promise<string> {
    const folderId = await this.getOrCreateCVDataFolder();
    const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    const metadata = {
      name: pdfFilename,
      mimeType: 'application/pdf',
      parents: [folderId],
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', pdfBlob);

    const res = await driveFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      throw new Error('Error al subir PDF a Google Drive');
    }

    const data = await res.json();
    return `https://drive.google.com/file/d/${data.id}/view`;
  }

  /**
   * [EFECTO] Renombra un archivo existente en Google Drive.
   */
  async renameDocument(id: string, newTitle: string): Promise<void> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID no válido');

    const filename = `${newTitle.trim()}.json`;
    const res = await driveFetch(`https://www.googleapis.com/drive/v3/files/${safeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: filename }),
    });

    if (!res.ok) {
      throw new Error('Error al renombrar archivo en Google Drive');
    }
  }

  /**
   * [EFECTO] Duplica un documento existente creando una copia.
   */
  async duplicateDocument(id: string): Promise<CVMetadata> {
    const doc = await this.getDocument(id);
    return this.saveDocument(doc, `${doc.profile.fullName || 'CV'} (Copia)`);
  }

  /**
   * [EFECTO] Elimina un documento de Google Drive.
   */
  async deleteDocument(id: string): Promise<void> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID no válido');

    const res = await driveFetch(`https://www.googleapis.com/drive/v3/files/${safeId}`, {
      method: 'DELETE',
    });

    if (!res.ok && res.status !== 404) {
      throw new Error('Error al eliminar archivo en Google Drive');
    }
  }
}
