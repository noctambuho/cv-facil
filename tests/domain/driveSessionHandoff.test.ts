import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveDriveHandoff, consumeDriveHandoff } from '../../src/services/storage/driveSessionHandoff';

describe('services/storage/driveSessionHandoff', () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    const mockSessionStorage = {
      getItem: vi.fn((key: string) => mockStore[key] || null),
      setItem: vi.fn((key: string, val: string) => {
        mockStore[key] = val;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStore[key];
      }),
      clear: vi.fn(() => {
        mockStore = {};
      }),
    };
    vi.stubGlobal('sessionStorage', mockSessionStorage);
    vi.stubGlobal('window', { sessionStorage: mockSessionStorage });
  });

  it('debe guardar y consumir el handoff efímero, destruyéndolo tras la primera lectura', () => {
    saveDriveHandoff('mock-token-xyz', 3600, {
      email: 'usuario@example.com',
      name: 'Usuario Prueba',
    });

    const handoff = consumeDriveHandoff();
    expect(handoff).not.toBeNull();
    expect(handoff?.accessToken).toBe('mock-token-xyz');
    expect(handoff?.user.email).toBe('usuario@example.com');

    // Comprobación de destrucción inmediata (un solo uso)
    const secondTry = consumeDriveHandoff();
    expect(secondTry).toBeNull();
  });

  it('debe descartar handoffs cuyo TTL supere los 60 segundos (CWE-312)', () => {
    const expiredTimestamp = Date.now() - 65 * 1000; // 65 segundos atrás
    mockStore['cv_facil_drive_session_handoff'] = JSON.stringify({
      accessToken: 'stale-token',
      expiresAt: Date.now() + 3600 * 1000,
      createdAt: expiredTimestamp,
      user: { email: 'stale@example.com', name: 'Stale' },
    });

    const handoff = consumeDriveHandoff();
    expect(handoff).toBeNull();
  });

  it('debe retornar null cuando no existe ningún handoff', () => {
    const handoff = consumeDriveHandoff();
    expect(handoff).toBeNull();
  });
});
