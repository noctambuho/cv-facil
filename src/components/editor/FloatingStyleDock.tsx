/**
 * src/components/editor/FloatingStyleDock.tsx
 * Dock flotante inferior para cambiar plantilla, paleta de colores y tipografía en vivo.
 * Trazabilidad: US-09, TASK-7.4
 */

import React, { useState, useRef } from 'react';
import type { CVSettings } from '../../types/cv';
import { TEMPLATES, FONTS, ACCENT_COLORS } from '../../domain/catalogs';
import { useClickOutside } from '../common/hooks/useClickOutside';
import { Palette, Check, ChevronUp } from 'lucide-react';

export interface FloatingStyleDockProps {
  settings: CVSettings;
  onChange: (updated: CVSettings) => void;
}

/**
 * [COMPONENTE] Menú flotante colapsable para personalización visual del CV.
 */
export const FloatingStyleDock: React.FC<FloatingStyleDockProps> = ({ settings, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  useClickOutside(dockRef, () => setIsOpen(false), isOpen);

  const updateSetting = <K extends keyof CVSettings>(key: K, value: CVSettings[K]) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div ref={dockRef} className="fixed bottom-6 right-6 z-40 select-none">
      {/* Panel Desplegable */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>Estilo y Diseño del CV</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">En vivo</span>
          </div>

          {/* Plantilla A4 */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Plantilla de Maquetación
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => updateSetting('templateId', tmpl.id)}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                    settings.templateId === tmpl.id
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">{tmpl.name}</span>
                  {tmpl.badge && (
                    <span className="text-[9px] px-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-normal">
                      {tmpl.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Paleta de Colores de Acento */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Color de Acento
            </label>
            <div className="flex items-center gap-2">
              {ACCENT_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => updateSetting('accentColor', hex)}
                  title={hex}
                  style={{ backgroundColor: hex }}
                  className="w-7 h-7 rounded-full transition-transform active:scale-90 flex items-center justify-center shadow-2xs hover:scale-105"
                >
                  {settings.accentColor === hex && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tipografía */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Familia Tipográfica
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => updateSetting('fontFamily', font.id)}
                  className={`p-2 rounded-xl border text-center transition ${font.className} ${
                    settings.fontFamily === font.id
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">{font.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Botón Disparador Flotante */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir panel de estilos"
        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 text-xs font-semibold"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Diseño y Estilo</span>
        <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};
