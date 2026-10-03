/**
 * src/components/preview/templates/ModernTemplate.tsx
 * Plantilla Moderna de dos columnas para visualización interactiva HTML en A4.
 * Trazabilidad: US-09, TASK-7.5
 */

import React from 'react';
import type { TemplateProps } from '../../../types/cv';
import {
  formatDateRange,
  formatEducationDegree,
  getProfileInitials,
  toDisplayUrl,
  getSkillLevelLabel,
  getFontClass,
} from '../../../domain/cvFormatters';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Award, Languages } from 'lucide-react';

const LEVEL_BADGE_STYLES: Record<string, string> = {
  basic: 'bg-slate-100 text-slate-700 border border-slate-300',
  intermediate: 'bg-sky-50 text-sky-800 border border-sky-300',
  advanced: 'bg-blue-100 text-blue-900 border border-blue-400 font-semibold',
};

/**
 * [COMPONENTE] Plantilla moderna A4 interactiva HTML.
 */
export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';
  const fontClass = getFontClass(settings.fontFamily);

  return (
    <div className={`w-full min-h-[297mm] bg-white text-slate-900 flex ${fontClass} text-[13px] leading-relaxed`}>
      {/* Columna Lateral (Sidebar) */}
      <aside className="w-[33%] bg-slate-900 text-slate-100 p-6 flex flex-col justify-between" style={{ borderRight: `4px solid ${accent}` }}>
        <div className="space-y-6">
          {/* Avatar / Iniciales */}
          <div className="flex flex-col items-center text-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover border-2 border-white/40 mb-3 shadow"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-inner"
                style={{ backgroundColor: accent }}
              >
                {getProfileInitials(profile.fullName)}
              </div>
            )}
            {profile.fullName && <h1 className="text-xl font-bold tracking-tight text-white">{profile.fullName}</h1>}
            {profile.headline && <p className="text-xs text-slate-300 mt-1 font-medium">{profile.headline}</p>}
          </div>

          {/* Información de Contacto */}
          <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Contacto</h2>
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{toDisplayUrl(profile.website)}</span>
              </div>
            )}
            {profile.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{toDisplayUrl(profile.linkedin)}</span>
              </div>
            )}
            {profile.github && (
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{toDisplayUrl(profile.github)}</span>
              </div>
            )}
          </div>

          {/* Habilidades Técnicas */}
          {skills && skills.length > 0 && (
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Award className="w-3.5 h-3.5" />
                <h2 className="text-[11px] font-bold uppercase tracking-wider">Competencias</h2>
              </div>
              <div className="space-y-1.5">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center text-xs">
                    <span className="text-slate-200">{skill.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${LEVEL_BADGE_STYLES[skill.level] || ''}`}>
                      {getSkillLevelLabel(skill.level)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Idiomas */}
          {languages && languages.length > 0 && (
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Languages className="w-3.5 h-3.5" />
                <h2 className="text-[11px] font-bold uppercase tracking-wider">Idiomas</h2>
              </div>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-xs">
                    <span className="text-slate-200">{lang.name}</span>
                    <span className="text-slate-400">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Columna Principal */}
      <main className="w-[67%] p-8 space-y-6">
        {/* Perfil Profesional */}
        {profile.summary && (
          <section className="space-y-2">
            <h2
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              <Briefcase className="w-4 h-4" />
              <span>Perfil Profesional</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-xs text-justify">{profile.summary}</p>
          </section>
        )}

        {/* Experiencia Laboral */}
        {experiences && experiences.length > 0 && (
          <section className="space-y-3">
            <h2
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experiencia Laboral</span>
            </h2>
            <div className="space-y-3.5">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{exp.role}</h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span className="font-medium">{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formación Académica */}
        {education && education.length > 0 && (
          <section className="space-y-3">
            <h2
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Educación y Formación</span>
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{formatEducationDegree(edu.degree, edu.fieldOfStudy)}</h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{edu.institution}</p>
                  {edu.description && <p className="text-xs text-slate-600 italic">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
