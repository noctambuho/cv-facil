import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '../../../types/cv';
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
  LinkedinIcon,
  GithubIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  AwardIcon,
  LanguagesIcon,
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

export const PdfModernTemplate: React.FC<PdfTemplateProps> = ({ data, fontFamily }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: '100%',
      fontFamily,
      fontSize: 9,
      color: '#0f172a',
    },
    // Columna Lateral (Sidebar)
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
    // Columna Principal
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

  const initials = profile.fullName
    ? profile.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CV';

  const getSkillBadgeStyle = (level: string) => {
    switch (level) {
      case 'basic':
        return styles.skillBadgeBasic;
      case 'intermediate':
        return styles.skillBadgeIntermediate;
      case 'advanced':
      default:
        return styles.skillBadgeAdvanced;
    }
  };

  return (
    <View style={styles.container}>
      {/* Columna Lateral */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarTop}>
          {/* Avatar / Iniciales */}
          <View style={styles.avatarContainer}>
            {profile.avatarUrl && settings.showPhoto !== false ? (
              <Image src={profile.avatarUrl} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
            <Text style={styles.fullName}>{profile.fullName || 'Tu Nombre'}</Text>
            {profile.headline ? <Text style={styles.headline}>{profile.headline}</Text> : null}
          </View>

          {/* Contacto con Iconos Vectoriales Nativos */}
          <View style={styles.sectionDivider}>
            <View style={styles.sidebarSectionTitle}>
              <Text style={styles.sidebarTitleText}>Contacto</Text>
            </View>

            {profile.email ? (
              <View style={styles.contactItem}>
                <MailIcon size={9} color={accent} />
                <Text style={styles.contactText}>{profile.email}</Text>
              </View>
            ) : null}

            {profile.phone ? (
              <View style={styles.contactItem}>
                <PhoneIcon size={9} color={accent} />
                <Text style={styles.contactText}>{profile.phone}</Text>
              </View>
            ) : null}

            {profile.location ? (
              <View style={styles.contactItem}>
                <MapPinIcon size={9} color={accent} />
                <Text style={styles.contactText}>{profile.location}</Text>
              </View>
            ) : null}

            {profile.website ? (
              <View style={styles.contactItem}>
                <GlobeIcon size={9} color={accent} />
                <Text style={styles.contactText}>{profile.website.replace(/^https?:\/\//, '')}</Text>
              </View>
            ) : null}

            {profile.linkedin ? (
              <View style={styles.contactItem}>
                <LinkedinIcon size={9} color={accent} />
                <Text style={styles.contactText}>
                  {profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </Text>
              </View>
            ) : null}

            {profile.github ? (
              <View style={styles.contactItem}>
                <GithubIcon size={9} color={accent} />
                <Text style={styles.contactText}>
                  {profile.github.replace(/^https?:\/\/(www\.)?/, '')}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Habilidades con Badges Estilizados */}
          {skills && skills.length > 0 ? (
            <View style={styles.sectionDivider}>
              <View style={styles.sidebarSectionTitle}>
                <AwardIcon size={9} color={accent} />
                <Text style={styles.sidebarTitleText}>Habilidades</Text>
              </View>
              {skills.map((skill) => (
                <View key={skill.id} style={styles.skillRow}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={getSkillBadgeStyle(skill.level)}>
                    {levelLabels[skill.level] || skill.level}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Idiomas */}
          {languages && languages.length > 0 ? (
            <View style={styles.sectionDivider}>
              <View style={styles.sidebarSectionTitle}>
                <LanguagesIcon size={9} color={accent} />
                <Text style={styles.sidebarTitleText}>Idiomas</Text>
              </View>
              {languages.map((lang) => (
                <View key={lang.id} style={styles.languageRow}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.languageLevel}>{lang.level}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Sin marcas de agua en el pie */}
      </View>

      {/* Columna Principal */}
      <View style={styles.main}>
        {/* Resumen Profesional */}
        {profile.summary ? (
          <View style={styles.section}>
            <View style={styles.mainSectionHeader}>
              <Text style={styles.mainSectionTitle}>Perfil Profesional</Text>
            </View>
            <Text style={styles.summaryText}>{profile.summary}</Text>
          </View>
        ) : null}

        {/* Experiencia Laboral */}
        {experiences && experiences.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.mainSectionHeader}>
              <BriefcaseIcon size={10} color={accent} />
              <Text style={styles.mainSectionTitle}>Experiencia Laboral</Text>
            </View>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.experienceItem} wrap={false}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expDates}>
                    {exp.startDate} — {exp.current ? 'Presente' : exp.endDate}
                  </Text>
                </View>
                <View style={styles.expCompanyRow}>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {exp.location ? <Text style={styles.expLocation}>{exp.location}</Text> : null}
                </View>
                {exp.description ? (
                  <Text style={styles.expDescription}>{exp.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Educación y Formación */}
        {education && education.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.mainSectionHeader}>
              <GraduationCapIcon size={10} color={accent} />
              <Text style={styles.mainSectionTitle}>Educación y Formación</Text>
            </View>
            {education.map((edu) => (
              <View key={edu.id} style={styles.educationItem} wrap={false}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.eduDegree}>
                    {edu.degree} {edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}
                  </Text>
                  <Text style={styles.expDates}>
                    {edu.startDate} — {edu.endDate}
                  </Text>
                </View>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
                {edu.description ? (
                  <Text style={styles.eduDescription}>{edu.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
};
