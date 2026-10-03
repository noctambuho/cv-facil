/**
 * src/components/editor/sections/LanguagesEditor.tsx
 * Formulario para añadir y eliminar idiomas dominados con sus niveles de certificación.
 * Trazabilidad: US-05, TASK-7.4
 */

import React, { useState } from 'react';
import type { LanguageItem } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { appendItem, removeById } from '../../../domain/listOps';
import { generateSecureId } from '../../../domain/security';
import { Languages, Plus, X } from 'lucide-react';

export interface LanguagesEditorProps {
  languages: LanguageItem[];
  onChange: (updated: LanguageItem[]) => void;
}

const COMMON_LEVELS = ['Nativo', 'C2 Bilingüe', 'C1 Avanzado', 'B2 Intermedio Alto', 'B1 Intermedio', 'A2 Básico'];

/**
 * [COMPONENTE] Sección para administrar idiomas y fluidez lingüística.
 */
export const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ languages, onChange }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('C1 Avanzado');

  const handleAdd = () => {
    if (!name.trim()) return;
    const newItem: LanguageItem = {
      id: generateSecureId('lang'),
      name: name.trim(),
      level,
    };
    onChange(appendItem(languages, newItem));
    setName('');
  };

  const handleRemove = (id: string) => {
    onChange(removeById(languages, id));
  };

  return (
    <SectionCard title="Idiomas" icon={<Languages className="w-4 h-4" />} badge={languages.length}>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            placeholder="Ej: Inglés, Alemán, Portugués..."
            className="flex-1 text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
          />

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition"
          >
            {COMMON_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
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

        <div className="flex flex-wrap gap-1.5">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <span className="font-semibold">{lang.name}:</span>
              <span className="text-slate-600 dark:text-slate-400">{lang.level}</span>
              <button
                type="button"
                onClick={() => handleRemove(lang.id)}
                title="Eliminar idioma"
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
