/**
 * src/components/lobby/LobbyDashboard.tsx
 * [ISLA] Dashboard principal interactivo del Lobby (estilo ONLYOFFICE).
 * Coordina la biblioteca de documentos, conexión BYOS a Google Drive y modales de gestión.
 * Trazabilidad: US-07, US-08, TASK-7.6
 */

import React, { useState } from 'react';
import type { CVData } from '../../types/cv';
import { getStorageAdapter, googleDriveAdapter } from '../../services/storage';
import { goToEditor } from '../../services/browser/navigation';
import { useDocumentLibrary } from './hooks/useDocumentLibrary';
import { useDriveConnection } from './hooks/useDriveConnection';
import { QuickActionsBar } from './QuickActionsBar';
import { RecentDocumentsTable } from './RecentDocumentsTable';
import { ImportModal } from './ImportModal';
import { GoogleDriveConfigModal } from './GoogleDriveConfigModal';
import { Modal } from '../common/primitives/Modal';
import { Input } from '../common/primitives/Input';
import { Button } from '../common/primitives/Button';
import { HardDrive, CheckCircle2, ShieldAlert, Sparkles, LogOut, RefreshCw, KeyRound } from 'lucide-react';

export const LobbyDashboard: React.FC = () => {
  const {
    documents,
    isLoading,
    loadDocuments,
    handleCreateBlank,
    handleChooseTemplate,
    handleRename,
    handleDuplicate,
    handleDelete,
  } = useDocumentLibrary();

  const {
    driveAuth,
    isConnectingDrive,
    isDriveConfigModalOpen,
    setIsDriveConfigModalOpen,
    handleToggleDriveAuth,
    handleConnectWithClientId,
  } = useDriveConnection(loadDocuments);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleImportSuccess = async (doc: CVData, name: string) => {
    const adapter = getStorageAdapter();
    const created = await adapter.saveDocument(doc, name);
    await loadDocuments();
    goToEditor(created.id);
  };

  const handleConfirmRename = async () => {
    if (!renameTarget || !renameTarget.title.trim()) return;
    await handleRename(renameTarget.id, renameTarget.title.trim());
    setRenameTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await handleDelete(deleteTarget.id);
    setDeleteTarget(null);
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
              {driveAuth.isAuthenticated ? <CheckCircle2 className="w-5 h-5" /> : <HardDrive className="w-5 h-5" />}
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
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Fila Superior de Acciones Rápidas */}
      <QuickActionsBar
        onCreateBlank={handleCreateBlank}
        onChooseTemplate={handleChooseTemplate}
        onImportFile={() => setIsImportModalOpen(true)}
      />

      {/* Tabla de Documentos Recientes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Documentos Recientes
          </h2>
          <button
            type="button"
            onClick={loadDocuments}
            title="Recargar lista de documentos"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>

        <RecentDocumentsTable
          documents={documents}
          onOpen={(id) => goToEditor(id)}
          onRename={(id, title) => setRenameTarget({ id, title })}
          onDuplicate={handleDuplicate}
          onDownloadPDF={(id) => goToEditor(id, true)}
          onDelete={(id, title) => setDeleteTarget({ id, title })}
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
        isOpen={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        title="Renombrar Documento"
        description="Ingresa el nuevo nombre identificador para este currículum."
        actions={
          <>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
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
          value={renameTarget?.title || ''}
          onChange={(e) =>
            setRenameTarget((prev) => (prev ? { ...prev, title: e.target.value } : null))
          }
          placeholder="Ej: CV_Desarrollador_2026"
          autoFocus
        />
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="¿Eliminar este currículum?"
        description="Esta acción no se puede deshacer y borrará permanentemente el documento de tu almacenamiento."
        actions={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
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
            <strong className="font-bold underline">{deleteTarget?.title}</strong>.
          </p>
        </div>
      </Modal>

      {/* Modal de Configuración BYOS Google Client ID */}
      <GoogleDriveConfigModal
        isOpen={isDriveConfigModalOpen}
        onClose={() => setIsDriveConfigModalOpen(false)}
        onConnect={handleConnectWithClientId}
        initialClientId={googleDriveAdapter.getClientId()}
      />
    </div>
  );
};
