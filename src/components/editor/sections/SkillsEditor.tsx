import React, { useState } from 'react';
import type { SkillItem, SkillLevel } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { Award, Plus, Trash2 } from 'lucide-react';

interface SkillsEditorProps {
  skills: SkillItem[];
  onChange: (updated: SkillItem[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onChange }) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('intermediate');

  const handleAdd = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!newSkillName.trim()) return;

    const newItem: SkillItem = {
      id: 'sk-' + Date.now(),
      name: newSkillName.trim(),
      level: newSkillLevel
    };

    onChange([...skills, newItem]);
    setNewSkillName('');
  };

  const handleRemove = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const handleLevelChange = (id: string, level: SkillLevel) => {
    onChange(
      skills.map((s) => (s.id === id ? { ...s, level } : s))
    );
  };

  return (
    <SectionCard title="Habilidades Técnicas y Competencias" icon={<Award className="w-4 h-4" />} badge={skills.length}>
      {/* Formulario rápido para añadir habilidad */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 pb-3 border-b border-slate-100">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Ej: TypeScript, React, Docker..."
          className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        />

        <select
          value={newSkillLevel}
          onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        >
          <option value="basic">Básico</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </select>

        <button
          type="submit"
          className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir</span>
        </button>
      </form>

      {/* Lista de Habilidades */}
      <div className="flex flex-wrap gap-2 pt-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 group hover:border-slate-300 transition"
          >
            <span className="font-medium">{skill.name}</span>

            {/* Selector de nivel en línea */}
            <select
              value={skill.level}
              onChange={(e) => handleLevelChange(skill.id, e.target.value as SkillLevel)}
              className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="basic">Básico</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>

            <button
              type="button"
              onClick={() => handleRemove(skill.id)}
              title="Eliminar habilidad"
              className="text-slate-400 hover:text-red-600 ml-0.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-xs text-slate-400 italic py-1">No hay habilidades añadidas aún.</p>
        )}
      </div>
    </SectionCard>
  );
};
