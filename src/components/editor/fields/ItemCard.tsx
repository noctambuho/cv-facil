/**
 * src/components/editor/fields/ItemCard.tsx
 * Contenedor visual para elementos individuales dentro de secciones de lista (Experiencia, Educación).
 * Trazabilidad: TASK-7.3, specs/07-refactor-legibilidad.md
 */

import React from 'react';
import { Trash2 } from 'lucide-react';

export interface ItemCardProps {
  title: string;
  onRemove: () => void;
  removeTitle?: string;
  children: React.ReactNode;
}

/**
 * [COMPONENTE] Tarjeta de ítem editable con encabezado de orden y acción de borrado.
 */
export const ItemCard: React.FC<ItemCardProps> = ({
  title,
  onRemove,
  removeTitle = 'Eliminar elemento',
  children,
}) => {
  return (
    <div className="p-4 bg-slate-50/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3 relative group">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {title}
        </span>
        <button
          type="button"
          onClick={onRemove}
          title={removeTitle}
          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-md transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {children}
    </div>
  );
};
