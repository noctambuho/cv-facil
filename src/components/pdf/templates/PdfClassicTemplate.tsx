/**
 * src/components/pdf/templates/PdfClassicTemplate.tsx
 * Plantilla Clásica de diseño tradicional centrado para compilación PDF con @react-pdf/renderer.
 * Trazabilidad: US-09, TASK-7.5
 */

import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import type { CVData } from '../../../types/cv';
import {
  formatDateRange,
  formatEducationDegree,
  toDisplayUrl,
  getSkillLevelLabel,
  hasSkillsOrLanguages,
} from '../../../domain/cvFormatters';
import { createClassicPdfStyles } from './styles/PdfClassicTemplate.styles';
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

/**
 * [COMPONENTE] Plantilla PDF clásica corporativa centrada.
 */
export const PdfClassicTemplate: React.FC<PdfTemplateProps> = ({ data, fontFamily }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';
  const styles = createClassicPdfStyles(accent, fontFamily);

  return (
    <View style={styles.container}>
      {/* Encabezado Clásico Centrado */}
      <View style={styles.header}>
        {profile.fullName && <Text style={styles.fullName}>{profile.fullName}</Text>}
        {profile.headline && <Text style={styles.headline}>{profile.headline}</Text>}

        {/* Fila de Contacto */}
        <View style={styles.contactRow}>
          {profile.email && (
            <View style={styles.contactItem}>
              <MailIcon size={8} color="#64748b" />
              <Text style={styles.contactText}>{profile.email}</Text>
            </View>
          )}
          {profile.phone && (
            <View style={styles.contactItem}>
              <PhoneIcon size={8} color="#64748b" />
              <Text style={styles.contactText}>{profile.phone}</Text>
            </View>
          )}
          {profile.location && (
            <View style={styles.contactItem}>
              <MapPinIcon size={8} color="#64748b" />
              <Text style={styles.contactText}>{profile.location}</Text>
            </View>
          )}
          {profile.website && (
            <View style={styles.contactItem}>
              <GlobeIcon size={8} color="#64748b" />
              <Text style={styles.contactText}>{toDisplayUrl(profile.website)}</Text>
            </View>
          )}
          {profile.linkedin && (
            <View style={styles.contactItem}>
              <LinkedinIcon size={8} color="#64748b" />
              <Text style={styles.contactText}>{toDisplayUrl(profile.linkedin)}</Text>
            </View>
          )}
          {profile.github && (
            <View style={styles.contactItem}>
              <GithubIcon size={8} color="#64748b" />
              <Text style={styles.contactText}>{toDisplayUrl(profile.github)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Perfil Profesional */}
      {profile.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil Profesional</Text>
          <Text style={styles.summaryText}>{profile.summary}</Text>
        </View>
      )}

      {/* Experiencia Laboral */}
      {experiences && experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <View style={styles.rowBetween}>
                <Text style={styles.roleText}>{exp.role}</Text>
                <Text style={styles.dateText}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={styles.companyText}>{exp.company}</Text>
                {exp.location && <Text style={styles.locationText}>{exp.location}</Text>}
              </View>
              {exp.description && <Text style={styles.descriptionText}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Formación Académica */}
      {education && education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.experienceItem}>
              <View style={styles.rowBetween}>
                <Text style={styles.roleText}>{formatEducationDegree(edu.degree, edu.fieldOfStudy)}</Text>
                <Text style={styles.dateText}>{formatDateRange(edu.startDate, edu.endDate)}</Text>
              </View>
              <Text style={styles.companyText}>{edu.institution}</Text>
              {edu.description && <Text style={styles.descriptionText}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Competencias e Idiomas en Dos Columnas */}
      {hasSkillsOrLanguages(skills, languages) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competencias e Idiomas</Text>
          <View style={styles.competenciesGrid}>
            {/* Habilidades Técnicas */}
            <View style={styles.competencyCol}>
              <Text style={styles.competencySubTitle}>Habilidades Técnicas</Text>
              <View style={styles.skillsWrap}>
                {skills?.map((skill) => (
                  <Text key={skill.id} style={styles.skillBadge}>
                    {skill.name} ({getSkillLevelLabel(skill.level)})
                  </Text>
                ))}
              </View>
            </View>

            {/* Idiomas */}
            <View style={styles.competencyCol}>
              <Text style={styles.competencySubTitle}>Idiomas</Text>
              {languages?.map((lang) => (
                <View key={lang.id} style={styles.languageRow}>
                  <Text style={styles.languageName}>{lang.name}</Text>
                  <Text style={styles.languageLevel}>{lang.level}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
