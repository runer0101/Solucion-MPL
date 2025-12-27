// Algoritmo del Método Simplex con explicaciones detalladas
import { formatNumber } from './formatters.js'

// Constantes de configuración
const EPSILON = 0.0001 // Tolerancia para comparaciones numéricas
const MAX_ITERATIONS = 100 // Máximo de iteraciones permitidas

export class SimplexSolver {
  constructor(problemData) {
    this.problemData = problemData
    this.iterations = []
    this.finalSolution = null
    this.status = null
  }

  /**
   * Formatea un número para mostrar en la interfaz
   * Utiliza la función compartida de formatters.js
   *
   * @param {number} numero - El número a formatear
   * @returns {string} - El número formateado como texto
   */
  formatNumber(numero) {
    return formatNumber(numero)
  }

  /**
   * Método principal que resuelve el problema de programación lineal
   * usando el algoritmo del Método Simplex
   *
   * @returns {object} - Objeto con iteraciones, solución y estado
   */
  solve() {
    try {
      // Paso 1: Convertir a forma estándar (agregar variables de holgura/exceso)
      const formaEstandar = this.convertToStandardForm()

      // Paso 2: Crear tabla inicial del Simplex
      let tablaSimplex = this.createInitialTableau(formaEstandar)

      let numeroDeIteracion = 0

      // Guardar iteración inicial (tabla sin modificar)
      this.iterations.push({
        iteration: 0,
        tableau: this.copyTableau(tablaSimplex),
        explanation: this.explainInitialTableau(formaEstandar),
        phase: 'inicial',
        isOptimal: false
      })

      // Paso 3: Iterar hasta encontrar solución óptima
      while (numeroDeIteracion < MAX_ITERATIONS) {
        // Verificar si la solución actual ya es óptima
        if (this.isOptimal(tablaSimplex)) {
          this.iterations[this.iterations.length - 1].isOptimal = true
          this.status = 'optimal'
          break
        }

        numeroDeIteracion++

        // Encontrar columna pivote (variable que entra a la base)
        const columnaDelPivote = this.findPivotColumn(tablaSimplex)
        if (columnaDelPivote === -1) {
          // No hay columna pivote, la solución es óptima
          this.status = 'optimal'
          this.iterations[this.iterations.length - 1].isOptimal = true
          break
        }

        // Encontrar fila pivote (variable que sale de la base)
        const filaDelPivote = this.findPivotRow(tablaSimplex, columnaDelPivote)
        if (filaDelPivote === -1) {
          // No hay fila pivote válida, el problema es no acotado
          this.status = 'unbounded'
          this.iterations.push({
            iteration: numeroDeIteracion,
            tableau: this.copyTableau(tablaSimplex),
            explanation: '<div class="explanation-section"><h3>PROBLEMA NO ACOTADO</h3><p>El problema es no acotado (solución ilimitada). No existe un máximo finito porque la variable entrante puede crecer indefinidamente sin violar ninguna restricción.</p></div>',
            phase: 'no-acotado',
            isOptimal: false,
            unbounded: true
          })
          break
        }

        // Obtener el elemento pivote (intersección de fila y columna pivote)
        const elementoPivote = tablaSimplex[filaDelPivote][columnaDelPivote]

        // Guardar la tabla ANTES del pivote para mostrar en la explicación
        const tablaAntesDePivotear = this.copyTableau(tablaSimplex)

        // Realizar operaciones de pivoteo (Gauss-Jordan)
        tablaSimplex = this.pivot(tablaSimplex, filaDelPivote, columnaDelPivote)

        // Guardar información de la iteración DESPUÉS del pivoteo
        const informacionDeIteracion = {
          iteration: numeroDeIteracion,
          pivotRow: filaDelPivote,
          pivotCol: columnaDelPivote,
          pivotElement: elementoPivote,
          enteringVariable: columnaDelPivote,
          leavingVariable: this.findBasicVariableInRow(tablaSimplex, filaDelPivote, formaEstandar),
          tableau: this.copyTableau(tablaSimplex),
          explanation: this.explainIteration(tablaAntesDePivotear, tablaSimplex, filaDelPivote, columnaDelPivote, elementoPivote, formaEstandar, numeroDeIteracion),
          phase: 'iteracion',
          isOptimal: false
        }

        this.iterations.push(informacionDeIteracion)
      }

      // Verificar si se alcanzó el máximo de iteraciones sin encontrar solución
      if (numeroDeIteracion >= MAX_ITERATIONS) {
        this.status = 'max_iterations'
      }

      // Extraer solución final de la tabla
      this.finalSolution = this.extractSolution(tablaSimplex, formaEstandar)

      return {
        iterations: this.iterations,
        solution: this.finalSolution,
        status: this.status
      }
    } catch (error) {
      return {
        error: true,
        message: error.message,
        iterations: this.iterations
      }
    }
  }

  /**
   * Convierte el problema a forma estándar agregando variables auxiliares
   *
   * Forma estándar significa:
   * - Todas las restricciones son igualdades (=)
   * - Todas las variables son no negativas (≥ 0)
   * - Para problemas de minimización, multiplicamos la función objetivo por -1
   *
   * Tipos de variables agregadas:
   * - Variables de holgura (slack): para restricciones ≤
   * - Variables de exceso (surplus): para restricciones ≥
   * - Variables artificiales: para restricciones ≥ y =
   *
   * @returns {object} - Problema en forma estándar
   */
  convertToStandardForm() {
    const { type, numVariables, numConstraints, objective, constraints, rhs, constraintTypes } = this.problemData

    // Copiar coeficientes originales
    let coeficientesObjetivo = [...objective]
    let coeficientesRestricciones = constraints.map(fila => [...fila])
    let ladosDerechos = [...rhs]

    // Si el problema es de minimización, convertir a maximización
    // Min Z = 3X₁ + 2X₂  →  Max Z' = -3X₁ - 2X₂
    if (type === 'min') {
      coeficientesObjetivo = coeficientesObjetivo.map(coeficiente => -coeficiente)
    }

    let contadorVariablesDeHolgura = 0
    let contadorVariablesArtificiales = 0
    const tiposDeVariablesAgregadas = [] // Guarda info de cada variable agregada

    // Procesar cada restricción para agregar variables auxiliares
    for (let indiceRestriccion = 0; indiceRestriccion < numConstraints; indiceRestriccion++) {
      const tipoDeRestriccion = constraintTypes[indiceRestriccion]

      if (tipoDeRestriccion === '≤') {
        // Restricción tipo ≤: Agregar variable de holgura
        // Ejemplo: X₁ + X₂ ≤ 10  →  X₁ + X₂ + S₁ = 10
        contadorVariablesDeHolgura++
        tiposDeVariablesAgregadas.push({ type: 'slack', constraintIndex: indiceRestriccion })
        coeficientesObjetivo.push(0) // La variable de holgura no afecta Z
      } else if (tipoDeRestriccion === '≥') {
        // Restricción tipo ≥: Agregar variable de exceso Y variable artificial
        // Ejemplo: X₁ + X₂ ≥ 5  →  X₁ + X₂ - E₁ + A₁ = 5
        contadorVariablesDeHolgura++
        contadorVariablesArtificiales++
        tiposDeVariablesAgregadas.push({ type: 'surplus', constraintIndex: indiceRestriccion })
        tiposDeVariablesAgregadas.push({ type: 'artificial', constraintIndex: indiceRestriccion })
        coeficientesObjetivo.push(0) // Variable de exceso
        coeficientesObjetivo.push(0) // Variable artificial (se penalizará después)
      } else if (tipoDeRestriccion === '=') {
        // Restricción tipo =: Agregar variable artificial
        // Ejemplo: X₁ + X₂ = 8  →  X₁ + X₂ + A₁ = 8
        contadorVariablesArtificiales++
        tiposDeVariablesAgregadas.push({ type: 'artificial', constraintIndex: indiceRestriccion })
        coeficientesObjetivo.push(0) // Variable artificial
      }
    }

    return {
      type,
      originalType: this.problemData.type,
      numOriginalVariables: numVariables,
      numVariables: coeficientesObjetivo.length,
      numConstraints,
      objective: coeficientesObjetivo,
      constraints: coeficientesRestricciones,
      rhs: ladosDerechos,
      constraintTypes,
      variableTypes: tiposDeVariablesAgregadas,
      slackVariables: contadorVariablesDeHolgura,
      artificialVariables: contadorVariablesArtificiales
    }
  }

  createInitialTableau(standardForm) {
    const { numVariables, numConstraints, objective, constraints, rhs, constraintTypes, variableTypes } = standardForm

    // Crear tableau: [restricciones, función objetivo]
    const tableau = []

    // Agregar restricciones con variables de holgura/exceso
    let currentExtraVar = standardForm.numOriginalVariables

    for (let i = 0; i < numConstraints; i++) {
      const row = [...constraints[i]]

      // Extender con ceros para variables adicionales
      const totalVars = numVariables + 1 // +1 para RHS
      while (row.length < numVariables) {
        row.push(0)
      }

      // Agregar variables de holgura/exceso según el tipo de restricción
      if (constraintTypes[i] === '≤') {
        // Variable de holgura en esta restricción
        for (let j = standardForm.numOriginalVariables; j < numVariables; j++) {
          if (j === currentExtraVar) {
            row[j] = 1
            currentExtraVar++
            break
          }
        }
      } else if (constraintTypes[i] === '≥') {
        // Variable de exceso (negativa) y artificial
        for (let j = standardForm.numOriginalVariables; j < numVariables; j++) {
          if (j === currentExtraVar) {
            row[j] = -1
            row[j + 1] = 1
            currentExtraVar += 2
            break
          }
        }
      } else if (constraintTypes[i] === '=') {
        // Variable artificial
        for (let j = standardForm.numOriginalVariables; j < numVariables; j++) {
          if (j === currentExtraVar) {
            row[j] = 1
            currentExtraVar++
            break
          }
        }
      }

      row.push(rhs[i]) // Agregar RHS
      tableau.push(row)
    }

    // Agregar fila Z (función objetivo)
    const zRow = objective.map(c => -c) // Negativos porque Z - cX = 0 -> -cX = -Z
    zRow.push(0) // RHS de la función objetivo
    tableau.push(zRow)

    return tableau
  }

  /**
   * Verifica si la solución actual es óptima
   *
   * Criterio de optimalidad para maximización:
   * - Todos los coeficientes en la fila Z deben ser ≥ 0
   * - Si hay algún coeficiente negativo, aún podemos mejorar la solución
   *
   * ¿Por qué funciona este criterio?
   * - Un coeficiente negativo en Z significa que aumentar esa variable mejora Z
   * - Si todos son ≥ 0, aumentar cualquier variable empeoraría Z
   *
   * @param {Array<Array<number>>} tablaSimplex - La tabla actual del Simplex
   * @returns {boolean} - true si es óptima, false si aún podemos mejorar
   */
  isOptimal(tablaSimplex) {
    // La fila Z es la última fila de la tabla
    const filaZ = tablaSimplex[tablaSimplex.length - 1]

    // Para maximización, es óptimo si todos los coeficientes (excepto LD) son ≥ 0
    for (let indiceColumna = 0; indiceColumna < filaZ.length - 1; indiceColumna++) {
      const coeficiente = filaZ[indiceColumna]

      // Si encontramos un coeficiente negativo, NO es óptima
      if (coeficiente < -EPSILON) { // Usamos tolerancia para evitar errores de redondeo
        return false
      }
    }

    // Todos los coeficientes son ≥ 0, ¡la solución es óptima!
    return true
  }

  /**
   * Encuentra la columna pivote (variable que entra a la base)
   *
   * Regla: Seleccionar la variable con el coeficiente MÁS NEGATIVO en la fila Z
   * Esta es la variable que más mejorará la función objetivo
   *
   * Ejemplo de fila Z:
   * Z | -3 | -5 | 0 | 0 | 0 |
   *      X₁   X₂  S₁  S₂  LD
   *
   * En este caso, X₂ tiene -5 (el más negativo), así que X₂ entra a la base
   *
   * @param {Array<Array<number>>} tablaSimplex - La tabla actual
   * @returns {number} - Índice de la columna pivote, o -1 si no hay (ya es óptima)
   */
  findPivotColumn(tablaSimplex) {
    const filaZ = tablaSimplex[tablaSimplex.length - 1]
    let valorMasNegativo = 0
    let indiceColumnaPivote = -1

    // Buscar el coeficiente más negativo en la fila Z
    for (let indiceColumna = 0; indiceColumna < filaZ.length - 1; indiceColumna++) {
      const coeficiente = filaZ[indiceColumna]

      // Si es más negativo que el mínimo actual, actualizar
      if (coeficiente < valorMasNegativo - EPSILON) {
        valorMasNegativo = coeficiente
        indiceColumnaPivote = indiceColumna
      }
    }

    // Si indiceColumnaPivote = -1, significa que no hay coeficientes negativos
    // Por lo tanto, la solución ya es óptima
    return indiceColumnaPivote
  }

  /**
   * Encuentra la fila pivote (variable que sale de la base)
   * usando el Test de la Razón Mínima
   *
   * Regla: Para cada restricción, calcular:
   *        Razón = Lado Derecho / Coeficiente en columna pivote
   *
   * La fila con la RAZÓN MÁS PEQUEÑA es la que sale
   *
   * ¿Por qué?
   * - Cuando aumentamos la variable entrante, las variables básicas disminuyen
   * - La razón indica cuánto puede crecer la entrante antes de que esa básica llegue a 0
   * - Elegimos la restricción más limitante para mantener factibilidad (todas ≥ 0)
   *
   * Ejemplo:
   * Restricción 1: 10 / 2 = 5  → La variable básica puede disminuir máximo 5
   * Restricción 2: 15 / 5 = 3  → La variable básica puede disminuir máximo 3 ← MÁS LIMITANTE
   * Restricción 3: 8 / -1 = (ignorar, coef negativo)
   *
   * @param {Array<Array<number>>} tablaSimplex - La tabla actual
   * @param {number} columnaDelPivote - Índice de la columna pivote
   * @returns {number} - Índice de la fila pivote, o -1 si no hay (problema no acotado)
   */
  findPivotRow(tablaSimplex, columnaDelPivote) {
    let razonMinima = Infinity
    let indiceFilaPivote = -1

    // Revisar cada restricción (todas las filas excepto la fila Z)
    for (let indiceFila = 0; indiceFila < tablaSimplex.length - 1; indiceFila++) {
      const coeficienteEnColumnaPivote = tablaSimplex[indiceFila][columnaDelPivote]
      const valorLadoDerecho = tablaSimplex[indiceFila][tablaSimplex[indiceFila].length - 1]

      // Solo considerar coeficientes positivos
      // Si el coeficiente es ≤ 0, esa restricción no limita el crecimiento
      if (coeficienteEnColumnaPivote > EPSILON) {
        // Calcular la razón: LD / Coef
        const razon = valorLadoDerecho / coeficienteEnColumnaPivote

        // Si esta razón es la más pequeña hasta ahora, actualizar
        if (razon >= 0 && razon < razonMinima) {
          razonMinima = razon
          indiceFilaPivote = indiceFila
        }
      }
    }

    // Si indiceFilaPivote = -1, significa que no hay coeficientes positivos
    // Por lo tanto, el problema es NO ACOTADO (solución ilimitada)
    return indiceFilaPivote
  }

  /**
   * Realiza las operaciones de pivoteo (Eliminación de Gauss-Jordan)
   *
   * Objetivo: Convertir la columna pivote en un vector unitario
   *           [0, 0, ..., 1, ..., 0] donde el 1 está en la fila pivote
   *
   * Proceso en 2 pasos:
   *
   * PASO 1: Normalizar la fila pivote
   *         Dividir toda la fila entre el elemento pivote para convertirlo en 1
   *
   * PASO 2: Hacer ceros en el resto de la columna
   *         Para cada otra fila, restar un múltiplo de la fila pivote
   *         para eliminar el coeficiente en la columna pivote
   *
   * Ejemplo:
   * Antes del pivoteo (pivote = 2 en fila 1, columna 1):
   *     X₁  X₂  S₁  LD
   * S₁  [2   1   1   10]  ← Fila pivote
   * S₂  [3   2   0   15]
   * Z   [-3 -2   0    0]
   *
   * Después del pivoteo:
   *     X₁  X₂  S₁  LD
   * X₁  [1  0.5 0.5  5]   ← Normalizada (dividida entre 2)
   * S₂  [0  0.5 -1.5 0]   ← Cero en X₁ (restamos 3 × fila pivote)
   * Z   [0 -0.5  1.5 15]  ← Cero en X₁ (sumamos 3 × fila pivote)
   *
   * @param {Array<Array<number>>} tablaSimplex - La tabla actual
   * @param {number} filaDelPivote - Índice de la fila pivote
   * @param {number} columnaDelPivote - Índice de la columna pivote
   * @returns {Array<Array<number>>} - Nueva tabla después del pivoteo
   */
  pivot(tablaSimplex, filaDelPivote, columnaDelPivote) {
    // Crear una copia de la tabla para no modificar la original
    const nuevaTabla = this.copyTableau(tablaSimplex)
    const elementoPivote = nuevaTabla[filaDelPivote][columnaDelPivote]

    // ===== PASO 1: NORMALIZAR LA FILA PIVOTE =====
    // Dividir cada elemento de la fila pivote entre el elemento pivote
    // Esto hace que el pivote se convierta en 1
    for (let indiceColumna = 0; indiceColumna < nuevaTabla[filaDelPivote].length; indiceColumna++) {
      nuevaTabla[filaDelPivote][indiceColumna] /= elementoPivote
    }

    // ===== PASO 2: HACER CEROS EN LA COLUMNA PIVOTE =====
    // Para cada fila (excepto la fila pivote)
    for (let indiceFila = 0; indiceFila < nuevaTabla.length; indiceFila++) {
      // Saltar la fila pivote (ya está normalizada)
      if (indiceFila !== filaDelPivote) {
        // Obtener el coeficiente actual en la columna pivote
        const factorDeEliminacion = nuevaTabla[indiceFila][columnaDelPivote]

        // Restar (factor × fila pivote normalizada) de esta fila
        // Esto hace que el coeficiente en la columna pivote se vuelva 0
        for (let indiceColumna = 0; indiceColumna < nuevaTabla[indiceFila].length; indiceColumna++) {
          nuevaTabla[indiceFila][indiceColumna] -= factorDeEliminacion * nuevaTabla[filaDelPivote][indiceColumna]
        }
      }
    }

    return nuevaTabla
  }

  /**
   * Extrae la solución final de la tabla Simplex óptima
   *
   * En una tabla Simplex, las variables básicas tienen valores > 0
   * y las no básicas valen 0
   *
   * Para identificar una variable básica:
   * - Su columna debe ser un vector unitario [0, 0, ..., 1, ..., 0]
   * - El valor de la variable está en el LD de la fila donde tiene el 1
   *
   * Ejemplo de tabla óptima:
   *     X₁  X₂  S₁  S₂  LD
   * X₁  [1   0  0.5  0   5]   ← X₁ es básica, vale 5
   * X₂  [0   1  -0.5 0   3]   ← X₂ es básica, vale 3
   * Z   [0   0   1.5 0   24]  ← Z vale 24
   *
   * Solución: X₁ = 5, X₂ = 3, S₁ = 0 (no básica), S₂ = 0 (no básica), Z = 24
   *
   * @param {Array<Array<number>>} tablaSimplex - Tabla final (óptima)
   * @param {object} formaEstandar - Información del problema en forma estándar
   * @returns {object} - Solución con variables y valor objetivo
   */
  extractSolution(tablaSimplex, formaEstandar) {
    const numeroDeVariablesOriginales = formaEstandar.numOriginalVariables
    const solucion = {
      variables: Array(numeroDeVariablesOriginales).fill(0),
      objectiveValue: 0,
      status: this.status
    }

    // Encontrar variables básicas (las que tienen valor > 0)
    const numeroDeFilasDeRestricciones = tablaSimplex.length - 1

    // Revisar cada variable original (X₁, X₂, ..., Xₙ)
    for (let indiceVariable = 0; indiceVariable < numeroDeVariablesOriginales; indiceVariable++) {
      let filaConElUno = -1
      let contadorDeUnos = 0

      // Verificar si esta columna es un vector unitario
      for (let indiceFila = 0; indiceFila < numeroDeFilasDeRestricciones; indiceFila++) {
        const valor = tablaSimplex[indiceFila][indiceVariable]

        if (Math.abs(valor - 1) < EPSILON) {
          // Encontramos un 1
          contadorDeUnos++
          filaConElUno = indiceFila
        } else if (Math.abs(valor) > EPSILON) {
          // Hay un valor diferente de 0 (que no es 1), no es vector unitario
          contadorDeUnos = 0
          break
        }
      }

      // Si la columna es un vector unitario (un solo 1 y el resto 0)
      // entonces esta variable es básica
      if (contadorDeUnos === 1 && filaConElUno !== -1) {
        // El valor de la variable está en el lado derecho de esa fila
        const indiceColumnaLD = tablaSimplex[filaConElUno].length - 1
        solucion.variables[indiceVariable] = tablaSimplex[filaConElUno][indiceColumnaLD]
      }
      // Si no es básica, ya tiene 0 por defecto
    }

    // Obtener valor de la función objetivo (esquina inferior derecha)
    const filaZ = tablaSimplex.length - 1
    const columnaLD = tablaSimplex[0].length - 1
    solucion.objectiveValue = tablaSimplex[filaZ][columnaLD]

    // Si el problema original era de minimización, revertir el signo
    // (recuerda que convertimos Min Z a Max -Z)
    if (formaEstandar.originalType === 'min') {
      solucion.objectiveValue = -solucion.objectiveValue
    }

    return solucion
  }

  /**
   * Encuentra qué variable es básica en una fila específica
   *
   * Una variable es básica en una fila si:
   * - Su columna tiene un 1 en esa fila
   * - Su columna tiene 0 en todas las demás filas (vector unitario)
   *
   * Esto se usa para identificar qué variable sale de la base durante el pivoteo
   *
   * @param {Array<Array<number>>} tablaSimplex - Tabla actual
   * @param {number} indiceDeFila - Fila donde buscar la variable básica
   * @param {object} formaEstandar - Información del problema
   * @returns {number} - Índice de la columna de la variable básica, o -1 si no hay
   */
  findBasicVariableInRow(tablaSimplex, indiceDeFila, formaEstandar) {
    const numeroDeColumnas = tablaSimplex[0].length - 1

    // Revisar cada columna para ver si es básica en esta fila
    for (let indiceColumna = 0; indiceColumna < numeroDeColumnas; indiceColumna++) {
      let esVectorUnitarioEnEstaFila = true
      let filaDelUno = -1

      // Verificar si esta columna es un vector unitario con el 1 en nuestra fila
      for (let otraFila = 0; otraFila < tablaSimplex.length - 1; otraFila++) {
        const valor = tablaSimplex[otraFila][indiceColumna]

        if (otraFila === indiceDeFila && Math.abs(valor - 1) < EPSILON) {
          // En nuestra fila debe haber un 1
          filaDelUno = otraFila
        } else if (Math.abs(valor) > EPSILON) {
          // En cualquier otra fila debe haber 0
          esVectorUnitarioEnEstaFila = false
          break
        }
      }

      // Si encontramos la variable básica de esta fila, devolverla
      if (esVectorUnitarioEnEstaFila && filaDelUno === indiceDeFila) {
        return indiceColumna
      }
    }

    // No se encontró variable básica en esta fila
    return -1
  }
  //Div general que aparese luego de hacer click en el boton 
  //Primer espacio
  explainInitialTableau(standardForm) {
    let explanation = '<div class="explanation-section">'
    explanation += '<h3>TABLA INICIAL DEL MÉTODO SIMPLEX</h3>'

    explanation += '<div class="explanation-block">'
    explanation += '<h4>Problema Original:</h4>'
    explanation += '<p class="formula">'
    explanation += `${standardForm.originalType === 'max' ? 'Maximizar' : 'Minimizar'} Z = ` 

    for (let i = 0; i < standardForm.numOriginalVariables; i++) {
      const coef = standardForm.originalType === 'min' ? -standardForm.objective[i] : standardForm.objective[i]
      if (i > 0 && coef >= 0) explanation += ' + '
      explanation += `${coef}X<sub>${i + 1}</sub>`
    }
    explanation += '</p>'
    explanation += '<p class="explanation-text">Esta es la función objetivo que queremos optimizar. Representa el valor que buscamos maximizar (o minimizar) según los recursos disponibles.</p>'
    explanation += '</div>'

    explanation += '<div class="explanation-block">'
    explanation += '<h4>Conversión a Forma Estándar:</h4>'
    explanation += '<p class="explanation-text">El método Simplex trabaja exclusivamente con sistemas de ecuaciones (igualdades). Por ello, debemos convertir las desigualdades agregando variables auxiliares:</p>'
    explanation += '<ul>'
    explanation += '<li><strong>Restricciones (≤):</strong> Se agrega una <em>variable de holgura</em> (slack) que representa el recurso no utilizado. Ejemplo: X₁ + X₂ ≤ 10 → X₁ + X₂ + S₁ = 10</li>'
    explanation += '<li><strong>Restricciones (≥):</strong> Se resta una <em>variable de exceso</em> (surplus) para el excedente y se agrega una <em>variable artificial</em> para iniciar el algoritmo.</li>'
    explanation += '<li><strong>Restricciones (=):</strong> Se agrega solo una <em>variable artificial</em> para obtener una solución básica factible inicial.</li>'
    explanation += '</ul>'
    explanation += `<p class="highlight"><strong>En este problema:</strong> Se agregaron ${standardForm.variableTypes.length} variable(s) adicional(es) para convertir el problema a forma estándar.</p>`
    explanation += '</div>'

    explanation += '<div class="explanation-block">'
    explanation += '<h4>Anatomía de la Tabla Simplex:</h4>'
    explanation += '<p class="explanation-text">La tabla Simplex es una representación matricial del sistema de ecuaciones que nos permite visualizar y resolver el problema sistemáticamente:</p>'
    explanation += '<ul>'
    explanation += '<li><strong>Variables Básicas (V.B):</strong> Variables que tienen valor diferente de cero en la solución actual. Inicialmente son las variables de holgura/artificiales.</li>'
    explanation += '<li><strong>Fila Z:</strong> Representa la función objetivo en forma canónica (Z - cX = 0). Los coeficientes negativos indican que aumentar esa variable mejorará Z.</li>'
    explanation += '<li><strong>Columna LD (Lado Derecho):</strong> Valores actuales de las variables básicas y el valor actual de Z.</li>'
    explanation += '<li><strong>Condición de Optimalidad:</strong> Cuando todos los coeficientes en la fila Z son ≥ 0, hemos alcanzado la solución óptima (no podemos mejorar más).</li>'
    explanation += '</ul>'
    explanation += '</div>'

    explanation += '<div class="explanation-block">'
    explanation += '<h4>Estrategia del Algoritmo:</h4>'
    explanation += '<p class="explanation-text">El método Simplex funciona como un explorador inteligente que:</p>'
    explanation += '<ol class="strategy-list">'
    explanation += '<li>Comienza en un vértice de la región factible (solución básica inicial)</li>'
    explanation += '<li>Examina los vértices adyacentes buscando mejoras en el valor de Z</li>'
    explanation += '<li>Se mueve al vértice vecino que más mejora la función objetivo</li>'
    explanation += '<li>Repite el proceso hasta que ningún movimiento mejore Z (solución óptima)</li>'
    explanation += '</ol>'
    explanation += '</div>'

    explanation += '<div class="info-box">'
    explanation += '<strong>¿Qué sigue?</strong> En cada iteración, identificaremos qué variable debe "entrar" a la base (aumentar desde 0) y cuál debe "salir" (reducirse a 0) para mejorar el valor de Z sin violar las restricciones.'
    explanation += '</div>'

    explanation += '</div>'
    return explanation
  }
  //Epacio 2
  //Tabla Inicial
  explainIteration(tableauBefore, tableauAfter, pivotRow, pivotCol, pivotElement, standardForm, iterationCount) {
    const zRowBefore = tableauBefore[tableauBefore.length - 1]
    const zRowAfter = tableauAfter[tableauAfter.length - 1]

    let explanation = '<div class="explanation-section">'
    explanation += `<h3>ITERACIÓN ${iterationCount} DEL MÉTODO SIMPLEX</h3>`

    // Paso 1: Selección de variable entrante
    //Metodo de codigo expancion
    explanation += '<div class="explanation-block step-block">'
    explanation += '<p class="explanation-text"><strong>¿Por qué este paso?</strong> Necesitamos identificar qué variable no básica (actualmente en 0) debería aumentar su valor para mejorar Z. Los coeficientes negativos en la fila Z indican oportunidades de mejora.</p>'
    explanation += '<p><strong>Regla:</strong> Seleccionamos la variable con el coeficiente más negativo en la fila Z (criterio de máximo descenso).</p>'

    explanation += '<div class="calculation-box">'
    explanation += '<p><strong>Análisis de coeficientes en la fila Z:</strong></p>'
    explanation += '<ul class="coefficient-list">'

    for (let j = 0; j < zRowBefore.length - 1; j++) {
      // Obtener nombre de la variable usando la función helper
      const nombreVariable = this.obtenerNombreVariable(j, standardForm)

      const esVariableSeleccionada = j === pivotCol
      const coeficiente = zRowBefore[j]
      const esCoeficienteNegativo = coeficiente < -EPSILON

      // Construir clase CSS
      const claseCss = esVariableSeleccionada ? 'selected-var' : ''

      explanation += `<li class="${claseCss}">`
      explanation += `${nombreVariable}: ${this.formatNumber(coeficiente)}`

      if (esCoeficienteNegativo) {
        const mejora = Math.abs(coeficiente)
        explanation += ` → Por cada unidad que aumente ${nombreVariable}, Z mejorará en ${this.formatNumber(mejora)}`
      }

      if (esVariableSeleccionada) {
        explanation += ' ← <strong>Mayor potencial de mejora (ENTRA a la base)</strong>'
      }

      explanation += '</li>'
    }

    explanation += '</ul></div>'

    // Determinar nombre de la variable que entra
    const nombreVariableEntrante = this.obtenerNombreVariable(pivotCol, standardForm)

    explanation += `<p class="highlight"><strong>✓ Decisión:</strong> ${nombreVariableEntrante} entra a la base (Columna ${pivotCol + 1})</p>`
    explanation += '<p class="note">Esta variable pasará de valer 0 a tener un valor positivo, mejorando así la función objetivo.</p>'
    explanation += '</div>'

    // Paso 2: Selección de variable saliente
    explanation += '<div class="explanation-block step-block">'
    explanation += '<h4>Selección de Variable Saliente (Fila Pivote)</h4>'
    explanation += '<p class="explanation-text"><strong>¿Por qué este paso?</strong> Cuando aumentamos la variable entrante, las variables básicas actuales cambiarán. Debemos identificar cuál llegará a cero primero para mantener todas las variables no negativas (factibilidad).</p>'
    explanation += '<p><strong>Regla del Test de la Razón Mínima:</strong> Para cada restricción, calculamos cuánto puede crecer la variable entrante antes de violar la no negatividad. La restricción más limitante determina qué variable sale.</p>'

    explanation += '<div class="calculation-box">'
    explanation += '<p><strong>Cálculo: Razón = Valor actual (LD) / Coeficiente en columna pivote</strong></p>'
    explanation += '<p class="mini-note">Solo consideramos coeficientes positivos (coef > 0). Si el coeficiente es ≤ 0, esa restricción no limita el crecimiento.</p>'
    explanation += '<ul class="ratio-list">'

    for (let i = 0; i < tableauBefore.length - 1; i++) {
      const coeficiente = tableauBefore[i][pivotCol]
      const ladoDerecho = tableauBefore[i][tableauBefore[i].length - 1]
      const esRestriccionSeleccionada = i === pivotRow

      // Calcular la razón (solo si el coeficiente es positivo)
      const esCoeficientePositivo = coeficiente > EPSILON
      const razon = esCoeficientePositivo ? (ladoDerecho / coeficiente) : Infinity

      // Construir clase CSS
      const claseCss = esRestriccionSeleccionada ? 'selected-var' : ''

      explanation += `<li class="${claseCss}">`
      explanation += `Restricción ${i + 1}: `

      if (esCoeficientePositivo) {
        // Mostrar cálculo de la razón
        explanation += `${this.formatNumber(ladoDerecho)} ÷ ${this.formatNumber(coeficiente)} = ${this.formatNumber(razon)}`
        explanation += ` → La variable básica puede disminuir hasta ${this.formatNumber(razon)} unidades`

        if (esRestriccionSeleccionada) {
          explanation += ' ← <strong>Restricción más limitante (SALE de la base)</strong>'
        }
      } else {
        // Coeficiente no positivo, no limita
        explanation += `Coef = ${this.formatNumber(coeficiente)} ≤ 0 → No limita (se ignora)`
      }

      explanation += '</li>'
    }

    explanation += '</ul></div>'
    explanation += `<p class="highlight"><strong>✓ Decisión:</strong> Variable básica de la Fila ${pivotRow + 1} sale de la base</p>`
    explanation += '<p class="note">Esta variable se reducirá a 0, liberando espacio para que la variable entrante tome su lugar en la base.</p>'
    explanation += '</div>'

    // Paso 3: Elemento pivote
    explanation += '<div class="explanation-block step-block">'
    explanation += '<h4>Elemento Pivote</h4>'
    explanation += `<p class="explanation-text"><strong>¿Qué es el pivote?</strong> Es el valor clave alrededor del cual girarán todas las operaciones algebraicas. Se encuentra en la intersección de la columna entrante y la fila saliente.</p>`
    explanation += '<div class="pivot-box">'
    explanation += `<p class="pivot-value">Pivote = ${this.formatNumber(pivotElement)}</p>`
    explanation += `<p class="pivot-location">Ubicación: Fila ${pivotRow + 1}, Columna ${pivotCol + 1}</p>`
    explanation += `<p class="pivot-meaning">Este valor nos indica la tasa de intercambio entre la variable que entra y la que sale.</p>`
    explanation += '</div>'
    explanation += '</div>'

    // Paso 4: Operaciones
    explanation += '<div class="explanation-block step-block">'
    explanation += '<h4>Operaciones de Pivoteo (Transformación de Gauss-Jordan)</h4>'
    explanation += '<p class="explanation-text"><strong>¿Qué buscamos?</strong> Transformar la tabla para que la variable entrante se convierta en básica. Esto se logra convirtiendo su columna en un vector unitario (un 1 en la fila pivote y 0 en todas las demás).</p>'
    explanation += '<p><strong>Procedimiento algebraico:</strong></p>'
    explanation += '<ol class="operations-list">'
    explanation += `<li><strong>Paso 4.1 - Normalización de la fila pivote:</strong><br>`
    explanation += `Dividir cada elemento de la fila ${pivotRow + 1} entre el pivote (${this.formatNumber(pivotElement)}):<br>`
    explanation += `<code>Nueva_Fila_${pivotRow + 1}[j] = Fila_${pivotRow + 1}[j] / ${this.formatNumber(pivotElement)}</code><br>`
    explanation += `<em>Resultado: El pivote se convierte en 1</em></li>`
    explanation += `<li><strong>Paso 4.2 - Eliminación en otras filas:</strong><br>`
    explanation += `Para cada fila i ≠ ${pivotRow + 1}, hacer que el coeficiente de la columna ${pivotCol + 1} sea 0:<br>`
    explanation += `<code>Nueva_Fila[i] = Fila_Vieja[i] - (Coef_Pivote[i] × Nueva_Fila_Pivote)</code><br>`
    explanation += `<em>Resultado: La columna pivote tendrá ceros excepto en la fila pivote</em></li>`
    explanation += '</ol>'
    explanation += '<p class="note"><strong>Interpretación:</strong> Estas operaciones mantienen la equivalencia matemática del sistema (las mismas soluciones), pero reorganizan las ecuaciones para expresar las variables básicas en función de las no básicas.</p>'
    explanation += '</div>'

    // Resultado después del pivote
    explanation += '<div class="explanation-block step-block">'
    explanation += '<h4>Análisis del Resultado</h4>'

    const currentZValue = tableauAfter[tableauAfter.length - 1][tableauAfter[0].length - 1]
    const previousZValue = tableauBefore[tableauBefore.length - 1][tableauBefore[0].length - 1]

    explanation += '<div class="result-comparison">'
    explanation += '<div class="result-item">'
    explanation += `<span class="result-label">Z antes:</span>`
    explanation += `<span class="result-value">${this.formatNumber(previousZValue)}</span>`
    explanation += '</div>'
    explanation += '<div class="result-arrow">→</div>'
    explanation += '<div class="result-item">'
    explanation += `<span class="result-label">Z después:</span>`
    explanation += `<span class="result-value-after">${this.formatNumber(currentZValue)}</span>`
    explanation += '</div>'
    explanation += '</div>'

    const improvement = currentZValue - previousZValue
    if (improvement > EPSILON) {
      const percentImprovement = Math.abs(previousZValue) > EPSILON ? ((improvement / Math.abs(previousZValue)) * 100).toFixed(2) : '∞'
      explanation += `<p class="highlight"><strong>Mejora obtenida:</strong> +${this.formatNumber(improvement)}`
      if (percentImprovement !== '∞') {
        explanation += ` (incremento del ${percentImprovement}%)`
      }
      explanation += '</p>'
      explanation += '<p class="explanation-text">¡Excelente! El valor de la función objetivo ha mejorado. Esto confirma que la variable entrante fue una buena elección.</p>'
    }

    // Verificar si es óptima
    const isOptimal = this.isOptimal(tableauAfter)
    if (isOptimal) {
      explanation += '<div class="info-box optimal-box">'
      explanation += '<h5>SOLUCIÓN ÓPTIMA ALCANZADA</h5>'
      explanation += '<p><strong>Test de optimalidad:</strong> Todos los coeficientes en la fila Z son ≥ 0</p>'
      explanation += '<p>- No existen variables no básicas que puedan mejorar Z al entrar a la base</p>'
      explanation += '<p>- Cualquier movimiento desde este punto empeoraría la solución</p>'
      explanation += '<p>- Esta es matemáticamente la mejor solución posible para el problema</p>'
      explanation += '</div>'
    } else {
      explanation += '<div class="warning-box">'
      explanation += '<p><strong>La tabla aún NO es óptima</strong></p>'
      explanation += '<p>Aunque mejoramos Z en esta iteración, todavía existen oportunidades de mejora.</p>'
      explanation += '</div>'

      // Mostrar qué coeficientes son negativos
      const coeficientesNegativos = []

      for (let j = 0; j < zRowAfter.length - 1; j++) {
        const coeficiente = zRowAfter[j]
        const esNegativo = coeficiente < -EPSILON

        if (esNegativo) {
          // Obtener nombre de la variable usando la función helper
          const nombreVariable = this.obtenerNombreVariable(j, standardForm)
          const valorFormateado = this.formatNumber(coeficiente)
          coeficientesNegativos.push(`${nombreVariable} (${valorFormateado})`)
        }
      }

      if (coeficientesNegativos.length > 0) {
        explanation += '<p><strong>Variables con potencial de mejora (coef. negativos en Z):</strong></p>'
        explanation += '<ul class="negative-coefs-list">'

        coeficientesNegativos.forEach(coeficienteInfo => {
          explanation += `<li>${coeficienteInfo}</li>`
        })

        explanation += '</ul>'
        explanation += '<p class="note">Se requiere otra iteración. El algoritmo continuará automáticamente.</p>'
      }
    }

    explanation += '</div>'

    explanation += '</div>'
    return explanation
  }

  /**
   * Obtiene el nombre HTML de una variable (X o S) según su índice
   *
   * @param {number} indiceColumna - Índice de la columna
   * @param {object} formaEstandar - Información del problema
   * @returns {string} - Nombre de la variable en formato HTML
   *
   * @example
   * obtenerNombreVariable(0, form) // "X<sub>1</sub>"
   * obtenerNombreVariable(5, form) // "S<sub>3</sub>" (si hay 3 vars originales)
   */
  obtenerNombreVariable(indiceColumna, formaEstandar) {
    const esVariableOriginal = indiceColumna < formaEstandar.numOriginalVariables

    if (esVariableOriginal) {
      // Variable de decisión original (X1, X2, ...)
      return `X<sub>${indiceColumna + 1}</sub>`
    } else {
      // Variable de holgura/exceso (S1, S2, ...)
      const numeroDeHolgura = indiceColumna - formaEstandar.numOriginalVariables + 1
      return `S<sub>${numeroDeHolgura}</sub>`
    }
  }

  /**
   * Crea una copia profunda de la tabla Simplex
   *
   * Es importante crear una copia para no modificar la tabla original
   * cuando hacemos operaciones de pivoteo o guardamos iteraciones
   *
   * @param {Array<Array<number>>} tablaSimplex - Tabla a copiar
   * @returns {Array<Array<number>>} - Copia independiente de la tabla
   */
  copyTableau(tablaSimplex) {
    // Crear un nuevo array con filas copiadas
    return tablaSimplex.map(fila => [...fila])
  }
}

// Exportar constantes para uso en otros módulos si es necesario
export { EPSILON, MAX_ITERATIONS }