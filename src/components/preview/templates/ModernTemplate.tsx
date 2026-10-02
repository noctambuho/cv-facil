import React from 'react';
import type { TemplateProps } from '../../../types/cv';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Award, Languages } from 'lucide-react';

const levelLabels = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
};

const levelBadgeStyles = {
  basic: 'bg-slate-100 text-slate-700 border border-slate-300',
  intermediate: 'bg-sky-50 text-sky-800 border border-sky-300',
  advanced: 'bg-blue-100 text-blue-900 border border-blue-400 font-semibold'
};

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';

  const fontClass =
    settings.fontFamily === 'serif'
      ? 'font-serif'
      : settings.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

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
                {profile.fullName
                  ? profile.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'CV'}
              </div>
            )}
            <h2 className="text-lg font-bold tracking-tight text-white">{profile.fullName || 'Tu Nombre'}</h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">{profile.headline || 'Tu Titular Profesional'}</p>
          </div>

          {/* Contacto */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <span>Contacto</span>
            </h3>
            {profile.email && (
              <div className="flex items-center gap-2 text-slate-300 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2 text-slate-300 break-all">
                <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                <span>{profile.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {profile.linkedin && (
              <div className="flex items-center gap-2 text-slate-300 break-all">
                <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                <span>{profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            )}
            {profile.github && (
              <div className="flex items-center gap-2 text-slate-300 break-all">
                <Github className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
                <span>{profile.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </div>
            )}
          </div>

          {/* Habilidades (Skills con enum basic / intermediate / advanced) */}
          {skills.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" style={{ color: accent }} />
                <span>Habilidades</span>
              </h3>
              <div className="flex flex-col gap-1.5">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between text-xs py-0.5">
                    <span className="text-slate-200 font-medium">{skill.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${levelBadgeStyles[skill.level] || 'bg-slate-700 text-slate-200'}`}
                    >
                      {levelLabels[skill.level] || skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Idiomas */}
          {languages.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" style={{ color: accent }} />
                <span>Idiomas</span>
              </h3>
              <div className="space-y-1.5 text-xs">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between">
                    <span className="text-slate-200 font-medium">{lang.name}</span>
                    <span className="text-slate-400">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


      </aside>

      {/* Columna Principal (Main Content) */}
      <main className="w-[67%] p-8 space-y-6">
        {/* Resumen Profesional */}
        {profile.summary && (
          <section className="avoid-break">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              Perfil Profesional
            </h3>
            <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line text-xs">
              {profile.summary}
            </p>
          </section>
        )}

        {/* Experiencia Laboral */}
        {experiences.length > 0 && (
          <section className="space-y-3">
            <h3
              className="text-sm font-bold uppercase tracking-wider pb-1 border-b flex items-center gap-1.5"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experiencia Laboral</span>
            </h3>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="avoid-break space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900 text-[13px]">{exp.role}</h4>
                    <span className="text-[11px] font-medium text-slate-500 shrink-0">
                      {exp.startDate} — {exp.current ? 'Presente' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-slate-700 text-xs whitespace-pre-line leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Educación */}
        {education.length > 0 && (
          <section className="space-y-3">
            <h3
              className="text-sm font-bold uppercase tracking-wider pb-1 border-b flex items-center gap-1.5"
              style={{ color: accent, borderColor: `${accent}40` }}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Educación y Formación</span>
            </h3>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="avoid-break space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900 text-[13px]">
                      {edu.degree} {edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}
                    </h4>
                    <span className="text-[11px] text-slate-500 shrink-0">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{edu.institution}</p>
                  {edu.description && (
                    <p className="text-xs text-slate-700 pt-0.5">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
