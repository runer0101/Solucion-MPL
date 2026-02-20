import { describe, it, expect } from 'vitest'
import { SimplexSolver, BIG_M } from '../src/utils/simplex.js'

// Helper para construir problemData
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

// ===== MAXIMIZACIÓN CON RESTRICCIONES ≤ =====
describe('SimplexSolver - Maximización con restricciones ≤', () => {
  it('resuelve Max Z = 3X1 + 5X2 (ejemplo del proyecto)', () => {
    // X1≤4, 2X2≤12 → Z* = 3*4 + 5*6 = 42 en (4, 6)
    const solver = new SimplexSolver(makeProblem({
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

  it('resuelve Max Z = 40X1 + 30X2 con tres restricciones', () => {
    // Z* ≈ 366.67 (solución conocida para este problema)
    const solver = new SimplexSolver(makeProblem({
      objective: [40, 30],
      constraints: [[1, 1], [2, 1], [1, 2]],
      rhs: [12, 16, 15],
      constraintTypes: ['≤', '≤', '≤']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    expect(result.solution.objectiveValue).toBeCloseTo(366.67, 0)
  })

  it('resuelve Max Z = 2X1 + 3X2 + 4X3 con tres variables', () => {
    const solver = new SimplexSolver(makeProblem({
      objective: [2, 3, 4],
      constraints: [[3, 2, 1], [2, 5, 3]],
      rhs: [10, 15],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    expect(result.solution.objectiveValue).toBeGreaterThan(0)
    // Todas las variables deben ser no negativas
    result.solution.variables.forEach(v => expect(v).toBeGreaterThanOrEqual(-0.001))
  })

  it('todas las restricciones se cumplen en la solución', () => {
    const constraints = [[1, 1], [2, 1], [1, 2]]
    const rhs = [12, 16, 15]
    const solver = new SimplexSolver(makeProblem({
      objective: [40, 30],
      constraints,
      rhs,
      constraintTypes: ['≤', '≤', '≤']
    }))
    const result = solver.solve()
    const [x1, x2] = result.solution.variables
    constraints.forEach((c, i) => {
      const lhs = c[0] * x1 + c[1] * x2
      expect(lhs).toBeLessThanOrEqual(rhs[i] + 0.001)
    })
  })
})

// ===== MINIMIZACIÓN =====
describe('SimplexSolver - Minimización', () => {
  it('minimiza correctamente invirtiendo la función objetivo', () => {
    // Min Z = 2X1 + 3X2, s.t X1+X2≤10, X1≤6, X2≤8
    // Mínimo en (0,0) → Z=0
    const solver = new SimplexSolver(makeProblem({
      type: 'min',
      objective: [2, 3],
      constraints: [[1, 1], [1, 0], [0, 1]],
      rhs: [10, 6, 8],
      constraintTypes: ['≤', '≤', '≤']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    expect(result.solution.objectiveValue).toBeCloseTo(0, 1)
  })

  it('el estado del resultado es optimal para minimización', () => {
    const solver = new SimplexSolver(makeProblem({
      type: 'min',
      objective: [1, 2],
      constraints: [[1, 1]],
      rhs: [5],
      constraintTypes: ['≤']
    }))
    const result = solver.solve()
    expect(result.solution.status).toBe('optimal')
  })
})

// ===== RESTRICCIONES ≥ CON BIG-M =====
describe('SimplexSolver - Restricciones ≥ con Big-M', () => {
  it('resuelve Max con restricción ≥ y la solución cumple la cota mínima', () => {
    // Max Z = 5X1 + 4X2, s.t. X1+X2≤10, X1≥2
    // X1 debe ser ≥ 2 en la solución
    const solver = new SimplexSolver(makeProblem({
      objective: [5, 4],
      constraints: [[1, 1], [1, 0]],
      rhs: [10, 2],
      constraintTypes: ['≤', '≥']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    expect(result.solution.variables[0]).toBeGreaterThanOrEqual(2 - 0.001)
  })

  it('la suma de variables cumple la restricción ≥', () => {
    // X1 + X2 ≥ 3 debe cumplirse
    const solver = new SimplexSolver(makeProblem({
      objective: [3, 2],
      constraints: [[1, 1], [1, 1]],
      rhs: [10, 3],
      constraintTypes: ['≤', '≥']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    const [x1, x2] = result.solution.variables
    expect(x1 + x2).toBeGreaterThanOrEqual(3 - 0.001)
  })

  it('las variables artificiales no contaminan la solución final', () => {
    const solver = new SimplexSolver(makeProblem({
      objective: [3, 2],
      constraints: [[1, 1], [1, 0]],
      rhs: [10, 2],
      constraintTypes: ['≤', '≥']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    // Solo debe haber 2 variables (las originales)
    expect(result.solution.variables).toHaveLength(2)
    // Ningún valor debe ser del orden de Big-M
    result.solution.variables.forEach(v =>
      expect(Math.abs(v)).toBeLessThan(BIG_M / 2)
    )
  })
})

// ===== RESTRICCIONES = CON BIG-M =====
describe('SimplexSolver - Restricciones = con Big-M', () => {
  it('resuelve problema con restricción de igualdad', () => {
    // Max Z = 3X1 + 2X2, s.t. X1+X2=4, X1≤3
    // Z* = 3*3 + 2*1 = 11 en (3, 1)
    const solver = new SimplexSolver(makeProblem({
      objective: [3, 2],
      constraints: [[1, 1], [1, 0]],
      rhs: [4, 3],
      constraintTypes: ['=', '≤']
    }))
    const result = solver.solve()
    expect(result.status).toBe('optimal')
    const [x1, x2] = result.solution.variables
    // La restricción de igualdad debe cumplirse exactamente
    expect(x1 + x2).toBeCloseTo(4, 1)
    expect(result.solution.objectiveValue).toBeCloseTo(11, 1)
  })
})

// ===== PROBLEMA NO ACOTADO =====
describe('SimplexSolver - Problema no acotado', () => {
  it('detecta correctamente un problema no acotado', () => {
    // Max Z = X1 + X2, s.t. -X1 ≤ 0 (solo impide X1<0) → no acotado
    const solver = new SimplexSolver(makeProblem({
      objective: [1, 1],
      constraints: [[-1, 0]],
      rhs: [0],
      constraintTypes: ['≤']
    }))
    const result = solver.solve()
    expect(result.status).toBe('unbounded')
  })

  it('el resultado de unbounded incluye las iteraciones hasta ese punto', () => {
    const solver = new SimplexSolver(makeProblem({
      objective: [1, 1],
      constraints: [[-1, 0]],
      rhs: [0],
      constraintTypes: ['≤']
    }))
    const result = solver.solve()
    expect(result.iterations.length).toBeGreaterThan(0)
  })
})

// ===== ITERACIONES Y ESTRUCTURA =====
describe('SimplexSolver - Estructura de iteraciones', () => {
  it('genera la iteración 0 (tabla inicial) siempre', () => {
    const solver = new SimplexSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    expect(result.iterations.length).toBeGreaterThan(0)
    expect(result.iterations[0].phase).toBe('inicial')
    expect(result.iterations[0].iteration).toBe(0)
  })

  it('la última iteración está marcada como isOptimal=true', () => {
    const solver = new SimplexSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    const ultima = result.iterations[result.iterations.length - 1]
    expect(ultima.isOptimal).toBe(true)
  })

  it('cada iteración tiene tableau, explanation y phase', () => {
    const solver = new SimplexSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    result.iterations.forEach(iter => {
      expect(iter).toHaveProperty('tableau')
      expect(iter).toHaveProperty('explanation')
      expect(iter).toHaveProperty('phase')
    })
  })

  it('la solución devuelve las propiedades esperadas', () => {
    const solver = new SimplexSolver(makeProblem({
      objective: [3, 5],
      constraints: [[1, 0], [0, 2]],
      rhs: [4, 12],
      constraintTypes: ['≤', '≤']
    }))
    const result = solver.solve()
    expect(result).toHaveProperty('iterations')
    expect(result).toHaveProperty('solution')
    expect(result).toHaveProperty('status')
    expect(result.solution).toHaveProperty('variables')
    expect(result.solution).toHaveProperty('objectiveValue')
  })
})
