import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CVData } from '../../types/cv';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Smartphone, Monitor } from 'lucide-react';

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
      {/* Controles flotantes de Zoom (No imprimibles) */}
      <div className="no-print sticky top-2 sm:top-3 z-30 mb-3 sm:mb-4 bg-white/95 backdrop-blur-md border border-slate-200 shadow-md rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 text-xs text-slate-700">
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
      </div>

      {/* Indicador de ayuda móvil si la hoja está escalada */}
      {isMobileScreen && (
        <div className="no-print mb-2 text-[10px] text-slate-500 flex items-center gap-1 bg-white/70 px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
          <Smartphone className="w-3 h-3 text-blue-600 shrink-0" />
          <span>Vista adaptada a pantalla móvil ({Math.round(zoom * 100)}%)</span>
        </div>
      )}

      {/* 
        Contenedor escalable con compensación de dimensiones visuales exactas:
        El contenedor exterior mide exactamente scaledWidth x scaledHeight y se centra con margin: 0 auto.
        El zoom-wrapper interior escala desde (0, 0) ocupando el 100% exacto del contenedor exterior.
      */}
      <div
        className="zoom-container relative transition-all duration-150 mx-auto"
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          minHeight: `${scaledHeight}px`,
          maxWidth: '100%'
        }}
      >
        <div
          className="zoom-wrapper absolute top-0 left-0 transition-transform duration-150"
          style={{
            transformOrigin: '0 0',
            transform: `scale(${zoom})`,
            width: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`
          }}
        >
          <div
            id="cv-print-area"
            className="a4-sheet bg-white shadow-xl sm:shadow-2xl rounded-xs overflow-hidden"
            style={{
              width: '210mm',
              minHeight: '297mm',
              boxSizing: 'border-box'
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
