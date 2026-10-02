import React from 'react';
import { Document, Page, StyleSheet, Font } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import { PdfModernTemplate } from './templates/PdfModernTemplate';
import { PdfClassicTemplate } from './templates/PdfClassicTemplate';
import { PdfMinimalTemplate } from './templates/PdfMinimalTemplate';

// Registrar fuentes TrueType para fidelidad tipográfica 1:1 con la previsualización web
if (typeof window !== 'undefined') {
  const base = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
  const origin = window.location.origin;

  try {
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
  } catch (err) {
    console.warn('Error registrando fuentes en cliente:', err);
  }
}

interface ResumePdfDocumentProps {
  data: CVData;
}

const fontMap: Record<string, string> = {
  sans: 'Inter',
  serif: 'Merriweather',
  mono: 'JetBrains Mono',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 0,
    margin: 0,
    width: '100%',
    height: '100%',
  },
});

export const ResumePdfDocument: React.FC<ResumePdfDocumentProps> = ({ data }) => {
  const templateId = data.settings.templateId || 'modern';
  const fontFamily = fontMap[data.settings.fontFamily] || 'Inter';

  const renderTemplate = () => {
    switch (templateId) {
      case 'classic':
        return <PdfClassicTemplate data={data} fontFamily={fontFamily} />;
      case 'minimal':
        return <PdfMinimalTemplate data={data} fontFamily={fontFamily} />;
      case 'modern':
      default:
        return <PdfModernTemplate data={data} fontFamily={fontFamily} />;
    }
  };

  const documentTitle = data.profile.fullName
    ? `CV - ${data.profile.fullName}`
    : 'Curriculum Vitae';

  return (
    <Document
      title={documentTitle}
      author={data.profile.fullName || 'CV Fácil'}
      subject={data.profile.headline || 'Currículum Vitae'}
      creator="CV Fácil - Generador PDF Local-First"
      producer="react-pdf (@react-pdf/renderer)"
      keywords={['Curriculum Vitae', 'CV', 'Resume', data.profile.headline || ''].join(', ')}
    >
      <Page size="A4" style={styles.page}>
        {renderTemplate()}
      </Page>
    </Document>
  );
};
