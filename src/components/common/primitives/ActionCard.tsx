import React from 'react';

export interface ActionCardProps {
  /** Título principal de la tarjeta */
  title: string;
  /** Breve descripción explicativa */
  description?: string;
  /** Componente o elemento de icono */
  icon: React.ReactNode;
  /** Etiqueta opcional tipo badge */
  badge?: string;
  /** Enlace opcional (renderiza etiqueta <a>) */
  href?: string;
  /** Callback opcional al hacer clic */
  onClick?: () => void;
  /** Variante visual de acento */
  highlight?: boolean;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * src/components/common/primitives/ActionCard.tsx
 * [COMPONENTE] Componente interactivo para disparar acciones o navegación rápida.
 * Diseñado con estética glassmorphic moderna, elevación al posar el cursor y alta legibilidad.
 * Trazabilidad: TASK-7.3, TASK-7.7
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  badge,
  href,
  onClick,
  highlight = false,
  className = '',
}) => {
  const content = (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
            highlight
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
          }`}
        >
          {icon}
        </div>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
            {badge}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  const containerClasses = `group text-left block p-5 rounded-2xl border transition-all duration-200 cursor-pointer backdrop-blur-md select-none hover:-translate-y-1 hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
    highlight
      ? 'bg-white/90 dark:bg-slate-900/90 border-blue-300 dark:border-blue-700 shadow-xs'
      : 'bg-white/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
  } ${className}`;

  if (href) {
    return (
      <a href={href} className={containerClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={containerClasses}>
      {content}
    </button>
  );
};
