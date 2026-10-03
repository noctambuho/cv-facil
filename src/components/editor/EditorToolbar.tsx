/**
 * src/components/editor/EditorToolbar.tsx
 * Barra superior del Editor con título editable, estado de autoguardado y acciones de exportación.
 * Trazabilidad: US-07, US-09, TASK-7.4
 */

import React, { useRef, useState, useEffect } from 'react';
import type { CVData } from '../../types/cv';
import { sampleData } from '../../data/sampleData';
import { initialData } from '../../data/initialData';
import { getRoute } from '../../services/browser/navigation';
import { useClickOutside } from '../common/hooks/useClickOutside';
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
 * [COMPONENTE] Barra de herramientas global del editor de CV.
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

  useClickOutside(mobileMenuRef, () => setIsMobileMenuOpen(false), isMobileMenuOpen);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    const clean = titleInput.trim();
    if (clean && clean !== documentTitle) {
      onTitleChange(clean);
    } else {
      setTitleInput(documentTitle);
    }
  };

  const handleLoadSample = () => {
    if (data.profile.fullName && data.profile.fullName !== 'Nuevo Currículum') {
      const confirm = window.confirm(
        '¿Cargar los datos de ejemplo? Esto reemplazará la información actual en el formulario.'
      );
      if (!confirm) return;
    }
    onChange({ ...sampleData });
    setIsMobileMenuOpen(false);
  };

  const handleClear = () => {
    const confirm = window.confirm(
      '¿Limpiar todos los campos del currículum? Esta acción no se puede deshacer.'
    );
    if (confirm) {
      onChange({ ...initialData });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Lado izquierdo: Regreso al Lobby y Título Editable */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a
            href={getRoute('/lobby')}
            title="Volver al Lobby de documentos"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>

          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleInput(documentTitle);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-blue-500 focus:outline-hidden max-w-[180px] sm:max-w-xs"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              title="Haz clic para renombrar este documento"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition truncate max-w-[180px] sm:max-w-xs text-left group"
            >
              <span className="truncate">{documentTitle || 'Currículum sin título'}</span>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </button>
          )}

          {/* Indicador de Autoguardado */}
          <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lastSavedText}</span>
          </div>
        </div>

        {/* Lado derecho: Acciones y Botón de Descarga */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ejemplo</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          </div>

          {/* Botón Principal Exportar */}
          <button
            type="button"
            onClick={onOpenExportModal}
            className="px-3 sm:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>

          {/* Menú de opciones móvil */}
          <div className="relative sm:hidden" ref={mobileMenuRef}>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Más acciones"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cargar Ejemplo</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar Formulario</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
