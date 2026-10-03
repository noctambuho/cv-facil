/**
 * src/services/browser/navigation.ts
 * Enrutamiento y resolución de rutas relativas al BASE_URL configurado en Astro.
 * Trazabilidad: TASK-7.2, specs/07-refactor-legibilidad.md
 */

/**
 * [PURA] Resuelve una ruta absoluta anteponiendo el BASE_URL si aplica.
 *
 * @param path Ruta interna (ej: '/editor' o '/lobby')
 * @returns Ruta normalizada lista para usar en href
 */
export function getRoute(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

/**
 * [EFECTO] Redirige imperativamente al editor cargando el documento por ID.
 *
 * @param id Identificador seguro del documento
 * @param autoExport Si es true, activa la pre-apertura del diálogo de exportación
 */
export function goToEditor(id: string, autoExport = false): void {
  if (typeof window === 'undefined') return;
  const param = `?id=${encodeURIComponent(id)}${autoExport ? '&export=true' : ''}`;
  window.location.href = getRoute(`/editor${param}`);
}
