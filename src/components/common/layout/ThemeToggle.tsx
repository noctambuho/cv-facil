import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getStoredTheme, toggleTheme, type Theme } from '../../../services/browser/theme';

/**
 * src/components/common/layout/ThemeToggle.tsx
 * [ISLA] Botón interactivo accesible para conmutar entre Modo Claro y Oscuro.
 * Trazabilidad: US-10, TASK-7.7
 */
export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getStoredTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: Theme }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      }
    };

    window.addEventListener('cv_facil_theme_changed', handleThemeChange);
    return () => {
      window.removeEventListener('cv_facil_theme_changed', handleThemeChange);
    };
  }, []);

  const handleToggle = () => {
    const nextTheme = toggleTheme();
    setTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 shadow-2xs"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
};
