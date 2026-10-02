import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Input: Campo de formulario accesible con etiquetas asociadas, indicador de error
 * y estilos de foco visibles (WCAG AA).
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Nombre del Documento"
 *   placeholder="CV Desarrollador Frontend 2026"
 *   value={title}
 *   onChange={(e) => setTitle(e.target.value)}
 *   error={errorMsg}
 * />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-lg shadow-2xs">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          disabled={disabled}
          className={`w-full text-xs sm:text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-9' : 'pl-3'
          } ${rightIcon ? 'pr-9' : 'pr-3'} py-2 ${
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-[11px] text-red-500 font-medium">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-[11px] text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
