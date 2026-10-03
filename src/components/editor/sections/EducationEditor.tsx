/**
 * src/components/editor/sections/EducationEditor.tsx
 * Formulario interactivo para gestionar la formación académica y certificaciones.
 * Trazabilidad: US-03, TASK-7.4
 */

import React from 'react';
import type { EducationItem } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { EditorField } from '../fields/EditorField';
import { ItemCard } from '../fields/ItemCard';
import { AddItemButton } from '../fields/AddItemButton';
import { appendItem, removeById, updateFieldById } from '../../../domain/listOps';
import { generateSecureId } from '../../../domain/security';
import { GraduationCap, Landmark, Calendar } from 'lucide-react';

export interface EducationEditorProps {
  education: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

/**
 * [COMPONENTE] Sección para agregar, editar y eliminar titulaciones académicas.
 */
export const EducationEditor: React.FC<EducationEditorProps> = ({ education, onChange }) => {
  const handleAdd = () => {
    const newItem: EducationItem = {
      id: generateSecureId('edu'),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    onChange(appendItem(education, newItem));
  };

  const handleRemove = (id: string) => {
    onChange(removeById(education, id));
  };

  const handleUpdate = <K extends keyof EducationItem>(
    id: string,
    field: K,
    value: EducationItem[K]
  ) => {
    onChange(updateFieldById(education, id, field, value));
  };

  return (
    <SectionCard
      title="Formación Académica"
      icon={<GraduationCap className="w-4 h-4" />}
      badge={education.length}
    >
      <div className="space-y-4">
        {education.map((edu, index) => (
          <ItemCard
            key={edu.id}
            title={`Titulación #${index + 1}: ${edu.degree || edu.institution || 'Sin título'}`}
            onRemove={() => handleRemove(edu.id)}
            removeTitle="Eliminar titulación"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <EditorField
                label="Institución / Universidad"
                required
                icon={<Landmark className="w-3 h-3" />}
                value={edu.institution}
                onChange={(val) => handleUpdate(edu.id, 'institution', val)}
                placeholder="Ej: Universidad Politécnica"
              />

              <EditorField
                label="Título / Grado Obtenido"
                required
                value={edu.degree}
                onChange={(val) => handleUpdate(edu.id, 'degree', val)}
                placeholder="Ej: Grado en Ingeniería Informática"
              />

              <EditorField
                label="Campo de Estudio / Especialidad"
                value={edu.fieldOfStudy}
                onChange={(val) => handleUpdate(edu.id, 'fieldOfStudy', val)}
                placeholder="Ej: Desarrollo de Software"
              />

              <div className="grid grid-cols-2 gap-2">
                <EditorField
                  label="Inicio"
                  icon={<Calendar className="w-3 h-3" />}
                  value={edu.startDate}
                  onChange={(val) => handleUpdate(edu.id, 'startDate', val)}
                  placeholder="2018-09"
                />

                <EditorField
                  label="Fin"
                  value={edu.endDate}
                  onChange={(val) => handleUpdate(edu.id, 'endDate', val)}
                  placeholder="2022-06"
                />
              </div>
            </div>

            <EditorField
              as="textarea"
              label="Detalles Adicionales (Opcional)"
              rows={2}
              value={edu.description || ''}
              onChange={(val) => handleUpdate(edu.id, 'description', val)}
              placeholder="Mención de honor, proyectos destacados o tesis..."
            />
          </ItemCard>
        ))}

        <AddItemButton label="Añadir Formación Académica" onClick={handleAdd} />
      </div>
    </SectionCard>
  );
};
