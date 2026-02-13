<script setup>
import { ref, watch } from 'vue'
import MethodExplanation from './MethodExplanation.vue'

const props = defineProps({
  numVariables: Number,
  numConstraints: Number,
  problemType: String,
  selectedMethod: {
    type: String,
    default: 'todos'
  }
})

const emit = defineEmits(['solve', 'update:numVariables', 'update:numConstraints', 'update:problemType'])

// Variables locales (copias de las props para edición)
const localNumVariables = ref(props.numVariables)
const localNumConstraints = ref(props.numConstraints)
const localProblemType = ref(props.problemType)

// Método de solución seleccionado (reactivo a cambios en la prop)
const selectedMethod = ref(props.selectedMethod)

// Control de pestañas: 'calculadora', 'teoria', 'pasoapaso'
const activeTab = ref('calculadora')

// Observar cambios en la prop selectedMethod para actualizar el valor local
watch(() => props.selectedMethod, (newMethod) => {
  selectedMethod.value = newMethod
})

// Matrices para almacenar los datos del problema
const objectiveCoefficients = ref([])        // Coeficientes de la función objetivo
const constraintCoefficients = ref([])       // Coeficientes de las restricciones (matriz)
const constraintRHS = ref([])                // Lados derechos de las restricciones
const constraintTypes = ref([])              // Tipos de restricciones (≤, ≥, =)

/**
 * Inicializa o reinicia las matrices de datos cuando cambia
 * el número de variables o restricciones
 */
const initializeMatrices = () => {
  // Array para función objetivo: [c₁, c₂, ..., cₙ]
  objectiveCoefficients.value = Array(localNumVariables.value).fill(0)

  // Matriz de coeficientes de restricciones: [[a₁₁, a₁₂], [a₂₁, a₂₂], ...]
  constraintCoefficients.value = Array(localNumConstraints.value).fill(null).map(() =>
    Array(localNumVariables.value).fill(0)
  )

  // Lados derechos: [b₁, b₂, ..., bₘ]
  constraintRHS.value = Array(localNumConstraints.value).fill(0)

  // Tipos de restricciones: ['≤', '≤', '≥', ...]
  constraintTypes.value = Array(localNumConstraints.value).fill('≤')
}

// Inicializar al cargar el componente
initializeMatrices()

// Reinicializar cuando cambian las dimensiones del problema
watch([localNumVariables, localNumConstraints], () => {
  initializeMatrices()
})

/**
 * Carga un ejemplo predefinido de problema de programación lineal
 *
 * Ejemplos disponibles:
 * 1. Problema simple (2 variables, 2 restricciones)
 * 2. Problema de producción (2 variables, 3 restricciones)
 * 3. Problema con 3 variables (3 variables, 2 restricciones)
 *
 * @param {number} numeroDeEjemplo - Número del ejemplo a cargar (1, 2, o 3)
 */
const loadExample = (numeroDeEjemplo = 1) => {
  if (numeroDeEjemplo === 1) {
    // Ejemplo 1: Problema simple de maximización
    // Max Z = 3X₁ + 5X₂
    // s.a: X₁ ≤ 4
    //      2X₂ ≤ 12
    localNumVariables.value = 2
    localNumConstraints.value = 2
    localProblemType.value = 'max'

    emit('update:numVariables', 2)
    emit('update:numConstraints', 2)
    emit('update:problemType', 'max')

    setTimeout(() => {
      objectiveCoefficients.value = [3, 5]
      constraintCoefficients.value = [
        [1, 0],
        [0, 2]
      ]
      constraintRHS.value = [4, 12]
      constraintTypes.value = ['≤', '≤']
    }, 0)
  } else if (numeroDeEjemplo === 2) {
    // Ejemplo 2: Problema de producción
    // Max Z = 40X₁ + 30X₂ (utilidad por producto)
    // s.a: X₁ + X₂ ≤ 12    (horas disponibles)
    //      2X₁ + X₂ ≤ 16   (material A)
    //      X₁ + 2X₂ ≤ 15   (material B)
    localNumVariables.value = 2
    localNumConstraints.value = 3
    localProblemType.value = 'max'

    emit('update:numVariables', 2)
    emit('update:numConstraints', 3)
    emit('update:problemType', 'max')

    setTimeout(() => {
      objectiveCoefficients.value = [40, 30]
      constraintCoefficients.value = [
        [1, 1],
        [2, 1],
        [1, 2]
      ]
      constraintRHS.value = [12, 16, 15]
      constraintTypes.value = ['≤', '≤', '≤']
    }, 0)
  } else if (numeroDeEjemplo === 3) {
    // Ejemplo 3: Problema con 3 variables
    // Max Z = 2X₁ + 3X₂ + 4X₃
    // s.a: 3X₁ + 2X₂ + X₃ ≤ 10
    //      2X₁ + 5X₂ + 3X₃ ≤ 15
    localNumVariables.value = 3
    localNumConstraints.value = 2
    localProblemType.value = 'max'

    emit('update:numVariables', 3)
    emit('update:numConstraints', 2)
    emit('update:problemType', 'max')

    setTimeout(() => {
      objectiveCoefficients.value = [2, 3, 4]
      constraintCoefficients.value = [
        [3, 2, 1],
        [2, 5, 3]
      ]
      constraintRHS.value = [10, 15]
      constraintTypes.value = ['≤', '≤']
    }, 0)
  } else if (numeroDeEjemplo === 4) {
    // Ejemplo 4: Problema con restricciones mixtas para probar Penalización
    // Max Z = 3X₁ + 2X₂ + 5X₃
    // s.a: X₁ + 2X₂ + X₃ ≤ 430
    //      3X₁ + 2X₃ ≥ 460
    //      X₁ + 4X₂ = 120
    localNumVariables.value = 3
    localNumConstraints.value = 3
    localProblemType.value = 'max'

    emit('update:numVariables', 3)
    emit('update:numConstraints', 3)
    emit('update:problemType', 'max')

    setTimeout(() => {
      objectiveCoefficients.value = [3, 2, 5]
      constraintCoefficients.value = [
        [1, 2, 1],
        [3, 0, 2],
        [1, 4, 0]
      ]
      constraintRHS.value = [430, 460, 120]
      constraintTypes.value = ['≤', '≥', '=']
    }, 0)
  }
}

// Controla la visibilidad del panel de ejemplos
const showExamples = ref(false)

/**
 * Valida que todos los campos del formulario estén completos
 *
 * Verifica:
 * - Todos los coeficientes de la función objetivo estén llenos
 * - Todos los coeficientes de restricciones estén llenos
 * - Todos los lados derechos estén llenos
 * - Valores numéricos válidos
 * - Restricciones con sentido lógico
 *
 * @returns {string|null} - Mensaje de error si hay validación fallida, null si todo está bien
 */
const validateInputs = () => {
  // Verificar coeficientes de la función objetivo
  for (let indiceVariable = 0; indiceVariable < localNumVariables.value; indiceVariable++) {
    const coef = objectiveCoefficients.value[indiceVariable]
    if (coef === '' || coef === null || coef === undefined) {
      return 'Por favor, complete todos los coeficientes de la función objetivo';
    }
    if (isNaN(coef) || !isFinite(coef)) {
      return 'Los coeficientes de la función objetivo deben ser números válidos';
    }
  }

  // Verificar coeficientes de restricciones
  for (let indiceRestriccion = 0; indiceRestriccion < localNumConstraints.value; indiceRestriccion++) {
    for (let indiceVariable = 0; indiceVariable < localNumVariables.value; indiceVariable++) {
      const coeficiente = constraintCoefficients.value[indiceRestriccion][indiceVariable]
      if (coeficiente === '' || coeficiente === null || coeficiente === undefined) {
        return `Por favor, complete todos los coeficientes de la restricción ${indiceRestriccion + 1}`;
      }
      if (isNaN(coeficiente) || !isFinite(coeficiente)) {
        return `Los coeficientes de la restricción ${indiceRestriccion + 1} deben ser números válidos`;
      }
    }

    // Verificar lado derecho de cada restricción
    const rhs = constraintRHS.value[indiceRestriccion]
    if (rhs === '' || rhs === null || rhs === undefined) {
      return `Por favor, complete el lado derecho de la restricción ${indiceRestriccion + 1}`;
    }
    if (isNaN(rhs) || !isFinite(rhs)) {
      return `El lado derecho de la restricción ${indiceRestriccion + 1} debe ser un número válido`;
    }
    if (rhs < 0) {
      return `El lado derecho de la restricción ${indiceRestriccion + 1} debe ser no negativo`;
    }
  }

  // Todo está completo
  return null;
}

/**
 * Maneja el evento de resolver el problema
 *
 * 1. Valida que todos los campos estén completos
 * 2. Convierte todos los valores a números
 * 3. Emite el evento 'solve' con los datos del problema
 */
const handleSolve = () => {
  // Validar entradas
  const mensajeDeError = validateInputs()
  if (mensajeDeError) {
    alert(mensajeDeError)
    return
  }

  // Preparar datos del problema
  const datosDelProblema = {
    type: localProblemType.value,
    numVariables: localNumVariables.value,
    numConstraints: localNumConstraints.value,
    objective: objectiveCoefficients.value.map(Number),
    constraints: constraintCoefficients.value.map(fila => fila.map(Number)),
    rhs: constraintRHS.value.map(Number),
    constraintTypes: constraintTypes.value,
    method: selectedMethod.value // Agregar método seleccionado
  }

  // Emitir evento para que el componente padre resuelva el problema
  emit('solve', datosDelProblema)
}

/**
 * Actualiza el número de variables y notifica al componente padre
 */
const updateNumVariables = (evento) => {
  const nuevoValor = parseInt(evento.target.value)
  if (nuevoValor >= 1 && nuevoValor <= 10) {
    localNumVariables.value = nuevoValor
    emit('update:numVariables', nuevoValor)
  }
}

/**
 * Actualiza el número de restricciones y notifica al componente padre
 */
const updateNumConstraints = (evento) => {
  const nuevoValor = parseInt(evento.target.value)
  if (nuevoValor >= 1 && nuevoValor <= 10) {
    localNumConstraints.value = nuevoValor
    emit('update:numConstraints', nuevoValor)
  }
}

/**
 * Actualiza el tipo de problema (maximizar/minimizar) y notifica al componente padre
 */
const updateProblemType = (evento) => {
  localProblemType.value = evento.target.value
  emit('update:problemType', evento.target.value)
}
</script>

<template>
  <div class="simplex-input">
    <!-- Sistema de Pestañas -->
    <div class="tabs-container">
      <button
        @click="activeTab = 'calculadora'"
        :class="{ active: activeTab === 'calculadora' }"
        class="tab-btn"
      >
        Calculadora
      </button>
      <button
        @click="activeTab = 'pasoapaso'"
        :class="{ active: activeTab === 'pasoapaso' }"
        class="tab-btn"
      >
        Paso a Paso
      </button>
      <button
        @click="activeTab = 'teoria'"
        :class="{ active: activeTab === 'teoria' }"
        class="tab-btn"
      >
        Teoría
      </button>
    </div>

    <!-- Contenido: Paso a Paso -->
    <div v-if="activeTab === 'pasoapaso'" class="tab-content">
      <div class="tutorial-section">
        <h2>Tutorial Paso a Paso</h2>
        <p class="tutorial-intro">Aprende a resolver problemas de programación lineal siguiendo estos pasos:</p>

        <div class="tutorial-steps">
          <div class="tutorial-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Identificar el problema</h3>
              <p>Define claramente qué quieres maximizar o minimizar (función objetivo) y cuáles son tus limitaciones (restricciones).</p>
              <div class="step-example">
                <strong>Ejemplo:</strong> Una fábrica produce 2 productos. Producto A genera $3 de ganancia y B genera $5.
                Queremos maximizar ganancias con recursos limitados.
              </div>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Definir variables</h3>
              <p>Asigna una variable a cada decisión. Usa X₁, X₂, X₃, etc.</p>
              <div class="step-example">
                <strong>Ejemplo:</strong> X₁ = cantidad de producto A, X₂ = cantidad de producto B
              </div>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Escribir función objetivo</h3>
              <p>Expresa matemáticamente lo que quieres optimizar.</p>
              <div class="step-example">
                <strong>Ejemplo:</strong> Maximizar Z = 3X₁ + 5X₂
              </div>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Establecer restricciones</h3>
              <p>Convierte cada limitación en una desigualdad o ecuación matemática.</p>
              <div class="step-example">
                <strong>Ejemplo:</strong><br>
                X₁ ≤ 4 (máximo 4 unidades de A)<br>
                2X₂ ≤ 12 (recurso limitado para B)
              </div>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">5</div>
            <div class="step-content">
              <h3>Usar la calculadora</h3>
              <p>Ingresa tus datos en la pestaña "Calculadora" y obtén la solución óptima automáticamente.</p>
            </div>
          </div>
        </div>

        <button @click="activeTab = 'calculadora'" class="btn-go-calculator">
          Ir a la Calculadora
        </button>
      </div>
    </div>

    <!-- Contenido: Teoría -->
    <div v-else-if="activeTab === 'teoria'" class="tab-content">
      <div class="method-explanation-section">
        <MethodExplanation :selectedMethod="selectedMethod" />
      </div>
    </div>

    <!-- Contenido: Calculadora -->
    <div v-else class="tab-content">
    <div class="config-card">
      <h2 class="section-title"><span class="text-gradient">Configuración del Problema</span></h2>

      <div class="config-grid">
        <div class="form-group">
          <label for="num-vars">Número de Variables:</label>
          <input
            id="num-vars"
            type="number"
            :value="localNumVariables"
            @input="updateNumVariables"
            min="1"
            max="10"
            class="form-input"
          >
          <small>Máximo 10 variables</small>
        </div>

        <div class="form-group">
          <label for="num-constraints">Número de Restricciones:</label>
          <input
            id="num-constraints"
            type="number"
            :value="localNumConstraints"
            @input="updateNumConstraints"
            min="1"
            max="10"
            class="form-input"
          >
          <small>Máximo 10 restricciones</small>
        </div>

      </div>
    </div>

    <div class="objective-card">
      <div class="card-header">
        <h2 class="section-title"><span class="text-gradient">Función Objetivo</span></h2>
      </div>
      <p class="section-description">Define la expresión matemática que representa tu objetivo a optimizar</p>
      <p class="info-text">La función objetivo es lo que queremos maximizar o minimizar (ej: ganancias, costos, tiempo)</p>

      <div class="form-group">
        <label for="problem-type">Tipo de Problema:</label>
        <select
          id="problem-type"
          :value="localProblemType"
          @change="updateProblemType"
          class="form-select"
        >
          <option value="max">Maximizar</option>
          <option value="min">Minimizar</option>
        </select>
      </div>

      <div class="objective-function">
        <span class="function-label">{{ localProblemType === 'max' ? 'Maximizar' : 'Minimizar' }} Z =</span>
        <div class="coefficients-row">
          <template v-for="(coef, index) in objectiveCoefficients" :key="'obj-' + index">
            <input
              v-model.number="objectiveCoefficients[index]"
              type="number"
              step="any"
              class="coef-input"
              :placeholder="'c' + (index + 1)"
              :title="'Coeficiente de X' + (index + 1)"
              :aria-label="'Coeficiente de la variable X' + (index + 1) + ' en la función objetivo'"
            >
            <span class="variable-label" aria-hidden="true">X<sub>{{ index + 1 }}</sub></span>
            <span v-if="index < objectiveCoefficients.length - 1" class="operator" aria-hidden="true">+</span>
          </template>
        </div>
      </div>

      <div class="examples-section">
        <button @click="showExamples = !showExamples" class="btn btn-secondary">
          {{ showExamples ? 'Ocultar Ejemplos' : 'Ver Ejemplos' }}
        </button>

        <div v-if="showExamples" class="examples-grid">
          <div class="example-card" @click="loadExample(1)">
            <h4>Ejemplo 1: Básico</h4>
            <p>Max Z = 3X₁ + 5X₂</p>
            <small>2 variables, 2 restricciones</small>
          </div>
          <div class="example-card" @click="loadExample(2)">
            <h4>Ejemplo 2: Producción</h4>
            <p>Max Z = 40X₁ + 30X₂</p>
            <small>2 variables, 3 restricciones</small>
          </div>
          <div class="example-card" @click="loadExample(3)">
            <h4>Ejemplo 3: Tres Variables</h4>
            <p>Max Z = 2X₁ + 3X₂ + 4X₃</p>
            <small>3 variables, 2 restricciones</small>
          </div>
          <div class="example-card" @click="loadExample(4)">
            <h4>Ejemplo 4: Mixto</h4>
            <p>Max Z = 3X₁ + 2X₂ + 5X₃</p>
            <small>3 variables, 3 restricciones (≤, ≥, =)</small>
          </div>
        </div>
      </div>
    </div>

    <div class="constraints-card">
      <div class="card-header">
        <h2 class="section-title"><span class="text-gradient">Restricciones</span></h2>
      </div>
      <p class="section-description">Define las limitaciones y condiciones que deben cumplirse</p>
      <p class="info-text">Las restricciones representan las limitaciones del problema (recursos, capacidades, requisitos)</p>
      <p class="helper-text">Sujeto a:</p>

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
                :aria-label="'Coeficiente de X' + (j + 1) + ' en la restricción ' + (i + 1)"
              >
              <span class="variable-label" aria-hidden="true">X<sub>{{ j + 1 }}</sub></span>
              <span v-if="j < constraint.length - 1" class="operator" aria-hidden="true">+</span>
            </template>

            <select
              v-model="constraintTypes[i]"
              class="constraint-type-select"
              :aria-label="'Tipo de desigualdad para la restricción ' + (i + 1)"
            >
              <option value="≤">≤ (Menor o igual)</option>
              <option value="≥">≥ (Mayor o igual)</option>
              <option value="=">= (Igual)</option>
            </select>

            <input
              v-model.number="constraintRHS[i]"
              type="number"
              step="any"
              class="coef-input rhs"
              :placeholder="'b' + (i + 1)"
              :aria-label="'Lado derecho de la restricción ' + (i + 1)"
            >
          </div>
        </div>
      </div>

      <div class="non-negativity">
        <p><strong>Restricciones de no negatividad:</strong></p>
        <p>
          <span v-for="(_, index) in objectiveCoefficients" :key="'nn-' + index">
            X<sub>{{ index + 1 }}</sub> ≥ 0
            <span v-if="index < objectiveCoefficients.length - 1">, </span>
          </span>
        </p>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="handleSolve" class="btn btn-secundary btn-solve-large">
        Resolver Problema
      </button>
    </div>
    </div>
    <!-- Fin tab-content calculadora -->
  </div>
</template>

<style scoped>
.simplex-input {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Sistema de Pestañas */
.tabs-container {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
}

.tab-btn {
  padding: 1rem 2rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.tab-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tutorial Section */
.tutorial-section {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tutorial-section h2 {
  color: #1e40af;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.tutorial-intro {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.tutorial-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.tutorial-step {
  display: flex;
  gap: 1.5rem;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  transition: all 0.3s;
}

.tutorial-step:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateX(5px);
}

.step-number {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  color: #1e40af;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #475569;
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.step-example {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #dbeafe;
  margin-top: 0.75rem;
}

.step-example strong {
  color: #1e40af;
}

.btn-go-calculator {
  width: 100%;
  padding: 1.25rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-go-calculator:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.info-panel {
  background: #3b82f6;
  color: rgb(255, 255, 255);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 12px rgba(30, 64, 175, 0.3);
}

.info-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.info-description {
  background: rgba(255, 255, 255, 0.15);
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info-description p {
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 0;
  opacity: 0.98;
}

.info-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.feature {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.25rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s;
}

.feature:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  line-height: 1;
}

.feature strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.feature p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.config-card,
.objective-card,
.constraints-card,
.method-selector-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  border: 2px solid transparent;
}

.config-card:hover,
.objective-card:hover,
.constraints-card:hover,
.method-selector-card:hover {
  box-shadow: 0 8px 16px rgba(30, 64, 175, 0.2);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title .emoji {
  font-size: 1.5rem;
}

.section-title .text-gradient {
  color: #1e3a8a;
}

.help-tooltip {
  font-size: 1.2rem;
  cursor: help;
  opacity: 0.8;
  transition: all 0.3s ease;
  padding: 0.35rem 0.6rem;
  border-radius: 50%;
  background: #e3f2fd;
  border: 2px solid #90caf9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.help-tooltip:hover {
  opacity: 1;
  background: #3b82f6;
  color: white;
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
  border-color: #1e3a8a;
}

.section-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-style: italic;
  padding: 0.75rem 1rem;
  background: #f0f7ff;
  border-radius: 6px;
  border: 2px solid #93c5fd;
}

.info-text {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: #f0f7ff;
  border-radius: 6px;
  border: 2px solid #93c5fd;
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

.objective-card .form-group {
  margin-bottom: 1.5rem;
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
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 4px 12px rgba(30, 64, 175, 0.1);
  transform: translateY(-2px);
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
}

.objective-function {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
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
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(30, 64, 175, 0.15);
  transform: scale(1.08);
  background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
}

.coef-input:hover {
  border-color: #60a5fa;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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
  border-color: #667eea;
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
/* Boton de "Resolver con Método Simplex "*/
.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.6);
}

.btn-primary:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

/* Boton de "Ver ejemplos y Ocultar Ejemplos" */
.btn-secondary {
  background: #60a5fa;
  color: #ffffff;
  margin-top: 1rem;
  border: 2px solid #ffffff;
}

.btn-secondary:hover {
  background: #3b82f6;
  border-color: #2563eb;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Boton de "Ver Guia del Método */
.btn-info {
  background: #2196f3;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-info:hover {
  background: #1976d2;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
}

.examples-section {
  margin-top: 1.5rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.example-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s;
}

.example-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.example-card h4 {
  color: #1e40af;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.example-card p {
  color: #333;
  font-weight: 600;
  margin: 0.5rem 0;
  font-family: 'Courier New', monospace;
}

.example-card small {
  color: #666;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .tabs-container {
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .tab-btn {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    text-align: center;
  }

  .config-card,
  .objective-card,
  .constraints-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .section-title .emoji {
    font-size: 1.2rem;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }

  .objective-function {
    flex-direction: column;
    align-items: flex-start;
  }

  .constraint-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn {
    width: 100%;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .info-features {
    grid-template-columns: 1fr;
  }

  .feature-icon {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .tabs-container {
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.6rem;
  }

  .tab-btn {
    width: 100%;
    padding: 0.65rem 0.75rem;
    font-size: 0.88rem;
  }

  .config-card,
  .objective-card,
  .constraints-card {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .section-title .emoji {
    font-size: 1.1rem;
  }

  .info-panel {
    padding: 1.5rem;
  }

  .info-title .emoji {
    font-size: 1.5rem;
  }

  .btn {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }

  .methods-grid {
    grid-template-columns: 1fr;
  }
}

/* Estilos para el selector de métodos */
.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.method-option {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 3px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.method-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s;
}

.method-option:hover::before {
  left: 100%;
}

.method-option:hover {
  border-color: #3b82f6;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.method-option.active {
  background: #3b82f6;
  border-color: #1e40af;
  color: white;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
}

.method-option.active .method-badge {
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border-color: white;
}

.method-option.active h3,
.method-option.active p {
  color: white;
}

.method-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.method-option h3 {
  color: #1e40af;
  font-size: 1.15rem;
  margin: 0.5rem 0;
  font-weight: 700;
}

.method-option p {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem 0;
  line-height: 1.5;
}

.method-badge {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  background: #e3f2fd;
  color: #1e40af;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid #90caf9;
  margin-top: 0.5rem;
}

.method-option.method-all {
  border-color: #3b82f6;
}

.method-option.method-all:hover {
  border-color: #2563eb;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.method-option.method-all.active {
  background: #3b82f6;
  border-color: #1e40af;
}

.warning-message {
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  background: #dbeafe;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  color: #1e40af;
  font-weight: 600;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

/* Sección de explicación del método */
.method-explanation-section {
  margin: 2rem 0;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e3f2fd;
}

/* Botón de resolver más grande y destacado */
.btn-solve-large {
  width: 100%;
  padding: 1.25rem 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-solve-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-solve-large:active {
  transform: translateY(0);
}
</style>