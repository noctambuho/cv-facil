/**
 * src/components/pdf/templates/styles/PdfClassicTemplate.styles.ts
 * Factoría de estilos de @react-pdf/renderer para la plantilla Clásica A4.
 * Trazabilidad: TASK-7.5, specs/07-refactor-legibilidad.md
 */

import { StyleSheet } from '@react-pdf/renderer';

/**
 * [PURA] Construye la hoja de estilos de la plantilla clásica a partir del color de acento y tipografía.
 */
export function createClassicPdfStyles(accent: string, fontFamily: string) {
  return StyleSheet.create({
    container: {
      padding: 30,
      fontFamily,
      fontSize: 9,
      color: '#0f172a',
      height: '100%',
    },
    header: {
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: accent,
      borderBottomStyle: 'solid',
      paddingBottom: 12,
      marginBottom: 12,
    },
    fullName: {
      fontSize: 16,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#0f172a',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    headline: {
      fontSize: 9.5,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: accent,
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 2,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    contactText: {
      fontSize: 8,
      color: '#475569',
    },
    section: {
      marginTop: 10,
    },
    sectionTitle: {
      fontSize: 9,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: accent,
      borderBottomWidth: 1,
      borderBottomColor: `${accent}40`,
      borderBottomStyle: 'solid',
      paddingBottom: 2.5,
      marginBottom: 6,
    },
    summaryText: {
      fontSize: 8.5,
      color: '#334155',
      lineHeight: 1.5,
      textAlign: 'justify',
    },
    experienceItem: {
      marginBottom: 8,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 1.5,
    },
    roleText: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#0f172a',
    },
    dateText: {
      fontSize: 8,
      color: '#64748b',
      fontStyle: 'italic',
    },
    companyText: {
      fontSize: 8.5,
      fontWeight: 'bold',
      color: '#334155',
    },
    locationText: {
      fontSize: 7.5,
      color: '#64748b',
      fontStyle: 'italic',
    },
    descriptionText: {
      fontSize: 8,
      color: '#334155',
      lineHeight: 1.45,
      marginTop: 1.5,
    },
    competenciesGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
      marginTop: 4,
    },
    competencyCol: {
      width: '48%',
    },
    competencySubTitle: {
      fontSize: 8.5,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 4,
    },
    skillsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    skillBadge: {
      fontSize: 7.5,
      backgroundColor: '#f1f5f9',
      color: '#1e293b',
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      borderRadius: 2.5,
      borderWidth: 0.5,
      borderColor: '#e2e8f0',
    },
    languageRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2.5,
    },
    languageName: {
      fontSize: 8,
      color: '#1e293b',
    },
    languageLevel: {
      fontSize: 7.5,
      color: '#64748b',
      fontStyle: 'italic',
    },
  });
}
