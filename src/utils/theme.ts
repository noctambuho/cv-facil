/**
 * src/utils/theme.ts
 * Gestor del Modo Oscuro/Claro nativo para la plataforma CV Fácil.
 * Trazabilidad: US-10 (Criterio 10.1)
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'cv_facil_theme';

/**
 * Obtiene el tema actual guardado o la preferencia del sistema operativo.
 * 
 * @returns 'light' | 'dark'
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/**
 * Aplica el tema manipulando la clase 'dark' en el elemento raíz <html>
 * y emitiendo un evento personalizado para que las islas React sincronicen su estado.
 * 
 * @param theme El tema a aplicar ('light' o 'dark')
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('No se pudo persistir la preferencia de tema en localStorage:', e);
  }

  // Notificar a componentes cliente
  window.dispatchEvent(new CustomEvent('cv_facil_theme_changed', { detail: { theme } }));
}

/**
 * Conmuta entre el tema claro y oscuro.
 * 
 * @returns El nuevo tema activado
 */
export function toggleTheme(): Theme {
  const current = getStoredTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}
