import React from 'react';
import type { CVSettings, TemplateId, FontFamily } from '../../types/cv';
import { SectionCard } from './SectionCard';
import { Palette, LayoutTemplate, Type, Check } from 'lucide-react';

interface SettingsEditorProps {
  settings: CVSettings;
  onChange: (updated: CVSettings) => void;
}

const colorPresets = [
  { name: 'Azul CV Wizard', hex: '#1e40af' },
  { name: 'Azul Zafiro', hex: '#0284c7' },
  { name: 'Verde Esmeralda', hex: '#059669' },
  { name: 'Púrpura Elegante', hex: '#7c3aed' },
  { name: 'Gris Ejecutivo', hex: '#334155' },
  { name: 'Carmesí Moderno', hex: '#dc2626' }
];

export const SettingsEditor: React.FC<SettingsEditorProps> = ({ settings, onChange }) => {
  const handleTemplateChange = (templateId: TemplateId) => {
    onChange({ ...settings, templateId });
  };

  const handleColorChange = (accentColor: string) => {
    onChange({ ...settings, accentColor });
  };

  const handleFontChange = (fontFamily: FontFamily) => {
    onChange({ ...settings, fontFamily });
  };

  return (
    <SectionCard title="Personalización y Estilo de Plantilla" icon={<Palette className="w-4 h-4" />}>
      {/* Selector de Plantilla */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
          <span>Seleccionar Diseño de Plantilla:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Plantilla Moderna */}
          <button
            type="button"
            onClick={() => handleTemplateChange('modern')}
            className={`p-3 rounded-xl border text-left transition flex sm:flex-col justify-between items-start gap-2 ${
              settings.templateId === 'modern'
                ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-slate-900">Moderna</span>
              <span className="text-[11px] sm:text-[10px] text-slate-500 leading-tight">Sidebar lateral oscuro y acentos visuales</span>
            </div>
            {settings.templateId === 'modern' ? (
              <span className="shrink-0 text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1 sm:mt-2">
                <Check className="w-3 h-3" /> Activa
              </span>
            ) : (
              <span className="shrink-0 text-[10px] text-slate-400 sm:hidden">Elegir</span>
            )}
          </button>

          {/* Plantilla Clásica */}
          <button
            type="button"
            onClick={() => handleTemplateChange('classic')}
            className={`p-3 rounded-xl border text-left transition flex sm:flex-col justify-between items-start gap-2 ${
              settings.templateId === 'classic'
                ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-slate-900">Clásica</span>
              <span className="text-[11px] sm:text-[10px] text-slate-500 leading-tight">Centrada, líneas sobrias y estilo ejecutivo</span>
            </div>
            {settings.templateId === 'classic' ? (
              <span className="shrink-0 text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1 sm:mt-2">
                <Check className="w-3 h-3" /> Activa
              </span>
            ) : (
              <span className="shrink-0 text-[10px] text-slate-400 sm:hidden">Elegir</span>
            )}
          </button>

          {/* Plantilla Minimalista */}
          <button
            type="button"
            onClick={() => handleTemplateChange('minimal')}
            className={`p-3 rounded-xl border text-left transition flex sm:flex-col justify-between items-start gap-2 ${
              settings.templateId === 'minimal'
                ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-slate-900">Minimalista</span>
              <span className="text-[11px] sm:text-[10px] text-slate-500 leading-tight">Monocolumna limpia con enfoque técnico</span>
            </div>
            {settings.templateId === 'minimal' ? (
              <span className="shrink-0 text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1 sm:mt-2">
                <Check className="w-3 h-3" /> Activa
              </span>
            ) : (
              <span className="shrink-0 text-[10px] text-slate-400 sm:hidden">Elegir</span>
            )}
          </button>
        </div>
      </div>

      {/* Selector de Color de Acento */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          <span>Color de Acento del CV:</span>
        </label>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {colorPresets.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => handleColorChange(preset.hex)}
              title={preset.name}
              className={`w-8 h-8 rounded-full transition-transform shadow-2xs ${
                settings.accentColor === preset.hex
                  ? 'scale-110 ring-2 ring-offset-2 ring-blue-600'
                  : 'hover:scale-105 active:scale-95'
              }`}
              style={{ backgroundColor: preset.hex }}
            />
          ))}

          {/* Selector de color personalizado */}
          <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-slate-200">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-8 h-8 rounded-full cursor-pointer border border-slate-200 p-0 bg-transparent overflow-hidden"
              title="Elegir color personalizado"
            />
            <span className="font-mono text-[11px] text-slate-600 uppercase font-semibold">{settings.accentColor}</span>
          </div>
        </div>
      </div>

      {/* Tipografía */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-blue-600" />
          <span>Familia Tipográfica del CV:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleFontChange('sans')}
            className={`py-2 px-3 rounded-lg border text-xs font-sans transition flex items-center justify-between sm:justify-center ${
              settings.fontFamily === 'sans'
                ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-900 ring-1 ring-blue-600/30'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Inter (Sans-Serif)</span>
            {settings.fontFamily === 'sans' && <Check className="w-3.5 h-3.5 text-blue-700 sm:hidden" />}
          </button>

          <button
            type="button"
            onClick={() => handleFontChange('serif')}
            className={`py-2 px-3 rounded-lg border text-xs font-serif transition flex items-center justify-between sm:justify-center ${
              settings.fontFamily === 'serif'
                ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-900 ring-1 ring-blue-600/30'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Merriweather (Serif)</span>
            {settings.fontFamily === 'serif' && <Check className="w-3.5 h-3.5 text-blue-700 sm:hidden" />}
          </button>

          <button
            type="button"
            onClick={() => handleFontChange('mono')}
            className={`py-2 px-3 rounded-lg border text-xs font-mono transition flex items-center justify-between sm:justify-center ${
              settings.fontFamily === 'mono'
                ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-900 ring-1 ring-blue-600/30'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>JetBrains (Mono)</span>
            {settings.fontFamily === 'mono' && <Check className="w-3.5 h-3.5 text-blue-700 sm:hidden" />}
          </button>
        </div>
      </div>
    </SectionCard>
  );
};
