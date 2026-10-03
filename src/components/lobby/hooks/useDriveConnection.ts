/**
 * src/components/lobby/hooks/useDriveConnection.ts
 * Hook para la gestión del estado de autenticación y conexión con Google Drive (BYOS).
 * Trazabilidad: US-08, TASK-7.6
 */

import { useState, useEffect } from 'react';
import type { DriveAuthState } from '../../../types/storage';
import { googleDriveAdapter, setActiveProvider } from '../../../services/storage';

/**
 * [HOOK] Controla la conexión, desconexión y configuración de Google Drive.
 */
export function useDriveConnection(onAuthChanged?: () => void) {
  const [driveAuth, setDriveAuth] = useState<DriveAuthState>({ isAuthenticated: false });
  const [isConnectingDrive, setIsConnectingDrive] = useState(false);
  const [isDriveConfigModalOpen, setIsDriveConfigModalOpen] = useState(false);

  useEffect(() => {
    setDriveAuth(googleDriveAdapter.getAuthState());

    const handleDriveAuthChange = (e: any) => {
      if (e.detail) setDriveAuth(e.detail);
      onAuthChanged?.();
    };

    window.addEventListener('cv_facil_drive_auth_changed', handleDriveAuthChange);
    return () => {
      window.removeEventListener('cv_facil_drive_auth_changed', handleDriveAuthChange);
    };
  }, [onAuthChanged]);

  const handleToggleDriveAuth = async () => {
    if (driveAuth.isAuthenticated) {
      googleDriveAdapter.disconnect();
      setActiveProvider('local');
      onAuthChanged?.();
    } else {
      const clientId = googleDriveAdapter.getClientId();
      if (!clientId) {
        setIsDriveConfigModalOpen(true);
        return;
      }
      setIsConnectingDrive(true);
      try {
        await googleDriveAdapter.authenticate();
        setActiveProvider('drive');
        onAuthChanged?.();
      } catch (err: any) {
        if (err?.message === 'MISSING_CLIENT_ID') {
          setIsDriveConfigModalOpen(true);
        } else {
          alert('No se pudo conectar con Google Drive: ' + (err?.message || 'Error desconocido'));
        }
      } finally {
        setIsConnectingDrive(false);
      }
    }
  };

  const handleConnectWithClientId = async (clientId: string) => {
    await googleDriveAdapter.authenticate(clientId);
    setActiveProvider('drive');
    setIsDriveConfigModalOpen(false);
    onAuthChanged?.();
  };

  return {
    driveAuth,
    isConnectingDrive,
    isDriveConfigModalOpen,
    setIsDriveConfigModalOpen,
    handleToggleDriveAuth,
    handleConnectWithClientId,
  };
}
