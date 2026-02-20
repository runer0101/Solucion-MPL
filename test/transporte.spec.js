import { describe, it, expect } from 'vitest'
import { TransporteSolver } from '../src/utils/transporte.js'

// Problema de transporte clásico 3x3
// Oferta: [30, 40, 50]  Demanda: [25, 35, 60]  → balanceado (total=120)
const COSTOS_3x3 = [
  [2, 3, 1],
  [5, 4, 8],
  [5, 6, 8]
]
const OFERTA_3x3 = [30, 40, 50]
const DEMANDA_3x3 = [25, 35, 60]

// Problema 2x3 simple
const COSTOS_2x3 = [
  [1, 4, 3],
  [5, 2, 6]
]
const OFERTA_2x3 = [10, 20]
const DEMANDA_2x3 = [15, 10, 5]

const solver = new TransporteSolver({})

// ===== ESQUINA NOROESTE =====
describe('TransporteSolver - Esquina Noroeste', () => {
  it('la asignación satisface toda la oferta', () => {
    const result = solver.esquinaNoroeste(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    OFERTA_3x3.forEach((oferta, i) => {
      const asignado = result.asignacion[i].reduce((sum, v) => sum + v, 0)
      expect(asignado).toBe(oferta)
    })
  })

  it('la asignación satisface toda la demanda', () => {
    const result = solver.esquinaNoroeste(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    DEMANDA_3x3.forEach((demanda, j) => {
      const asignado = result.asignacion.reduce((sum, fila) => sum + fila[j], 0)
      expect(asignado).toBe(demanda)
    })
  })

  it('el costo total es positivo', () => {
    const result = solver.esquinaNoroeste(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    expect(result.costoTotal).toBeGreaterThan(0)
  })

  it('las asignaciones son no negativas', () => {
    const result = solver.esquinaNoroeste(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    result.asignacion.forEach(fila =>
      fila.forEach(v => expect(v).toBeGreaterThanOrEqual(0))
    )
  })

  it('registra pasos de asignación', () => {
    const result = solver.esquinaNoroeste(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    expect(result.pasos.length).toBeGreaterThan(0)
  })

  it('funciona con problema 2x3', () => {
    const result = solver.esquinaNoroeste(COSTOS_2x3, OFERTA_2x3, DEMANDA_2x3)
    expect(result.costoTotal).toBeGreaterThan(0)
  })
})

// ===== COSTO MÍNIMO =====
describe('TransporteSolver - Costo Mínimo', () => {
  it('la asignación satisface toda la oferta', () => {
    const result = solver.costoMinimo(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    OFERTA_3x3.forEach((oferta, i) => {
      const asignado = result.asignacion[i].reduce((sum, v) => sum + v, 0)
      expect(asignado).toBe(oferta)
    })
  })

  it('la asignación satisface toda la demanda', () => {
    const result = solver.costoMinimo(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    DEMANDA_3x3.forEach((demanda, j) => {
      const asignado = result.asignacion.reduce((sum, fila) => sum + fila[j], 0)
      expect(asignado).toBe(demanda)
    })
  })

  it('tiene costo menor o igual que Esquina Noroeste (generalmente)', () => {
    const nw = solver.esquinaNoroeste(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    const cm = solver.costoMinimo(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    // Costo mínimo siempre ≤ Esquina Noroeste
    expect(cm.costoTotal).toBeLessThanOrEqual(nw.costoTotal + 0.001)
  })

  it('el metodo devuelto es "Costo Mínimo"', () => {
    const result = solver.costoMinimo(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    expect(result.metodo).toBe('Costo Mínimo')
  })

  it('las asignaciones son no negativas', () => {
    const result = solver.costoMinimo(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    result.asignacion.forEach(fila =>
      fila.forEach(v => expect(v).toBeGreaterThanOrEqual(0))
    )
  })
})

// ===== VOGEL =====
describe('TransporteSolver - Aproximación de Vogel', () => {
  it('la asignación satisface toda la oferta', () => {
    const result = solver.aproximacionVogel(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    OFERTA_3x3.forEach((oferta, i) => {
      const asignado = result.asignacion[i].reduce((sum, v) => sum + v, 0)
      expect(asignado).toBe(oferta)
    })
  })

  it('la asignación satisface toda la demanda', () => {
    const result = solver.aproximacionVogel(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    DEMANDA_3x3.forEach((demanda, j) => {
      const asignado = result.asignacion.reduce((sum, fila) => sum + fila[j], 0)
      expect(asignado).toBe(demanda)
    })
  })

  it('tiene costo menor o igual que Esquina Noroeste', () => {
    const nw = solver.esquinaNoroeste(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    const vogel = solver.aproximacionVogel(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    expect(vogel.costoTotal).toBeLessThanOrEqual(nw.costoTotal + 0.001)
  })

  it('las asignaciones son no negativas', () => {
    const result = solver.aproximacionVogel(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    result.asignacion.forEach(fila =>
      fila.forEach(v => expect(v).toBeGreaterThanOrEqual(0))
    )
  })

  it('registra penalizaciones en los pasos', () => {
    const result = solver.aproximacionVogel(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    expect(result.pasos.length).toBeGreaterThan(0)
    result.pasos.forEach(paso => {
      expect(paso).toHaveProperty('penalizacionFilas')
      expect(paso).toHaveProperty('penalizacionColumnas')
    })
  })
})

// ===== COSTO TOTAL =====
describe('TransporteSolver - calcularCostoTotal()', () => {
  it('calcula el costo total correctamente', () => {
    const asignacion = [[10, 0], [0, 20]]
    const costos = [[3, 5], [2, 4]]
    // 10*3 + 20*4 = 30 + 80 = 110
    expect(solver.calcularCostoTotal(asignacion, costos)).toBe(110)
  })

  it('devuelve 0 para asignación vacía', () => {
    const asignacion = [[0, 0], [0, 0]]
    const costos = [[3, 5], [2, 4]]
    expect(solver.calcularCostoTotal(asignacion, costos)).toBe(0)
  })
})

// ===== RESOLVER TODOS =====
describe('TransporteSolver - resolverTodos()', () => {
  it('devuelve los tres métodos', () => {
    const result = solver.resolverTodos(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    expect(result).toHaveProperty('esquinaNoroeste')
    expect(result).toHaveProperty('costoMinimo')
    expect(result).toHaveProperty('vogel')
  })

  it('los tres métodos producen costos positivos', () => {
    const result = solver.resolverTodos(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    expect(result.esquinaNoroeste.costoTotal).toBeGreaterThan(0)
    expect(result.costoMinimo.costoTotal).toBeGreaterThan(0)
    expect(result.vogel.costoTotal).toBeGreaterThan(0)
  })

  it('todos satisfacen la oferta y demanda total', () => {
    const result = solver.resolverTodos(COSTOS_3x3, OFERTA_3x3, DEMANDA_3x3)
    const totalOferta = OFERTA_3x3.reduce((a, b) => a + b, 0)
    const totalDemanda = DEMANDA_3x3.reduce((a, b) => a + b, 0)
    expect(totalOferta).toBe(totalDemanda) // problema balanceado

    ;['esquinaNoroeste', 'costoMinimo', 'vogel'].forEach(metodo => {
      const totalAsignado = result[metodo].asignacion
        .flat()
        .reduce((a, b) => a + b, 0)
      expect(totalAsignado).toBe(totalOferta)
    })
  })
})
