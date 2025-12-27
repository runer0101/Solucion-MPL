<script setup>
import { ref, computed } from 'vue'
import { SimplexSolver } from '../utils/simplex.js'
import { GraphicMethodSolver } from '../utils/grafico.js'
import TransporteSolver from '../utils/transporte.js'

// Datos unificados del problema
const numVariables = ref(2)
const numConstraints = ref(2)
const problemType = ref('min') // Por defecto minimizar (compatibilidad con transporte)
const objectiveCoefficients = ref([])
const constraintCoefficients = ref([])
const constraintRHS = ref([])
const constraintTypes = ref([])

// Configuración para vista de transporte
const numOrigenes = ref(2)
const numDestinos = ref(2)

// Explicación de la correlación
const showCorrelation = ref(false)
const showDifferences = ref(false)

// Estado de las soluciones
const showSolutions = ref(false)
const solutionResults = ref({
  grafico: null,
  simplex: null,
  esquinaNoroeste: null,
  costoMinimo: null,
  vogel: null,
  mejorTransporte: null
})


const initializeMatrices = () => {
  objectiveCoefficients.value = Array(numVariables.value).fill(0)
  constraintCoefficients.value = Array(numConstraints.value).fill(null).map(() =>
    Array(numVariables.value).fill(0)
  )
  constraintRHS.value = Array(numConstraints.value).fill(0)
  constraintTypes.value = Array(numConstraints.value).fill('≤')
}

initializeMatrices()

const canUseGraphicMethod = computed(() => {
  return numVariables.value === 2
})

const loadExample = () => {
  // Ejemplo simple para Simplex y Gráfico
  numVariables.value = 2
  numConstraints.value = 2
  problemType.value = 'max'

  setTimeout(() => {
    objectiveCoefficients.value = [3, 5]
    constraintCoefficients.value = [
      [1, 0],
      [0, 2]
    ]
    constraintRHS.value = [4, 12]
    constraintTypes.value = ['≤', '≤']
  }, 0)
}

const loadTransportExample = () => {
  // Problema de transporte 2x3 (2 orígenes, 3 destinos)
  // 6 variables (X11, X12, X13, X21, X22, X23)
  // 5 restricciones (2 oferta + 3 demanda)
  numVariables.value = 6
  numConstraints.value = 5
  numOrigenes.value = 2
  numDestinos.value = 3
  problemType.value = 'min'

  setTimeout(() => {
    // Costos de transporte por unidad
    // Origen 1: [10, 15, 20] a Destinos 1, 2, 3
    // Origen 2: [12, 18, 25] a Destinos 1, 2, 3
    objectiveCoefficients.value = [10, 15, 20, 12, 18, 25]

    // Restricciones de oferta y demanda
    // Oferta Origen 1: 50 unidades
    // Oferta Origen 2: 70 unidades
    // Demanda Destino 1: 40 unidades
    // Demanda Destino 2: 45 unidades
    // Demanda Destino 3: 35 unidades
    // Total Oferta = Total Demanda = 120 unidades (BALANCEADO)

    constraintCoefficients.value = [
      [1, 1, 1, 0, 0, 0],  // Oferta origen 1: X11 + X12 + X13 = 50
      [0, 0, 0, 1, 1, 1],  // Oferta origen 2: X21 + X22 + X23 = 70
      [1, 0, 0, 1, 0, 0],  // Demanda destino 1: X11 + X21 = 40
      [0, 1, 0, 0, 1, 0],  // Demanda destino 2: X12 + X22 = 45
      [0, 0, 1, 0, 0, 1]   // Demanda destino 3: X13 + X23 = 35
    ]
    constraintRHS.value = [50, 70, 40, 45, 35]
    constraintTypes.value = ['=', '=', '=', '=', '=']
  }, 0)
}

// NO cargar ejemplo automáticamente, empezar con valores en cero
initializeMatrices()

const validateInputs = () => {
  console.log('Validando inputs...')
  console.log('objectiveCoefficients:', objectiveCoefficients.value)
  console.log('constraintCoefficients:', constraintCoefficients.value)
  console.log('constraintRHS:', constraintRHS.value)

  for (let i = 0; i < numVariables.value; i++) {
    const coef = objectiveCoefficients.value[i]
    if (coef === '' || coef === null || coef === undefined) {
      console.log(`Error en coeficiente ${i}: está vacío`)
      return 'Por favor, complete todos los coeficientes de la función objetivo'
    }
    if (isNaN(coef) || !isFinite(coef)) {
      console.log(`Error en coeficiente ${i}: no es un número válido`)
      return 'Los coeficientes de la función objetivo deben ser números válidos'
    }
  }

  for (let i = 0; i < numConstraints.value; i++) {
    for (let j = 0; j < numVariables.value; j++) {
      const coef = constraintCoefficients.value[i][j]
      if (coef === '' || coef === null || coef === undefined) {
        return `Por favor, complete todos los coeficientes de la restricción ${i + 1}`
      }
      if (isNaN(coef) || !isFinite(coef)) {
        return `Los coeficientes de la restricción ${i + 1} deben ser números válidos`
      }
    }

    const rhs = constraintRHS.value[i]
    if (rhs === '' || rhs === null || rhs === undefined) {
      return `Por favor, complete el lado derecho de la restricción ${i + 1}`
    }
    if (isNaN(rhs) || !isFinite(rhs)) {
      return `El lado derecho de la restricción ${i + 1} debe ser un número válido`
    }
    if (rhs < 0) {
      return `El lado derecho de la restricción ${i + 1} debe ser no negativo`
    }
  }

  return null
}

// Convertir problema PL a formato de transporte
const convertirATransporte = () => {
  // Detectar dimensiones del problema de transporte desde las restricciones
  const numRestricciones = numConstraints.value
  const numVars = numVariables.value

  // Para un problema m×n de transporte:
  // - Hay m+n restricciones (m para oferta, n para demanda)
  // - Hay m×n variables

  // Intentar determinar m y n
  let m, n
  for (let i = 2; i <= 10; i++) {
    for (let j = 2; j <= 10; j++) {
      if (i * j === numVars && i + j === numRestricciones) {
        m = i
        n = j
        break
      }
    }
    if (m) break
  }

  if (!m || !n) return null

  // Extraer costos, oferta y demanda
  const costos = []
  for (let i = 0; i < m; i++) {
    costos[i] = []
    for (let j = 0; j < n; j++) {
      const varIndex = i * n + j
      costos[i][j] = objectiveCoefficients.value[varIndex] || 0
    }
  }

  const oferta = constraintRHS.value.slice(0, m)
  const demanda = constraintRHS.value.slice(m, m + n)

  return { costos, oferta, demanda }
}

const compareAllMethods = () => {
  console.log('=== COMPARAR TODOS LOS MÉTODOS ===')
  console.log('BOTÓN FUNCIONÓ - La función se está ejecutando')

  const errorMsg = validateInputs()
  console.log('Error de validación:', errorMsg)

  if (errorMsg) {
    alert(errorMsg)
    console.log('Mostrando alerta de error')
    return
  }

  solutionResults.value = {}
  console.log('Iniciando comparación...')

  const problemData = {
    type: problemType.value,
    numVariables: numVariables.value,
    numConstraints: numConstraints.value,
    objective: objectiveCoefficients.value.map(Number),
    constraints: constraintCoefficients.value.map(fila => fila.map(Number)),
    rhs: constraintRHS.value.map(Number),
    constraintTypes: constraintTypes.value
  }

  console.log('Datos del problema:', problemData)
  console.log('¿Puede usar método gráfico?', canUseGraphicMethod.value)
  console.log('¿Es problema de transporte?', esProblemaTransporte.value)

  // Método Gráfico (solo si hay 2 variables)
  if (canUseGraphicMethod.value) {
    try {
      const solver = new GraphicMethodSolver(problemData)
      const resultado = solver.solve()

      console.log('Resultado Gráfico:', resultado)

      if (resultado.status === 'optimal' && resultado.optimalPoint) {
        const variables = [resultado.optimalPoint.x, resultado.optimalPoint.y]
        const zValue = resultado.solution.objectiveValue

        solutionResults.value.grafico = {
          z: zValue,
          variables: variables,
          factible: true,
          puntoOptimo: resultado.optimalPoint,
          interpretacion: `Punto óptimo: (${variables[0].toFixed(2)}, ${variables[1].toFixed(2)}), Z = ${zValue.toFixed(2)}`
        }
      } else {
        solutionResults.value.grafico = {
          error: resultado.message || 'No se encontró solución factible'
        }
      }
    } catch (error) {
      console.error('Error en Gráfico:', error)
      solutionResults.value.grafico = { error: 'No se pudo resolver con el método gráfico' }
    }
  }

  // Método Simplex (SIEMPRE intentar resolver)
  try {
    const solver = new SimplexSolver(problemData)
    const resultado = solver.solve()

    console.log('Resultado Simplex:', resultado)

    if (resultado.status === 'optimal' && resultado.solution) {
      solutionResults.value.simplex = {
        z: resultado.solution.objectiveValue,
        variables: resultado.solution.variables,
        factible: true,
        tablaFinal: resultado.iterations[resultado.iterations.length - 1]?.tableau || null,
        pasos: resultado.iterations || [],
        interpretacion: `Valor óptimo encontrado: Z = ${resultado.solution.objectiveValue.toFixed(2)}`
      }
    } else {
      solutionResults.value.simplex = {
        error: resultado.message || 'No se encontró solución factible'
      }
    }
  } catch (error) {
    console.error('Error en Simplex:', error)
    solutionResults.value.simplex = { error: 'No se pudo resolver con el método simplex' }
  }

  // Si es problema de transporte, resolver los 3 métodos y guardar TODOS
  if (esProblemaTransporte.value) {
    const datosTransporte = convertirATransporte()

    if (datosTransporte) {
      try {
        const solver = new TransporteSolver()
        const resultados = solver.resolverTodos(
          datosTransporte.costos,
          datosTransporte.oferta,
          datosTransporte.demanda
        )

        // Guardar los 3 resultados
        solutionResults.value.esquinaNoroeste = {
          z: resultados.esquinaNoroeste.costoTotal,
          factible: true,
          tablaFinal: resultados.esquinaNoroeste.asignacion,
          pasos: resultados.esquinaNoroeste.pasos || [],
          interpretacion: `Costo Total: ${resultados.esquinaNoroeste.costoTotal.toFixed(2)}`
        }

        solutionResults.value.costoMinimo = {
          z: resultados.costoMinimo.costoTotal,
          factible: true,
          tablaFinal: resultados.costoMinimo.asignacion,
          pasos: resultados.costoMinimo.pasos || [],
          interpretacion: `Costo Total: ${resultados.costoMinimo.costoTotal.toFixed(2)}`
        }

        solutionResults.value.vogel = {
          z: resultados.vogel.costoTotal,
          factible: true,
          tablaFinal: resultados.vogel.asignacion,
          pasos: resultados.vogel.pasos || [],
          interpretacion: `Costo Total: ${resultados.vogel.costoTotal.toFixed(2)}`
        }

        // Encontrar el mejor método (menor costo ya que es minimización)
        const metodos = [
          { nombre: 'Esquina Noroeste', costo: resultados.esquinaNoroeste.costoTotal },
          { nombre: 'Costo Mínimo', costo: resultados.costoMinimo.costoTotal },
          { nombre: 'Vogel (VAM)', costo: resultados.vogel.costoTotal }
        ]

        const mejorMetodo = metodos.reduce((mejor, actual) =>
          actual.costo < mejor.costo ? actual : mejor
        )

        // Guardar cuál es el mejor
        solutionResults.value.mejorTransporte = mejorMetodo.nombre

      } catch (error) {
        console.error('Error al resolver con métodos de transporte:', error)
        solutionResults.value.esquinaNoroeste = { error: 'Error al calcular', factible: false }
        solutionResults.value.costoMinimo = { error: 'Error al calcular', factible: false }
        solutionResults.value.vogel = { error: 'Error al calcular', factible: false }
      }
    } else {
      console.warn('No se pudo convertir a formato de transporte')
    }
  }

  console.log('Soluciones calculadas:', solutionResults.value)

  // Ejecutar validación cruzada
  performCrossValidation()

  showSolutions.value = true
  console.log('Mostrando resultados...')
}

// Estado de validación cruzada
const validationResults = ref({
  linealConvergence: null,
  transportComparison: null
})

// Función de validación cruzada
const performCrossValidation = () => {
  const TOLERANCE = 0.01 // 1% de variación permitida

  // Función auxiliar para comparar valores numéricos
  const areEqual = (val1, val2, tolerance = TOLERANCE) => {
    if (val1 === null || val2 === null || val1 === undefined || val2 === undefined) return false
    return Math.abs(val1 - val2) <= Math.abs(val1) * tolerance
  }

  // Validación de convergencia de métodos de programación lineal
  const validateLinearConvergence = () => {
    const methods = []

    if (solutionResults.value.simplex && !solutionResults.value.simplex.error) {
      methods.push({ name: 'Simplex', z: solutionResults.value.simplex.z, vars: solutionResults.value.simplex.variables })
    }
    if (solutionResults.value.grafico && !solutionResults.value.grafico.error) {
      methods.push({ name: 'Gráfico', z: solutionResults.value.grafico.z, vars: solutionResults.value.grafico.variables })
    }

    if (methods.length < 2) {
      return { valid: true, message: 'Un solo método disponible', methods }
    }

    // Validar Z
    const zValues = methods.map(m => m.z)
    const allZEqual = zValues.every(z => areEqual(z, zValues[0]))

    if (!allZEqual) {
      const maxZ = Math.max(...zValues)
      const minZ = Math.min(...zValues)
      return {
        valid: false,
        message: '⚠️ Los métodos NO convergen al mismo Z',
        zValues: methods.map(m => ({ name: m.name, z: m.z })),
        difference: maxZ - minZ,
        methods
      }
    }

    // Validar variables
    const numVars = methods[0].vars.length
    for (let i = 0; i < numVars; i++) {
      const varValues = methods.map(m => m.vars[i])
      const allVarsEqual = varValues.every(v => areEqual(v, varValues[0]))

      if (!allVarsEqual) {
        return {
          valid: false,
          message: `⚠️ Variable X${i+1} tiene valores diferentes`,
          varIndex: i + 1,
          varValues: methods.map(m => ({ name: m.name, value: m.vars[i] })),
          methods
        }
      }
    }

    return {
      valid: true,
      message: '✓ TODOS los métodos convergen a la MISMA solución',
      solution: {
        variables: methods[0].vars,
        z: methods[0].z
      },
      methods
    }
  }

  // Validación de métodos de transporte
  const validateTransportMethods = () => {
    const transportMethods = []

    if (solutionResults.value.esquinaNoroeste && !solutionResults.value.esquinaNoroeste.error) {
      transportMethods.push({
        name: 'Esquina Noroeste',
        cost: solutionResults.value.esquinaNoroeste.z
      })
    }
    if (solutionResults.value.costoMinimo && !solutionResults.value.costoMinimo.error) {
      transportMethods.push({
        name: 'Costo Mínimo',
        cost: solutionResults.value.costoMinimo.z
      })
    }
    if (solutionResults.value.vogel && !solutionResults.value.vogel.error) {
      transportMethods.push({
        name: 'Vogel (VAM)',
        cost: solutionResults.value.vogel.z
      })
    }

    if (transportMethods.length === 0) {
      return null
    }

    const costs = transportMethods.map(m => m.cost)
    const minCost = Math.min(...costs)
    const maxCost = Math.max(...costs)
    const bestMethod = transportMethods.find(m => m.cost === minCost)

    return {
      valid: true,
      message: '✓ Todos los métodos de transporte son factibles',
      methods: transportMethods,
      best: {
        method: bestMethod.name,
        cost: bestMethod.cost,
        savings: maxCost - minCost
      }
    }
  }

  // Ejecutar validaciones
  validationResults.value.linealConvergence = validateLinearConvergence()
  validationResults.value.transportComparison = validateTransportMethods()

  console.log('Validación cruzada completada:', validationResults.value)
}

const resetComparison = () => {
  showSolutions.value = false
  solutionResults.value = {}
  validationResults.value = {
    linealConvergence: null,
    transportComparison: null
  }
}

const isBestSolution = (method) => {
  if (!solutionResults.value[method] || solutionResults.value[method].error) return false

  const values = []

  // Recopilar todos los valores Z válidos
  if (solutionResults.value.grafico && !solutionResults.value.grafico.error) {
    values.push(solutionResults.value.grafico.z)
  }
  if (solutionResults.value.simplex && !solutionResults.value.simplex.error) {
    values.push(solutionResults.value.simplex.z)
  }
  if (solutionResults.value.transporte && !solutionResults.value.transporte.error) {
    values.push(solutionResults.value.transporte.z)
  }

  if (values.length === 0) return false

  const currentZ = solutionResults.value[method].z

  if (problemType.value === 'max') {
    return currentZ === Math.max(...values)
  } else {
    return currentZ === Math.min(...values)
  }
}

const getBestMethod = () => {
  const methods = []

  if (solutionResults.value.grafico && !solutionResults.value.grafico.error) {
    methods.push({ name: 'Método Gráfico', z: solutionResults.value.grafico.z })
  }
  if (solutionResults.value.simplex && !solutionResults.value.simplex.error) {
    methods.push({ name: 'Método Simplex', z: solutionResults.value.simplex.z })
  }
  if (solutionResults.value.esquinaNoroeste && !solutionResults.value.esquinaNoroeste.error) {
    methods.push({ name: 'Esquina Noroeste', z: solutionResults.value.esquinaNoroeste.z })
  }
  if (solutionResults.value.costoMinimo && !solutionResults.value.costoMinimo.error) {
    methods.push({ name: 'Costo Mínimo', z: solutionResults.value.costoMinimo.z })
  }
  if (solutionResults.value.vogel && !solutionResults.value.vogel.error) {
    methods.push({ name: 'Vogel (VAM)', z: solutionResults.value.vogel.z })
  }

  if (methods.length === 0) return null

  if (problemType.value === 'max') {
    return methods.reduce((best, current) => current.z > best.z ? current : best).name
  } else {
    return methods.reduce((best, current) => current.z < best.z ? current : best).name
  }
}

const getBestValue = () => {
  const values = []

  if (solutionResults.value.grafico && !solutionResults.value.grafico.error) {
    values.push(solutionResults.value.grafico.z)
  }
  if (solutionResults.value.simplex && !solutionResults.value.simplex.error) {
    values.push(solutionResults.value.simplex.z)
  }
  if (solutionResults.value.esquinaNoroeste && !solutionResults.value.esquinaNoroeste.error) {
    values.push(solutionResults.value.esquinaNoroeste.z)
  }
  if (solutionResults.value.costoMinimo && !solutionResults.value.costoMinimo.error) {
    values.push(solutionResults.value.costoMinimo.z)
  }
  if (solutionResults.value.vogel && !solutionResults.value.vogel.error) {
    values.push(solutionResults.value.vogel.z)
  }

  if (values.length === 0) return null

  if (problemType.value === 'max') {
    return Math.max(...values)
  } else {
    return Math.min(...values)
  }
}

const esProblemaTransporte = computed(() => {
  // Un problema es de transporte si todas las restricciones son de igualdad
  // y sigue el patrón m+n restricciones con m*n variables
  const todasIgualdad = constraintTypes.value.every(t => t === '=')

  if (!todasIgualdad) return false

  // Verificar si las dimensiones coinciden con un problema de transporte
  const numVars = numVariables.value
  const numRes = numConstraints.value

  for (let m = 2; m <= 10; m++) {
    for (let n = 2; n <= 10; n++) {
      if (m * n === numVars && m + n === numRes) {
        return true
      }
    }
  }

  return false
})

const numMetodosDisponibles = computed(() => {
  let count = 1 // Simplex siempre está disponible
  if (canUseGraphicMethod.value) count++
  if (esProblemaTransporte.value) count++ // Un método de transporte (el mejor de 3)
  return count
})
</script>

<template>
  <div class="comparar-todos">
    <!-- Formulario de entrada -->
    <div v-if="!showSolutions" class="input-section">
      <div class="input-card">
        <h2 class="section-title">Comparación de Métodos</h2>

        <!-- Configuración -->
        <div class="config-section">
          <div class="config-grid">
            <div class="form-group">
              <label for="num-vars">Número de Variables:</label>
              <input
                id="num-vars"
                type="number"
                v-model.number="numVariables"
                @input="initializeMatrices"
                min="2"
                max="10"
                class="form-input"
              >
              <small>Mínimo 2, Máximo 10</small>
            </div>

            <div class="form-group">
              <label for="num-constraints">Número de Restricciones:</label>
              <input
                id="num-constraints"
                type="number"
                v-model.number="numConstraints"
                @input="initializeMatrices"
                min="1"
                max="10"
                class="form-input"
              >
              <small>Mínimo 1, Máximo 10</small>
            </div>

            <div class="form-group full-width">
              <label for="problem-type">Tipo de Problema:</label>
              <div class="field-with-explanation">
                <select
                  id="problem-type"
                  v-model="problemType"
                  class="form-select"
                >
                  <option value="max">Maximizar</option>
                  <option value="min">Minimizar</option>
                </select>
                <div class="explanation-box">
                  <div class="explanation-row">
                    <strong>Simplex/Grafico:</strong>
                    <span>Puede ser Maximizar o Minimizar</span>
                  </div>
                  <div class="explanation-row">
                    <strong>Transporte:</strong>
                    <span>Solo Minimizar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Función Objetivo -->
        <div class="objective-section">
          <h3>Función Objetivo</h3>
          <div class="section-with-explanation">
            <div class="objective-function">
              <span class="function-label">{{ problemType === 'max' ? 'Maximizar' : 'Minimizar' }} Z =</span>
              <div class="coefficients-row">
                <template v-for="(coef, index) in objectiveCoefficients" :key="'obj-' + index">
                  <input
                    v-model.number="objectiveCoefficients[index]"
                    type="number"
                    step="any"
                    class="coef-input"
                    :placeholder="'c' + (index + 1)"
                  >
                  <span class="variable-label">X<sub>{{ index + 1 }}</sub></span>
                  <span v-if="index < objectiveCoefficients.length - 1" class="operator">+</span>
                </template>
              </div>
            </div>
            <div class="explanation-box">
              <div class="explanation-row">
                <strong>Simplex/Grafico:</strong>
                <span>Coeficientes que multiplican cada variable. Ejemplo: 3X₁ + 5X₂, aqui 3 y 5 son los coeficientes</span>
              </div>
              <div class="explanation-row">
                <strong>Transporte:</strong>
                <span>Costo de enviar 1 unidad. Ejemplo: Si X₁=costo de Fabrica1 a Tienda1, X₂=costo de Fabrica1 a Tienda2. Los costos podrian ser 4 y 8</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Restricciones -->
        <div class="constraints-section">
          <h3>Restricciones</h3>
          <div class="section-with-explanation">
            <div class="constraints-list">
              <div
                v-for="(constraint, i) in constraintCoefficients"
                :key="'constraint-' + i"
                class="constraint-row"
              >
                <span class="constraint-number">{{ i + 1 }}.</span>
                <div class="constraint-content">
                  <template v-for="(coef, j) in constraint" :key="'c-' + i + '-' + j">
                    <input
                      v-model.number="constraintCoefficients[i][j]"
                      type="number"
                      step="any"
                      class="coef-input small"
                      :placeholder="'a' + (i + 1) + (j + 1)"
                    >
                    <span class="variable-label">X<sub>{{ j + 1 }}</sub></span>
                    <span v-if="j < constraint.length - 1" class="operator">+</span>
                  </template>

                  <select v-model="constraintTypes[i]" class="constraint-type-select">
                    <option value="≤">≤ (Menor o igual)</option>
                    <option value="≥">≥ (Mayor o igual)</option>
                    <option value="=">=  (Igual)</option>
                  </select>

                  <input
                    v-model.number="constraintRHS[i]"
                    type="number"
                    step="any"
                    class="coef-input rhs"
                    :placeholder="'b' + (i + 1)"
                  >
                </div>
              </div>
            </div>
            <div class="explanation-box">
              <div class="explanation-row">
                <strong>Simplex/Grafico:</strong>
                <span>Limite de recursos. Ejemplo: X₁ + X₂ ≤ 100 significa "no puedes producir mas de 100 unidades en total"</span>
              </div>
              <div class="explanation-row">
                <strong>Transporte:</strong>
                <span>PRIMERAS restricciones: X₁ + X₂ = 50 (Fabrica1 tiene 50 unidades). ULTIMAS restricciones: X₁ + X₃ = 30 (Tienda1 necesita 30 unidades)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista previa en formato Transporte - SIEMPRE VISIBLE -->
        <div class="transport-preview-section">
          <h3>Asi seria en Metodo de Transporte:</h3>

          <div class="transport-config">
            <div class="form-group">
              <label for="num-origenes">Numero de Origenes:</label>
              <input
                id="num-origenes"
                v-model.number="numOrigenes"
                type="number"
                min="1"
                max="10"
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label for="num-destinos">Numero de Destinos:</label>
              <input
                id="num-destinos"
                v-model.number="numDestinos"
                type="number"
                min="1"
                max="10"
                class="form-input"
              >
            </div>
          </div>

          <div class="transport-table-container">
            <table class="transport-table">
              <thead>
                <tr>
                  <th>Origen / Destino</th>
                  <th v-for="j in numDestinos" :key="'dest-' + j">Destino {{ j }}</th>
                  <th class="oferta-header">Oferta</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in numOrigenes" :key="'orig-' + i">
                  <td class="origen-header"><strong>Origen {{ i }}</strong></td>
                  <td v-for="j in numDestinos" :key="'cell-' + i + '-' + j" class="cost-cell">
                    {{ objectiveCoefficients[(i-1) * numDestinos + (j-1)] || 0 }}
                  </td>
                  <td class="supply-cell">{{ constraintRHS[i-1] || 0 }}</td>
                </tr>
                <tr class="demand-row">
                  <td class="demanda-header"><strong>Demanda</strong></td>
                  <td v-for="j in numDestinos" :key="'demand-' + j" class="demand-cell">
                    {{ constraintRHS[numOrigenes + j - 1] || 0 }}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <button @click="loadExample" class="btn btn-secondary btn-example">
            Cargar Ejemplo Simple (Simplex + Gráfico)
          </button>
          <button @click="loadTransportExample" class="btn btn-secondary btn-example">
            Cargar Ejemplo Transporte
          </button>
          <button @click="compareAllMethods" class="btn btn-primary btn-solve-main">
            Resolver y Comparar Métodos
          </button>
        </div>

      </div>
    </div>

    <!-- Resultados comparativos -->
    <div v-if="showSolutions" class="solutions-section">
      <div class="solutions-header">
        <h2>Comparación de Resultados</h2>
      </div>

      <!-- MÉTODO SIMPLEX -->
      <div v-if="solutionResults.simplex" class="method-result-card">
        <h3 class="result-title">Método Simplex</h3>
        <div v-if="!solutionResults.simplex.error" class="result-content">
          <div class="result-summary">
            <p class="result-z">Valor Z = <strong>{{ solutionResults.simplex.z?.toFixed(2) }}</strong></p>
            <p class="result-interpretation">{{ solutionResults.simplex.interpretacion }}</p>
          </div>
        </div>
        <div v-else class="error-message">{{ solutionResults.simplex.error }}</div>
      </div>

      <!-- MÉTODO GRÁFICO -->
      <div v-if="solutionResults.grafico" class="method-result-card">
        <h3 class="result-title">Método Gráfico</h3>
        <div v-if="!solutionResults.grafico.error" class="result-content">
          <div class="result-summary">
            <p class="result-z">Valor Z = <strong>{{ solutionResults.grafico.z?.toFixed(2) }}</strong></p>
            <p class="result-interpretation">{{ solutionResults.grafico.interpretacion }}</p>
          </div>
        </div>
        <div v-else class="error-message">{{ solutionResults.grafico.error }}</div>
      </div>

      <!-- MÉTODOS DE TRANSPORTE -->
      <div v-if="solutionResults.esquinaNoroeste || solutionResults.costoMinimo || solutionResults.vogel" class="transport-results">
        <h3 class="section-subtitle">Métodos de Transporte</h3>

        <!-- Esquina Noroeste -->
        <div v-if="solutionResults.esquinaNoroeste" class="method-result-card transport-card">
          <h4 class="transport-method-title">
            Método Esquina Noroeste
            <span v-if="solutionResults.mejorTransporte === 'Esquina Noroeste'" class="best-badge">⭐ Mejor</span>
          </h4>
          <div v-if="!solutionResults.esquinaNoroeste.error" class="result-content">
            <p class="result-z">Costo Total = <strong>{{ solutionResults.esquinaNoroeste.z?.toFixed(2) }}</strong></p>
          </div>
          <div v-else class="error-message">{{ solutionResults.esquinaNoroeste.error }}</div>
        </div>

        <!-- Costo Mínimo -->
        <div v-if="solutionResults.costoMinimo" class="method-result-card transport-card">
          <h4 class="transport-method-title">
            Método Costo Mínimo
            <span v-if="solutionResults.mejorTransporte === 'Costo Mínimo'" class="best-badge">⭐ Mejor</span>
          </h4>
          <div v-if="!solutionResults.costoMinimo.error" class="result-content">
            <p class="result-z">Costo Total = <strong>{{ solutionResults.costoMinimo.z?.toFixed(2) }}</strong></p>
          </div>
          <div v-else class="error-message">{{ solutionResults.costoMinimo.error }}</div>
        </div>

        <!-- Vogel (VAM) -->
        <div v-if="solutionResults.vogel" class="method-result-card transport-card">
          <h4 class="transport-method-title">
            Método Vogel (VAM)
            <span v-if="solutionResults.mejorTransporte === 'Vogel (VAM)'" class="best-badge">⭐ Mejor</span>
          </h4>
          <div v-if="!solutionResults.vogel.error" class="result-content">
            <p class="result-z">Costo Total = <strong>{{ solutionResults.vogel.z?.toFixed(2) }}</strong></p>
          </div>
          <div v-else class="error-message">{{ solutionResults.vogel.error }}</div>
        </div>
      </div>

      <!-- VALIDACIÓN CRUZADA -->
      <div v-if="validationResults.linealConvergence && validationResults.linealConvergence.methods.length > 1" class="validation-section">
        <h3 class="validation-title">
          <span v-if="validationResults.linealConvergence.valid">✓</span>
          <span v-else>⚠️</span>
          Validación Cruzada
        </h3>

        <div :class="['validation-box', validationResults.linealConvergence.valid ? 'validation-success' : 'validation-warning']">
          <p class="validation-message">{{ validationResults.linealConvergence.message }}</p>

          <div v-if="validationResults.linealConvergence.valid" class="convergence-details">
            <h4>Convergencia Confirmada:</h4>
            <div class="method-convergence-list">
              <div v-for="method in validationResults.linealConvergence.methods" :key="method.name" class="convergence-item">
                <span class="method-icon">✓</span>
                <strong>{{ method.name }}:</strong>
                <span class="convergence-values">
                  <span v-for="(varVal, idx) in method.vars" :key="idx">
                    X{{ idx + 1 }}={{ varVal.toFixed(2) }}{{ idx < method.vars.length - 1 ? ', ' : '' }}
                  </span>
                  , Z={{ method.z.toFixed(2) }}
                </span>
              </div>
            </div>
            <p class="convergence-confirmation">✓✓✓ Todos los métodos dan la MISMA solución</p>
          </div>

          <div v-else class="convergence-warning">
            <h4>Diferencias Detectadas:</h4>
            <div v-if="validationResults.linealConvergence.zValues" class="difference-details">
              <p>Valores de Z:</p>
              <ul>
                <li v-for="item in validationResults.linealConvergence.zValues" :key="item.name">
                  {{ item.name }}: {{ item.z.toFixed(2) }}
                </li>
              </ul>
              <p class="difference-amount">Diferencia: {{ validationResults.linealConvergence.difference?.toFixed(2) }}</p>
            </div>
            <div v-if="validationResults.linealConvergence.varValues" class="difference-details">
              <p>Variable X{{ validationResults.linealConvergence.varIndex }}:</p>
              <ul>
                <li v-for="item in validationResults.linealConvergence.varValues" :key="item.name">
                  {{ item.name }}: {{ item.value.toFixed(2) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- COMPARACIÓN DE TRANSPORTE -->
      <div v-if="validationResults.transportComparison && validationResults.transportComparison.methods.length > 0" class="validation-section">
        <h3 class="validation-title">✓ Comparación de Métodos de Transporte</h3>

        <div class="validation-box validation-info">
          <p class="validation-message">{{ validationResults.transportComparison.message }}</p>

          <div class="transport-comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Costo Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="method in validationResults.transportComparison.methods" :key="method.name"
                    :class="{ 'best-transport-row': method.name === validationResults.transportComparison.best.method }">
                  <td>
                    {{ method.name }}
                    <span v-if="method.name === validationResults.transportComparison.best.method" class="best-indicator">⭐</span>
                  </td>
                  <td>{{ method.cost.toFixed(2) }}</td>
                  <td>
                    <span v-if="method.name === validationResults.transportComparison.best.method" class="status-best">MEJOR</span>
                    <span v-else class="status-ok">✓ Factible</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="validationResults.transportComparison.best.savings > 0" class="savings-info">
            <p class="savings-text">
              💰 Ahorro al usar <strong>{{ validationResults.transportComparison.best.method }}</strong>:
              ${{ validationResults.transportComparison.best.savings.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- RESULTADO FINAL: MÉTODO MÁS FACTIBLE -->
      <div class="final-conclusion">
        <h3 class="conclusion-title">Resultado Final</h3>
        <div class="optimal-solution-box">
          <h4>Método Más Factible:</h4>
          <p class="best-method-name">{{ getBestMethod() }}</p>
          <p class="best-value">Valor Z = <strong>{{ getBestValue()?.toFixed(2) }}</strong></p>
          <p v-if="solutionResults.mejorTransporte" class="transport-note">
            (De los 3 métodos de transporte evaluados, el mejor fue: <strong>{{ solutionResults.mejorTransporte }}</strong>)
          </p>
        </div>
      </div>

      <!-- Botón para nuevo problema al final -->
      <div class="final-actions">
        <button @click="resetComparison" class="btn btn-secondary btn-new-problem">
          Nuevo Problema
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comparar-todos {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-section {
  animation: fadeIn 0.4s ease-in;
}

/* Explicación de métodos */
.methods-explanation {
  background: #f0f9ff;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.methods-explanation > p:first-child {
  color: #1e40af;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.method-desc {
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;
  flex: 1;
}

.note-info {
  color: #1e40af;
  font-size: 0.9rem;
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid #bfdbfe;
  font-style: italic;
}

/* Etiquetas de transporte en restricciones */
.transport-label {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 0.75rem;
  white-space: nowrap;
  animation: fadeIn 0.3s ease-in;
}

.label-oferta {
  background: #dbeafe;
  color: #1e40af;
  border: 1.5px solid #3b82f6;
}

.label-demanda {
  background: #fef3c7;
  color: #92400e;
  border: 1.5px solid #f59e0b;
}

/* Balance de oferta/demanda */
.transport-sum-info {
  background: #f0f9ff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.balance-note {
  text-align: center;
  margin: 0;
  font-size: 0.95rem;
}

.balanced {
  color: #065f46;
  font-weight: 700;
  font-size: 1rem;
}

.unbalanced {
  color: #b91c1c;
  font-weight: 700;
  font-size: 1rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Guía de uso */
.usage-guide {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.usage-guide h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.guide-intro {
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
  opacity: 0.95;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.method-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1.25rem;
  text-align: center;
  transition: all 0.3s;
}

.method-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
}

.method-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.method-card h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.method-card p {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.tip-box {
  background: rgba(255, 255, 255, 0.2);
  border-left: 4px solid #fbbf24;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
}

.tip-box strong {
  font-weight: 700;
}

@media (max-width: 768px) {
  .methods-grid {
    grid-template-columns: 1fr;
  }
}

/* Sección con explicación al lado */
.section-with-explanation {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  align-items: start;
}

.field-with-explanation {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 1.5rem;
  align-items: center;
}

.full-width {
  grid-column: 1 / -1;
}

.explanation-box {
  background: #f0f9ff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 1rem;
}

.explanation-row {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.explanation-row:last-child {
  margin-bottom: 0;
}

.explanation-row strong {
  color: #1e40af;
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.explanation-row span {
  color: #475569;
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .section-with-explanation,
  .field-with-explanation {
    grid-template-columns: 1fr;
  }
}

/* Vista previa de Transporte */
.transport-preview-section {
  background: #ecfdf5;
  border: 3px solid #10b981;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.transport-preview-section h3 {
  color: #065f46;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.transport-config {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.transport-config .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transport-config label {
  color: #065f46;
  font-weight: 600;
  font-size: 0.95rem;
}

.transport-config .form-input {
  padding: 0.75rem;
  border: 2px solid #10b981;
  border-radius: 6px;
  font-size: 1rem;
}

.transport-table-container {
  overflow-x: auto;
}

.transport-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.transport-table thead {
  background: #10b981;
  color: white;
}

.transport-table th {
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
}

.transport-table td {
  padding: 1rem;
  text-align: center;
  border: 1px solid #d1fae5;
  font-size: 1.1rem;
  font-weight: 600;
}

.transport-table .origen-header {
  background: #3b82f6;
  color: white;
  font-weight: 700;
}

.transport-table .demanda-header {
  background: #ef4444;
  color: white;
  font-weight: 700;
}

.transport-table .oferta-header {
  background: #3b82f6;
  color: white;
}

.transport-table .cost-cell {
  background: #dbeafe;
  color: #1e40af;
  font-size: 1.2rem;
}

.transport-table .supply-cell {
  background: #3b82f6;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

.transport-table .demand-row {
  background: #fee2e2;
}

.transport-table .demand-cell {
  background: #ef4444;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
}

/* Botón de diferencias */
.btn-differences {
  width: 100%;
  background: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.btn-differences:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* Contenido de diferencias */
.differences-content {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  animation: fadeIn 0.3s ease-in;
}

.differences-content h4 {
  color: #1e40af;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.comparison-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.comparison-box {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.comparison-box.highlight {
  background: #ecfdf5;
  border-color: #10b981;
}

.comparison-box h5 {
  color: #1e40af;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.comparison-box p {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.comparison-box ul {
  list-style: none;
  padding-left: 0;
  margin: 1rem 0;
}

.comparison-box ul li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #475569;
}

.comparison-box ul li::before {
  content: "→";
  color: #10b981;
  position: absolute;
  left: 0;
  font-weight: 700;
}

.note-important {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #92400e;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .comparison-boxes {
    grid-template-columns: 1fr;
  }
}

.input-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  color: #1e40af;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.section-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.config-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 2px solid #e2e8f0;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-group small {
  color: #666;
  font-size: 0.85rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.methods-info {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 2px solid #3b82f6;
}

.methods-info h4 {
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.methods-badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.method-badge {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.badge-graphic {
  background: #8b5cf6;
  color: white;
}

.badge-simplex {
  background: #3b82f6;
  color: white;
}

.badge-transport {
  background: #10b981;
  color: white;
}

.badge-transport2 {
  background: #059669;
  color: white;
}

.badge-transport3 {
  background: #047857;
  color: white;
}

.badge-disabled {
  background: #e2e8f0;
  color: #94a3b8;
}

.objective-section,
.constraints-section {
  margin-bottom: 2rem;
}

.objective-section h3,
.constraints-section h3 {
  font-size: 1.3rem;
  color: #1e40af;
  margin-bottom: 1rem;
  font-weight: 700;
}

.objective-function {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: #f0f7ff;
  border-radius: 8px;
  border: 2px solid #93c5fd;
}

.function-label {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.coefficients-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.coef-input {
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;
  transition: all 0.3s;
}

.coef-input.small {
  width: 70px;
}

.coef-input.rhs {
  width: 90px;
}

.coef-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.variable-label {
  font-weight: 600;
  color: #1e40af;
  font-size: 1rem;
}

.operator {
  color: #999;
  font-size: 1.2rem;
  font-weight: 300;
}

.helper-text {
  color: #666;
  margin-bottom: 1rem;
  font-style: italic;
}

.constraints-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.constraint-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.constraint-number {
  font-weight: 600;
  color: #1e40af;
  font-size: 1.1rem;
  min-width: 25px;
}

.constraint-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.constraint-type-select {
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.constraint-type-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.non-negativity {
  background: #eff6ff;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #93c5fd;
}

.non-negativity p {
  margin: 0.5rem 0;
  color: #333;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: #60a5fa;
  color: white;
}

.btn-secondary:hover {
  background: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-example {
  background: #10b981;
  color: white;
}

.btn-example:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

/* Sección de soluciones */
.solutions-section {
  animation: fadeIn 0.6s ease-in;
}

.solutions-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.solutions-header h2 {
  font-size: 2rem;
  color: #1e40af;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.solutions-header p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

/* Tabla comparativa */
.comparison-table-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
}

.comparison-table thead {
  background: #f8fafc;
}

.comparison-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: #1e40af;
  border-bottom: 3px solid #3b82f6;
}

.comparison-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s;
}

.comparison-table tbody tr:hover {
  background: #f8fafc;
}

.comparison-table tbody tr.best-solution {
  background: #ecfdf5;
  border-left: 4px solid #10b981;
}

.comparison-table tbody tr.best-solution:hover {
  background: #d1fae5;
}

.comparison-table td {
  padding: 1.25rem 1rem;
  color: #475569;
}

.method-name {
  font-weight: 600;
}

.value-z {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e40af;
}

.error-text {
  color: #ef4444;
  font-style: italic;
}

.status-badge {
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
}

.status-success {
  background: #d1fae5;
  color: #065f46;
}

.status-error {
  background: #fee2e2;
  color: #991b1b;
}

.type-badge {
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  background: #e0e7ff;
  color: #3730a3;
}

.type-badge.type-transport {
  background: #d1fae5;
  color: #065f46;
}

/* Resultados detallados */
.detailed-results {
  margin-bottom: 2rem;
}

.detailed-results h3 {
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.result-detail-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #3b82f6;
}

.result-detail-card h4 {
  color: #1e40af;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.result-summary p {
  color: #475569;
  line-height: 1.8;
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
}

.result-summary ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.result-summary ul li {
  padding: 0.5rem 0;
  color: #475569;
  font-size: 1.05rem;
}

/* Conclusión final */
/* Tarjetas de resultado de cada método */
.method-result-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #3b82f6;
}

.result-title {
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.result-content {
  padding: 1rem 0;
}

.result-summary {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
}

.result-z {
  color: #1e40af;
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.result-z strong {
  color: #10b981;
  font-size: 1.5rem;
}

.result-interpretation {
  color: #475569;
  font-size: 1.05rem;
  line-height: 1.7;
}

.error-message {
  background: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

/* Sección de transporte */
.transport-results {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.section-subtitle {
  color: #065f46;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-align: center;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #10b981;
}

.transport-card {
  border-left-color: #10b981;
}

.transport-method-title {
  color: #065f46;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.best-badge {
  background: #fbbf24;
  color: #78350f;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 700;
}

/* Conclusión final */
.final-conclusion {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 3px solid #10b981;
  border-radius: 16px;
  padding: 2.5rem;
  margin-top: 2rem;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.conclusion-title {
  color: #065f46;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.optimal-solution-box {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.optimal-solution-box h4 {
  color: #1e40af;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.best-method-name {
  color: #3b82f6;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.best-value {
  color: #475569;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.best-value strong {
  color: #10b981;
  font-size: 2.2rem;
}

.transport-note {
  color: #64748b;
  font-size: 1rem;
  margin-top: 1.5rem;
  font-style: italic;
  padding-top: 1rem;
  border-top: 2px solid #e2e8f0;
}

.note-text {
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 1rem;
}

/* Botón nuevo problema al final */
.final-actions {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.btn-new-problem {
  padding: 1.25rem 3rem;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-new-problem:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* Sección de validación cruzada */
.validation-section {
  margin: 2rem 0;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.validation-title {
  font-size: 1.8rem;
  color: #1e40af;
  margin-bottom: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.validation-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #3b82f6;
}

.validation-success {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.validation-warning {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.validation-info {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
}

.validation-message {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 1.5rem;
}

.convergence-details h4,
.convergence-warning h4 {
  color: #065f46;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.method-convergence-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.convergence-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #d1fae5;
}

.method-icon {
  color: #10b981;
  font-size: 1.2rem;
  font-weight: bold;
}

.convergence-values {
  color: #475569;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
}

.convergence-confirmation {
  background: #10b981;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.convergence-warning {
  background: #fef3c7;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #f59e0b;
}

.difference-details {
  margin-top: 1rem;
}

.difference-details ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.difference-details li {
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  border-left: 3px solid #f59e0b;
}

.difference-amount {
  font-weight: 700;
  color: #b91c1c;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 6px;
}

/* Tabla de comparación de transporte */
.transport-comparison-table {
  margin: 1.5rem 0;
  overflow-x: auto;
}

.transport-comparison-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.transport-comparison-table th {
  background: #3b82f6;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.transport-comparison-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.transport-comparison-table tr:last-child td {
  border-bottom: none;
}

.best-transport-row {
  background: #f0fdf4;
  font-weight: 600;
}

.best-indicator {
  margin-left: 0.5rem;
  font-size: 1.2rem;
}

.status-best {
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
}

.status-ok {
  color: #10b981;
  font-weight: 600;
}

.savings-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.savings-text {
  color: #065f46;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

@media (max-width: 768px) {
  .config-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .objective-function,
  .constraint-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .comparison-table-container {
    padding: 1rem;
  }

  .comparison-table {
    font-size: 0.85rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 0.75rem 0.5rem;
  }

  .value-z {
    font-size: 1rem;
  }
}
</style>
