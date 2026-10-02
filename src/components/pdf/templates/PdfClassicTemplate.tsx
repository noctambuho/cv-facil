import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '../../../types/cv';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
  LinkedinIcon,
  GithubIcon,
} from '../PdfIcons';

interface PdfTemplateProps {
  data: CVData;
  fontFamily: string;
}

const levelLabels: Record<string, string> = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export const PdfClassicTemplate: React.FC<PdfTemplateProps> = ({ data, fontFamily }) => {
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
    // Encabezado Clásico Centrado
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
    // Secciones
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
    // Habilidades y Competencias
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

  return (
    <View style={styles.container}>
      {/* Encabezado Clásico Centrado */}
      <View style={styles.header}>
        <Text style={styles.fullName}>{profile.fullName || 'Tu Nombre Completo'}</Text>
        {profile.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}

        <View style={styles.contactRow}>
          {profile.email ? (
            <View style={styles.contactItem}>
              <MailIcon size={8} color="#94a3b8" />
              <Text style={styles.contactText}>{profile.email}</Text>
            </View>
          ) : null}

          {profile.phone ? (
            <View style={styles.contactItem}>
              <PhoneIcon size={8} color="#94a3b8" />
              <Text style={styles.contactText}>{profile.phone}</Text>
            </View>
          ) : null}

          {profile.location ? (
            <View style={styles.contactItem}>
              <MapPinIcon size={8} color="#94a3b8" />
              <Text style={styles.contactText}>{profile.location}</Text>
            </View>
          ) : null}

          {profile.website ? (
            <View style={styles.contactItem}>
              <GlobeIcon size={8} color="#94a3b8" />
              <Text style={styles.contactText}>{profile.website.replace(/^https?:\/\//, '')}</Text>
            </View>
          ) : null}

          {profile.linkedin ? (
            <View style={styles.contactItem}>
              <LinkedinIcon size={8} color="#94a3b8" />
              <Text style={styles.contactText}>
                {profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </Text>
            </View>
          ) : null}

          {profile.github ? (
            <View style={styles.contactItem}>
              <GithubIcon size={8} color="#94a3b8" />
              <Text style={styles.contactText}>
                {profile.github.replace(/^https?:\/\/(www\.)?/, '')}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Resumen Profesional */}
      {profile.summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil Profesional</Text>
          <Text style={styles.summaryText}>{profile.summary}</Text>
        </View>
      ) : null}

      {/* Experiencia Laboral */}
      {experiences && experiences.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceItem} wrap={false}>
              <View style={styles.rowBetween}>
                <Text style={styles.roleText}>{exp.role}</Text>
                <Text style={styles.dateText}>
                  {exp.startDate} — {exp.current ? 'Presente' : exp.endDate}
                </Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.companyText}>{exp.company}</Text>
                {exp.location ? <Text style={styles.locationText}>{exp.location}</Text> : null}
              </View>
              {exp.description ? (
                <Text style={styles.descriptionText}>{exp.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Educación y Formación */}
      {education && education.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación y Formación</Text>
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
              <Text style={styles.companyText}>{edu.institution}</Text>
              {edu.description ? (
                <Text style={styles.descriptionText}>{edu.description}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      {/* Habilidades y Competencias (2 Columnas) */}
      {(skills?.length > 0 || languages?.length > 0) && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Habilidades y Competencias</Text>
          <View style={styles.competenciesGrid}>
            {skills && skills.length > 0 ? (
              <View style={styles.competencyCol}>
                <Text style={styles.competencySubTitle}>Conocimientos Técnicos:</Text>
                <View style={styles.skillsWrap}>
                  {skills.map((s) => (
                    <Text key={s.id} style={styles.skillBadge}>
                      {s.name} ({levelLabels[s.level] || s.level})
                    </Text>
                  ))}
                </View>
              </View>
            ) : null}

            {languages && languages.length > 0 ? (
              <View style={styles.competencyCol}>
                <Text style={styles.competencySubTitle}>Idiomas:</Text>
                {languages.map((l) => (
                  <View key={l.id} style={styles.languageRow}>
                    <Text style={styles.languageName}>{l.name}</Text>
                    <Text style={styles.languageLevel}>{l.level}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      )}
    </View>
  );
};
