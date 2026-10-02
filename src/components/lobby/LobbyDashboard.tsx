import React, { useState, useEffect, useCallback } from 'react';
import type { CVMetadata, DriveAuthState } from '../../types/storage';
import type { CVData } from '../../types/cv';
import { getStorageAdapter, setActiveProvider, GoogleDriveAdapter } from '../../services/storage';
import { QuickActionsBar } from './QuickActionsBar';
import { RecentDocumentsTable } from './RecentDocumentsTable';
import { ImportModal } from './ImportModal';
import { GoogleDriveConfigModal } from './GoogleDriveConfigModal';
import { Modal } from '../common/primitives/Modal';
import { Input } from '../common/primitives/Input';
import { Button } from '../common/primitives/Button';
import { initialData } from '../../data/initialData';
import { sampleData } from '../../data/sampleData';
import { getRoute } from '../../utils/routes';
import { HardDrive, CheckCircle2, ShieldAlert, Sparkles, LogOut, RefreshCw, KeyRound } from 'lucide-react';

/**
 * LobbyDashboard: Isla principal interactiva del Lobby (dashboard estilo ONLYOFFICE).
 * Coordina la lista de documentos, conexión a Google Drive, modales de confirmación y enrutamiento al Editor.
 * Trazabilidad: US-07 (Criterios 7.1 a 7.3), US-08 (Criterio 8.1 y 8.2), TASK-2.4.1, TASK-2.4.2
 */
export const LobbyDashboard: React.FC = () => {
  const [documents, setDocuments] = useState<CVMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Estados para modal de renombrar
  const [renameModalState, setRenameModalState] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({ isOpen: false, id: '', title: '' });

  // Estados para modal de eliminar
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({ isOpen: false, id: '', title: '' });

  // Estado de autenticación con Google Drive
  const [driveAuth, setDriveAuth] = useState<DriveAuthState>({ isAuthenticated: false });
  const [isConnectingDrive, setIsConnectingDrive] = useState<boolean>(false);
  const [isDriveConfigModalOpen, setIsDriveConfigModalOpen] = useState<boolean>(false);

  // Carga de documentos desde el adaptador activo
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const adapter = getStorageAdapter();
      const list = await adapter.listDocuments();
      setDocuments(list);

      // Registrar sesión activa para US-07 (Criterio 7.3)
      if (typeof window !== 'undefined') {
        localStorage.setItem('cv_facil_active_session', 'true');
      }
    } catch (err) {
      console.error('Error al cargar documentos en Lobby:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();

    // Sincronizar estado inicial de Google Drive
    const driveAdapter = new GoogleDriveAdapter();
    setDriveAuth(driveAdapter.getAuthState());

    const handleLibraryUpdate = () => loadDocuments();
    const handleDriveAuthChange = (e: any) => {
      if (e.detail) setDriveAuth(e.detail);
      loadDocuments();
    };

    window.addEventListener('cv_facil_library_updated', handleLibraryUpdate);
    window.addEventListener('cv_facil_drive_auth_changed', handleDriveAuthChange);

    return () => {
      window.removeEventListener('cv_facil_library_updated', handleLibraryUpdate);
      window.removeEventListener('cv_facil_drive_auth_changed', handleDriveAuthChange);
    };
  }, [loadDocuments]);

  // Acciones Rápidas
  const handleCreateBlank = async () => {
    try {
      const adapter = getStorageAdapter();
      const blankData: CVData = {
        ...initialData,
        profile: {
          ...initialData.profile,
          fullName: 'Nuevo Currículum',
          headline: 'Título Profesional',
        },
      };
      const created = await adapter.saveDocument(blankData, 'Nuevo Currículum');
      window.location.href = getRoute(`/editor?id=${encodeURIComponent(created.id)}`);
    } catch (err) {
      console.error('Error al crear documento en blanco:', err);
    }
  };

  const handleChooseTemplate = async () => {
    try {
      const adapter = getStorageAdapter();
      const templateDoc: CVData = {
        ...sampleData,
      };
      const created = await adapter.saveDocument(templateDoc, 'CV Plantilla Moderna');
      window.location.href = getRoute(`/editor?id=${encodeURIComponent(created.id)}`);
    } catch (err) {
      console.error('Error al crear documento con plantilla:', err);
    }
  };

  const handleImportSuccess = async (doc: CVData, name: string) => {
    const adapter = getStorageAdapter();
    const created = await adapter.saveDocument(doc, name);
    await loadDocuments();
    window.location.href = getRoute(`/editor?id=${encodeURIComponent(created.id)}`);
  };

  // Operaciones de Fila
  const handleOpenEditor = (id: string) => {
    window.location.href = getRoute(`/editor?id=${encodeURIComponent(id)}`);
  };

  const handleStartRename = (id: string, currentTitle: string) => {
    setRenameModalState({ isOpen: true, id, title: currentTitle });
  };

  const handleConfirmRename = async () => {
    if (!renameModalState.title.trim()) return;
    try {
      const adapter = getStorageAdapter();
      await adapter.renameDocument(renameModalState.id, renameModalState.title.trim());
      setRenameModalState({ isOpen: false, id: '', title: '' });
      await loadDocuments();
    } catch (err) {
      console.error('Error al renombrar:', err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const adapter = getStorageAdapter();
      await adapter.duplicateDocument(id);
      await loadDocuments();
    } catch (err) {
      console.error('Error al duplicar:', err);
    }
  };

  const handleDownloadPDF = (id: string) => {
    // Redirige al editor con parámetro de auto-exportación
    window.location.href = getRoute(`/editor?id=${encodeURIComponent(id)}&export=true`);
  };

  const handleStartDelete = (id: string, title: string) => {
    setDeleteModalState({ isOpen: true, id, title });
  };

  const handleConfirmDelete = async () => {
    try {
      const adapter = getStorageAdapter();
      await adapter.deleteDocument(deleteModalState.id);
      setDeleteModalState({ isOpen: false, id: '', title: '' });
      await loadDocuments();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  // Autenticación con Google Drive
  const handleToggleDriveAuth = async () => {
    const driveAdapter = new GoogleDriveAdapter();
    if (driveAuth.isAuthenticated) {
      driveAdapter.disconnect();
      setActiveProvider('local');
      await loadDocuments();
    } else {
      const clientId = driveAdapter.getClientId();
      if (!clientId) {
        setIsDriveConfigModalOpen(true);
        return;
      }
      setIsConnectingDrive(true);
      try {
        await driveAdapter.authenticate();
        setActiveProvider('drive');
        await loadDocuments();
      } catch (err: any) {
        if (err?.message === 'MISSING_CLIENT_ID') {
          setIsDriveConfigModalOpen(true);
        } else {
          alert('No se pudo conectar con Google Drive: ' + (err.message || 'Error desconocido'));
        }
      } finally {
        setIsConnectingDrive(false);
      }
    }
  };

  const handleConnectWithClientId = async (clientId: string) => {
    const driveAdapter = new GoogleDriveAdapter();
    await driveAdapter.authenticate(clientId);
    setActiveProvider('drive');
    await loadDocuments();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Cabecera del Lobby y Estado de BYOS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Lobby de Currículums
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Espacio de trabajo local-first inspirado en ONLYOFFICE para crear y administrar tus versiones de CV.
          </p>
        </div>

        {/* Tarjeta de Estado y Conmutador de Almacenamiento: Local vs Google Drive BYOS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                driveAuth.isAuthenticated
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                  : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
              }`}
            >
              {driveAuth.isAuthenticated ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <HardDrive className="w-5 h-5" />
              )}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  {driveAuth.isAuthenticated ? 'Google Drive (BYOS)' : 'Almacenamiento Local (por defecto)'}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    driveAuth.isAuthenticated
                      ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {driveAuth.isAuthenticated ? 'Nube Privada' : 'Local-First'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {driveAuth.isAuthenticated
                  ? `Conectado como ${driveAuth.userEmail || 'usuario@gmail.com'} (Carpeta: CV Data)`
                  : 'Tus CVs residen en este navegador de forma 100% privada'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <Button
              variant={driveAuth.isAuthenticated ? 'ghost' : 'outline'}
              size="sm"
              onClick={handleToggleDriveAuth}
              isLoading={isConnectingDrive}
            >
              {driveAuth.isAuthenticated ? (
                <>
                  <LogOut className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>Desconectar</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-500" />
                  <span>Conectar Google Drive</span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setIsDriveConfigModalOpen(true)}
              title="Configurar Google Client ID (BYOS)"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fila Superior de Acciones Rápidas (TASK-2.4.1) */}
      <QuickActionsBar
        onCreateBlank={handleCreateBlank}
        onChooseTemplate={handleChooseTemplate}
        onImportFile={() => setIsImportModalOpen(true)}
      />

      {/* Tabla de Documentos Recientes (TASK-2.4.2) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Documentos Recientes
          </h2>
          <button
            type="button"
            onClick={loadDocuments}
            title="Recargar lista de documentos"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>

        <RecentDocumentsTable
          documents={documents}
          onOpen={handleOpenEditor}
          onRename={handleStartRename}
          onDuplicate={handleDuplicate}
          onDownloadPDF={handleDownloadPDF}
          onDelete={handleStartDelete}
          onCreateNew={handleCreateBlank}
        />
      </div>

      {/* Modal de Importar Archivo */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Modal de Renombrar Documento */}
      <Modal
        isOpen={renameModalState.isOpen}
        onClose={() => setRenameModalState({ isOpen: false, id: '', title: '' })}
        title="Renombrar Documento"
        description="Ingresa el nuevo nombre identificador para este currículum."
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setRenameModalState({ isOpen: false, id: '', title: '' })}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleConfirmRename}>
              Guardar Cambios
            </Button>
          </>
        }
      >
        <Input
          label="Nombre del CV"
          value={renameModalState.title}
          onChange={(e) =>
            setRenameModalState((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Ej: CV_Desarrollador_2026"
          autoFocus
        />
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, id: '', title: '' })}
        title="¿Eliminar este currículum?"
        description="Esta acción no se puede deshacer y borrará permanentemente el documento de tu almacenamiento."
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteModalState({ isOpen: false, id: '', title: '' })}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Eliminar Definitivamente
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <p>
            Estás a punto de borrar:{' '}
            <strong className="font-bold underline">{deleteModalState.title}</strong>.
          </p>
        </div>
      </Modal>

      {/* Modal de Configuración BYOS Google Client ID */}
      <GoogleDriveConfigModal
        isOpen={isDriveConfigModalOpen}
        onClose={() => setIsDriveConfigModalOpen(false)}
        onConnect={handleConnectWithClientId}
        initialClientId={new GoogleDriveAdapter().getClientId()}
      />
    </div>
  );
};
