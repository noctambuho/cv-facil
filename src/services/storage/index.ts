/**
 * src/services/storage/index.ts
 * Gestor unificado de almacenamiento y factoría de adaptadores.
 * Permite conmutar transparentemente entre Modo Invitado (LocalStorage) y Google Drive (BYOS).
 * Trazabilidad: US-08, TASK-2.2.1
 */

import { LocalStorageAdapter } from './LocalStorageAdapter';
import { GoogleDriveAdapter } from './GoogleDriveAdapter';
import type { IStorageAdapter } from './IStorageAdapter';
import type { StorageProviderType } from '../../types/storage';

const localAdapterInstance = new LocalStorageAdapter();
const driveAdapterInstance = new GoogleDriveAdapter();

let currentProvider: StorageProviderType = 'local';

export function getStorageAdapter(provider?: StorageProviderType): IStorageAdapter {
  const target = provider || currentProvider;
  if (target === 'drive') {
    return driveAdapterInstance;
  }
  return localAdapterInstance;
}

export function getActiveProvider(): StorageProviderType {
  return currentProvider;
}

export function setActiveProvider(provider: StorageProviderType): void {
  currentProvider = provider;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('cv_facil_provider_changed', { detail: { provider } })
    );
  }
}

export { LocalStorageAdapter, GoogleDriveAdapter };
export type { IStorageAdapter };
