/**
 * src/utils/routes.ts
 * Generador de URLs canónicas y enlaces internos considerando el BASE_URL configurado en Astro.
 */

/**
 * Resuelve una ruta interna considerando el prefijo BASE_URL del proyecto.
 * 
 * @param path Ruta relativa o absoluta interna (ej: '/lobby', 'editor')
 * @returns Ruta normalizada con el prefijo base del sitio
 */
export function getRoute(path: string): string {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  if (!cleanPath) {
    return base ? `${base}/` : '/';
  }
  return `${base}/${cleanPath}`;
}
