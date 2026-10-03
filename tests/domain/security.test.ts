import { describe, it, expect } from 'vitest';
import {
  sanitizeDocumentId,
  generateSecureId,
  sanitizeExternalUrl,
  isSafeImageDataUrl,
  isHexColor,
  SAFE_ID_REGEX,
} from '../../src/domain/security';

describe('Domain: Security and Sanitization', () => {
  describe('sanitizeDocumentId', () => {
    it('acepta UUIDs estándar y Drive IDs alfanuméricos', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const validDriveId = '1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT-u_VwXyZ';
      expect(sanitizeDocumentId(validUuid)).toBe(encodeURIComponent(validUuid));
      expect(sanitizeDocumentId(validDriveId)).toBe(encodeURIComponent(validDriveId));
    });

    it('bloquea path traversal o caracteres peligrosos', () => {
      expect(sanitizeDocumentId('../secret/file')).toBeNull();
      expect(sanitizeDocumentId('doc<script>alert(1)</script>')).toBeNull();
      expect(sanitizeDocumentId('short')).toBeNull(); // menos de 10 chars
      expect(sanitizeDocumentId(null)).toBeNull();
      expect(sanitizeDocumentId('')).toBeNull();
    });
  });

  describe('generateSecureId', () => {
    it('genera identificadores compatibles con SAFE_ID_REGEX', () => {
      const id1 = generateSecureId();
      const id2 = generateSecureId('exp');
      expect(SAFE_ID_REGEX.test(id1)).toBe(true);
      expect(SAFE_ID_REGEX.test(id2)).toBe(true);
      expect(id2.startsWith('exp_')).toBe(true);
    });
  });

  describe('sanitizeExternalUrl (CWE-79 XSS Mitigation)', () => {
    it('neutraliza protocolos peligrosos', () => {
      expect(sanitizeExternalUrl('javascript:alert(document.cookie)')).toBe('');
      expect(sanitizeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe('');
      expect(sanitizeExternalUrl('vbscript:msgbox(1)')).toBe('');
      expect(sanitizeExternalUrl('file:///etc/passwd')).toBe('');
    });

    it('antepone https:// a URLs sin protocolo y las preserva', () => {
      expect(sanitizeExternalUrl('github.com/usuario')).toBe('https://github.com/usuario');
      expect(sanitizeExternalUrl('https://linkedin.com/in/usuario')).toBe('https://linkedin.com/in/usuario');
      expect(sanitizeExternalUrl('http://mi-sitio.dev/portfolio')).toBe('http://mi-sitio.dev/portfolio');
    });

    it('devuelve cadena vacía ante entradas nulas o malformadas', () => {
      expect(sanitizeExternalUrl(null)).toBe('');
      expect(sanitizeExternalUrl('')).toBe('');
      expect(sanitizeExternalUrl('http://')).toBe('');
    });
  });

  describe('isSafeImageDataUrl (CWE-434)', () => {
    it('permite Data URLs base64 de JPEG, PNG y WebP', () => {
      const validJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/';
      const validPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
      expect(isSafeImageDataUrl(validJpeg)).toBe(true);
      expect(isSafeImageDataUrl(validPng)).toBe(true);
    });

    it('rechaza SVGs u otros tipos MIME no autorizados', () => {
      expect(isSafeImageDataUrl('data:image/svg+xml;base64,PHN2Zz48c2NyaXB0PmFsZXJ0KDEpPC9zY3JpcHQ+PC9zdmc+')).toBe(false);
      expect(isSafeImageDataUrl('https://malicious.com/tracking.png')).toBe(false);
      expect(isSafeImageDataUrl('')).toBe(false);
    });
  });

  describe('isHexColor', () => {
    it('valida colores hexadecimales correctos', () => {
      expect(isHexColor('#1e40af')).toBe(true);
      expect(isHexColor('#FFF')).toBe(true);
      expect(isHexColor('#000000')).toBe(true);
    });

    it('rechaza colores inválidos o inyecciones CSS', () => {
      expect(isHexColor('red; background: black')).toBe(false);
      expect(isHexColor('#12345')).toBe(false);
      expect(isHexColor('')).toBe(false);
    });
  });
});
