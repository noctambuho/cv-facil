/**
 * src/services/storage/LocalStorageAdapter.ts
 * Implementación del adaptador de almacenamiento local (Modo Invitado / Local-First).
 * Gestiona múltiples currículums bajo la clave 'cv_facil_library'.
 * Trazabilidad: US-08 (Criterio 8.1), TASK-2.2.2
 */

import type { IStorageAdapter } from './IStorageAdapter';
import type { CVData } from '../../types/cv';
import type { CVMetadata, LocalDocumentEntry } from '../../types/storage';
import { initialData } from '../../data/initialData';
import { sampleData } from '../../data/sampleData';
import { generateSecureId, sanitizeDocumentId } from '../../utils/security';

const LIBRARY_KEY = 'cv_facil_library';
const LEGACY_STORAGE_KEY = 'cv_wizard_data_v1';

export class LocalStorageAdapter implements IStorageAdapter {
  private getStorage(): Storage | null {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage;
  }

  /**
   * Lee la biblioteca completa desde localStorage con migración automática si aplica.
   */
  private readLibrary(): Record<string, LocalDocumentEntry> {
    const storage = this.getStorage();
    if (!storage) return {};

    try {
      const raw = storage.getItem(LIBRARY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error al deserializar cv_facil_library:', e);
    }

    // Migración transparente desde v1 o si está vacía
    return this.initializeOrMigrate(storage);
  }

  /**
   * Escribe la biblioteca en localStorage.
   */
  private writeLibrary(lib: Record<string, LocalDocumentEntry>): void {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      storage.setItem(LIBRARY_KEY, JSON.stringify(lib));
      // Emitir evento para reactividad entre pestañas e islas
      window.dispatchEvent(new CustomEvent('cv_facil_library_updated'));
    } catch (e) {
      console.error('Error al persistir cv_facil_library en localStorage:', e);
    }
  }

  /**
   * Inicializa la biblioteca con el CV de la versión previa si existe, o un documento inicial.
   */
  private initializeOrMigrate(storage: Storage): Record<string, LocalDocumentEntry> {
    const lib: Record<string, LocalDocumentEntry> = {};

    let initialCV: CVData = sampleData;
    let initialTitle = 'CV Desarrollador Frontend 2026';

    try {
      const legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        if (legacyParsed?.profile?.fullName) {
          initialCV = {
            ...initialData,
            ...legacyParsed,
            profile: { ...initialData.profile, ...(legacyParsed.profile || {}) },
            settings: { ...initialData.settings, ...(legacyParsed.settings || {}) },
          };
          initialTitle = `CV ${initialCV.profile.fullName || 'Profesional'}`;
        }
      }
    } catch {
      // Ignorar error de migración legacy
    }

    const defaultId = generateSecureId();
    const entry: LocalDocumentEntry = {
      metadata: {
        id: defaultId,
        title: initialTitle,
        updatedAt: new Date().toISOString(),
        sizeBytes: JSON.stringify(initialCV).length,
        isDriveSynced: false,
        hasExportedPDF: false,
      },
      data: initialCV,
    };

    lib[defaultId] = entry;

    try {
      storage.setItem(LIBRARY_KEY, JSON.stringify(lib));
    } catch (err) {
      console.warn('No se pudo guardar la inicialización de la biblioteca:', err);
    }

    return lib;
  }

  /**
   * Obtiene la lista de documentos ordenada por fecha de última modificación descendente.
   */
  async listDocuments(): Promise<CVMetadata[]> {
    const lib = this.readLibrary();
    const items = Object.values(lib).map((entry) => entry.metadata);
    return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Obtiene los datos estructurados de un CV por su ID sanitizado.
   */
  async getDocument(id: string): Promise<CVData> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) {
      throw new Error('ID de documento no válido o bloqueado por seguridad.');
    }

    const lib = this.readLibrary();
    const entry = lib[safeId];
    if (!entry) {
      throw new Error(`El documento con ID "${safeId}" no fue encontrado en el almacenamiento local.`);
    }

    return entry.data;
  }

  /**
   * Guarda o actualiza un documento en la biblioteca local.
   */
  async saveDocument(doc: CVData, customName?: string, id?: string): Promise<CVMetadata> {
    const lib = this.readLibrary();
    const docId = id ? sanitizeDocumentId(id) || generateSecureId() : generateSecureId();

    const title =
      customName?.trim() ||
      lib[docId]?.metadata?.title ||
      (doc.profile.fullName ? `CV ${doc.profile.fullName}` : 'Nuevo Currículum');

    const serialized = JSON.stringify(doc);
    const existing = lib[docId];

    const metadata: CVMetadata = {
      id: docId,
      title,
      updatedAt: new Date().toISOString(),
      sizeBytes: serialized.length,
      isDriveSynced: false,
      hasExportedPDF: Boolean(existing?.metadata?.hasExportedPDF),
    };

    lib[docId] = {
      metadata,
      data: doc,
      pdfDataUrl: existing?.pdfDataUrl,
    };

    this.writeLibrary(lib);
    return metadata;
  }

  /**
   * Renombra un documento existente.
   */
  async renameDocument(id: string, newTitle: string): Promise<void> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID no válido.');

    const lib = this.readLibrary();
    const entry = lib[safeId];
    if (!entry) throw new Error('Documento no encontrado.');

    entry.metadata.title = newTitle.trim() || 'Sin título';
    entry.metadata.updatedAt = new Date().toISOString();

    this.writeLibrary(lib);
  }

  /**
   * Duplica un documento existente generando un nuevo identificador.
   */
  async duplicateDocument(id: string): Promise<CVMetadata> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID no válido.');

    const lib = this.readLibrary();
    const original = lib[safeId];
    if (!original) throw new Error('Documento original no encontrado.');

    const newId = generateSecureId();
    const newTitle = `${original.metadata.title} (Copia)`;
    const duplicatedData: CVData = JSON.parse(JSON.stringify(original.data));

    const newMetadata: CVMetadata = {
      id: newId,
      title: newTitle,
      updatedAt: new Date().toISOString(),
      sizeBytes: JSON.stringify(duplicatedData).length,
      isDriveSynced: false,
      hasExportedPDF: false,
    };

    lib[newId] = {
      metadata: newMetadata,
      data: duplicatedData,
    };

    this.writeLibrary(lib);
    return newMetadata;
  }

  /**
   * Elimina un documento de la biblioteca.
   */
  async deleteDocument(id: string): Promise<void> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID no válido.');

    const lib = this.readLibrary();
    if (lib[safeId]) {
      delete lib[safeId];
      this.writeLibrary(lib);
    }
  }

  /**
   * Guarda el archivo binario PDF en base64 en la entrada del documento.
   */
  async savePDF(id: string, pdfBlob: Blob, _filename: string): Promise<string> {
    const safeId = sanitizeDocumentId(id);
    if (!safeId) throw new Error('ID no válido.');

    const lib = this.readLibrary();
    const entry = lib[safeId];
    if (!entry) throw new Error('Documento no encontrado.');

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        entry.pdfDataUrl = dataUrl;
        entry.metadata.hasExportedPDF = true;
        entry.metadata.updatedAt = new Date().toISOString();
        this.writeLibrary(lib);
        resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error('Error al convertir el Blob PDF a base64'));
      reader.readAsDataURL(pdfBlob);
    });
  }
}
