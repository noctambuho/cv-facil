import React, { useRef, useState, useEffect } from 'react';
import type { CVData } from '../../types/cv';
import { sampleData } from '../../data/sampleData';
import { initialData } from '../../data/initialData';
import { exportToJSON, importFromJSON } from '../../utils/storage';
import {
  Download,
  Sparkles,
  RotateCcw,
  FileJson,
  Upload,
  CheckCircle2,
  FileText,
  MoreVertical,
  X
} from 'lucide-react';

interface ToolbarProps {
  data: CVData;
  onChange: (updated: CVData) => void;
  lastSavedText: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ data, onChange, lastSavedText }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handlePrintPDF = () => {
    const originalTitle = document.title;
    const safeName = (data.profile.fullName || 'Curriculum-Vitae')
      .trim()
      .replace(/\s+/g, '_');
    document.title = `${safeName}_CV`;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleLoadSample = () => {
    setIsMobileMenuOpen(false);
    if (
      data.profile.fullName &&
      !confirm('¿Cargar datos de ejemplo? Esto reemplazará los datos actuales del formulario.')
    ) {
      return;
    }
    onChange(sampleData);
  };

  const handleClear = () => {
    setIsMobileMenuOpen(false);
    if (confirm('¿Estás seguro de que deseas limpiar todo el formulario?')) {
      onChange(initialData);
    }
  };

  const handleExportJSON = () => {
    setIsMobileMenuOpen(false);
    exportToJSON(data);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMobileMenuOpen(false);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importFromJSON(file);
      onChange(imported);
      alert('¡Datos del CV importados correctamente!');
    } catch (err: any) {
      alert('Error al importar archivo JSON: ' + (err.message || 'Formato inválido'));
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs shrink-0">
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight shrink-0">
              CV Wizard <span className="text-blue-700 font-bold">OS</span>
            </span>
            <span className="hidden lg:inline-block bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              Open Source
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500">
            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{lastSavedText}</span>
          </div>
        </div>
      </div>

      {/* Input de archivo oculto para importar JSON */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json,application/json"
        className="hidden"
      />

      {/* Acciones principales */}
      <div className="flex items-center gap-1.5 sm:gap-2 justify-end shrink-0">
        {/* Acciones para pantallas medianas/grandes (>= 640px) */}
        <button
          type="button"
          onClick={handleLoadSample}
          title="Rellenar formulario con datos de ejemplo realistas"
          className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Ejemplo</span>
        </button>

        <button
          type="button"
          onClick={handleExportJSON}
          title="Descargar copia de respaldo en formato JSON"
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
        >
          <FileJson className="w-3.5 h-3.5 text-blue-600" />
          <span>Exportar</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Cargar un archivo de respaldo JSON"
          className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Importar</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          title="Reiniciar formulario a blanco"
          className="hidden sm:flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Botón Principal: Descargar PDF */}
        <button
          type="button"
          onClick={handlePrintPDF}
          title="Descargar en PDF estándar A4 sin marcas de agua"
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs sm:text-sm rounded-lg shadow-xs transition"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Descargar PDF</span>
        </button>

        {/* Menú de Opciones Móvil (Visible en pantallas < 640px) */}
        <div className="relative sm:hidden" ref={mobileMenuRef}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Más opciones"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition border border-slate-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <MoreVertical className="w-4 h-4" />
            )}
          </button>

          {/* Desplegable móvil */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Opciones del Formulario
              </div>

              <button
                type="button"
                onClick={handleLoadSample}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Cargar Datos de Ejemplo</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
              >
                <FileJson className="w-3.5 h-3.5 text-blue-600" />
                <span>Exportar Respaldo JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Importar Respaldo JSON</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleClear}
                className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-500" />
                <span>Limpiar Formulario</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
