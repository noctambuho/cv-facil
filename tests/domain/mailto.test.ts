import { describe, it, expect } from 'vitest';
import { buildMailtoHref, sanitizeEmailHeader } from '../../src/domain/mailto';

describe('domain/mailto', () => {
  it('debe construir un mailto simple con destinatario válido', () => {
    const href = buildMailtoHref({ to: 'contacto@cvfacil.app' });
    expect(href).toBe('mailto:contacto@cvfacil.app');
  });

  it('debe construir un mailto con asunto codificado correctamente', () => {
    const href = buildMailtoHref({
      to: 'jcnunezgrandal@gmail.com',
      subject: '[IMPORTANTE] Quiero un sitio web',
    });
    expect(href).toBe(
      'mailto:jcnunezgrandal@gmail.com?subject=%5BIMPORTANTE%5D%20Quiero%20un%20sitio%20web'
    );
  });

  it('debe construir un mailto con asunto y cuerpo', () => {
    const href = buildMailtoHref({
      to: 'test@example.com',
      subject: 'Hola',
      body: 'Línea 1\nLínea 2',
    });
    expect(href).toBe('mailto:test@example.com?subject=Hola&body=L%C3%ADnea%201%0AL%C3%ADnea%202');
  });

  it('debe prevenir inyecciones CRLF en las cabeceras (CWE-93)', () => {
    const sanitized = sanitizeEmailHeader('Asunto\r\nBcc: victim@example.com\r\n');
    expect(sanitized).toBe('Asunto Bcc: victim@example.com');

    const href = buildMailtoHref({
      to: 'admin@example.com\r\nCc: hacker@example.com',
      subject: 'Test\r\nHeader: injection',
    });
    expect(href).not.toContain('\r');
    expect(href).not.toContain('\n');
    expect(href).toContain('admin@example.com%20Cc%3A%20hacker@example.com');
  });

  it('debe retornar "#" si el destinatario no contiene arroba o está vacío', () => {
    expect(buildMailtoHref({ to: '' })).toBe('#');
    expect(buildMailtoHref({ to: 'invalid-email-address' })).toBe('#');
  });
});
