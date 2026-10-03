/**
 * src/components/lobby/ImportModal.tsx
 * Diálogo modal para la importación y validación de archivos JSON de currículum.
 * Trazabilidad: US-07, TASK-7.6
 */

import React, { useState } from 'react';
import { Modal } from '../common/primitives/Modal';
import { Button } from '../common/primitives/Button';
import type { CVData } from '../../types/cv';
import { parseAndSanitizeCVImport } from '../../domain/cvNormalizer';
import { Upload, FileCode, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (doc: CVData, suggestedName: string) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * [COMPONENTE] Modal para carga de respaldo JSON de currículum con validación integral.
 */
export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('El archivo excede el tamaño máximo permitido de 5MB.');
      return;
    }

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Por favor selecciona un archivo con formato .json válido.');
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
      const result = parseAndSanitizeCVImport(text, selectedFile.name);

      if (!result.valid || !result.data) {
        setError(result.error || 'No se pudo interpretar la estructura del currículum.');
        return;
      }

      onImportSuccess(result.data, result.suggestedTitle || 'Currículum Importado');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error inesperado al leer el archivo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Importar Currículum desde Archivo JSON"
      description="Carga una copia de seguridad .json para editarla de inmediato en tu espacio de trabajo."
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!selectedFile}
            isLoading={isProcessing}
            onClick={handleProcessImport}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Importar y Abrir
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 dark:bg-slate-900/40">
          <input type="file" accept=".json,application/json" onChange={handleFileChange} className="hidden" />
          <FileCode className="w-10 h-10 text-slate-400 mb-2" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
            {selectedFile ? selectedFile.name : 'Haz clic o arrastra aquí tu archivo .json'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Archivos exportados por CV Fácil (máx. 5MB)</span>
        </label>

        {selectedFile && !error && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">Archivo listo para procesar: <strong>{selectedFile.name}</strong></span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 text-xs border border-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
