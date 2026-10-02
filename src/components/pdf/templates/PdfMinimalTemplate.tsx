import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '../../../types/cv';

interface PdfTemplateProps {
  data: CVData;
  fontFamily: string;
}

const levelLabels: Record<string, string> = {
  basic: 'Básico',
  intermediate: 'Medio',
  advanced: 'Avanzado',
};

export const PdfMinimalTemplate: React.FC<PdfTemplateProps> = ({ data, fontFamily }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';

  const styles = StyleSheet.create({
    container: {
      padding: 30,
      fontFamily,
      fontSize: 9,
      color: '#0f172a',
      height: '100%',
    },
    // Encabezado Minimalista Tech
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
    // Secciones
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
    // Competencias
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

  const contactPieces: string[] = [];
  if (profile.email) contactPieces.push(profile.email);
  if (profile.phone) contactPieces.push(profile.phone);
  if (profile.location) contactPieces.push(profile.location);
  if (profile.website) contactPieces.push(profile.website.replace(/^https?:\/\//, ''));
  if (profile.github) {
    contactPieces.push(
      `github.com/${profile.github.replace(/^https?:\/\/(www\.)?github\.com\/?/, '')}`
    );
  }
  if (profile.linkedin) {
    contactPieces.push(
      `linkedin.com/in/${profile.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, '')}`
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado Minimalista */}
      <View style={styles.header}>
        <Text style={styles.fullName}>{profile.fullName || 'Tu Nombre'}</Text>
        {profile.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}

        <View style={styles.contactRow}>
          {contactPieces.map((piece, idx) => (
            <Text key={idx} style={styles.contactItem}>
              {idx > 0 ? ' • ' : ''}
              {piece}
            </Text>
          ))}
        </View>
      </View>

      {/* Resumen */}
      {profile.summary ? (
        <View style={styles.section}>
          <Text style={styles.summaryText}>{profile.summary}</Text>
        </View>
      ) : null}

      {/* Experiencia */}
      {experiences && experiences.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>// Experiencia</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceItem} wrap={false}>
              <View style={styles.rowBetween}>
                <Text style={styles.roleText}>
                  {exp.role}{' '}
                  <Text style={styles.companyTag}>@ {exp.company}</Text>
                </Text>
                <Text style={styles.dateText}>
                  {exp.startDate} → {exp.current ? 'Presente' : exp.endDate}
                </Text>
              </View>
              {exp.location ? <Text style={styles.locationText}>{exp.location}</Text> : null}
              {exp.description ? (
                <Text style={styles.descriptionText}>{exp.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Educación */}
      {education && education.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>// Educación</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.experienceItem} wrap={false}>
              <View style={styles.rowBetween}>
                <Text style={styles.roleText}>
                  {edu.degree} {edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}
                </Text>
                <Text style={styles.dateText}>
                  {edu.startDate} — {edu.endDate}
                </Text>
              </View>
              <Text style={styles.companyTag}>{edu.institution}</Text>
              {edu.description ? (
                <Text style={styles.descriptionText}>{edu.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Competencias */}
      {(skills?.length > 0 || languages?.length > 0) && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>// Competencias</Text>
          <View style={styles.competenciesWrap}>
            {skills && skills.length > 0 ? (
              <View style={styles.skillsWrap}>
                <Text style={styles.skillsLabel}>Skills:</Text>
                {skills.map((s) => (
                  <Text key={s.id} style={styles.skillBadge}>
                    {s.name} ({levelLabels[s.level] || s.level})
                  </Text>
                ))}
              </View>
            ) : null}

            {languages && languages.length > 0 ? (
              <View style={styles.languagesWrap}>
                <Text style={styles.languagesLabel}>Idiomas:</Text>
                {languages.map((l) => (
                  <Text key={l.id} style={styles.languageItem}>
                    {l.name}: {l.level}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
};
