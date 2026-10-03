/**
 * src/components/pdf/ResumePdfDocument.tsx
 * Ensamblador del documento PDF para @react-pdf/renderer con metadatos y página A4.
 * Trazabilidad: US-09, TASK-7.2
 */

import React from 'react';
import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '../../types/cv';
import { getPdfFontName } from '../../domain/cvFormatters';
import { registerPdfFonts } from '../../services/pdf/pdfFonts';
import { PdfModernTemplate } from './templates/PdfModernTemplate';
import { PdfClassicTemplate } from './templates/PdfClassicTemplate';
import { PdfMinimalTemplate } from './templates/PdfMinimalTemplate';

interface ResumePdfDocumentProps {
  data: CVData;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 0,
    margin: 0,
    width: '100%',
    height: '100%',
  },
});

/**
 * [COMPONENTE] Documento raíz para exportación y visualización PDF.
 */
export const ResumePdfDocument: React.FC<ResumePdfDocumentProps> = ({ data }) => {
  registerPdfFonts();

  const templateId = data.settings.templateId || 'modern';
  const fontFamily = getPdfFontName(data.settings.fontFamily);

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

  const documentTitle = data.profile.fullName ? `CV - ${data.profile.fullName}` : 'Curriculum Vitae';

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
