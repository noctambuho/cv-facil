import React from 'react';
import type { Profile } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, FileText, Image } from 'lucide-react';

interface ProfileEditorProps {
  profile: Profile;
  onChange: (updated: Profile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange }) => {
  const handleChange = (field: keyof Profile, value: string) => {
    onChange({
      ...profile,
      [field]: value
    });
  };

  return (
    <SectionCard title="Datos Personales y Contacto" icon={<User className="w-4 h-4" />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Nombre completo */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo *</label>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="Ej: Alejandro Morales"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Titular profesional */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo / Titular Profesional *</label>
          <input
            type="text"
            value={profile.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="Ej: Senior Full Stack Engineer"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" /> Correo Electrónico
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="alejandro@ejemplo.com"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" /> Teléfono
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+34 612 345 678"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> Ubicación / Residencia
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Madrid, España"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Sitio Web */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" /> Sitio Web o Portfolio
          </label>
          <input
            type="url"
            value={profile.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://amorales.dev"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Linkedin className="w-3 h-3 text-slate-400" /> Perfil de LinkedIn
          </label>
          <input
            type="text"
            value={profile.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/usuario"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Github className="w-3 h-3 text-slate-400" /> Perfil de GitHub
          </label>
          <input
            type="text"
            value={profile.github}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="github.com/usuario"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Foto de perfil / Avatar URL */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <Image className="w-3 h-3 text-slate-400" /> URL de Foto de Perfil (Opcional)
          </label>
          <input
            type="url"
            value={profile.avatarUrl || ''}
            onChange={(e) => handleChange('avatarUrl', e.target.value)}
            placeholder="https://images.unsplash.com/... o enlace público"
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Resumen Profesional */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3 text-slate-400" /> Perfil / Resumen Profesional
          </label>
          <textarea
            rows={4}
            value={profile.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            placeholder="Describe tu trayectoria, logros destacados y valor diferencial que aportas..."
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-y"
          />
        </div>
      </div>
    </SectionCard>
  );
};
