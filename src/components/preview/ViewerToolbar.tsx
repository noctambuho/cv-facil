/**
 * src/components/preview/ViewerToolbar.tsx
 * Barra flotante de controles para escala de zoom, selector de modo y descarga directa.
 * Trazabilidad: US-09, TASK-7.5
 */

import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  FileText,
  Layout,
  Download,
  Loader2,
} from 'lucide-react';

export interface ViewerToolbarProps {
  viewMode: 'html' | 'pdf';
  onViewModeChange: (mode: 'html' | 'pdf') => void;
  zoom: number;
  isAutoFit: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitWidth: () => void;
  onDownloadDirectPDF: () => void;
  isDownloading: boolean;
}

/**
 * [COMPONENTE] Barra de herramientas flotante del visor A4.
 */
export const ViewerToolbar: React.FC<ViewerToolbarProps> = ({
  viewMode,
  onViewModeChange,
  zoom,
  isAutoFit,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitWidth,
  onDownloadDirectPDF,
  isDownloading,
}) => {
  return (
    <div className="no-print sticky top-2 sm:top-3 z-30 mb-3 sm:mb-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-md rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-700 dark:text-slate-300">
      {/* Selector de Modo: HTML vs PDF Real */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-full mr-0.5">
        <button
          type="button"
          onClick={() => onViewModeChange('html')}
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition ${
            viewMode === 'html'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
          title="Vista HTML interactiva rápida"
        >
          <Layout className="w-3 h-3" />
          <span className="hidden sm:inline">Diseño Web</span>
          <span className="sm:hidden">Web</span>
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('pdf')}
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition ${
            viewMode === 'pdf'
              ? 'bg-blue-600 text-white shadow-2xs font-semibold'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
          title="Visor PDF vectorial compilado en tiempo real"
        >
          <FileText className="w-3 h-3" />
          <span className="hidden sm:inline">PDF Real</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

      {/* Controles de Zoom */}
      <button
        type="button"
        onClick={onZoomOut}
        title="Reducir Zoom (-10%)"
        aria-label="Reducir Zoom"
        className="p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
      >
        <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
      </button>

      <span className="w-10 sm:w-12 text-center font-mono font-bold text-[11px] sm:text-xs text-slate-800 dark:text-slate-200">
        {Math.round(zoom * 100)}%
      </span>

      <button
        type="button"
        onClick={onZoomIn}
        title="Aumentar Zoom (+10%)"
        aria-label="Aumentar Zoom"
        className="p-1 sm:p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
      >
        <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
      </button>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

      {/* Botón Ajustar al Ancho */}
      <button
        type="button"
        onClick={onFitWidth}
        title="Ajustar automáticamente al ancho"
        className={`px-2 py-1 rounded-full transition flex items-center gap-1 text-[11px] font-medium ${
          isAutoFit
            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-semibold'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
        }`}
      >
        <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span>Ajustar</span>
      </button>

      {/* Botón Escala Real 100% */}
      <button
        type="button"
        onClick={onResetZoom}
        title="Escala 100%"
        className={`p-1 sm:p-1.5 rounded-full transition ${
          zoom === 1.0 && !isAutoFit
            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
      >
        <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

      {/* Botón Descarga Directa */}
      <button
        type="button"
        onClick={onDownloadDirectPDF}
        disabled={isDownloading}
        title="Descargar PDF Vectorial directamente"
        className="px-2.5 py-1 rounded-full transition flex items-center gap-1 text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 disabled:opacity-50"
      >
        {isDownloading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
        ) : (
          <Download className="w-3.5 h-3.5 text-blue-600" />
        )}
        <span className="hidden sm:inline">Descargar PDF</span>
      </button>
    </div>
  );
};
