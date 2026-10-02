import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CVData } from '../../types/cv';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { generatePdfBlob, downloadPdfFile } from '../../utils/pdfRenderer';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Smartphone,
  FileText,
  Layout,
  Download,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ResumeViewerProps {
  data: CVData;
}

// 210mm a 96 DPI estándar ≈ 793.7px (usamos 794px)
const A4_WIDTH_PX = 794;
// 297mm a 96 DPI estándar ≈ 1122.5px (usamos 1123px)
const A4_HEIGHT_PX = 1123;

export const ResumeViewer: React.FC<ResumeViewerProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.85);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'html' | 'pdf'>('html');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompilingPdf, setIsCompilingPdf] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Calcula la escala óptima para que la hoja A4 encaje al 100% del ancho del visor
  const calculateFitZoom = useCallback((width: number): number => {
    if (!width || width <= 0) return 0.85;
    // Margen de seguridad horizontal (16px a cada lado en móvil, 32px en desktop)
    const padding = width < 640 ? 24 : 48;
    const availableWidth = Math.max(280, width - padding);
    const fitScale = Number((availableWidth / A4_WIDTH_PX).toFixed(2));
    // Limitar entre 0.35 y 1.25
    return Math.min(1.25, Math.max(0.35, fitScale));
  }, []);

  // Observador de cambio de tamaño del contenedor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      setContainerWidth(rect.width);

      if (isAutoFit) {
        const optimalZoom = calculateFitZoom(rect.width);
        setZoom(optimalZoom);
      }
    };

    // Medición inicial
    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isAutoFit, calculateFitZoom]);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.min(1.6, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.max(0.35, Number((prev - 0.1).toFixed(2))));
  };

  const handleResetZoom = () => {
    setIsAutoFit(false);
    setZoom(1.0); // 100% escala real
  };

  const handleFitWidth = () => {
    setIsAutoFit(true);
    if (containerRef.current) {
      const optimalZoom = calculateFitZoom(containerRef.current.clientWidth);
      setZoom(optimalZoom);
    }
  };

  const currentUrlRef = useRef<string | null>(null);
  const [pdfCompileError, setPdfCompileError] = useState<string | null>(null);

  // Compilación en tiempo real del PDF con debounce (Playground Mode)
  useEffect(() => {
    if (viewMode !== 'pdf') return;

    let isCancelled = false;
    setIsCompilingPdf(true);
    setPdfCompileError(null);

    const timer = setTimeout(async () => {
      try {
        const blob = await generatePdfBlob(data);
        if (isCancelled) return;

        const nextUrl = URL.createObjectURL(blob);
        const oldUrl = currentUrlRef.current;
        currentUrlRef.current = nextUrl;
        setPdfUrl(nextUrl);

        if (oldUrl) {
          setTimeout(() => URL.revokeObjectURL(oldUrl), 1500);
        }
      } catch (err: any) {
        console.error('Error generando vista previa PDF en vivo:', err);
        if (!isCancelled) {
          setPdfCompileError(err?.message || 'Error al compilar PDF');
        }
      } finally {
        if (!isCancelled) {
          setIsCompilingPdf(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [data, viewMode]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
    };
  }, []);

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

  const scaledWidth = Math.round(A4_WIDTH_PX * zoom);
  const scaledHeight = Math.round(A4_HEIGHT_PX * zoom);
  const isMobileScreen =
    typeof window !== 'undefined' &&
    window.innerWidth < 1024 &&
    containerWidth > 0 &&
    containerWidth < 640;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center bg-slate-200/60 overflow-x-hidden overflow-y-auto custom-scrollbar p-3 sm:p-6 preview-viewport select-text"
    >
      {/* Controles flotantes de Zoom y Modo de Vista (No imprimibles) */}
      <div className="no-print sticky top-2 sm:top-3 z-30 mb-3 sm:mb-4 bg-white/95 backdrop-blur-md border border-slate-200 shadow-md rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-700">
        {/* Selector de Modo: HTML vs PDF Real (Playground) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-full mr-0.5">
          <button
            type="button"
            onClick={() => setViewMode('html')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition ${
              viewMode === 'html'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Vista HTML interactiva rápida"
          >
            <Layout className="w-3 h-3" />
            <span className="hidden sm:inline">Diseño Web</span>
            <span className="sm:hidden">Web</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pdf')}
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 transition ${
              viewMode === 'pdf'
                ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Visor PDF vectorial compilado en tiempo real con @react-pdf/renderer (estilo Playground)"
          >
            <FileText className="w-3 h-3" />
            <span className="hidden sm:inline">PDF Real</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        <button
          type="button"
          onClick={handleZoomOut}
          title="Reducir Zoom (-10%)"
          aria-label="Reducir Zoom"
          className="p-1 sm:p-1.5 hover:bg-slate-100 rounded-full transition active:bg-slate-200"
        >
          <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
        </button>

        <span className="w-10 sm:w-12 text-center font-mono font-bold text-[11px] sm:text-xs text-slate-800">
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={handleZoomIn}
          title="Aumentar Zoom (+10%)"
          aria-label="Aumentar Zoom"
          className="p-1 sm:p-1.5 hover:bg-slate-100 rounded-full transition active:bg-slate-200"
        >
          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Botón Ajustar al Ancho */}
        <button
          type="button"
          onClick={handleFitWidth}
          title="Ajustar automáticamente al ancho de la pantalla"
          className={`px-2 py-1 rounded-full transition flex items-center gap-1 text-[11px] font-medium ${
            isAutoFit
              ? 'bg-blue-100 text-blue-800 font-semibold'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Ajustar</span>
        </button>

        {/* Botón Escala Real (100%) */}
        <button
          type="button"
          onClick={handleResetZoom}
          title="Ver en escala real 100%"
          className={`p-1 sm:p-1.5 rounded-full transition ${
            zoom === 1.0 && !isAutoFit
              ? 'bg-blue-100 text-blue-800 font-bold'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        {/* Botón Descarga Directa PDF */}
        <button
          type="button"
          onClick={handleDownloadDirectPDF}
          disabled={isDownloading}
          title="Descargar PDF Vectorial directamente (@react-pdf/renderer)"
          className="px-2.5 py-1 rounded-full transition flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 disabled:opacity-50"
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
          ) : (
            <Download className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span className="hidden sm:inline">Descargar PDF</span>
        </button>
      </div>

      {/* Indicador de ayuda móvil si la hoja está escalada */}
      {isMobileScreen && (
        <div className="no-print mb-2 text-[10px] text-slate-500 flex items-center gap-1 bg-white/70 px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
          <Smartphone className="w-3 h-3 text-blue-600 shrink-0" />
          <span>Vista adaptada a pantalla móvil ({Math.round(zoom * 100)}%)</span>
        </div>
      )}

      {/* Indicador de compilación en segundo plano en modo PDF */}
      {viewMode === 'pdf' && isCompilingPdf && (
        <div className="no-print mb-2 text-[11px] text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shadow-2xs animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
          <span>Compilando PDF vectorial en tiempo real...</span>
        </div>
      )}

      {/* Contenedor de Previsualización: PDF vs HTML */}
      {viewMode === 'pdf' ? (
        <div
          className="zoom-container relative transition-all duration-150 mx-auto"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            minHeight: `${scaledHeight}px`,
            maxWidth: '100%',
          }}
        >
          <div
            className="w-full h-full bg-white shadow-xl sm:shadow-2xl rounded-xs overflow-hidden border border-slate-300 flex flex-col"
            style={{ minHeight: `${scaledHeight}px` }}
          >
            {pdfCompileError ? (
              <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center text-red-500">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-xs font-semibold mb-1">No se pudo compilar el visor PDF</p>
                <p className="text-[11px] text-slate-500 max-w-sm mb-3">{pdfCompileError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setPdfCompileError(null);
                    setIsCompilingPdf(true);
                    generatePdfBlob(data)
                      .then((blob) => {
                        const nextUrl = URL.createObjectURL(blob);
                        currentUrlRef.current = nextUrl;
                        setPdfUrl(nextUrl);
                      })
                      .catch((e) => setPdfCompileError(e.message))
                      .finally(() => setIsCompilingPdf(false));
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
                >
                  Reintentar compilación
                </button>
              </div>
            ) : pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                className="w-full h-full flex-1 border-0"
                title="Visor PDF Realtime"
              />
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
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            minHeight: `${scaledHeight}px`,
            maxWidth: '100%',
          }}
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
              style={{
                width: '210mm',
                minHeight: '297mm',
                boxSizing: 'border-box',
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
