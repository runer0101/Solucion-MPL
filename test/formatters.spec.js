import { describe, it, expect } from 'vitest'
import { formatNumber, isValidNumber, EPSILON } from '../src/utils/formatters.js'

// ===== formatNumber =====
describe('formatNumber()', () => {
  it('formatea un número entero sin decimales innecesarios', () => {
    expect(formatNumber(5)).toBe('5.00')
  })

  it('formatea un número con 2 decimales por defecto', () => {
    expect(formatNumber(3.14159)).toBe('3.14')
  })

  it('redondea correctamente al número de decimales dado', () => {
    // Nota: 1.005 en IEEE 754 es 1.00499999... por lo que toFixed(2) da '1.00'
    expect(formatNumber(1.006, 2)).toBe('1.01')
  })

  it('usa decimales personalizados cuando se pasan', () => {
    expect(formatNumber(1234.56789, 4)).toBe('1 234.5679')
  })

  it('devuelve "0" para valores muy cercanos a cero (< EPSILON)', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(0.00001)).toBe('0')
    expect(formatNumber(-0.00001)).toBe('0')
  })

  it('agrega separador de miles para números grandes', () => {
    expect(formatNumber(1000000)).toBe('1 000 000.00')
  })

  it('maneja números negativos correctamente', () => {
    expect(formatNumber(-1234.5)).toBe('-1 234.50')
  })

  it('maneja números negativos pequeños como cero', () => {
    expect(formatNumber(-EPSILON / 2)).toBe('0')
  })

  it('formatea números entre 100 y 999 sin separador', () => {
    expect(formatNumber(123.45)).toBe('123.45')
  })

  it('formatea número con 0 decimales', () => {
    expect(formatNumber(1234, 0)).toBe('1 234')
  })
})

// ===== isValidNumber =====
describe('isValidNumber()', () => {
  it('acepta números enteros', () => {
    expect(isValidNumber(0)).toBe(true)
    expect(isValidNumber(42)).toBe(true)
    expect(isValidNumber(-10)).toBe(true)
  })

  it('acepta números decimales', () => {
    expect(isValidNumber(3.14)).toBe(true)
    expect(isValidNumber(-0.001)).toBe(true)
  })

  it('rechaza string vacío', () => {
    expect(isValidNumber('')).toBe(false)
  })

  it('rechaza null', () => {
    expect(isValidNumber(null)).toBe(false)
  })

  it('rechaza undefined', () => {
    expect(isValidNumber(undefined)).toBe(false)
  })

  it('rechaza NaN', () => {
    expect(isValidNumber(NaN)).toBe(false)
  })

  it('rechaza Infinity', () => {
    expect(isValidNumber(Infinity)).toBe(false)
    expect(isValidNumber(-Infinity)).toBe(false)
  })

  it('acepta string numérico', () => {
    // isValidNumber usa !isNaN(), los strings numéricos pasan
    expect(isValidNumber('42')).toBe(true)
  })

  it('rechaza string no numérico', () => {
    expect(isValidNumber('abc')).toBe(false)
  })
})

// ===== EPSILON exportado =====
describe('EPSILON exportado', () => {
  it('tiene el valor correcto (0.0001)', () => {
    expect(EPSILON).toBe(0.0001)
  })
})
