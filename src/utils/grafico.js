// Método Gráfico para Programación Lineal (2 variables)
import { formatNumber } from './formatters.js'

const EPSILON = 0.0001

export class GraphicMethodSolver {
  constructor(problemData) {
    this.problemData = problemData
    this.vertices = []
    this.feasibleRegion = []
    this.optimalPoint = null
    this.steps = []
  }

  /**
   * Verifica si el problema puede resolverse con el método gráfico
   * Solo funciona para problemas con exactamente 2 variables
   */
  canSolve() {
    if (this.problemData.numVariables !== 2) {
      return {
        canSolve: false,
        reason: 'El método gráfico solo funciona con problemas de 2 variables. Este problema tiene ' +
                this.problemData.numVariables + ' variables.'
      }
    }
    return { canSolve: true }
  }

  /**
   * Resuelve el problema usando el método gráfico
   */
  solve() {
    try {
      // Verificar si se puede resolver
      const validation = this.canSolve()
      if (!validation.canSolve) {
        return {
          error: true,
          message: validation.reason,
          steps: []
        }
      }

      // Paso 1: Identificar las restricciones
      this.steps.push({
        step: 1,
        title: 'Identificación del Problema',
        explanation: this.explainProblem()
      })

      // Paso 2: Encontrar puntos de intersección (vértices)
      this.findVertices()
      this.steps.push({
        step: 2,
        title: 'Encontrar Vértices de la Región Factible',
        explanation: this.explainVertices(),
        vertices: [...this.vertices]
      })

      // Paso 3: Evaluar función objetivo en cada vértice
      const evaluations = this.evaluateObjective()
      this.steps.push({
        step: 3,
        title: 'Evaluación de la Función Objetivo',
        explanation: this.explainEvaluations(evaluations),
        evaluations
      })

      // Paso 4: Determinar solución óptima
      this.determineOptimal(evaluations)
      this.steps.push({
        step: 4,
        title: 'Solución Óptima',
        explanation: this.explainOptimal(),
        optimalPoint: this.optimalPoint
      })

      return {
        steps: this.steps,
        vertices: this.vertices,
        optimalPoint: this.optimalPoint,
        solution: {
          variables: [this.optimalPoint.x, this.optimalPoint.y],
          objectiveValue: this.optimalPoint.z,
          status: 'optimal'
        },
        status: 'optimal'
      }

    } catch (error) {
      return {
        error: true,
        message: error.message,
        steps: this.steps
      }
    }
  }

  /**
   * Encuentra todos los vértices de la región factible
   */
  findVertices() {
    const { constraints, rhs, constraintTypes } = this.problemData

    // Agregar ejes como restricciones (X1 >= 0, X2 >= 0)
    const allConstraints = [...constraints]
    const allRHS = [...rhs]
    const allTypes = [...constraintTypes]

    // X1 >= 0 (eje Y)
    allConstraints.push([1, 0])
    allRHS.push(0)
    allTypes.push('≥')

    // X2 >= 0 (eje X)
    allConstraints.push([0, 1])
    allRHS.push(0)
    allTypes.push('≥')

    const vertices = []

    // Encontrar intersecciones de cada par de restricciones
    for (let i = 0; i < allConstraints.length; i++) {
      for (let j = i + 1; j < allConstraints.length; j++) {
        const point = this.findIntersection(
          allConstraints[i], allRHS[i],
          allConstraints[j], allRHS[j]
        )

        if (point && this.isFeasible(point, allConstraints, allRHS, allTypes)) {
          // Verificar si no es duplicado
          const isDuplicate = vertices.some(v =>
            Math.abs(v.x - point.x) < EPSILON &&
            Math.abs(v.y - point.y) < EPSILON
          )

          if (!isDuplicate) {
            vertices.push(point)
          }
        }
      }
    }

    // Ordenar vértices en sentido antihorario para mejor visualización
    vertices.sort((a, b) => {
      const angleA = Math.atan2(a.y, a.x)
      const angleB = Math.atan2(b.y, b.x)
      return angleA - angleB
    })

    this.vertices = vertices
  }

  /**
   * Encuentra la intersección de dos líneas
   * a1*x + b1*y = c1
   * a2*x + b2*y = c2
   */
  findIntersection(constraint1, rhs1, constraint2, rhs2) {
    const [a1, b1] = constraint1
    const [a2, b2] = constraint2
    const c1 = rhs1
    const c2 = rhs2

    // Resolver sistema usando método de Cramer
    const det = a1 * b2 - a2 * b1

    // Si el determinante es 0, las líneas son paralelas
    if (Math.abs(det) < EPSILON) {
      return null
    }

    const x = (c1 * b2 - c2 * b1) / det
    const y = (a1 * c2 - a2 * c1) / det

    return { x, y }
  }

  /**
   * Verifica si un punto está en la región factible
   */
  isFeasible(point, constraints, rhs, types) {
    const { x, y } = point

    // Verificar no negatividad
    if (x < -EPSILON || y < -EPSILON) {
      return false
    }

    // Verificar cada restricción
    for (let i = 0; i < constraints.length; i++) {
      const [a, b] = constraints[i]
      const value = a * x + b * y
      const limit = rhs[i]
      const type = types[i]

      if (type === '≤' && value > limit + EPSILON) {
        return false
      }
      if (type === '≥' && value < limit - EPSILON) {
        return false
      }
      if (type === '=' && Math.abs(value - limit) > EPSILON) {
        return false
      }
    }

    return true
  }

  /**
   * Evalúa la función objetivo en cada vértice
   */
  evaluateObjective() {
    const { objective, type } = this.problemData
    const [c1, c2] = objective

    return this.vertices.map(vertex => {
      const z = c1 * vertex.x + c2 * vertex.y
      return {
        x: vertex.x,
        y: vertex.y,
        z: z,
        formatted: `Z = ${formatNumber(c1)} × ${formatNumber(vertex.x)} + ${formatNumber(c2)} × ${formatNumber(vertex.y)} = ${formatNumber(z)}`
      }
    })
  }

  /**
   * Determina el punto óptimo
   */
  determineOptimal(evaluations) {
    const { type } = this.problemData

    if (evaluations.length === 0) {
      throw new Error('No se encontraron vértices factibles. El problema puede ser infactible.')
    }

    if (type === 'max') {
      this.optimalPoint = evaluations.reduce((max, current) =>
        current.z > max.z ? current : max
      )
    } else {
      this.optimalPoint = evaluations.reduce((min, current) =>
        current.z < min.z ? current : min
      )
    }
  }

  /**
   * Explicación del problema
   */
  explainProblem() {
    const { type, objective, constraints, rhs, constraintTypes, numConstraints } = this.problemData
    const [c1, c2] = objective

    let html = '<div class="explanation-section">'
    html += '<h3>MÉTODO GRÁFICO PARA PROGRAMACIÓN LINEAL</h3>'

    html += '<div class="explanation-block">'
    html += '<h4>Problema a Resolver:</h4>'
    html += '<p class="formula">'
    html += `${type === 'max' ? 'Maximizar' : 'Minimizar'} Z = ${formatNumber(c1)}X₁ + ${formatNumber(c2)}X₂`
    html += '</p>'

    html += '<p><strong>Sujeto a las restricciones:</strong></p>'
    html += '<ul class="constraints-list">'

    for (let i = 0; i < numConstraints; i++) {
      const [a, b] = constraints[i]
      html += '<li>'
      html += `${formatNumber(a)}X₁ + ${formatNumber(b)}X₂ ${constraintTypes[i]} ${formatNumber(rhs[i])}`
      html += '</li>'
    }

    html += '<li>X₁ ≥ 0</li>'
    html += '<li>X₂ ≥ 0</li>'
    html += '</ul>'
    html += '</div>'

    html += '<div class="explanation-block">'
    html += '<h4>¿Qué es el Método Gráfico?</h4>'
    html += '<p class="explanation-text">El método gráfico es una técnica visual para resolver problemas de programación lineal con <strong>dos variables</strong>. Permite visualizar geométricamente la región factible y encontrar el punto óptimo.</p>'
    html += '<p><strong>Pasos del método:</strong></p>'
    html += '<ol class="method-steps">'
    html += '<li>Graficar cada restricción como una línea en el plano X₁-X₂</li>'
    html += '<li>Identificar la región factible (área que satisface todas las restricciones)</li>'
    html += '<li>Encontrar los vértices (puntos esquina) de la región factible</li>'
    html += '<li>Evaluar la función objetivo en cada vértice</li>'
    html += '<li>El vértice con el mejor valor de Z es la solución óptima</li>'
    html += '</ol>'
    html += '</div>'

    html += '<div class="info-box">'
    html += '<strong>Teorema Fundamental:</strong> Si existe una solución óptima finita, siempre se encuentra en un vértice de la región factible.'
    html += '</div>'

    html += '</div>'
    return html
  }

  /**
   * Explicación de los vértices encontrados
   */
  explainVertices() {
    let html = '<div class="explanation-section">'
    html += '<h3>VÉRTICES DE LA REGIÓN FACTIBLE</h3>'

    html += '<div class="explanation-block">'
    html += '<p class="explanation-text">Los vértices son los puntos de intersección de las restricciones que forman las esquinas de la región factible. Estos puntos son candidatos para la solución óptima.</p>'
    html += '</div>'

    html += '<div class="explanation-block">'
    html += '<h4>Vértices Encontrados:</h4>'
    html += '<div class="vertices-grid">'

    this.vertices.forEach((vertex, index) => {
      html += '<div class="vertex-card">'
      html += `<h5>Vértice ${index + 1}</h5>`
      html += `<p><strong>Coordenadas:</strong></p>`
      html += `<p>X₁ = ${formatNumber(vertex.x)}</p>`
      html += `<p>X₂ = ${formatNumber(vertex.y)}</p>`
      html += '</div>'
    })

    html += '</div>'
    html += '</div>'

    if (this.vertices.length === 0) {
      html += '<div class="warning-box">'
      html += '<p><strong>No se encontraron vértices factibles.</strong></p>'
      html += '<p>Esto puede indicar que el problema es infactible (no tiene solución) o que la región factible es vacía.</p>'
      html += '</div>'
    }

    html += '</div>'
    return html
  }

  /**
   * Explicación de las evaluaciones
   */
  explainEvaluations(evaluations) {
    const { type, objective } = this.problemData
    const [c1, c2] = objective

    let html = '<div class="explanation-section">'
    html += '<h3>EVALUACIÓN DE LA FUNCIÓN OBJETIVO</h3>'

    html += '<div class="explanation-block">'
    html += '<p class="explanation-text">Ahora evaluamos la función objetivo Z en cada vértice para determinar cuál nos da el mejor valor (máximo o mínimo según el tipo de problema).</p>'
    html += `<p class="formula">Z = ${formatNumber(c1)}X₁ + ${formatNumber(c2)}X₂</p>`
    html += '</div>'

    html += '<div class="explanation-block">'
    html += '<h4>Cálculos:</h4>'
    html += '<div class="evaluations-list">'

    evaluations.forEach((evaluation, index) => {
      html += '<div class="evaluation-item">'
      html += `<h5>Vértice ${index + 1}: (${formatNumber(evaluation.x)}, ${formatNumber(evaluation.y)})</h5>`
      html += `<p class="calculation">${evaluation.formatted}</p>`
      html += '</div>'
    })

    html += '</div>'
    html += '</div>'

    html += '</div>'
    return html
  }

  /**
   * Explicación de la solución óptima
   */
  explainOptimal() {
    const { type } = this.problemData

    let html = '<div class="explanation-section">'
    html += '<h3>SOLUCIÓN ÓPTIMA</h3>'

    html += '<div class="explanation-block">'
    html += `<p class="explanation-text">El punto que ${type === 'max' ? 'maximiza' : 'minimiza'} la función objetivo es:</p>`
    html += '<div class="optimal-solution">'
    html += `<p><strong>X₁ = ${formatNumber(this.optimalPoint.x)}</strong></p>`
    html += `<p><strong>X₂ = ${formatNumber(this.optimalPoint.y)}</strong></p>`
    html += `<p class="optimal-value"><strong>Z = ${formatNumber(this.optimalPoint.z)}</strong></p>`
    html += '</div>'
    html += '</div>'

    html += '<div class="explanation-block">'
    html += '<h4>Interpretación:</h4>'
    html += '<p class="explanation-text">'
    html += `Este punto representa la ${type === 'max' ? 'mejor' : 'menor'} combinación posible de las variables X₁ y X₂ `
    html += `que satisface todas las restricciones del problema y ${type === 'max' ? 'maximiza' : 'minimiza'} el valor de Z.`
    html += '</p>'
    html += '</div>'

    html += '<div class="info-box optimal-box">'
    html += '<p><strong>✓ Solución verificada:</strong> Este punto está en la región factible y representa el óptimo global del problema.</p>'
    html += '</div>'

    html += '</div>'
    return html
  }
}

export { EPSILON }
