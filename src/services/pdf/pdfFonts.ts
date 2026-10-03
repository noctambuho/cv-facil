/**
 * src/services/pdf/pdfFonts.ts
 * Registro y carga de fuentes tipográficas para el motor @react-pdf/renderer.
 * Trazabilidad: TASK-7.2, US-09
 */

import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

/**
 * [EFECTO] Registra de forma idempotente las fuentes estándar A4 en el motor PDF.
 */
export function registerPdfFonts(): void {
  if (fontsRegistered) return;
  if (typeof window === 'undefined') return;

  const origin = window.location.origin;
  const rawBase = import.meta.env.BASE_URL || '/';
  const base = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

  Font.register({
    family: 'Inter',
    fonts: [
      { src: `${origin}${base}/fonts/inter/Inter-Regular.ttf`, fontWeight: 'normal' },
      { src: `${origin}${base}/fonts/inter/Inter-Bold.ttf`, fontWeight: 'bold' },
    ],
  });

  Font.register({
    family: 'Merriweather',
    fonts: [
      { src: `${origin}${base}/fonts/merriweather/Merriweather-Regular.ttf`, fontWeight: 'normal' },
      { src: `${origin}${base}/fonts/merriweather/Merriweather-Bold.ttf`, fontWeight: 'bold' },
    ],
  });

  Font.register({
    family: 'JetBrains Mono',
    fonts: [
      { src: `${origin}${base}/fonts/jetbrains-mono/JetBrainsMono-Regular.ttf`, fontWeight: 'normal' },
      { src: `${origin}${base}/fonts/jetbrains-mono/JetBrainsMono-Bold.ttf`, fontWeight: 'bold' },
    ],
  });

  fontsRegistered = true;
}
