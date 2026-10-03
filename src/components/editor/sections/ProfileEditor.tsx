/**
 * src/components/editor/sections/ProfileEditor.tsx
 * Formulario para datos personales, enlaces de contacto y resumen profesional.
 * Trazabilidad: US-01, TASK-7.4
 */

import React from 'react';
import type { Profile } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';
import { EditorField } from '../fields/EditorField';
import { User, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { sanitizeExternalUrl } from '../../../domain/security';

export interface ProfileEditorProps {
  profile: Profile;
  onChange: (updated: Profile) => void;
}

/**
 * [COMPONENTE] Sección de formulario para la información personal y de contacto.
 */
export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange }) => {
  const handleChange = (field: keyof Profile, value: string) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  const handleUrlBlur = (field: 'linkedin' | 'github' | 'website') => {
    const raw = profile[field] || '';
    const clean = sanitizeExternalUrl(raw);
    if (clean !== raw) {
      handleChange(field, clean);
    }
  };

  return (
    <SectionCard title="Datos Personales y Contacto" icon={<User className="w-4 h-4" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <EditorField
          label="Nombre Completo"
          required
          value={profile.fullName}
          onChange={(val) => handleChange('fullName', val)}
          placeholder="Ej: Alejandro Morales"
        />

        <EditorField
          label="Cargo / Titular Profesional"
          required
          value={profile.headline}
          onChange={(val) => handleChange('headline', val)}
          placeholder="Ej: Senior Full Stack Engineer"
        />

        <EditorField
          label="Correo Electrónico"
          icon={<Mail className="w-3 h-3" />}
          type="email"
          value={profile.email}
          onChange={(val) => handleChange('email', val)}
          placeholder="alejandro@ejemplo.com"
        />

        <EditorField
          label="Teléfono"
          icon={<Phone className="w-3 h-3" />}
          type="tel"
          value={profile.phone}
          onChange={(val) => handleChange('phone', val)}
          placeholder="+34 600 000 000"
        />

        <EditorField
          label="Ubicación"
          icon={<MapPin className="w-3 h-3" />}
          value={profile.location}
          onChange={(val) => handleChange('location', val)}
          placeholder="Madrid, España / Remoto"
        />

        <EditorField
          label="LinkedIn"
          type="url"
          value={profile.linkedin}
          onChange={(val) => handleChange('linkedin', val)}
          onBlur={() => handleUrlBlur('linkedin')}
          placeholder="https://linkedin.com/in/tuusuario"
        />

        <EditorField
          label="GitHub"
          type="url"
          value={profile.github}
          onChange={(val) => handleChange('github', val)}
          onBlur={() => handleUrlBlur('github')}
          placeholder="https://github.com/tuusuario"
        />

        <EditorField
          label="Sitio Web / Portfolio"
          icon={<Globe className="w-3 h-3" />}
          type="url"
          value={profile.website}
          onChange={(val) => handleChange('website', val)}
          onBlur={() => handleUrlBlur('website')}
          placeholder="https://tu-portfolio.dev"
        />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <ProfilePhotoUpload
          avatarUrl={profile.avatarUrl || ''}
          onChange={(newUrl) => handleChange('avatarUrl', newUrl)}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <EditorField
          as="textarea"
          label="Resumen Profesional"
          icon={<FileText className="w-3 h-3" />}
          rows={4}
          value={profile.summary}
          onChange={(val) => handleChange('summary', val.slice(0, 600))}
          placeholder="Breve extracto de tu trayectoria, especialidad técnica e impacto..."
          helperText={`${profile.summary?.length || 0} / 600 caracteres recomendados`}
        />
      </div>
    </SectionCard>
  );
};
