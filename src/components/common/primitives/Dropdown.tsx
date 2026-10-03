/**
 * src/components/common/primitives/Dropdown.tsx
 * [COMPONENTE] Menú contextual flotante accesible con soporte de cierre al clic exterior
 * y navegación básica conforme a estándares WCAG AA.
 * Trazabilidad: TASK-7.3, TASK-7.7
 */

import React, { useState, useRef, useEffect } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  /** Elemento que renderiza el disparador del menú */
  trigger: React.ReactNode;
  /** Elementos a desplegar en la lista */
  items: DropdownItem[];
  /** Alineación del menú relativo al disparador */
  align?: 'left' | 'right';
  /** Clases CSS adicionales para el contenedor del menú */
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1.5 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition select-none disabled:opacity-50 disabled:cursor-not-allowed ${
                item.danger
                  ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon && (
                <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                  {item.icon}
                </span>
              )}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
