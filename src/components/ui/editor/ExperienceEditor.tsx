import React from 'react';
import type { ExperienceItem } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { Briefcase, Plus, Trash2, Calendar, MapPin, Building } from 'lucide-react';

interface ExperienceEditorProps {
  experiences: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experiences, onChange }) => {
  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: 'exp-' + Date.now(),
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange([newItem, ...experiences]);
  };

  const handleRemove = (id: string) => {
    onChange(experiences.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(
      experiences.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  return (
    <SectionCard
      title="Experiencia Laboral"
      icon={<Briefcase className="w-4 h-4" />}
      badge={experiences.length}
    >
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3 relative group"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">
                Puesto #{experiences.length - index}: {exp.role || exp.company || 'Sin título'}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(exp.id)}
                title="Eliminar experiencia"
                className="text-slate-400 hover:text-red-600 p-1 rounded-md transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" /> Empresa / Organización *
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleUpdate(exp.id, 'company', e.target.value)}
                  placeholder="Ej: TechFlow Solutions"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cargo / Puesto *
                </label>
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => handleUpdate(exp.id, 'role', e.target.value)}
                  placeholder="Ej: Senior Software Engineer"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Ubicación
                </label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleUpdate(exp.id, 'location', e.target.value)}
                  placeholder="Ej: Madrid / Remoto"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Inicio
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleUpdate(exp.id, 'startDate', e.target.value)}
                    placeholder="2022-03"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Fin</label>
                  <input
                    type="text"
                    disabled={exp.current}
                    value={exp.current ? 'Presente' : exp.endDate}
                    onChange={(e) => handleUpdate(exp.id, 'endDate', e.target.value)}
                    placeholder="2024-01"
                    className={`w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition ${
                      exp.current ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => handleUpdate(exp.id, 'current', e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-700 cursor-pointer select-none">
                Actualmente trabajo aquí
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Responsabilidades y Logros Destacados
              </label>
              <textarea
                rows={3}
                value={exp.description}
                onChange={(e) => handleUpdate(exp.id, 'description', e.target.value)}
                placeholder="• Lideré el equipo técnico...&#10;• Reduje la latencia en un 40%..."
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-y"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-2.5 px-4 border border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Experiencia Laboral</span>
        </button>
      </div>
    </SectionCard>
  );
};
