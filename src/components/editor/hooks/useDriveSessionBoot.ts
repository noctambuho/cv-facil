/**
 * src/components/editor/hooks/useDriveSessionBoot.ts
 * [HOOK] Inicializador de sesión de Google Drive al arrancar el Editor.
 * Consume y destruye cualquier traspaso efímero desde la Landing y gestiona aperturas automáticas de configuración.
 * Trazabilidad: US-12 (Criterio 12.2, 12.4, 12.5), TASK-8.4, specs/08-rediseno-landing.md
 */

import { useState, useEffect } from 'react';
import { consumeDriveHandoff } from '../../../services/storage/driveSessionHandoff';
import { VolatileTokenStore } from '../../../services/storage/driveTokenStore';
import { setActiveProvider } from '../../../services/storage';

/**
 * [HOOK] Gestiona el arranque de sesión de Google Drive en el editor.
 */
export function useDriveSessionBoot() {
  const [isDriveConfigModalOpen, setIsDriveConfigModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Consumir y destruir traspaso efímero de sesión si proviene de la Landing
    const handoff = consumeDriveHandoff();
    if (handoff) {
      const remainingSeconds = Math.max(
        1,
        Math.floor((handoff.expiresAt - Date.now()) / 1000)
      );
      VolatileTokenStore.setToken(handoff.accessToken, remainingSeconds, handoff.user);
      setActiveProvider('drive');
    }

    // 2. Comprobar si la URL solicita configuración directa (?drive=config)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('drive') === 'config') {
        setIsDriveConfigModalOpen(true);

        // Limpiar el parámetro de la URL sin recargar la página para evitar aperturas repetidas
        urlParams.delete('drive');
        const cleanQuery = urlParams.toString();
        const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}`;
        window.history.replaceState({}, '', cleanUrl);
      }
    }
  }, []);

  return {
    isDriveConfigModalOpen,
    setIsDriveConfigModalOpen,
  };
}
