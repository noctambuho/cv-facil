/**
 * src/types/storage.ts
 * Definición de tipos para la capa de almacenamiento y metadatos de documentos.
 * Trazabilidad: US-08, TASK-2.2.1
 */

import type { CVData } from './cv';

/**
 * Metadatos inmutables de un currículum en la biblioteca del usuario.
 */
export interface CVMetadata {
  /** Identificador único sanitizado (UUIDv4 o ID seguro de Google Drive) */
  id: string;
  /** Título o nombre visible del documento (ej. "CV_Desarrollador_2026") */
  title: string;
  /** Marca temporal ISO-8601 de última actualización */
  updatedAt: string;
  /** Tamaño aproximado del archivo en bytes */
  sizeBytes?: number;
  /** true si el documento está sincronizado en Google Drive; false si es local */
  isDriveSynced: boolean;
  /** true si el documento cuenta con un PDF exportado asociado */
  hasExportedPDF: boolean;
}

/**
 * Registro de un documento guardado en LocalStorage.
 */
export interface LocalDocumentEntry {
  metadata: CVMetadata;
  data: CVData;
  pdfDataUrl?: string;
}

/**
 * Tipo de proveedor de almacenamiento activo.
 */
export type StorageProviderType = 'local' | 'drive';

/**
 * Estado de la sesión y autenticación con Google Drive.
 */
export interface DriveAuthState {
  isAuthenticated: boolean;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  folderId?: string;
}
