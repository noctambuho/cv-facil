/**
 * src/services/storage/index.ts
 * Factoría y exportación de instancias únicas (singleton) de almacenamiento.
 * Trazabilidad: US-08, TASK-7.2
 */

import type { IStorageAdapter } from './IStorageAdapter';
import type { StorageProviderType } from '../../types/storage';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { GoogleDriveAdapter } from './GoogleDriveAdapter';

export { LocalStorageAdapter } from './LocalStorageAdapter';
export { GoogleDriveAdapter } from './GoogleDriveAdapter';
export type { IStorageAdapter } from './IStorageAdapter';

/**
 * [INSTANCIA] Adaptador singleton para persistencia local.
 */
export const localStorageAdapter = new LocalStorageAdapter();

/**
 * [INSTANCIA] Adaptador singleton para persistencia BYOS en Google Drive.
 */
export const googleDriveAdapter = new GoogleDriveAdapter();

let currentProvider: StorageProviderType = 'local';

/**
 * [EFECTO] Define el proveedor activo en el contexto actual de la aplicación.
 */
export function setActiveProvider(provider: StorageProviderType): void {
  currentProvider = provider;
}

/**
 * [PURA] Retorna el adaptador de almacenamiento correspondiente al proveedor solicitado o activo.
 */
export function getStorageAdapter(provider?: StorageProviderType): IStorageAdapter {
  const target = provider || currentProvider;
  return target === 'drive' ? googleDriveAdapter : localStorageAdapter;
}
