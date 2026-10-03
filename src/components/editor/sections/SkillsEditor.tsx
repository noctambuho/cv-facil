/**
 * src/components/editor/sections/SkillsEditor.tsx
 * Formulario para añadir, clasificar por nivel y eliminar habilidades técnicas y blandas.
 * Trazabilidad: US-04, TASK-7.4
 */

import React, { useState } from 'react';
import type { SkillItem, SkillLevel } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { appendItem, removeById, updateFieldById } from '../../../domain/listOps';
import { generateSecureId } from '../../../domain/security';
import { SKILL_LEVEL_LABELS } from '../../../domain/catalogs';
import { Award, Plus, X } from 'lucide-react';

export interface SkillsEditorProps {
  skills: SkillItem[];
  onChange: (updated: SkillItem[]) => void;
}

/**
 * [COMPONENTE] Sección para gestionar competencias técnicas con selector de nivel.
 */
export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onChange }) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('intermediate');

  const handleAdd = () => {
    if (!newSkillName.trim()) return;
    const newItem: SkillItem = {
      id: generateSecureId('sk'),
      name: newSkillName.trim(),
      level: newSkillLevel,
    };
    onChange(appendItem(skills, newItem));
    setNewSkillName('');
  };

  const handleRemove = (id: string) => {
    onChange(removeById(skills, id));
  };

  const handleLevelChange = (id: string, level: SkillLevel) => {
    onChange(updateFieldById(skills, id, 'level', level));
  };

  return (
    <SectionCard title="Habilidades Técnicas y Competencias" icon={<Award className="w-4 h-4" />} badge={skills.length}>
      <div className="space-y-4">
        {/* Formulario de entrada rápida */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            placeholder="Ej: TypeScript, React, Docker..."
            className="flex-1 text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
          />

          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
            className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
          >
            {Object.entries(SKILL_LEVEL_LABELS).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>

        {/* Nube interactiva de chips */}
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <span>{skill.name}</span>
              <select
                value={skill.level}
                onChange={(e) => handleLevelChange(skill.id, e.target.value as SkillLevel)}
                className="text-[10px] bg-transparent text-slate-500 dark:text-slate-400 font-semibold cursor-pointer border-0 p-0 focus:ring-0"
              >
                {Object.entries(SKILL_LEVEL_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleRemove(skill.id)}
                title="Eliminar habilidad"
                className="text-slate-400 hover:text-red-500 transition ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};
