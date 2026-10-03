import React, { useState } from 'react';
import { Modal } from '../common/primitives/Modal';
import { Button } from '../common/primitives/Button';
import { Input } from '../common/primitives/Input';
import { HardDrive, ExternalLink, ShieldCheck, KeyRound } from 'lucide-react';

interface GoogleDriveConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (clientId: string) => Promise<void>;
  initialClientId?: string;
}

/**
 * GoogleDriveConfigModal: Diálogo de configuración para el modelo BYOS (Bring Your Own Storage).
 * [COMPONENTE] Diálogo modal para ingresar y validar Google Client ID.
 * Trazabilidad: US-08, TASK-7.6
 */
export const GoogleDriveConfigModal: React.FC<GoogleDriveConfigModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  initialClientId = '',
}) => {
  const [clientId, setClientId] = useState(initialClientId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const cleanId = clientId.trim();
    if (!cleanId) {
      setError('Por favor, ingresa un Google Client ID válido.');
      return;
    }

    if (!cleanId.includes('.apps.googleusercontent.com')) {
      setError('El Client ID suele tener el formato "xxxxxx-xxxxxx.apps.googleusercontent.com".');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onConnect(cleanId);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al iniciar la autenticación con Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Conectar Google Drive (BYOS)"
      description="Sincronización privada en tu propia nube bajo el modelo Bring Your Own Storage."
      maxWidth="max-w-md"
      actions={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<HardDrive className="w-4 h-4" />}
          >
            Autenticar con Google
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Banner de Privacidad y Scope */}
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Principio de Mínimo Privilegio (drive.file)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-300/80">
            La aplicación <strong>no tiene acceso</strong> a tu unidad personal. Solo podrá crear y administrar la carpeta <code>CV Data/</code> y los currículums generados aquí.
          </p>
        </div>

        {/* Campo de Client ID */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Google Client ID de OAuth 2.0
          </label>
          <div className="relative">
            <Input
              type="text"
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ej: 123456789-abcdef.apps.googleusercontent.com"
              className="text-xs font-mono pr-8"
              autoFocus
            />
            <KeyRound className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {error && <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">{error}</p>}
        </div>

        {/* Ayuda y Enlace a Google Cloud */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>¿Dónde obtener este Client ID?</span>
            <a
              href="https://console.cloud.google.com/apis/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 hover:underline"
            >
              <span>Google Cloud Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-[10.5px] text-slate-600 dark:text-slate-400 pt-0.5">
            <li>Crea un proyecto y habilita la <strong>Google Drive API</strong>.</li>
            <li>En <em>Credenciales</em>, crea un <em>ID de cliente OAuth (Aplicación web)</em>.</li>
            <li>Agrega en <em>Orígenes autorizados de JavaScript</em> el origen actual: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.2 rounded font-mono text-[10px]">{typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4321'}</code>.</li>
          </ol>
        </div>
      </form>
    </Modal>
  );
};
