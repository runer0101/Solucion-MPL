import { describe, it, expect } from 'vitest'
import { GraphicMethodSolver } from '../src/utils/grafico.js'

function makeProblem({ type = 'max', objective, constraints, rhs, constraintTypes }) {
  return {
    type,
    numVariables: objective.length,
    numConstraints: constraints.length,
    objective,
    constraints,
    rhs,
    constraintTypes
  }
}

// ===== VALIDACIÓN =====
describe('GraphicMethodSolver - canSolve()', () => {
  it('acepta problemas con exactamente 2 variables', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0]],
      rhs: [4],
      constraintTypes: ['≤']
    }))
    expect(solver.canSolve().canSolve).toBe(true)
  })

  it('rechaza problemas con más de 2 variables', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [2, 3, 4],
      constraints: [[1, 1, 1]],
      rhs: [10],
      constraintTypes: ['≤']
    }))
    const check = solver.canSolve()
    expect(check.canSolve).toBe(false)
    expect(check.reason).toContain('3')
  })

  it('rechaza problemas con 1 variable', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [5],
      constraints: [[1]],
      rhs: [10],
      constraintTypes: ['≤']
    }))
    expect(solver.canSolve().canSolve).toBe(false)
  })
})

// ===== MAXIMIZACIÓN =====
describe('GraphicMethodSolver - Maximización', () => {
  it('resuelve Max Z = 3X1 + 5X2 con 2 restricciones ≤', () => {
    // Z* = 42 en (4, 6)
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    expect(result.solution.objectiveValue).toBeCloseTo(42, 1)
    expect(result.solution.variables[0]).toBeCloseTo(4, 1)
    expect(result.solution.variables[1]).toBeCloseTo(6, 1)
  })

  it('encuentra vértices en la región factible', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    expect(result.vertices.length).toBeGreaterThan(0)
    // El origen siempre debe estar en la región factible
    const origen = result.vertices.find(v =>
      Math.abs(v.x) < 0.001 && Math.abs(v.y) < 0.001
    )
    expect(origen).toBeTruthy()
  })

  it('el punto óptimo está entre los vértices evaluados', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [2, 3],
      constraints: [[1, 1], [2, 1]],
      rhs: [4, 6],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    const { x, y } = result.optimalPoint
    const estaEnVertices = result.vertices.some(v =>
      Math.abs(v.x - x) < 0.001 && Math.abs(v.y - y) < 0.001
    )
    expect(estaEnVertices).toBe(true)
  })

  it('todos los vértices son no negativos', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    result.vertices.forEach(v => {
      expect(v.x).toBeGreaterThanOrEqual(-0.001)
      expect(v.y).toBeGreaterThanOrEqual(-0.001)
    })
  })
})

// ===== MINIMIZACIÓN =====
describe('GraphicMethodSolver - Minimización', () => {
  it('resuelve Min Z = 2X1 + 3X2 correctamente', () => {
    // Min en la región factible de restricciones ≤ → mínimo en origen (0,0), Z=0
    const solver = new GraphicMethodSolver(makeProblem({
      type: 'min',
      objective: [2, 3],
      constraints: [[1, 1], [1, 0]],
      rhs: [4, 3],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    expect(result.solution.objectiveValue).toBeCloseTo(0, 1)
  })

  it('el objetivo de minimización es menor o igual que en todos los otros vértices', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      type: 'min',
      objective: [2, 3],
      constraints: [[1, 1], [1, 0], [0, 1]],
      rhs: [6, 4, 5],
      constraintTypes: ['≤', '≤', '≤']
    }))
    const result = solver.solve()
    const { x, y } = result.optimalPoint
    const zOptimo = 2 * x + 3 * y
    result.vertices.forEach(v => {
      const z = 2 * v.x + 3 * v.y
      expect(zOptimo).toBeLessThanOrEqual(z + 0.001)
    })
  })
})

// ===== ESTRUCTURA DEL RESULTADO =====
describe('GraphicMethodSolver - Estructura del resultado', () => {
  it('devuelve 4 pasos siempre', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    expect(result.steps).toHaveLength(4)
  })

  it('cada paso tiene step, title y explanation', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    result.steps.forEach(step => {
      expect(step).toHaveProperty('step')
      expect(step).toHaveProperty('title')
      expect(step).toHaveProperty('explanation')
    })
  })

  it('la solución tiene variables y objectiveValue', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    expect(result.solution).toHaveProperty('variables')
    expect(result.solution).toHaveProperty('objectiveValue')
    expect(result.solution.variables).toHaveLength(2)
  })

  it('devuelve error si el problema tiene más de 2 variables', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [1, 2, 3],
      constraints: [[1, 1, 1]],
      rhs: [6],
      constraintTypes: ['≤']
    }))
    const result = solver.solve()
    expect(result.error).toBe(true)
    expect(result.message).toBeTruthy()
  })
})

// ===== INTERSECCIONES =====
describe('GraphicMethodSolver - findIntersection()', () => {
  it('encuentra la intersección de dos líneas no paralelas', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [1, 1],
      constraints: [[1, 1]],
      rhs: [4],
      constraintTypes: ['≤']
    }))
    // X1 + X2 = 4  y  X1 - X2 = 0  → X1=2, X2=2
    const punto = solver.findIntersection([1, 1], 4, [1, -1], 0)
    expect(punto.x).toBeCloseTo(2, 4)
    expect(punto.y).toBeCloseTo(2, 4)
  })

  it('devuelve null para líneas paralelas', () => {
    const solver = new GraphicMethodSolver(makeProblem({
      objective: [1, 1],
      constraints: [[1, 1]],
      rhs: [4],
      constraintTypes: ['≤']
    }))
    // X1 + X2 = 4  y  X1 + X2 = 6  → paralelas, sin intersección
    const punto = solver.findIntersection([1, 1], 4, [1, 1], 6)
    expect(punto).toBeNull()
  })
})
