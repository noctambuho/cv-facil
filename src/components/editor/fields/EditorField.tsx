/**
 * src/components/editor/fields/EditorField.tsx
 * Campo de entrada accesible reutilizable para los formularios del editor.
 * Unifica etiquetas, iconos, estados de foco y estilos de modo oscuro (WCAG AA).
 * Trazabilidad: TASK-7.3, specs/07-refactor-legibilidad.md
 */

import React, { useId } from 'react';
import { cn } from '../../common/cn';

export interface EditorFieldProps {
  label?: string;
  icon?: React.ReactNode;
  type?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  value?: string;
  onChange?: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  className?: string;
}

/**
 * [COMPONENTE] Campo de formulario unificado para secciones del editor de CV.
 */
export const EditorField: React.FC<EditorFieldProps> = ({
  label,
  icon,
  type = 'text',
  as = 'input',
  rows = 3,
  value = '',
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  helperText,
  className = '',
}) => {
  const generatedId = useId();
  const inputClass = cn(
    'w-full text-xs px-2.5 py-1.5 rounded-lg border transition',
    'bg-white dark:bg-slate-900',
    'border-slate-200 dark:border-slate-700',
    'text-slate-900 dark:text-white',
    'placeholder:text-slate-400 dark:placeholder:text-slate-500',
    'focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent',
    disabled && 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800',
    as === 'textarea' && 'resize-y',
    className
  );

  return (
    <div className="w-full space-y-1 text-left">
      {label && (
        <label
          htmlFor={generatedId}
          className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
        >
          {icon && <span className="text-slate-400 dark:text-slate-500 shrink-0">{icon}</span>}
          <span>{label}</span>
          {required && <span className="text-blue-500">*</span>}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={generatedId}
          rows={rows}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
        />
      ) : (
        <input
          id={generatedId}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
        />
      )}

      {helperText && (
        <p className="text-[10px] text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
