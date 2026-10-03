/**
 * src/components/preview/templates/ClassicTemplate.tsx
 * Plantilla Clásica de diseño tradicional centrado para visualización interactiva HTML en A4.
 * Trazabilidad: US-09, TASK-7.5
 */

import React from 'react';
import type { TemplateProps } from '../../../types/cv';
import {
  formatDateRange,
  formatEducationDegree,
  toDisplayUrl,
  getSkillLevelLabel,
  hasSkillsOrLanguages,
  getFontClass,
} from '../../../domain/cvFormatters';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

/**
 * [COMPONENTE] Plantilla clásica A4 centrada para vista web.
 */
export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';
  const fontClass = getFontClass(settings.fontFamily);

  return (
    <div className={`w-full min-h-[297mm] bg-white text-slate-900 p-10 ${fontClass} text-[13px] leading-relaxed`}>
      {/* Encabezado Clásico Centrado */}
      <header className="text-center pb-5 mb-5 border-b-2 space-y-1.5" style={{ borderColor: accent }}>
        {profile.fullName && <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{profile.fullName}</h1>}
        {profile.headline && <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>{profile.headline}</p>}

        {/* Fila de Contacto */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
          {profile.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              <span>{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>{toDisplayUrl(profile.website)}</span>
            </div>
          )}
          {profile.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-400" />
              <span>{toDisplayUrl(profile.linkedin)}</span>
            </div>
          )}
          {profile.github && (
            <div className="flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-400" />
              <span>{toDisplayUrl(profile.github)}</span>
            </div>
          )}
        </div>
      </header>

      <div className="space-y-5">
        {/* Perfil Profesional */}
        {profile.summary && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wide border-b pb-1" style={{ color: accent, borderColor: `${accent}40` }}>
              Perfil Profesional
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{profile.summary}</p>
          </section>
        )}

        {/* Experiencia Laboral */}
        {experiences && experiences.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wide border-b pb-1" style={{ color: accent, borderColor: `${accent}40` }}>
              Experiencia Laboral
            </h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{exp.role}</h3>
                    <span className="text-[11px] text-slate-500 font-mono italic">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-700">
                    <span className="font-semibold">{exp.company}</span>
                    {exp.location && <span className="text-slate-500 italic">{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formación Académica */}
        {education && education.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wide border-b pb-1" style={{ color: accent, borderColor: `${accent}40` }}>
              Educación
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{formatEducationDegree(edu.degree, edu.fieldOfStudy)}</h3>
                    <span className="text-[11px] text-slate-500 font-mono italic">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{edu.institution}</p>
                  {edu.description && <p className="text-xs text-slate-500 italic">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Competencias e Idiomas */}
        {hasSkillsOrLanguages(skills, languages) && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wide border-b pb-1" style={{ color: accent, borderColor: `${accent}40` }}>
              Competencias e Idiomas
            </h2>
            <div className="grid grid-cols-2 gap-6 pt-1">
              {skills && skills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-800 mb-1.5">Habilidades Técnicas</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span key={skill.id} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                        {skill.name} ({getSkillLevelLabel(skill.level)})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {languages && languages.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-800 mb-1.5">Idiomas</h3>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex justify-between text-xs">
                        <span className="text-slate-800 font-medium">{lang.name}</span>
                        <span className="text-slate-500 italic">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
