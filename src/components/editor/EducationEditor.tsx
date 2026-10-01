import React from 'react';
import type { EducationItem } from '../../types/cv';
import { SectionCard } from './SectionCard';
import { GraduationCap, Plus, Trash2, Calendar, BookOpen } from 'lucide-react';

interface EducationEditorProps {
  education: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ education, onChange }) => {
  const handleAdd = () => {
    const newItem: EducationItem = {
      id: 'edu-' + Date.now(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange([...education, newItem]);
  };

  const handleRemove = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  const handleUpdate = (id: string, field: keyof EducationItem, value: string) => {
    onChange(
      education.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  return (
    <SectionCard
      title="Educación y Formación"
      icon={<GraduationCap className="w-4 h-4" />}
      badge={education.length}
    >
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div
            key={edu.id}
            className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-3 relative group"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">
                Titulación #{index + 1}: {edu.degree || edu.institution || 'Sin título'}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(edu.id)}
                title="Eliminar titulación"
                className="text-slate-400 hover:text-red-600 p-1 rounded-md transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-slate-400" /> Institución Educativa / Universidad *
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleUpdate(edu.id, 'institution', e.target.value)}
                  placeholder="Ej: Universidad Politécnica"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Título / Grado Obtenido *
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdate(edu.id, 'degree', e.target.value)}
                  placeholder="Ej: Grado en Ingeniería Informática"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Campo de Estudio / Especialidad
                </label>
                <input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleUpdate(edu.id, 'fieldOfStudy', e.target.value)}
                  placeholder="Ej: Software y Sistemas Distribuidos"
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> Año Inicio
                  </label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleUpdate(edu.id, 'startDate', e.target.value)}
                    placeholder="2016"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Año Fin</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleUpdate(edu.id, 'endDate', e.target.value)}
                    placeholder="2020"
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Detalles Adicionales / Menciones (Opcional)
              </label>
              <input
                type="text"
                value={edu.description || ''}
                onChange={(e) => handleUpdate(edu.id, 'description', e.target.value)}
                placeholder="Ej: Graduado con honores o promedio destacado"
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
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
          <span>Añadir Titulación / Formación</span>
        </button>
      </div>
    </SectionCard>
  );
};
