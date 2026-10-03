/**
 * src/components/pdf/templates/PdfMinimalTemplate.tsx
 * Plantilla Minimalista y moderna para compilación PDF con @react-pdf/renderer.
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
import { createMinimalPdfStyles } from './styles/PdfMinimalTemplate.styles';

interface PdfTemplateProps {
  data: CVData;
  fontFamily: string;
}

/**
 * [COMPONENTE] Plantilla PDF minimalista sobria y compacta.
 */
export const PdfMinimalTemplate: React.FC<PdfTemplateProps> = ({ data, fontFamily }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';
  const styles = createMinimalPdfStyles(accent, fontFamily);

  const contactPieces: string[] = [];
  if (profile.email) contactPieces.push(profile.email);
  if (profile.phone) contactPieces.push(profile.phone);
  if (profile.location) contactPieces.push(profile.location);
  if (profile.website) contactPieces.push(toDisplayUrl(profile.website));
  if (profile.github) contactPieces.push(`github.com/${toDisplayUrl(profile.github).replace(/^github\.com\/?/, '')}`);
  if (profile.linkedin) contactPieces.push(`linkedin.com/in/${toDisplayUrl(profile.linkedin).replace(/^linkedin\.com\/in\/?/, '')}`);

  return (
    <View style={styles.container}>
      {/* Encabezado Minimalista */}
      <View style={styles.header}>
        {profile.fullName && <Text style={styles.fullName}>{profile.fullName}</Text>}
        {profile.headline && <Text style={styles.headline}>{profile.headline}</Text>}

        {/* Fila de Contacto Unificada */}
        {contactPieces.length > 0 && (
          <View style={styles.contactRow}>
            {contactPieces.map((piece, idx) => (
              <Text key={idx} style={styles.contactItem}>
                {idx > 0 ? ' • ' : ''}{piece}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Perfil Profesional */}
      {profile.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil</Text>
          <Text style={styles.summaryText}>{profile.summary}</Text>
        </View>
      )}

      {/* Experiencia Laboral */}
      {experiences && experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceItem}>
              <View style={styles.rowBetween}>
                <Text style={styles.roleText}>
                  {exp.role} <Text style={styles.companyTag}>| {exp.company}</Text>
                </Text>
                <Text style={styles.dateText}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
              </View>
              {exp.location && <Text style={styles.locationText}>{exp.location}</Text>}
              {exp.description && <Text style={styles.descriptionText}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Educación */}
      {education && education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.experienceItem}>
              <View style={styles.rowBetween}>
                <Text style={styles.roleText}>
                  {formatEducationDegree(edu.degree, edu.fieldOfStudy)} <Text style={styles.companyTag}>| {edu.institution}</Text>
                </Text>
                <Text style={styles.dateText}>{formatDateRange(edu.startDate, edu.endDate)}</Text>
              </View>
              {edu.description && <Text style={styles.descriptionText}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Competencias e Idiomas */}
      {hasSkillsOrLanguages(skills, languages) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competencias</Text>
          <View style={styles.competenciesWrap}>
            {skills && skills.length > 0 && (
              <View style={styles.skillsWrap}>
                <Text style={styles.skillsLabel}>Habilidades:</Text>
                {skills.map((s) => (
                  <Text key={s.id} style={styles.skillBadge}>
                    {s.name} ({getSkillLevelLabel(s.level)})
                  </Text>
                ))}
              </View>
            )}

            {languages && languages.length > 0 && (
              <View style={styles.languagesWrap}>
                <Text style={styles.languagesLabel}>Idiomas:</Text>
                {languages.map((l) => (
                  <Text key={l.id} style={styles.languageItem}>
                    {l.name}: {l.level}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};
