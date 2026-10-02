import React, { useState, useRef, useEffect } from 'react';
import type { CVSettings, TemplateId, FontFamily } from '../../types/cv';
import { Palette, X, Sparkles, Check, Type, Layout, Image as ImageIcon } from 'lucide-react';

export interface FloatingStyleDockProps {
  settings: CVSettings;
  onChange: (updated: CVSettings) => void;
  hasProfilePhoto?: boolean;
}

const ACCENT_COLORS = [
  { name: 'Azul Zafiro', hex: '#1e40af' },
  { name: 'Azul Marino', hex: '#0f172a' },
  { name: 'Verde Esmeralda', hex: '#059669' },
  { name: 'Índigo Real', hex: '#4f46e5' },
  { name: 'Rubí Borgoña', hex: '#9f1239' },
  { name: 'Ámbar Cálido', hex: '#d97706' },
];

const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: 'modern', label: 'Moderna', desc: 'Columna lateral oscura y acentos vivos' },
  { id: 'classic', label: 'Clásica', desc: 'Elegancia simétrica y encabezado centrado' },
  { id: 'minimal', label: 'Minimalista', desc: 'Diseño limpio en blanco y negro' },
];

const FONTS: { id: FontFamily; label: string; preview: string }[] = [
  { id: 'sans', label: 'Inter (Sans)', preview: 'Aa Sans' },
  { id: 'serif', label: 'Merriweather (Serif)', preview: 'Aa Serif' },
  { id: 'mono', label: 'JetBrains (Mono)', preview: 'Aa Mono' },
];

/**
 * FloatingStyleDock: Menú flotante ubicado en la esquina inferior derecha para
 * personalización instantánea de plantilla, paleta de colores, tipografía y foto.
 * Trazabilidad: US-01, specs/05b-design-landing-lobby.md (Sección 5), TASK-2.5.1
 */
export const FloatingStyleDock: React.FC<FloatingStyleDockProps> = ({
  settings,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const updateSetting = <K extends keyof CVSettings>(key: K, value: CVSettings[K]) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div
      ref={dockRef}
      className="no-print fixed bottom-5 sm:bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end"
    >
      {/* Panel Desplegable Flotante */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-800 dark:text-slate-200 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Estilo y Personalización</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              aria-label="Cerrar panel de estilo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 1. Selector de Plantilla */}
          <div className="space-y-2">
            <span className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Layout className="w-3.5 h-3.5" />
              <span>Plantilla Visual</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => updateSetting('templateId', tmpl.id)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    settings.templateId === tmpl.id
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs">{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color de Acento */}
          <div className="space-y-2">
            <span className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Color de Acento</span>
            </span>
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {ACCENT_COLORS.map((col) => {
                const isSelected = settings.accentColor.toLowerCase() === col.hex.toLowerCase();
                return (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => updateSetting('accentColor', col.hex)}
                    title={col.name}
                    style={{ backgroundColor: col.hex }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform flex items-center justify-center text-white ${
                      isSelected
                        ? 'ring-2 ring-offset-2 ring-blue-600 dark:ring-offset-slate-900 scale-110 shadow-sm'
                        : 'hover:scale-105'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Tipografía */}
          <div className="space-y-2">
            <span className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span>Tipografía</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => updateSetting('fontFamily', f.id)}
                  className={`p-2 rounded-xl border text-center transition ${
                    settings.fontFamily === f.id
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold shadow-2xs'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs block">{f.label.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400 block">{f.preview}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Opciones de Visualización */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            {/* Switch Foto de Perfil */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Mostrar Foto en Encabezado</span>
              </span>
              <input
                type="checkbox"
                checked={settings.showPhoto !== false}
                onChange={(e) => updateSetting('showPhoto', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
              />
            </label>

            {/* Switch Iconos */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>Iconos en Secciones</span>
              </span>
              <input
                type="checkbox"
                checked={settings.showIcons}
                onChange={(e) => updateSetting('showIcons', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
              />
            </label>
          </div>
        </div>
      )}

      {/* Botón Flotante Disparador (Floating Action Button) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir panel flotante de estilo"
        title="Personalizar estilo, plantilla y colores"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 select-none group"
      >
        <div
          className="w-4 h-4 rounded-full shadow-inner border border-white/40"
          style={{ backgroundColor: settings.accentColor }}
        />
        <span className="font-bold text-xs">Estilos</span>
        <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
