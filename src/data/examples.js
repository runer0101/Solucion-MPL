export const SIMPLEX_EXAMPLES = {
  1: {
    label: 'Ejemplo 1: Básico',
    description: 'Max Z = 3X₁ + 5X₂',
    detail: '2 variables, 2 restricciones',
    vars: 2, type: 'max',
    objective: [3, 5],
    constraints: [[1, 0], [0, 2]],
    rhs: [4, 12],
    types: ['≤', '≤']
  },
  2: {
    label: 'Ejemplo 2: Producción',
    description: 'Max Z = 40X₁ + 30X₂',
    detail: '2 variables, 3 restricciones',
    vars: 2, type: 'max',
    objective: [40, 30],
    constraints: [[1, 1], [2, 1], [1, 2]],
    rhs: [12, 16, 15],
    types: ['≤', '≤', '≤']
  },
  3: {
    label: 'Ejemplo 3: Tres Variables',
    description: 'Max Z = 2X₁ + 3X₂ + 4X₃',
    detail: '3 variables, 2 restricciones',
    vars: 3, type: 'max',
    objective: [2, 3, 4],
    constraints: [[3, 2, 1], [2, 5, 3]],
    rhs: [10, 15],
    types: ['≤', '≤']
  },
  4: {
    label: 'Ejemplo 4: Mixto',
    description: 'Max Z = 3X₁ + 2X₂ + 5X₃',
    detail: '3 variables, 3 restricciones (≤, ≥, =)',
    vars: 3, type: 'max',
    objective: [3, 2, 5],
    constraints: [[1, 2, 1], [3, 0, 2], [1, 4, 0]],
    rhs: [430, 460, 420],
    types: ['≤', '≥', '=']
  }
}
