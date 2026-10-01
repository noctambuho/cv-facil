import React, { useState, useEffect, useRef } from 'react';
import type { CVData, Profile, ExperienceItem, EducationItem, SkillItem, LanguageItem, CVSettings } from '../types/cv';
import { loadCVData, saveCVData } from '../utils/storage';
import { sampleData } from '../data/sampleData';
import { Toolbar } from './ui/Toolbar';
import { ProfileEditor } from './ui/editor/ProfileEditor';
import { ExperienceEditor } from './ui/editor/ExperienceEditor';
import { EducationEditor } from './ui/editor/EducationEditor';
import { SkillsEditor } from './ui/editor/SkillsEditor';
import { LanguagesEditor } from './ui/editor/LanguagesEditor';
import { SettingsEditor } from './ui/editor/SettingsEditor';
import { ResumeViewer } from './preview/ResumeViewer';
import { Edit3, Eye, ArrowLeft, Sparkles } from 'lucide-react';

export const CVApp: React.FC = () => {
  const [data, setData] = useState<CVData>(() => {
    if (typeof window !== 'undefined') {
      const stored = loadCVData();
      if (!stored.profile.fullName) {
        return sampleData;
      }
      return stored;
    }
    return sampleData;
  });

  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [lastSavedText, setLastSavedText] = useState<string>('Guardado automático');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-guardado en localStorage con debounce de 500ms
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setLastSavedText('Guardando...');

    debounceTimerRef.current = setTimeout(() => {
      saveCVData(data);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedText(`Guardado a las ${timeStr}`);
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [data]);

  const updateProfile = (profile: Profile) => setData((prev) => ({ ...prev, profile }));
  const updateExperiences = (experiences: ExperienceItem[]) => setData((prev) => ({ ...prev, experiences }));
  const updateEducation = (education: EducationItem[]) => setData((prev) => ({ ...prev, education }));
  const updateSkills = (skills: SkillItem[]) => setData((prev) => ({ ...prev, skills }));
  const updateLanguages = (languages: LanguageItem[]) => setData((prev) => ({ ...prev, languages }));
  const updateSettings = (settings: CVSettings) => setData((prev) => ({ ...prev, settings }));

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Barra de Herramientas Global */}
      <Toolbar data={data} onChange={setData} lastSavedText={lastSavedText} />

      {/* Pestañas fijas de navegación en pantallas móviles y tablets (< 1024px) */}
      <nav
        aria-label="Pestañas de la aplicación"
        className="no-print lg:hidden sticky top-[53px] sm:top-[57px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-1.5 flex items-center justify-center gap-2 shadow-2xs"
      >
        <button
          type="button"
          onClick={() => setActiveMobileTab('editor')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeMobileTab === 'editor'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor de Datos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileTab('preview')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeMobileTab === 'preview'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vista Previa A4</span>
          <span className="ml-1 text-[10px] py-0.5 px-1.5 rounded-full bg-white/20 text-white font-mono uppercase">
            {data.settings.templateId}
          </span>
        </button>
      </nav>

      {/* Contenedor Principal Split-Screen */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Panel Izquierdo: Formularios del Editor */}
        <main
          className={`editor-pane w-full lg:w-[48%] xl:w-[46%] bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar p-3 sm:p-5 lg:p-6 space-y-3.5 sm:space-y-4 ${
            activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Tarjeta de bienvenida rápida para nuevos usuarios en móvil */}
          <div className="lg:hidden p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Modo Móvil Activo:</span> Completa los campos y usa la pestaña superior o el botón flotante para previsualizar tu CV en formato A4 listo para imprimir.
            </div>
          </div>

          <ProfileEditor profile={data.profile} onChange={updateProfile} />
          <ExperienceEditor experiences={data.experiences} onChange={updateExperiences} />
          <EducationEditor education={data.education} onChange={updateEducation} />
          <SkillsEditor skills={data.skills} onChange={updateSkills} />
          <LanguagesEditor languages={data.languages} onChange={updateLanguages} />
          <SettingsEditor settings={data.settings} onChange={updateSettings} />

          {/* Espaciador inferior para no tapar el último formulario con el botón flotante */}
          <div className="h-16 lg:hidden" />
        </main>

        {/* Panel Derecho: Previsualización A4 en Vivo */}
        <aside
          aria-label="Previsualización del CV"
          className={`preview-pane flex-1 min-w-0 bg-slate-200/80 p-2 sm:p-4 lg:p-8 overflow-auto ${
            activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResumeViewer data={data} />

          {/* Espaciador inferior móvil */}
          <div className="h-16 lg:hidden" />
        </aside>
      </div>

      {/* Botón Flotante Móvil de Acción Rápida (FAB) */}
      <div className="no-print lg:hidden fixed bottom-4 right-4 z-40">
        {activeMobileTab === 'editor' ? (
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-full shadow-lg transition transform active:scale-95 border border-white/20"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Previsualización</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveMobileTab('editor')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-lg transition transform active:scale-95 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Editor</span>
          </button>
        )}
      </div>
    </div>
  );
};
