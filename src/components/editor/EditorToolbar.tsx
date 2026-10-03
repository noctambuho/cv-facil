import React, { useRef, useState, useEffect } from 'react';
import type { CVData } from '../../types/cv';
import { sampleData } from '../../data/sampleData';
import { initialData } from '../../data/initialData';
import { getRoute } from '../../services/browser/navigation';
import {
  Download,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  MoreVertical,
  X,
  Edit2,
} from 'lucide-react';

export interface EditorToolbarProps {
  data: CVData;
  onChange: (updated: CVData) => void;
  documentTitle: string;
  onTitleChange: (newTitle: string) => void;
  lastSavedText: string;
  onOpenExportModal: () => void;
}

/**
 * EditorToolbar: Barra superior del Editor con gestión del título del documento,
 * estado de autoguardado, enlace al Lobby y botón principal de exportación (US-09).
 * Trazabilidad: US-07, US-09, TASK-2.5.1
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  data,
  onChange,
  documentTitle,
  onTitleChange,
  lastSavedText,
  onOpenExportModal,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(documentTitle);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleInput(documentTitle);
  }, [documentTitle]);

  // Cerrar menú móvil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
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

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim() && titleInput.trim() !== documentTitle) {
      onTitleChange(titleInput.trim());
    } else {
      setTitleInput(documentTitle);
    }
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

  return (
    <header className="no-print sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 transition-colors">
      {/* Botón Volver al Lobby y Título del Documento */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <a
          href={getRoute('/lobby')}
          title="Volver al Lobby de documentos"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </a>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={titleInput}
                autoFocus
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleSubmit();
                  if (e.key === 'Escape') {
                    setTitleInput(documentTitle);
                    setIsEditingTitle(false);
                  }
                }}
                className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-500 focus-visible:outline-hidden"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate hover:text-blue-600 dark:hover:text-blue-400 transition group text-left"
                title="Haz clic para renombrar este currículum"
              >
                <span className="truncate">{documentTitle || 'Currículum sin título'}</span>
                <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 shrink-0" />
            <span className="truncate">{lastSavedText}</span>
          </div>
        </div>
      </div>

      {/* Acciones del Editor */}
      <div className="flex items-center gap-1.5 sm:gap-2 justify-end shrink-0">
        <button
          type="button"
          onClick={handleLoadSample}
          title="Rellenar formulario con datos de ejemplo realistas"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Ejemplo</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          title="Reiniciar formulario a blanco"
          className="hidden sm:flex p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Botón Principal: Abrir Diálogo de Exportación (US-09) */}
        <button
          type="button"
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg shadow-2xs transition transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Descargar / Exportar</span>
        </button>

        {/* Menú de Opciones Móvil */}
        <div className="relative sm:hidden" ref={mobileMenuRef}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Más opciones"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition border border-slate-200 dark:border-slate-700"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
          </button>

          {isMobileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in duration-100">
              <button
                type="button"
                onClick={handleLoadSample}
                className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Cargar Ejemplo</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="w-full px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 transition"
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
