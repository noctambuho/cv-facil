/**
 * src/services/storage/IStorageAdapter.ts
 * Contrato inmutable para la gestión de documentos y persistencia en CV Fácil.
 * Trazabilidad: US-08, TASK-2.2.1
 */

import type { CVData } from '../../types/cv';
import type { CVMetadata } from '../../types/storage';

export interface IStorageAdapter {
  /**
   * Obtiene la lista de documentos disponibles para el usuario actual.
   * 
   * @returns Promesa con el array de metadatos ordenados por fecha de actualización descendente.
   */
  listDocuments(): Promise<CVMetadata[]>;

  /**
   * Carga el contenido JSON estructurado de un CV específico.
   * 
   * @param id Identificador sanitizado del documento
   * @returns Promesa con los datos completos del CV
   * @throws Error si el documento no existe o está corrupto
   */
  getDocument(id: string): Promise<CVData>;

  /**
   * Guarda o actualiza los datos estructurados de un CV.
   * Si no se provee `id`, se genera uno nuevo.
   * 
   * @param doc Datos completos del CV
   * @param customName Nombre opcional para el archivo
   * @param id Identificador opcional para actualizar un documento existente
   * @returns Promesa con los metadatos actualizados
   */
  saveDocument(doc: CVData, customName?: string, id?: string): Promise<CVMetadata>;

  /**
   * Renombra un documento existente.
   * 
   * @param id Identificador sanitizado del documento
   * @param newTitle Nuevo título para el documento
   */
  renameDocument(id: string, newTitle: string): Promise<void>;

  /**
   * Duplica un documento existente generando un nuevo identificador único.
   * 
   * @param id Identificador sanitizado del documento a duplicar
   * @returns Promesa con los metadatos del nuevo documento duplicado
   */
  duplicateDocument(id: string): Promise<CVMetadata>;

  /**
   * Elimina permanentemente el documento del almacenamiento.
   * 
   * @param id Identificador sanitizado del documento
   */
  deleteDocument(id: string): Promise<void>;

  /**
   * Guarda el archivo binario PDF en el destino correspondiente.
   * 
   * @param id Identificador del documento vinculado
   * @param pdfBlob Archivo binario generado
   * @param filename Nombre del archivo .pdf
   * @returns URL de descarga o enlace al archivo en Drive
   */
  savePDF(id: string, pdfBlob: Blob, filename: string): Promise<string>;
}
