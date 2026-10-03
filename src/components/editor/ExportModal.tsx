import React, { useState, useMemo } from 'react';
import { Modal } from '../common/primitives/Modal';
import { Button } from '../common/primitives/Button';
import type { CVData } from '../../types/cv';
import {
  EXPORT_PROFILES,
  type ExportQualityProfile,
  estimatePdfSizeBytes,
  formatBytes,
} from '../../domain/exportEstimate';
import { generatePdfBlob, downloadPdfFile } from '../../services/pdf/pdfRenderer';
import { exportToJSON } from '../../services/browser/download';
import { getStorageAdapter, GoogleDriveAdapter } from '../../services/storage';
import { GoogleDriveConfigModal } from '../lobby/GoogleDriveConfigModal';
import {
  HardDrive,
  FileCheck2,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVData;
  documentId?: string;
  documentTitle?: string;
}

/**
 * ExportModal: Diálogo compacto y centralizado para la descarga y exportación de CV en PDF.
 * Genera PDFs vectoriales puros y nítidos utilizando @react-pdf/renderer tanto para descarga local
 * como para sincronización directa en Google Drive (BYOS).
 */
export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  documentId = 'cv-actual',
  documentTitle = 'Mi_Curriculum',
}) => {
  const [selectedProfile, setSelectedProfile] = useState<ExportQualityProfile>('ats-web');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState<boolean>(false);
  const [isDriveConfigModalOpen, setIsDriveConfigModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [driveSuccessMessage, setDriveSuccessMessage] = useState<string | null>(null);

  // Cálculo de peso estimado
  const estimatedBytes = useMemo(() => {
    return estimatePdfSizeBytes(data, selectedProfile);
  }, [data, selectedProfile]);

  const estimatedString = formatBytes(estimatedBytes);
  const isUnder2MB = estimatedBytes < 2 * 1024 * 1024;
  const filename = (documentTitle || data.profile.fullName || 'Curriculum_Vitae').trim();

  // Acción Principal: Descargar PDF Vectorial (@react-pdf/renderer)
  const handleDownloadVectorPDF = async () => {
    setIsGeneratingPdf(true);
    setErrorMessage(null);
    try {
      await downloadPdfFile(data, filename);
      onClose();
    } catch (err: any) {
      console.error('Error generando PDF vectorial:', err);
      setErrorMessage(
        err?.message || 'No se pudo compilar el PDF vectorial. Revisa la consola para más detalles.'
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Acción 2: Exportar Respaldo JSON
  const handleExportJSON = () => {
    exportToJSON(data);
  };

  // Acción 3: Guardar en Google Drive (BYOS)
  const handleSaveToDrive = async () => {
    setIsSavingToDrive(true);
    setDriveSuccessMessage(null);
    setErrorMessage(null);

    try {
      const driveAdapter = new GoogleDriveAdapter();
      const auth = driveAdapter.getAuthState();

      if (!auth.isAuthenticated) {
        if (!driveAdapter.getClientId()) {
          setIsDriveConfigModalOpen(true);
          setIsSavingToDrive(false);
          return;
        }
        await driveAdapter.authenticate();
      }

      await driveAdapter.saveDocument(data, filename, documentId);
      const pdfBlob = await generatePdfBlob(data);
      await driveAdapter.savePDF(documentId, pdfBlob, `${filename}.pdf`);

      const localAdapter = getStorageAdapter('local');
      try {
        await localAdapter.savePDF(documentId, pdfBlob, `${filename}.pdf`);
      } catch {
        // Ignorar si solo vive en Drive
      }

      setDriveSuccessMessage('¡CV y PDF vectorial guardados en tu Google Drive (Carpeta: CV Data)!');
    } catch (err: any) {
      if (err?.message === 'MISSING_CLIENT_ID') {
        setIsDriveConfigModalOpen(true);
      } else {
        setErrorMessage('Error al sincronizar con Google Drive: ' + (err.message || 'Error desconocido'));
      }
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleDriveConfigConnect = async (clientId: string) => {
    const driveAdapter = new GoogleDriveAdapter();
    await driveAdapter.authenticate(clientId);
    await handleSaveToDrive();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportar Currículum"
      description="Descarga tu CV en PDF vectorial o respalda tus datos."
      maxWidth="max-w-[max-content]"
      actions={
        <div className="flex items-center justify-center gap-2 w-full pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportJSON}
            leftIcon={<FileJson className="w-3.5 h-3.5" />}
          >
            Respaldo JSON
          </Button>

          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadVectorPDF}
            isLoading={isGeneratingPdf}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Descargar PDF
          </Button>
        </div>
      }
    >
      <div className="w-[320px] sm:w-[380px] mx-auto space-y-3.5 text-center sm:text-left">
        {/* Selector Compacto de Perfil */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Calidad de exportación:</span>
            <span className="text-[10px] text-slate-400 font-normal">Motor @react-pdf/renderer</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.values(EXPORT_PROFILES).map((profile) => {
              const isSelected = selectedProfile === profile.id;
              return (
                <button
                  type="button"
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`p-2.5 rounded-xl border text-left transition select-none flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 shadow-2xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-[11px] leading-tight">
                      {profile.id === 'ats-web' ? 'Optimizado ATS' : 'Calidad Vectorial'}
                    </span>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 font-bold shrink-0">
                      &lt;{profile.targetMaxMB}MB
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {profile.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Indicador de Peso Estimado y Estado ATS */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileCheck2 className={`w-4 h-4 shrink-0 ${isUnder2MB ? 'text-emerald-600' : 'text-amber-500'}`} />
            <div className="text-left">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                Peso estimado: {estimatedString}
              </span>
              <span className="block text-[9.5px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
                {isUnder2MB ? 'Apto para portales ATS de empleo' : 'Resolución completa para imprenta'}
              </span>
            </div>
          </div>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
              isUnder2MB
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            {isUnder2MB ? 'Óptimo' : 'Alta Res.'}
          </span>
        </div>

        {/* Doble Destino: Guardar en Google Drive (BYOS) */}
        <div className="p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 to-blue-50/40 dark:from-indigo-950/20 dark:to-blue-950/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-left">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <HardDrive className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-bold text-[11px] text-slate-900 dark:text-white leading-tight">
                Sincronizar con Google Drive
              </h4>
              <p className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
                Guarda JSON y PDF vectorial en la carpeta "CV Data"
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveToDrive}
            isLoading={isSavingToDrive}
            className="text-[11px] px-2.5 py-1 shrink-0"
          >
            Drive
          </Button>
        </div>

        {driveSuccessMessage && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{driveSuccessMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-200 text-[11px] text-left">
            <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <GoogleDriveConfigModal
        isOpen={isDriveConfigModalOpen}
        onClose={() => setIsDriveConfigModalOpen(false)}
        onConnect={handleDriveConfigConnect}
        initialClientId={new GoogleDriveAdapter().getClientId()}
      />
    </Modal>
  );
};
