import type { CVData } from '../types/cv';
import { initialData } from '../data/initialData';

const STORAGE_KEY = 'cv_wizard_data_v1';

/**
 * Carga el estado guardado en localStorage o retorna el valor inicial por defecto.
 */
export function loadCVData(): CVData {
  if (typeof window === 'undefined') {
    return initialData;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    const parsed = JSON.parse(raw);
    return {
      ...initialData,
      ...parsed,
      profile: { ...initialData.profile, ...(parsed.profile || {}) },
      settings: { ...initialData.settings, ...(parsed.settings || {}) }
    };
  } catch (error) {
    console.warn('Error al leer de localStorage:', error);
    return initialData;
  }
}

/**
 * Guarda el estado en localStorage de forma segura.
 */
export function saveCVData(data: CVData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

/**
 * Descarga el estado del CV como archivo .json para respaldo local.
 */
export function exportToJSON(data: CVData): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (data.profile.fullName || 'cv-backup')
    .toLowerCase()
    .replace(/\s+/g, '-');
  a.href = url;
  a.download = `${safeName}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Importa y valida un archivo JSON cargado por el usuario.
 */
export function importFromJSON(file: File): Promise<CVData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('El archivo no contiene un JSON válido.');
        }
        // Mezclamos con valores por defecto para asegurar integridad
        const result: CVData = {
          profile: { ...initialData.profile, ...(parsed.profile || {}) },
          experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          languages: Array.isArray(parsed.languages) ? parsed.languages : [],
          settings: { ...initialData.settings, ...(parsed.settings || {}) }
        };
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsText(file);
  });
}
