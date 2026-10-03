/**
 * src/components/common/hooks/useClickOutside.ts
 * Hook personalizado para detectar clics fuera de un elemento referenciado del DOM.
 * Trazabilidad: TASK-7.3, specs/07-refactor-legibilidad.md
 */

import { useEffect, type RefObject } from 'react';

/**
 * [HOOK] Ejecuta un callback cuando el usuario hace clic o toca fuera del elemento indicado.
 *
 * @param ref Referencia React al elemento contenedor
 * @param handler Función callback a disparar
 * @param enabled Bandera condicional para activar o suspender el listener
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains((event.target as Node) || null)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
