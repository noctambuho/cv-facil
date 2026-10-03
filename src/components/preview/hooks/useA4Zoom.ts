/**
 * src/components/preview/hooks/useA4Zoom.ts
 * Hook para gestionar el nivel de zoom, auto-ajuste y dimensiones de la hoja A4.
 * Trazabilidad: US-09, TASK-7.5
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

/**
 * [HOOK] Controla el factor de escala interactivo del visor A4.
 */
export function useA4Zoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.85);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);

  const calculateFitZoom = useCallback((width: number): number => {
    if (!width || width <= 0) return 0.85;
    const padding = width < 640 ? 24 : 48;
    const availableWidth = Math.max(280, width - padding);
    const fitScale = Number((availableWidth / A4_WIDTH_PX).toFixed(2));
    return Math.min(1.25, Math.max(0.35, fitScale));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      setContainerWidth(rect.width);
      if (isAutoFit) {
        setZoom(calculateFitZoom(rect.width));
      }
    };

    handleResize();
    const observer = new ResizeObserver(() => handleResize());
    observer.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [isAutoFit, calculateFitZoom]);

  const zoomIn = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.min(1.6, Number((prev + 0.1).toFixed(2))));
  };

  const zoomOut = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.max(0.35, Number((prev - 0.1).toFixed(2))));
  };

  const resetZoom = () => {
    setIsAutoFit(false);
    setZoom(1.0);
  };

  const fitWidth = () => {
    setIsAutoFit(true);
    if (containerRef.current) {
      setZoom(calculateFitZoom(containerRef.current.clientWidth));
    }
  };

  const scaledWidth = Math.round(A4_WIDTH_PX * zoom);
  const scaledHeight = Math.round(A4_HEIGHT_PX * zoom);
  const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 1024 && containerWidth > 0 && containerWidth < 640;

  return {
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
  };
}
