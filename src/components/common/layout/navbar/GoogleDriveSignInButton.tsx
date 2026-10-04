import React, { useState } from 'react';
import { googleDriveAdapter } from '../../../../services/storage';
import { VolatileTokenStore } from '../../../../services/storage/driveTokenStore';
import { saveDriveHandoff } from '../../../../services/storage/driveSessionHandoff';
import { getRoute } from '../../../../services/browser/navigation';

export interface GoogleDriveSignInButtonProps {
  className?: string;
}

/**
 * src/components/common/layout/navbar/GoogleDriveSignInButton.tsx
 * [ISLA] Botón de inicio de sesión directo con Google Drive en colores de marca oficiales.
 * Inicia el flujo GIS (alcance drive.file) y orquesta el traspaso efímero hacia /editor.
 * Trazabilidad: US-11, US-12, TASK-8.5, specs/08-rediseno-landing.md
 */
export const GoogleDriveSignInButton: React.FC<GoogleDriveSignInButtonProps> = ({
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleClick = async () => {
    setFeedback(null);

    // 1. Si no existe Client ID configurado, redirigir a configuración interactiva en el editor
    const clientId = googleDriveAdapter.getClientId();
    if (!clientId) {
      window.location.href = getRoute('/editor?drive=config');
      return;
    }

    // 2. Ejecutar autenticación interactiva con Google Identity Services (GIS)
    setIsLoading(true);
    try {
      const authState = await googleDriveAdapter.authenticate();
      if (authState.isAuthenticated) {
        const token = VolatileTokenStore.getToken();
        if (token) {
          saveDriveHandoff(token, 3600, {
            email: authState.userEmail || '',
            name: authState.userName || '',
          });
        }
        window.location.href = getRoute('/editor');
      } else {
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      if (err?.message === 'MISSING_CLIENT_ID') {
        window.location.href = getRoute('/editor?drive=config');
      } else {
        const msg = err?.message || 'Acceso cancelado';
        setFeedback(msg);
        setTimeout(() => setFeedback(null), 4000);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label="Conectá tu Google Drive para sincronizar tus currículums"
        title="Conectá tu Google Drive (BYOS)"
        className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 shadow-2xs transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 select-none ${className}`}
      >
        {/* Isotipo oficial de Google Drive en colores originales */}
        <svg
          className={`w-4 h-4 shrink-0 ${isLoading ? 'animate-spin' : ''}`}
          viewBox="0 0 512 443.8"
          aria-hidden="true"
        >
          <path
            d="M170.7 0L0 295.9l85.4 147.9 170.7-295.9L170.7 0z"
            fill="#FFBA00"
          />
          <path
            d="M512 295.9L426.6 443.8H85.4l85.3-147.9H512z"
            fill="#0066DA"
          />
          <path
            d="M170.7 0h170.6L512 295.9H341.3L170.7 0z"
            fill="#00AC47"
          />
        </svg>

        <span className="hidden sm:inline">
          {isLoading ? 'Conectando...' : 'Conectá tu Drive'}
        </span>
        <span className="sm:hidden">
          {isLoading ? '...' : 'Drive'}
        </span>
      </button>

      {/* Alerta flotante accesible en caso de fallo o cancelación */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-full right-0 mt-2 z-50 whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/90 border border-rose-200 dark:border-rose-800 rounded-lg shadow-lg"
        >
          {feedback}
        </div>
      )}
    </div>
  );
};
