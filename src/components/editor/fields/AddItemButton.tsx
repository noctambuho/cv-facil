/**
 * src/components/editor/fields/AddItemButton.tsx
 * Botón punteado accesible para incorporar nuevos elementos a colecciones del currículum.
 * Trazabilidad: TASK-7.3, specs/07-refactor-legibilidad.md
 */

import React from 'react';
import { Plus } from 'lucide-react';

export interface AddItemButtonProps {
  label: string;
  onClick: () => void;
}

/**
 * [COMPONENTE] Botón con borde dashed para agregar ítems a listas.
 */
export const AddItemButton: React.FC<AddItemButtonProps> = ({ label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-2.5 px-4 border border-dashed border-blue-400 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
    >
      <Plus className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};
