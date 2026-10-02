import React, { useRef, useState } from 'react';
import { Modal } from '../common/primitives/Modal';
import { Button } from '../common/primitives/Button';
import { UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { CVData } from '../../types/cv';
import { initialData } from '../../data/initialData';

export interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (doc: CVData, name: string) => Promise<void>;
}

/**
 * ImportModal: Diálogo accesible para cargar e importar respaldos de currículum en formato JSON.
 * Valida la estructura básica del documento para garantizar integridad antes de guardar.
 * Trazabilidad: US-07 (Criterio 7.1), TASK-2.4.1
 */
export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Por favor selecciona un archivo con extensión .json válido.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleProcessImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const text = await selectedFile.text();
      const parsed = JSON.parse(text);

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('El archivo no contiene un objeto JSON legible.');
      }

      // Mezclar con valores predeterminados seguros para garantizar integridad de tipos
      const sanitizedDoc: CVData = {
        profile: { ...initialData.profile, ...(parsed.profile || {}) },
        experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        languages: Array.isArray(parsed.languages) ? parsed.languages : [],
        settings: { ...initialData.settings, ...(parsed.settings || {}) },
      };

      const docName =
        selectedFile.name.replace(/\.json$/i, '') ||
        (sanitizedDoc.profile.fullName ? `CV ${sanitizedDoc.profile.fullName}` : 'CV Importado');

      await onImportSuccess(sanitizedDoc, docName);
      setSelectedFile(null);
      onClose();
    } catch (err: any) {
      setError('Error al importar el archivo: ' + (err.message || 'Formato no compatible'));
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Importar Currículum (JSON)"
      description="Carga una copia de seguridad generada previamente por CV Fácil."
      actions={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleProcessImport}
            disabled={!selectedFile || isProcessing}
            isLoading={isProcessing}
          >
            Importar al Lobby
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {selectedFile ? selectedFile.name : 'Haz clic para seleccionar tu archivo .json'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Solo archivos JSON de copia de seguridad (máximo 5MB)
          </p>
        </div>

        {selectedFile && !error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs border border-emerald-200/60 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Archivo listo para procesar: {selectedFile.name}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 text-xs border border-red-200/60 dark:border-red-800">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
