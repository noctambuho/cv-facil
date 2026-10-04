import React, { useState, useEffect } from 'react';
import type {
  Profile,
  ExperienceItem,
  EducationItem,
  SkillItem,
  LanguageItem,
  CVSettings,
} from '../../types/cv';
import { useEditorDocument } from './hooks/useEditorDocument';
import { useAutoSave } from './hooks/useAutoSave';
import { useDriveSessionBoot } from './hooks/useDriveSessionBoot';
import { EditorToolbar } from './EditorToolbar';
import { FloatingStyleDock } from './FloatingStyleDock';
import { ExportModal } from './ExportModal';
import { GoogleDriveConfigModal } from '../lobby/GoogleDriveConfigModal';
import { googleDriveAdapter, setActiveProvider } from '../../services/storage';
import { ProfileEditor } from './sections/ProfileEditor';
import { ExperienceEditor } from './sections/ExperienceEditor';
import { EducationEditor } from './sections/EducationEditor';
import { SkillsEditor } from './sections/SkillsEditor';
import { LanguagesEditor } from './sections/LanguagesEditor';
import { ResumeViewer } from '../preview/ResumeViewer';
import { Edit3, Eye, ArrowLeft, Sparkles } from 'lucide-react';


/**
 * ResumeEditorApp: Isla interactiva principal del Editor (/editor).
 * Responsabilidad: Orquestar el layout split-screen, navegación móvil y modales.
 * La gestión del ciclo de vida y autoguardado se delega a custom hooks especializados (SRP).
 *
 * Trazabilidad: US-07, US-08, US-09, US-10, TASK-2.5.1, TASK-2.5.2
 */
export const ResumeEditorApp: React.FC = () => {
  const {
    documentId,
    documentTitle,
    data,
    setData,
    isLoading,
    isAutoExportRequested,
    handleTitleChange,
  } = useEditorDocument();

  const { lastSavedText } = useAutoSave({
    data,
    documentTitle,
    documentId,
  });

  const { isDriveConfigModalOpen, setIsDriveConfigModalOpen } = useDriveSessionBoot();

  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const handleConnectDrive = async (newClientId: string) => {
    await googleDriveAdapter.authenticate(newClientId);
    setActiveProvider('drive');
    setIsDriveConfigModalOpen(false);
  };

  // Apertura automática si la URL contenía &export=true

  useEffect(() => {
    if (isAutoExportRequested && !isLoading) {
      setIsExportModalOpen(true);
    }
  }, [isAutoExportRequested, isLoading]);

  // Actualizadores granulares por sección
  const updateProfile = (profile: Profile) => setData((prev) => ({ ...prev, profile }));
  const updateExperiences = (experiences: ExperienceItem[]) =>
    setData((prev) => ({ ...prev, experiences }));
  const updateEducation = (education: EducationItem[]) =>
    setData((prev) => ({ ...prev, education }));
  const updateSkills = (skills: SkillItem[]) => setData((prev) => ({ ...prev, skills }));
  const updateLanguages = (languages: LanguageItem[]) =>
    setData((prev) => ({ ...prev, languages }));
  const updateSettings = (settings: CVSettings) => setData((prev) => ({ ...prev, settings }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Cargando editor y datos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Barra de Herramientas del Editor */}
      <EditorToolbar
        data={data}
        onChange={setData}
        documentTitle={documentTitle}
        onTitleChange={handleTitleChange}
        lastSavedText={lastSavedText}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Pestañas fijas de navegación en móviles (< 1024px) */}
      <nav
        aria-label="Pestañas de la aplicación"
        className="no-print lg:hidden sticky top-[53px] sm:top-[57px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-center gap-2 shadow-2xs"
      >
        <button
          type="button"
          onClick={() => setActiveMobileTab('editor')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
            activeMobileTab === 'editor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
          className={`editor-pane w-full lg:w-[48%] xl:w-[46%] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto custom-scrollbar p-3 sm:p-5 lg:p-6 space-y-3.5 sm:space-y-4 ${
            activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Mensaje de orientación móvil */}
          <div className="lg:hidden p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Modo Móvil:</span> Completa los campos y usa la pestaña
              superior para previsualizar o exportar tu CV.
            </div>
          </div>

          <ProfileEditor profile={data.profile} onChange={updateProfile} />
          <ExperienceEditor experiences={data.experiences} onChange={updateExperiences} />
          <EducationEditor education={data.education} onChange={updateEducation} />
          <SkillsEditor skills={data.skills} onChange={updateSkills} />
          <LanguagesEditor languages={data.languages} onChange={updateLanguages} />

          {/* Espacio para que el dock flotante no tape contenido */}
          <div className="h-20" />
        </main>

        {/* Panel Derecho: Previsualización A4 en Vivo */}
        <aside
          aria-label="Previsualización del CV"
          className={`preview-pane flex-1 min-w-0 bg-slate-200/80 dark:bg-slate-950/80 p-2 sm:p-4 lg:p-8 overflow-auto ${
            activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResumeViewer data={data} />
          <div className="h-20 lg:hidden" />
        </aside>
      </div>

      {/* Menú Flotante de Estilos (TASK-2.5.1) */}
      <FloatingStyleDock
        settings={data.settings}
        onChange={updateSettings}
      />

      {/* Diálogo Inteligente de Exportación (US-09, TASK-2.5.2) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
        documentId={documentId}
        documentTitle={documentTitle}
      />

      {/* Diálogo de Configuración Directa de Google Drive (US-12, TASK-8.4) */}
      <GoogleDriveConfigModal
        isOpen={isDriveConfigModalOpen}
        onClose={() => setIsDriveConfigModalOpen(false)}
        onConnect={handleConnectDrive}
        initialClientId={googleDriveAdapter.getClientId()}
      />


      {/* Botón Flotante Móvil Alternar Vista */}
      <div className="no-print lg:hidden fixed bottom-5 left-5 z-40">
        {activeMobileTab === 'editor' ? (
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-lg transition transform active:scale-95 border border-white/20"
          >
            <Eye className="w-4 h-4" />
            <span>Ver A4</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setActiveMobileTab('editor')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow-lg transition transform active:scale-95 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Editar</span>
          </button>
        )}
      </div>
    </div>
  );
};
