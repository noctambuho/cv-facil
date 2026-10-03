/**
 * src/components/pdf/templates/PdfModernTemplate.tsx
 * Plantilla Moderna de dos columnas para compilación PDF con @react-pdf/renderer.
 * Trazabilidad: US-09, TASK-7.5
 */

import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import type { CVData } from '../../../types/cv';
import {
  formatDateRange,
  formatEducationDegree,
  getProfileInitials,
  toDisplayUrl,
  getSkillLevelLabel,
} from '../../../domain/cvFormatters';
import { createModernPdfStyles } from './styles/PdfModernTemplate.styles';
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

/**
 * [COMPONENTE] Plantilla PDF moderna con barra lateral azul y avatar.
 */
export const PdfModernTemplate: React.FC<PdfTemplateProps> = ({ data, fontFamily }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';
  const styles = createModernPdfStyles(accent, fontFamily);

  const getSkillBadgeStyle = (level: string) => {
    switch (level) {
      case 'advanced':
        return styles.skillBadgeAdvanced;
      case 'intermediate':
        return styles.skillBadgeIntermediate;
      case 'basic':
      default:
        return styles.skillBadgeBasic;
    }
  };

  return (
    <View style={styles.container}>
      {/* Columna Lateral (Sidebar) */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarTop}>
          {/* Foto de Perfil o Iniciales */}
          <View style={styles.avatarContainer}>
            {profile.avatarUrl ? (
              <Image src={profile.avatarUrl} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{getProfileInitials(profile.fullName)}</Text>
              </View>
            )}
            {profile.fullName && <Text style={styles.fullName}>{profile.fullName}</Text>}
            {profile.headline && <Text style={styles.headline}>{profile.headline}</Text>}
          </View>

          {/* Información de Contacto */}
          <View style={styles.sectionDivider}>
            <Text style={styles.sidebarSectionTitle}>Contacto</Text>
            {profile.email && (
              <View style={styles.contactItem}>
                <MailIcon size={9} color="#94a3b8" />
                <Text style={styles.contactText}>{profile.email}</Text>
              </View>
            )}
            {profile.phone && (
              <View style={styles.contactItem}>
                <PhoneIcon size={9} color="#94a3b8" />
                <Text style={styles.contactText}>{profile.phone}</Text>
              </View>
            )}
            {profile.location && (
              <View style={styles.contactItem}>
                <MapPinIcon size={9} color="#94a3b8" />
                <Text style={styles.contactText}>{profile.location}</Text>
              </View>
            )}
            {profile.website && (
              <View style={styles.contactItem}>
                <GlobeIcon size={9} color="#94a3b8" />
                <Text style={styles.contactText}>{toDisplayUrl(profile.website)}</Text>
              </View>
            )}
            {profile.linkedin && (
              <View style={styles.contactItem}>
                <LinkedinIcon size={9} color="#94a3b8" />
                <Text style={styles.contactText}>{toDisplayUrl(profile.linkedin)}</Text>
              </View>
            )}
            {profile.github && (
              <View style={styles.contactItem}>
                <GithubIcon size={9} color="#94a3b8" />
                <Text style={styles.contactText}>{toDisplayUrl(profile.github)}</Text>
              </View>
            )}
          </View>

          {/* Habilidades Técnicas */}
          {skills && skills.length > 0 && (
            <View style={styles.sectionDivider}>
              <View style={styles.sidebarSectionTitle}>
                <AwardIcon size={9} color="#94a3b8" />
                <Text style={styles.sidebarTitleText}>Competencias</Text>
              </View>
              {skills.map((skill) => (
                <View key={skill.id} style={styles.skillRow}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={getSkillBadgeStyle(skill.level)}>{getSkillLevelLabel(skill.level)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Idiomas */}
          {languages && languages.length > 0 && (
            <View style={styles.sectionDivider}>
              <View style={styles.sidebarSectionTitle}>
                <LanguagesIcon size={9} color="#94a3b8" />
                <Text style={styles.sidebarTitleText}>Idiomas</Text>
              </View>
              {languages.map((lang) => (
                <View key={lang.id} style={styles.languageRow}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.languageLevel}>{lang.level}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Columna Principal */}
      <View style={styles.main}>
        {/* Perfil Profesional */}
        {profile.summary && (
          <View style={styles.section}>
            <View style={styles.mainSectionHeader}>
              <BriefcaseIcon size={10} color={accent} />
              <Text style={styles.mainSectionTitle}>Perfil Profesional</Text>
            </View>
            <Text style={styles.summaryText}>{profile.summary}</Text>
          </View>
        )}

        {/* Experiencia Laboral */}
        {experiences && experiences.length > 0 && (
          <View style={styles.section}>
            <View style={styles.mainSectionHeader}>
              <BriefcaseIcon size={10} color={accent} />
              <Text style={styles.mainSectionTitle}>Experiencia Laboral</Text>
            </View>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expDates}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                </View>
                <View style={styles.expCompanyRow}>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {exp.location && <Text style={styles.expLocation}>{exp.location}</Text>}
                </View>
                {exp.description && <Text style={styles.expDescription}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Formación Académica */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <View style={styles.mainSectionHeader}>
              <GraduationCapIcon size={10} color={accent} />
              <Text style={styles.mainSectionTitle}>Educación y Formación</Text>
            </View>
            {education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.eduDegree}>{formatEducationDegree(edu.degree, edu.fieldOfStudy)}</Text>
                  <Text style={styles.expDates}>{formatDateRange(edu.startDate, edu.endDate)}</Text>
                </View>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
                {edu.description && <Text style={styles.eduDescription}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
