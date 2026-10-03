/**
 * src/components/preview/ResumeViewer.tsx
 * Visor interactivo A4 con soporte para zoom, previsualización HTML y modo Playground PDF.
 * Trazabilidad: US-09, TASK-7.5
 */

import React, { useState } from 'react';
import type { CVData } from '../../types/cv';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { downloadPdfFile } from '../../services/pdf/pdfRenderer';
import { useA4Zoom, A4_WIDTH_PX, A4_HEIGHT_PX } from './hooks/useA4Zoom';
import { useLivePdfPreview } from './hooks/useLivePdfPreview';
import { ViewerToolbar } from './ViewerToolbar';
import { Smartphone, Loader2, AlertCircle } from 'lucide-react';

interface ResumeViewerProps {
  data: CVData;
}

/**
 * [COMPONENTE] Contenedor de visualización y pruebas de impresión A4 en tiempo real.
 */
export const ResumeViewer: React.FC<ResumeViewerProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'html' | 'pdf'>('html');
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    containerRef,
    zoom,
    isAutoFit,
    zoomIn,
    zoomOut,
    resetZoom,
    fitWidth,
    scaledWidth,
    scaledHeight,
    isMobileScreen,
  } = useA4Zoom();

  const { pdfUrl, isCompilingPdf, pdfCompileError, retryCompile } = useLivePdfPreview(data, viewMode);

  const handleDownloadDirectPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadPdfFile(data, data.profile.fullName || 'Curriculum_Vitae');
    } catch (err) {
      console.error('Error descargando PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTemplate = () => {
    switch (data.settings.templateId) {
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center bg-slate-200/60 dark:bg-slate-950/60 overflow-x-hidden overflow-y-auto custom-scrollbar p-3 sm:p-6 preview-viewport select-text"
    >
      <ViewerToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        zoom={zoom}
        isAutoFit={isAutoFit}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        onFitWidth={fitWidth}
        onDownloadDirectPDF={handleDownloadDirectPDF}
        isDownloading={isDownloading}
      />

      {isMobileScreen && (
        <div className="no-print mb-2 text-[10px] text-slate-500 flex items-center gap-1 bg-white/70 dark:bg-slate-900/70 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-800 shadow-2xs">
          <Smartphone className="w-3 h-3 text-blue-600 shrink-0" />
          <span>Vista adaptada a pantalla móvil ({Math.round(zoom * 100)}%)</span>
        </div>
      )}

      {viewMode === 'pdf' && isCompilingPdf && (
        <div className="no-print mb-2 text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900 shadow-2xs animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
          <span>Compilando PDF vectorial en tiempo real...</span>
        </div>
      )}

      {viewMode === 'pdf' ? (
        <div
          className="zoom-container relative transition-all duration-150 mx-auto"
          style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px`, minHeight: `${scaledHeight}px`, maxWidth: '100%' }}
        >
          <div
            className="w-full h-full bg-white shadow-xl sm:shadow-2xl rounded-xs overflow-hidden border border-slate-300 dark:border-slate-700 flex flex-col"
            style={{ minHeight: `${scaledHeight}px` }}
          >
            {pdfCompileError ? (
              <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center text-red-500">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-xs font-semibold mb-1">No se pudo compilar el visor PDF</p>
                <p className="text-[11px] text-slate-500 max-w-sm mb-3">{pdfCompileError}</p>
                <button
                  type="button"
                  onClick={retryCompile}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
                >
                  Reintentar compilación
                </button>
              </div>
            ) : pdfUrl ? (
              <iframe src={`${pdfUrl}#toolbar=0&navpanes=0`} className="w-full h-full flex-1 border-0" title="Visor PDF Realtime" />
            ) : (
              <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                <p className="text-xs font-medium">Compilando documento con @react-pdf/renderer...</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="zoom-container relative transition-all duration-150 mx-auto"
          style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px`, minHeight: `${scaledHeight}px`, maxWidth: '100%' }}
        >
          <div
            className="zoom-wrapper absolute top-0 left-0 transition-transform duration-150"
            style={{
              transformOrigin: '0 0',
              transform: `scale(${zoom})`,
              width: `${A4_WIDTH_PX}px`,
              minHeight: `${A4_HEIGHT_PX}px`,
            }}
          >
            <div
              id="cv-print-area"
              className="a4-sheet bg-white shadow-xl sm:shadow-2xl rounded-xs overflow-hidden"
              style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
