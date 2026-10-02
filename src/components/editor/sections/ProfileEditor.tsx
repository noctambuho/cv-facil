import React from 'react';
import type { Profile } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { User, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { sanitizeExternalUrl } from '../../../utils/security';

export interface ProfileEditorProps {
  profile: Profile;
  onChange: (updated: Profile) => void;
}

/**
 * ProfileEditor: Formulario para datos personales, enlaces de contacto y resumen profesional.
 * La carga de foto se delega al componente ProfilePhotoUpload (SRP).
 * Trazabilidad: US-01, TASK-2.2.4, TASK-2.5.1
 */
export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange }) => {
  const handleChange = (field: keyof Profile, value: string) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  return (
    <SectionCard title="Datos Personales y Contacto" icon={<User className="w-4 h-4" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Nombre completo */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Ej: Alejandro Morales"
            className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition"
          />
        </div>

        {/* Titular profesional */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Cargo / Titular Profesional *
          </label>
          <input
            type="text"
            value={profile.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="Ej: Senior Full Stack Engineer"
            className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition"
          />
        </div>

        {/* Correo electrónico */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Mail className="w-3 h-3 inline mr-1 text-slate-400" /> Correo Electrónico
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="nombre@mail.com"
            className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Phone className="w-3 h-3 inline mr-1 text-slate-400" /> Teléfono
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+56 9 1234 5678"
            className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition"
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <MapPin className="w-3 h-3 inline mr-1 text-slate-400" /> Ubicación
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Santiago, Chile"
            className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            value={profile.linkedin}
            onChange={(e) => handleChange('linkedin', sanitizeExternalUrl(e.target.value))}
            placeholder="https://linkedin.com/in/tuusuario"
            className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            GitHub
          </label>
          <input
            type="url"
            value={profile.github}
            onChange={(e) => handleChange('github', sanitizeExternalUrl(e.target.value))}
            placeholder="https://github.com/tuusuario"
            className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition"
          />
        </div>

        {/* Sitio Web */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Globe className="w-3 h-3 inline mr-1 text-slate-400" /> Sitio Web / Portfolio
          </label>
          <input
            type="url"
            value={profile.website}
            onChange={(e) => handleChange('website', sanitizeExternalUrl(e.target.value))}
            placeholder="https://tu-portfolio.dev"
            className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition"
          />
        </div>

        {/* Foto de Perfil (Subcomponente modular) */}
        <ProfilePhotoUpload
          avatarUrl={profile.avatarUrl || ''}
          onChange={(newUrl) => handleChange('avatarUrl', newUrl)}
        />
      </div>

      {/* Resumen profesional */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <FileText className="w-3 h-3 inline mr-1 text-slate-400" /> Resumen Profesional
        </label>
        <textarea
          value={profile.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Breve resumen profesional que destaque tu propuesta de valor (2-3 oraciones)..."
          rows={4}
          maxLength={600}
          className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 resize-none transition"
        />
        <div className="text-right text-[10px] text-slate-400 mt-0.5">
          {profile.summary.length}/600 caracteres
        </div>
      </div>
    </SectionCard>
  );
};
