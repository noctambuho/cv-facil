/**
 * src/services/browser/theme.ts
 * Gestión del tema visual (claro / oscuro) y persistencia en localStorage.
 * Trazabilidad: US-10, TASK-7.2
 */

export type Theme = 'light' | 'dark';

export const THEME_KEY = 'cv_facil_theme';

/**
 * [EFECTO] Obtiene el tema almacenado o detecta la preferencia del sistema operativo.
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * [EFECTO] Aplica la clase 'dark' en <html> y persiste la preferencia.
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  try {
    localStorage.setItem(THEME_KEY, theme);
    window.dispatchEvent(new CustomEvent('cv_facil_theme_changed', { detail: theme }));
  } catch {
    // Storage bloqueado
  }
}

/**
 * [EFECTO] Alterna entre modo claro y oscuro.
 */
export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
