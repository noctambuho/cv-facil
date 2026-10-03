/**
 * src/components/preview/templates/MinimalTemplate.tsx
 * Plantilla Minimalista compacta y moderna para visualización interactiva HTML en A4.
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
import { sanitizeExternalUrl } from '../../../domain/security';

/**
 * [COMPONENTE] Plantilla minimalista sobria para visualización web A4.
 */
export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';
  const fontClass = getFontClass(settings.fontFamily);

  const safeWebsite = sanitizeExternalUrl(profile.website);
  const safeGithub = sanitizeExternalUrl(profile.github);
  const safeLinkedin = sanitizeExternalUrl(profile.linkedin);

  return (
    <div className={`w-full min-h-[297mm] bg-white text-slate-900 p-10 ${fontClass} text-[13px] leading-relaxed`}>
      {/* Encabezado Minimalista Tech */}
      <header className="mb-6 space-y-1">
        {profile.fullName && <h1 className="text-2xl font-bold tracking-tight text-slate-900">{profile.fullName}</h1>}
        <p className="text-xs font-bold" style={{ color: accent }}>{profile.headline || 'Profesional'}</p>

        {/* Fila de Contacto en una Línea */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 pt-1">
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>• {profile.phone}</span>}
          {profile.location && <span>• {profile.location}</span>}
          {safeWebsite && (
            <span>
              •{' '}
              <a href={safeWebsite} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800">
                {toDisplayUrl(safeWebsite)}
              </a>
            </span>
          )}
          {safeGithub && (
            <span>
              •{' '}
              <a href={safeGithub} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800">
                github.com/{toDisplayUrl(safeGithub).replace(/^github\.com\/?/, '')}
              </a>
            </span>
          )}
          {safeLinkedin && (
            <span>
              •{' '}
              <a href={safeLinkedin} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800">
                linkedin.com/in/{toDisplayUrl(safeLinkedin).replace(/^linkedin\.com\/in\/?/, '')}
              </a>
            </span>
          )}
        </div>
      </header>

      <div className="space-y-5">
        {/* Perfil */}
        {profile.summary && (
          <section className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-0.5" style={{ color: accent, borderColor: accent }}>
              Perfil
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{profile.summary}</p>
          </section>
        )}

        {/* Experiencia Laboral */}
        {experiences && experiences.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-0.5" style={{ color: accent, borderColor: accent }}>
              Experiencia
            </h2>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">
                      {exp.role} <span className="font-normal text-slate-500">| {exp.company}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  {exp.location && <p className="text-[11px] text-slate-400">{exp.location}</p>}
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Educación */}
        {education && education.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-0.5" style={{ color: accent, borderColor: accent }}>
              Educación
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">
                      {formatEducationDegree(edu.degree, edu.fieldOfStudy)}{' '}
                      <span className="font-normal text-slate-500">| {edu.institution}</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  {edu.description && <p className="text-xs text-slate-500 italic">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Competencias e Idiomas */}
        {hasSkillsOrLanguages(skills, languages) && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-0.5" style={{ color: accent, borderColor: accent }}>
              Competencias
            </h2>
            <div className="space-y-1.5 text-xs">
              {skills && skills.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-slate-500 mr-1">Habilidades:</span>
                  {skills.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200">
                      {s.name} ({getSkillLevelLabel(s.level)})
                    </span>
                  ))}
                </div>
              )}

              {languages && languages.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-semibold text-slate-500 mr-1">Idiomas:</span>
                  {languages.map((l) => (
                    <span key={l.id} className="text-slate-700">
                      <strong className="font-semibold">{l.name}:</strong> {l.level}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
