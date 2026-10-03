/**
 * src/components/editor/ExportModal.tsx
 * Diálogo modal para la exportación de CV en PDF vectorial, respaldo JSON y Google Drive.
 * Trazabilidad: US-09, TASK-7.4
 */

import React from 'react';
import { Modal } from '../common/primitives/Modal';
import { Button } from '../common/primitives/Button';
import type { CVData } from '../../types/cv';
import { EXPORT_PROFILES, type ExportQualityProfile } from '../../domain/exportEstimate';
import { GoogleDriveConfigModal } from '../lobby/GoogleDriveConfigModal';
import { googleDriveAdapter } from '../../services/storage';
import { useExportWorkflow } from './hooks/useExportWorkflow';
import {
  HardDrive,
  FileCheck2,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
  documentId?: string;
  documentTitle?: string;
}

/**
 * [COMPONENTE] Diálogo de selección de calidad y destino de exportación.
 */
export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  documentId,
  documentTitle,
}) => {
  const {
    selectedProfile,
    setSelectedProfile,
    isGeneratingPdf,
    isSavingToDrive,
    isDriveConfigModalOpen,
    setIsDriveConfigModalOpen,
    errorMessage,
    driveSuccessMessage,
    estimatedString,
    isUnder2MB,
    handleDownloadVectorPDF,
    handleExportJSON,
    handleSaveToDrive,
    handleDriveConfigConnect,
  } = useExportWorkflow({ data, documentId, documentTitle, onClose });

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Exportar y Descargar Currículum"
        description="Elige el perfil de exportación y el destino para tu CV profesional."
        maxWidth="max-w-xl"
        actions={
          <>
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              variant="outline"
              onClick={handleExportJSON}
              leftIcon={<FileJson className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            >
              Exportar JSON
            </Button>
            <Button
              variant="primary"
              onClick={handleDownloadVectorPDF}
              isLoading={isGeneratingPdf}
              leftIcon={<FileCheck2 className="w-4 h-4" />}
            >
              Descargar PDF
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Alertas de error o éxito */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-900 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          {driveSuccessMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p>{driveSuccessMessage}</p>
            </div>
          )}

          {/* Selector de perfil de calidad */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Perfil de Optimización ATS
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(EXPORT_PROFILES) as ExportQualityProfile[]).map((profKey) => {
                const prof = EXPORT_PROFILES[profKey];
                const isSelected = selectedProfile === profKey;
                return (
                  <button
                    key={profKey}
                    type="button"
                    onClick={() => setSelectedProfile(profKey)}
                    className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {prof.title}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {prof.description}
                      </p>
                    </div>
                    <span className="mt-2 text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100/60 dark:bg-blue-900/40 px-2 py-0.5 rounded-full self-start">
                      {prof.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indicador de peso estimado */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Peso estimado del PDF:{' '}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{estimatedString}</span>
              </div>
            </div>
            {isUnder2MB && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                Cumple límite &lt; 2MB
              </span>
            )}
          </div>

          {/* Opción de respaldo en Google Drive */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Guardar en Google Drive
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Sincroniza el JSON y el PDF en tu carpeta privada "CV Data"
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveToDrive}
              isLoading={isSavingToDrive}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-500" />}
            >
              Guardar en Drive
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de configuración BYOS de Google Drive si falta Client ID */}
      <GoogleDriveConfigModal
        isOpen={isDriveConfigModalOpen}
        onClose={() => setIsDriveConfigModalOpen(false)}
        onConnect={handleDriveConfigConnect}
        initialClientId={googleDriveAdapter.getClientId()}
      />
    </>
  );
};
