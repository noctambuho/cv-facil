import { describe, it, expect } from 'vitest';
import { normalizeCVData, parseAndSanitizeCVImport } from '../../src/domain/cvNormalizer';

describe('Domain: CV Normalization & Import Sanitization', () => {
  describe('normalizeCVData', () => {
    it('genera un objeto válido ante entradas vacías o nulas', () => {
      const result = normalizeCVData(null);
      expect(result).toBeDefined();
      expect(result.profile.fullName).toBeDefined();
      expect(result.settings.templateId).toBe('modern');
      expect(Array.isArray(result.experiences)).toBe(true);
    });

    it('sanea URLs y bloquea payloads XSS en el perfil', () => {
      const maliciousPayload = {
        profile: {
          fullName: 'Tester',
          website: 'javascript:alert(1)',
          linkedin: 'linkedin.com/in/safe',
          github: 'data:text/html,hack',
        },
      };

      const normalized = normalizeCVData(maliciousPayload);
      expect(normalized.profile.website).toBe('');
      expect(normalized.profile.github).toBe('');
      expect(normalized.profile.linkedin).toBe('https://linkedin.com/in/safe');
    });

    it('descarta avatares SVG o links externos y solo admite Data URLs válidos', () => {
      const docWithSvg = {
        profile: {
          avatarUrl: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
        },
      };
      expect(normalizeCVData(docWithSvg).profile.avatarUrl).toBeUndefined();

      const validPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
      const docWithPng = {
        profile: {
          avatarUrl: validPng,
        },
      };
      expect(normalizeCVData(docWithPng).profile.avatarUrl).toBe(validPng);
    });

    it('normaliza templateId y fontFamily no autorizados a valores por defecto', () => {
      const doc = {
        settings: {
          templateId: 'unsupported_template',
          fontFamily: 'comic_sans',
          accentColor: 'blue',
        },
      };
      const normalized = normalizeCVData(doc);
      expect(normalized.settings.templateId).toBe('modern');
      expect(normalized.settings.fontFamily).toBe('sans');
      expect(normalized.settings.accentColor).toBe('#1e40af'); // default
    });
  });

  describe('parseAndSanitizeCVImport', () => {
    it('rechaza JSON vacío o malformado', () => {
      expect(parseAndSanitizeCVImport('').valid).toBe(false);
      expect(parseAndSanitizeCVImport('{ invalid: json').valid).toBe(false);
      expect(parseAndSanitizeCVImport('"cadena"').valid).toBe(false);
    });

    it('parsea y sanea un archivo JSON completo deduciendo el título', () => {
      const validJson = JSON.stringify({
        profile: {
          fullName: 'María González',
          headline: 'Arquitecta de Software',
          website: 'mariagonzalez.dev',
        },
        experiences: [
          { company: 'Acme Corp', role: 'Lead Architect', current: true },
        ],
        settings: {
          templateId: 'classic',
        },
      });

      const result = parseAndSanitizeCVImport(validJson, 'Maria_CV_2026.json');
      expect(result.valid).toBe(true);
      expect(result.suggestedTitle).toBe('Maria_CV_2026');
      expect(result.data?.profile.fullName).toBe('María González');
      expect(result.data?.profile.website).toBe('https://mariagonzalez.dev/');
      expect(result.data?.settings.templateId).toBe('classic');
      expect(result.data?.experiences[0].id).toBeDefined();
    });
  });
});
