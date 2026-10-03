/**
 * src/components/editor/hooks/useExportWorkflow.ts
 * Orquestador del flujo asíncrono de exportación de PDF, JSON y guardado en Google Drive.
 * Trazabilidad: US-09, TASK-7.4
 */

import { useState, useMemo } from 'react';
import type { CVData } from '../../../types/cv';
import {
  type ExportQualityProfile,
  estimatePdfSizeBytes,
  formatBytes,
} from '../../../domain/exportEstimate';
import { generatePdfBlob, downloadPdfFile } from '../../../services/pdf/pdfRenderer';
import { exportToJSON } from '../../../services/browser/download';
import { googleDriveAdapter, localStorageAdapter } from '../../../services/storage';

export interface UseExportWorkflowOptions {
  data: CVData;
  documentId?: string;
  documentTitle?: string;
  onClose: () => void;
}

/**
 * [HOOK] Gestiona el estado y las operaciones de exportación del currículum.
 */
export function useExportWorkflow({
  data,
  documentId,
  documentTitle,
  onClose,
}: UseExportWorkflowOptions) {
  const [selectedProfile, setSelectedProfile] = useState<ExportQualityProfile>('ats-web');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [isDriveConfigModalOpen, setIsDriveConfigModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [driveSuccessMessage, setDriveSuccessMessage] = useState<string | null>(null);

  const estimatedBytes = useMemo(
    () => estimatePdfSizeBytes(data, selectedProfile),
    [data, selectedProfile]
  );
  const estimatedString = formatBytes(estimatedBytes);
  const isUnder2MB = estimatedBytes <= 2 * 1024 * 1024;
  const suggestedFilename = documentTitle || (data.profile.fullName ? `CV_${data.profile.fullName}` : 'Curriculum_Vitae');

  const handleDownloadVectorPDF = async () => {
    setIsGeneratingPdf(true);
    setErrorMessage(null);
    try {
      await downloadPdfFile(data, suggestedFilename);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al generar el archivo PDF vectorial');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportJSON = () => {
    exportToJSON(data, suggestedFilename);
    onClose();
  };

  const handleSaveToDrive = async () => {
    setIsSavingToDrive(true);
    setErrorMessage(null);
    setDriveSuccessMessage(null);

    try {
      const auth = googleDriveAdapter.getAuthState();
      if (!auth.isAuthenticated) {
        const cid = googleDriveAdapter.getClientId();
        if (!cid) {
          setIsDriveConfigModalOpen(true);
          setIsSavingToDrive(false);
          return;
        }
        await googleDriveAdapter.authenticate();
      }

      const pdfBlob = await generatePdfBlob(data);
      const savedMeta = await googleDriveAdapter.saveDocument(data, suggestedFilename, documentId);
      await googleDriveAdapter.savePDF(savedMeta.id, pdfBlob, `${suggestedFilename}.pdf`);

      // Marcar en almacenamiento local que tiene PDF exportado
      if (documentId) {
        try {
          await localStorageAdapter.savePDF(documentId, pdfBlob, `${suggestedFilename}.pdf`);
        } catch {
          // Fallback silencioso en modo Drive
        }
      }

      setDriveSuccessMessage('¡Guardado exitosamente en tu Google Drive dentro de la carpeta "CV Data"!');
      setTimeout(() => {
        onClose();
        setDriveSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      if (err?.message === 'MISSING_CLIENT_ID') {
        setIsDriveConfigModalOpen(true);
      } else {
        setErrorMessage(err?.message || 'Error al guardar en Google Drive');
      }
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleDriveConfigConnect = async (clientId: string) => {
    await googleDriveAdapter.authenticate(clientId);
    setIsDriveConfigModalOpen(false);
    await handleSaveToDrive();
  };

  return {
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
    suggestedFilename,
    handleDownloadVectorPDF,
    handleExportJSON,
    handleSaveToDrive,
    handleDriveConfigConnect,
  };
}
