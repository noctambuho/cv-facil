/**
 * src/components/pdf/templates/styles/PdfMinimalTemplate.styles.ts
 * Factoría de estilos de @react-pdf/renderer para la plantilla Minimalista A4.
 * Trazabilidad: TASK-7.5, specs/07-refactor-legibilidad.md
 */

import { StyleSheet } from '@react-pdf/renderer';

/**
 * [PURA] Construye la hoja de estilos de la plantilla minimalista a partir del color de acento y tipografía.
 */
export function createMinimalPdfStyles(accent: string, fontFamily: string) {
  return StyleSheet.create({
    container: {
      padding: 30,
      fontFamily,
      fontSize: 9,
      color: '#0f172a',
      height: '100%',
    },
    header: {
      marginBottom: 14,
    },
    fullName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#0f172a',
      letterSpacing: -0.2,
      marginBottom: 2,
    },
    headline: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: accent,
      marginBottom: 6,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      alignItems: 'center',
    },
    contactItem: {
      fontSize: 8,
      color: '#64748b',
    },
    section: {
      marginBottom: 13,
    },
    sectionTitle: {
      fontSize: 8.5,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: accent,
      borderBottomWidth: 1.5,
      borderBottomColor: accent,
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
    companyTag: {
      fontSize: 8.5,
      color: '#64748b',
      fontWeight: 'normal',
    },
    dateText: {
      fontSize: 8,
      color: '#64748b',
    },
    locationText: {
      fontSize: 7.5,
      color: '#94a3b8',
      marginBottom: 2,
    },
    descriptionText: {
      fontSize: 8,
      color: '#334155',
      lineHeight: 1.45,
    },
    competenciesWrap: {
      marginTop: 2,
    },
    skillsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      alignItems: 'center',
      marginBottom: 6,
    },
    skillsLabel: {
      fontSize: 8,
      color: '#64748b',
      fontWeight: 'bold',
      marginRight: 2,
    },
    skillBadge: {
      fontSize: 7.5,
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      borderRadius: 2.5,
      borderWidth: 0.5,
      borderColor: '#e2e8f0',
    },
    languagesWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center',
    },
    languagesLabel: {
      fontSize: 8,
      color: '#64748b',
      fontWeight: 'bold',
      marginRight: 2,
    },
    languageItem: {
      fontSize: 8,
      color: '#334155',
    },
  });
}
