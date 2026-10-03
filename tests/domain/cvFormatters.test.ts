import { describe, it, expect } from 'vitest';
import {
  formatDateRange,
  formatEducationDegree,
  getProfileInitials,
  toDisplayUrl,
  toSafeFilename,
  getSkillLevelLabel,
} from '../../src/domain/cvFormatters';

describe('Domain: CV Formatters', () => {
  it('formatDateRange utiliza guion largo unificado y maneja empleos actuales', () => {
    expect(formatDateRange('2022-01', '2024-05')).toBe('2022-01 — 2024-05');
    expect(formatDateRange('2023-08', '', true)).toBe('2023-08 — Presente');
    expect(formatDateRange('2020', '2021', false, '→')).toBe('2020 → 2021');
    expect(formatDateRange('2020')).toBe('2020');
  });

  it('formatEducationDegree concatena título y campo de estudio', () => {
    expect(formatEducationDegree('Licenciatura en Computación', 'Sistemas Distribuidos'))
      .toBe('Licenciatura en Computación en Sistemas Distribuidos');
    expect(formatEducationDegree('Ingeniería')).toBe('Ingeniería');
  });

  it('getProfileInitials extrae hasta 2 iniciales en mayúsculas', () => {
    expect(getProfileInitials('Juan Carlos Pérez')).toBe('JC');
    expect(getProfileInitials('Ana')).toBe('A');
    expect(getProfileInitials('')).toBe('CV');
  });

  it('toDisplayUrl remueve protocolos y barras finales', () => {
    expect(toDisplayUrl('https://www.linkedin.com/in/usuario/')).toBe('linkedin.com/in/usuario');
    expect(toDisplayUrl('http://mi-web.com')).toBe('mi-web.com');
  });

  it('toSafeFilename limpia caracteres especiales para exportación', () => {
    expect(toSafeFilename('CV - Desarrollador / 2026!', '.pdf')).toBe('CV_-_Desarrollador_2026.pdf');
    expect(toSafeFilename('', 'json')).toBe('Curriculum_Vitae.json');
  });

  it('getSkillLevelLabel retorna etiquetas estandarizadas en español', () => {
    expect(getSkillLevelLabel('intermediate')).toBe('Intermedio');
    expect(getSkillLevelLabel('basic')).toBe('Básico');
    expect(getSkillLevelLabel('advanced')).toBe('Avanzado');
  });
});
