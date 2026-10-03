/**
 * src/components/editor/sections/ExperienceEditor.tsx
 * Formulario interactivo para gestionar la trayectoria laboral del candidato.
 * Trazabilidad: US-02, TASK-7.4
 */

import React from 'react';
import type { ExperienceItem } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { EditorField } from '../fields/EditorField';
import { ItemCard } from '../fields/ItemCard';
import { AddItemButton } from '../fields/AddItemButton';
import { prependItem, removeById, updateFieldById } from '../../../domain/listOps';
import { generateSecureId } from '../../../domain/security';
import { Briefcase, Building, MapPin, Calendar } from 'lucide-react';

export interface ExperienceEditorProps {
  experiences: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

/**
 * [COMPONENTE] Sección para agregar, editar y eliminar puestos de trabajo.
 */
export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experiences, onChange }) => {
  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: generateSecureId('exp'),
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    onChange(prependItem(experiences, newItem));
  };

  const handleRemove = (id: string) => {
    onChange(removeById(experiences, id));
  };

  const handleUpdate = <K extends keyof ExperienceItem>(
    id: string,
    field: K,
    value: ExperienceItem[K]
  ) => {
    onChange(updateFieldById(experiences, id, field, value));
  };

  return (
    <SectionCard
      title="Experiencia Laboral"
      icon={<Briefcase className="w-4 h-4" />}
      badge={experiences.length}
    >
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <ItemCard
            key={exp.id}
            title={`Puesto #${experiences.length - index}: ${exp.role || exp.company || 'Sin título'}`}
            onRemove={() => handleRemove(exp.id)}
            removeTitle="Eliminar experiencia"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <EditorField
                label="Empresa / Organización"
                required
                icon={<Building className="w-3 h-3" />}
                value={exp.company}
                onChange={(val) => handleUpdate(exp.id, 'company', val)}
                placeholder="Ej: TechFlow Solutions"
              />

              <EditorField
                label="Cargo / Puesto"
                required
                value={exp.role}
                onChange={(val) => handleUpdate(exp.id, 'role', val)}
                placeholder="Ej: Senior Software Engineer"
              />

              <EditorField
                label="Ubicación"
                icon={<MapPin className="w-3 h-3" />}
                value={exp.location}
                onChange={(val) => handleUpdate(exp.id, 'location', val)}
                placeholder="Ej: Madrid / Remoto"
              />

              <div className="grid grid-cols-2 gap-2">
                <EditorField
                  label="Inicio"
                  icon={<Calendar className="w-3 h-3" />}
                  value={exp.startDate}
                  onChange={(val) => handleUpdate(exp.id, 'startDate', val)}
                  placeholder="2022-03"
                />

                <EditorField
                  label="Fin"
                  disabled={exp.current}
                  value={exp.current ? 'Presente' : exp.endDate}
                  onChange={(val) => handleUpdate(exp.id, 'endDate', val)}
                  placeholder="2024-01"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => handleUpdate(exp.id, 'current', e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
              />
              <label
                htmlFor={`current-${exp.id}`}
                className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none"
              >
                Actualmente trabajo aquí
              </label>
            </div>

            <EditorField
              as="textarea"
              label="Responsabilidades y Logros Destacados"
              rows={3}
              value={exp.description}
              onChange={(val) => handleUpdate(exp.id, 'description', val)}
              placeholder="• Lideré el equipo técnico...&#10;• Reduje la latencia en un 40%..."
            />
          </ItemCard>
        ))}

        <AddItemButton label="Añadir Experiencia Laboral" onClick={handleAdd} />
      </div>
    </SectionCard>
  );
};
