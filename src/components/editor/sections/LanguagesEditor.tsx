import React, { useState } from 'react';
import type { LanguageItem } from '../../../types/cv';
import { SectionCard } from './SectionCard';
import { Languages, Plus, Trash2 } from 'lucide-react';

interface LanguagesEditorProps {
  languages: LanguageItem[];
  onChange: (updated: LanguageItem[]) => void;
}

export const LanguagesEditor: React.FC<LanguagesEditorProps> = ({ languages, onChange }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('B2 Intermedio');

  const handleAdd = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const newItem: LanguageItem = {
      id: 'lang-' + Date.now(),
      name: name.trim(),
      level
    };

    onChange([...languages, newItem]);
    setName('');
  };

  const handleRemove = (id: string) => {
    onChange(languages.filter((l) => l.id !== id));
  };

  return (
    <SectionCard title="Idiomas" icon={<Languages className="w-4 h-4" />} badge={languages.length}>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 pb-3 border-b border-slate-100">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Español, Inglés, Francés..."
          className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        />

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
        >
          <option value="Nativo">Nativo / Bilingüe</option>
          <option value="C2 Avanzado / Maestría">C2 Maestría</option>
          <option value="C1 Profesional Completo">C1 Avanzado</option>
          <option value="B2 Intermedio Alto">B2 Intermedio Alto</option>
          <option value="B1 Intermedio">B1 Intermedio</option>
          <option value="A2 / A1 Básico">A2/A1 Elemental</option>
        </select>

        <button
          type="submit"
          className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir</span>
        </button>
      </form>

      <div className="space-y-2 pt-2">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <span className="font-semibold text-slate-800">{lang.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                {lang.level}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(lang.id)}
                title="Eliminar idioma"
                className="text-slate-400 hover:text-red-600 p-0.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {languages.length === 0 && (
          <p className="text-xs text-slate-400 italic py-1">No hay idiomas añadidos aún.</p>
        )}
      </div>
    </SectionCard>
  );
};
