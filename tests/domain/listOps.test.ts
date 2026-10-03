import { describe, it, expect } from 'vitest';
import {
  prependItem,
  appendItem,
  removeById,
  updateFieldById,
  updateById,
} from '../../src/domain/listOps';

describe('Domain: Immutable List Operations', () => {
  interface Item {
    id: string;
    name: string;
    active?: boolean;
  }

  const initialList: Item[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  it('prependItem agrega al inicio sin mutar el array original', () => {
    const result = prependItem(initialList, { id: '0', name: 'Item 0' });
    expect(result.length).toBe(3);
    expect(result[0].id).toBe('0');
    expect(initialList.length).toBe(2);
  });

  it('appendItem agrega al final sin mutar el array original', () => {
    const result = appendItem(initialList, { id: '3', name: 'Item 3' });
    expect(result.length).toBe(3);
    expect(result[2].id).toBe('3');
    expect(initialList.length).toBe(2);
  });

  it('removeById elimina el ítem indicado de forma inmutable', () => {
    const result = removeById(initialList, '1');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
    expect(initialList.length).toBe(2);
  });

  it('updateFieldById modifica el campo deseado', () => {
    const result = updateFieldById(initialList, '2', 'name', 'Nuevo Item 2');
    expect(result[1].name).toBe('Nuevo Item 2');
    expect(initialList[1].name).toBe('Item 2');
  });

  it('updateById aplica cambios parciales', () => {
    const result = updateById(initialList, '1', { name: 'Item 1 Modificado', active: true });
    expect(result[0].name).toBe('Item 1 Modificado');
    expect(result[0].active).toBe(true);
  });
});
