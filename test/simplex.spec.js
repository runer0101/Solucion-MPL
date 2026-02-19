import { describe, it, expect } from 'vitest'
import { SimplexSolver } from '../src/utils/simplex.js'

describe('SimplexSolver basic problems', () => {
  it('solves a simple maximization problem', () => {
    const problem = {
      type: 'max',
      numVariables: 2,
      numConstraints: 2,
      objective: [3, 5],
      constraints: [
        [1, 1],
        [1, 2]
      ],
      rhs: [4, 6],
      constraintTypes: ['≤', '≤']
    }

    const solver = new SimplexSolver(problem)
    const result = solver.solve()

    expect(result.status).toBe('optimal')
    expect(result.solution).toBeTruthy()
    // Objective value should be approximately 16
    expect(Math.round(result.solution.objectiveValue)).toBe(16)
    expect(result.solution.variables.length).toBe(2)
  })
})
