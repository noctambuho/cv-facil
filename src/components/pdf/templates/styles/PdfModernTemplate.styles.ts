/**
 * src/components/pdf/templates/styles/PdfModernTemplate.styles.ts
 * Factoría de estilos de @react-pdf/renderer para la plantilla Moderna A4.
 * Trazabilidad: TASK-7.5, specs/07-refactor-legibilidad.md
 */

import { StyleSheet } from '@react-pdf/renderer';

/**
 * [PURA] Construye la hoja de estilos de la plantilla moderna a partir del color de acento y tipografía.
 */
export function createModernPdfStyles(accent: string, fontFamily: string) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: '100%',
      fontFamily,
      fontSize: 9,
      color: '#0f172a',
    },
    sidebar: {
      width: '33%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: 20,
      borderRightWidth: 3.5,
      borderRightColor: accent,
      borderRightStyle: 'solid',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    sidebarTop: {
      flexDirection: 'column',
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 14,
    },
    avatarImage: {
      width: 64,
      height: 64,
      borderRadius: 32,
      marginBottom: 8,
      borderWidth: 2,
      borderColor: '#ffffff',
      objectFit: 'cover',
    },
    avatarPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    avatarInitials: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    fullName: {
      fontSize: 13.5,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: 3,
      letterSpacing: -0.2,
    },
    headline: {
      fontSize: 8.5,
      color: '#cbd5e1',
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 1.25,
    },
    sectionDivider: {
      borderTopWidth: 1,
      borderTopColor: '#1e293b',
      borderTopStyle: 'solid',
      marginTop: 10,
      paddingTop: 10,
    },
    sidebarSectionTitle: {
      fontSize: 7.5,
      fontWeight: 'bold',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    sidebarTitleText: {
      fontSize: 7.5,
      fontWeight: 'bold',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
      gap: 5,
    },
    contactText: {
      fontSize: 8,
      color: '#cbd5e1',
      flex: 1,
    },
    skillRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4.5,
    },
    skillName: {
      fontSize: 8,
      color: '#f1f5f9',
      maxWidth: '65%',
    },
    skillBadgeBasic: {
      fontSize: 6.5,
      color: '#94a3b8',
      backgroundColor: '#1e293b',
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      borderRadius: 2.5,
      borderWidth: 0.5,
      borderColor: '#334155',
    },
    skillBadgeIntermediate: {
      fontSize: 6.5,
      color: '#7dd3fc',
      backgroundColor: '#0c4a6e',
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      borderRadius: 2.5,
      borderWidth: 0.5,
      borderColor: '#0284c7',
    },
    skillBadgeAdvanced: {
      fontSize: 6.5,
      color: '#93c5fd',
      backgroundColor: '#1e3a8a',
      fontWeight: 'bold',
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      borderRadius: 2.5,
      borderWidth: 0.5,
      borderColor: '#3b82f6',
    },
    languageRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3.5,
    },
    languageName: {
      fontSize: 8,
      color: '#f1f5f9',
    },
    languageLevel: {
      fontSize: 7.5,
      color: '#94a3b8',
    },
    main: {
      width: '67%',
      padding: 24,
      flexDirection: 'column',
    },
    section: {
      marginBottom: 14,
    },
    mainSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      borderBottomWidth: 1,
      borderBottomColor: `${accent}40`,
      borderBottomStyle: 'solid',
      paddingBottom: 3,
      marginBottom: 8,
    },
    mainSectionTitle: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    summaryText: {
      fontSize: 8.5,
      color: '#334155',
      lineHeight: 1.5,
      textAlign: 'justify',
    },
    experienceItem: {
      marginBottom: 9,
    },
    expHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 1.5,
    },
    expRole: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#0f172a',
      maxWidth: '72%',
    },
    expDates: {
      fontSize: 7.5,
      color: '#64748b',
    },
    expCompanyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 2,
    },
    expCompany: {
      fontSize: 8.5,
      color: '#475569',
      fontWeight: 'bold',
    },
    expLocation: {
      fontSize: 7.5,
      color: '#64748b',
    },
    expDescription: {
      fontSize: 8,
      color: '#334155',
      lineHeight: 1.45,
    },
    educationItem: {
      marginBottom: 7,
    },
    eduDegree: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#0f172a',
    },
    eduInstitution: {
      fontSize: 8.5,
      color: '#475569',
      marginBottom: 1,
    },
    eduDescription: {
      fontSize: 7.5,
      color: '#64748b',
      lineHeight: 1.4,
    },
  });
}
