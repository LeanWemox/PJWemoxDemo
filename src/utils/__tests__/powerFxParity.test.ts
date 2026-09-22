import { describe, expect, it } from 'vitest'
import { getHitoStartTime } from '../powerFxParity'

describe('getHitoStartTime', () => {
  it('extrae hh:mm:ss desde la posición usada por Power Fx', () => {
    expect(
      getHitoStartTime('            15:20:30 Inicio de la reunión', 54975),
    ).toBe(255)
  })

  it('convierte el timestamp y resta el inicio del video', () => {
    expect(getHitoStartTime('            16:00:00 Hito', 54975)).toBe(2625)
  })

  it('soporta una marca al inicio del video', () => {
    expect(getHitoStartTime('            15:16:15 Inicio', 54975)).toBe(0)
  })

  it.each([
    'sin timestamp',
    '            15:20 Hito',
    '            15:70:30 Hito',
  ])('reporta explícitamente un formato inválido: %s', (titulo) => {
    expect(() => getHitoStartTime(titulo, 54975)).toThrow(
      'valid hh:mm:ss timestamp',
    )
  })
})
