/**
 * src/domain/listOps.ts
 * Operaciones puras e inmutables sobre colecciones con identificador único.
 * Trazabilidad: TASK-7.1, specs/07-refactor-legibilidad.md
 */

/**
 * [PURA] Inserta un elemento al inicio del arreglo sin mutar la fuente.
 */
export function prependItem<T extends { id: string }>(items: readonly T[], item: T): T[] {
  return [item, ...items];
}

/**
 * [PURA] Inserta un elemento al final del arreglo sin mutar la fuente.
 */
export function appendItem<T extends { id: string }>(items: readonly T[], item: T): T[] {
  return [...items, item];
}

/**
 * [PURA] Elimina un elemento por su identificador único de manera inmutable.
 */
export function removeById<T extends { id: string }>(items: readonly T[], id: string): T[] {
  return items.filter((item) => item.id !== id);
}

/**
 * [PURA] Actualiza un campo específico de un elemento encontrado por su id.
 */
export function updateFieldById<T extends { id: string }, K extends keyof T>(
  items: readonly T[],
  id: string,
  field: K,
  value: T[K]
): T[] {
  return items.map((item) => (item.id === id ? { ...item, [field]: value } : item));
}

/**
 * [PURA] Aplica una serie de cambios parciales a un elemento identificado por id.
 */
export function updateById<T extends { id: string }>(
  items: readonly T[],
  id: string,
  updates: Partial<T>
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}
