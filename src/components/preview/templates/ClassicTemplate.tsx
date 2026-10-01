import React from 'react';
import type { CVData, TemplateProps } from '../../../types/cv';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

const levelLabels = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
};

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
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
      {/* Encabezado Clásico Centrado */}
      <header className="text-center pb-5 border-b-2" style={{ borderColor: accent }}>
        <h1 className="text-2xl font-bold tracking-wide uppercase text-slate-900">
          {profile.fullName || 'Tu Nombre Completo'}
        </h1>
        {profile.headline && (
          <p className="text-sm font-semibold tracking-wider uppercase mt-1" style={{ color: accent }}>
            {profile.headline}
          </p>
        )}

        {/* Contact Bar */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-3">
          {profile.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              {profile.email}
            </span>
          )}
          {profile.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              {profile.phone}
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {profile.location}
            </span>
          )}
          {profile.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" />
              {profile.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {profile.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3 text-slate-400" />
              {profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {profile.github && (
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3 text-slate-400" />
              {profile.github.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </header>

      {/* Resumen Profesional */}
      {profile.summary && (
        <section className="mt-5 avoid-break">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-1"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Perfil Profesional
          </h2>
          <p className="text-slate-700 text-xs leading-relaxed text-justify whitespace-pre-line">
            {profile.summary}
          </p>
        </section>
      )}

      {/* Experiencia Laboral */}
      {experiences.length > 0 && (
        <section className="mt-5">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-3 border-b pb-1"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Experiencia Laboral
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="avoid-break space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[13px]">{exp.role}</span>
                  <span className="text-[11px] text-slate-600 italic">
                    {exp.startDate} — {exp.current ? 'Presente' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span className="font-semibold">{exp.company}</span>
                  {exp.location && <span className="text-slate-500 italic">{exp.location}</span>}
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
        <section className="mt-5">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-3 border-b pb-1"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Educación y Formación
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="avoid-break space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-[13px]">
                    {edu.degree} {edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}
                  </span>
                  <span className="text-[11px] text-slate-600 italic">
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <p className="text-xs text-slate-700">{edu.institution}</p>
                {edu.description && (
                  <p className="text-xs text-slate-600 pt-0.5">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Habilidades e Idiomas */}
      {(skills.length > 0 || languages.length > 0) && (
        <section className="mt-5 avoid-break">
          <h2
            className="text-xs font-bold uppercase tracking-wider mb-3 border-b pb-1"
            style={{ color: accent, borderColor: `${accent}40` }}
          >
            Habilidades y Competencias
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            {skills.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-800 mb-1.5">Conocimientos Técnicos:</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s.id} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                      {s.name} <span className="text-slate-500 text-[10px]">({levelLabels[s.level] || s.level})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {languages.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-800 mb-1.5">Idiomas:</h3>
                <div className="space-y-1">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span className="text-slate-800">{l.name}</span>
                      <span className="text-slate-500 italic">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
