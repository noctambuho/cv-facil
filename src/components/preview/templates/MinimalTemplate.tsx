import React from 'react';
import type { CVData, TemplateProps } from '../../../types/cv';

const levelLabels = {
  basic: 'Básico',
  intermediate: 'Medio',
  advanced: 'Avanzado'
};

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { profile, experiences, education, skills, languages, settings } = data;
  const accent = settings.accentColor || '#1e40af';

  const fontClass =
    settings.fontFamily === 'serif'
      ? 'font-serif'
      : settings.fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div className={`w-full min-h-[297mm] bg-white text-slate-900 p-10 ${fontClass} text-[13px] leading-relaxed`}>
      {/* Encabezado Minimalista Tech */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {profile.fullName || 'Tu Nombre'}
        </h1>
        <p className="text-sm font-medium mt-0.5" style={{ color: accent }}>
          {profile.headline || 'Ingeniero de Software'}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-2 font-mono">
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>• {profile.phone}</span>}
          {profile.location && <span>• {profile.location}</span>}
          {profile.website && (
            <span>
              •{' '}
              <a href={profile.website} className="underline hover:text-slate-800">
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </span>
          )}
          {profile.github && (
            <span>
              •{' '}
              <a href={`https://${profile.github.replace(/^https?:\/\//, '')}`} className="underline hover:text-slate-800">
                {profile.github.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </span>
          )}
          {profile.linkedin && (
            <span>
              •{' '}
              <a href={`https://${profile.linkedin.replace(/^https?:\/\//, '')}`} className="underline hover:text-slate-800">
                {profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Resumen */}
      {profile.summary && (
        <section className="mb-6 avoid-break">
          <p className="text-slate-700 text-xs leading-relaxed text-justify whitespace-pre-line">
            {profile.summary}
          </p>
        </section>
      )}

      {/* Experiencia */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-xs font-mono font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
            style={{ color: accent, borderColor: accent }}
          >
            // Experiencia
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="avoid-break space-y-1">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-[13px]">{exp.role}</span>
                    <span className="text-xs text-slate-500 font-mono">@ {exp.company}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {exp.startDate} → {exp.current ? 'Presente' : exp.endDate}
                  </span>
                </div>
                {exp.location && <div className="text-[11px] text-slate-400">{exp.location}</div>}
                {exp.description && (
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pt-1">
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
        <section className="mb-6">
          <h2
            className="text-xs font-mono font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
            style={{ color: accent, borderColor: accent }}
          >
            // Educación
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="avoid-break">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[13px]">
                    {edu.degree} {edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <div className="text-xs text-slate-600">{edu.institution}</div>
                {edu.description && <p className="text-xs text-slate-500 pt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Habilidades & Idiomas */}
      {(skills.length > 0 || languages.length > 0) && (
        <section className="avoid-break">
          <h2
            className="text-xs font-mono font-bold uppercase tracking-widest pb-1 mb-3 border-b-2"
            style={{ color: accent, borderColor: accent }}
          >
            // Competencias
          </h2>
          <div className="space-y-2 text-xs">
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="font-mono text-slate-500 text-[11px] mr-1">Skills:</span>
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {s.name} <span className="text-slate-400">({levelLabels[s.level] || s.level})</span>
                  </span>
                ))}
              </div>
            )}
            {languages.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pt-1 font-mono text-xs">
                <span className="text-slate-500 text-[11px]">Idiomas:</span>
                {languages.map((l) => (
                  <span key={l.id} className="text-slate-700">
                    {l.name} <span className="text-slate-400">({l.level})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
