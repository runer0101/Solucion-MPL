<script setup>
import { ref, onMounted, computed } from 'vue'
import { SimplexSolver } from '../utils/simplex.js'
import { GraphicMethodSolver } from '../utils/grafico.js'
import { formatNumber } from '../utils/formatters.js'
import SimplexTable from './SimplexTable.vue'

const props = defineProps({
  problemData: Object
})

const emit = defineEmits(['reset'])

const results = ref({
  simplex: null,
  grafico: null
})

const selectedMethod = ref(null)

onMounted(() => {
  solveProblem()
})

const solveProblem = () => {
  const method = props.problemData.method || 'simplex'
  selectedMethod.value = method

  if (method === 'todos') {
    // Resolver con todos los métodos aplicables
    solveWithAllMethods()
  } else if (method === 'simplex') {
    const solver = new SimplexSolver(props.problemData)
    results.value.simplex = solver.solve()
  } else if (method === 'grafico') {
    const solver = new GraphicMethodSolver(props.problemData)
    results.value.grafico = solver.solve()
  }
}

const solveWithAllMethods = () => {
  // Siempre resolver con Simplex
  const simplexSolver = new SimplexSolver(props.problemData)
  results.value.simplex = simplexSolver.solve()

  // Intentar método gráfico si hay 2 variables
  if (props.problemData.numVariables === 2) {
    const graficoSolver = new GraphicMethodSolver(props.problemData)
    results.value.grafico = graficoSolver.solve()
  }
}

// Computed para obtener el resultado actual para mantener compatibilidad con template existente
const result = computed(() => {
  if (!selectedMethod.value) {
    return results.value.simplex
  }

  if (selectedMethod.value === 'todos') {
    return results.value.simplex // Por defecto mostrar simplex en modo todos
  } else if (selectedMethod.value === 'simplex') {
    return results.value.simplex
  } else if (selectedMethod.value === 'grafico') {
    return results.value.grafico
  }

  return results.value.simplex
})

const exportToText = () => {
  if (!result.value) return

  let text = '=== SOLUCIÓN MÉTODO SIMPLEX ===\n\n'

  text += 'PROBLEMA:\n'
  text += `${props.problemData.type === 'max' ? 'Maximizar' : 'Minimizar'} Z = `
  text += props.problemData.objective.map((c, i) => `${c}X${i + 1}`).join(' + ')
  text += '\n\nRestricciones:\n'
  props.problemData.constraints.forEach((constraint, i) => {
    text += constraint.map((c, j) => `${c}X${j + 1}`).join(' + ')
    text += ` ${props.problemData.constraintTypes[i]} ${props.problemData.rhs[i]}\n`
  })

  text += '\n\nSOLUCIÓN:\n'
  if (result.value.solution) {
    result.value.solution.variables.forEach((value, i) => {
      text += `X${i + 1} = ${value.toFixed(2)}\n`
    })
    text += `\nValor Óptimo de Z = ${result.value.solution.objectiveValue.toFixed(2)}\n`
  }

  if (result.value.status) {
    text += `\nEstado: ${result.value.status}\n`
  }
  if (result.value.iterations) {
    text += `\nNúmero de iteraciones: ${result.value.iterations.length - 1}\n`
  }

  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'simplex-solution.txt'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="simplex-solution">
    <!-- Modo: Todos los métodos -->
    <div v-if="selectedMethod === 'todos'" class="all-methods-container">
      <h2 class="main-title">Comparación de Métodos de Resolución</h2>
      <p class="main-description">Se han aplicado todos los métodos disponibles para resolver el problema</p>

      <!-- Comparación de soluciones al inicio -->
      <div v-if="results.simplex || results.grafico" class="solution-comparison">
        <h2>Comparación de Soluciones</h2>
        <div class="comparison-grid">
          <div v-if="results.simplex && !results.simplex.error && results.simplex.solution" class="comparison-card">
            <h3>Método Simplex</h3>
            <p class="z-value">Z = {{ formatNumber(results.simplex.solution.objectiveValue) }}</p>
            <div class="var-values">
              <span v-for="(val, idx) in results.simplex.solution.variables" :key="idx">
                X<sub>{{idx+1}}</sub> = {{formatNumber(val)}}
              </span>
            </div>
          </div>
          <div v-if="results.grafico && !results.grafico.error && results.grafico.solution" class="comparison-card">
            <h3>Método Gráfico</h3>
            <p class="z-value">Z = {{ formatNumber(results.grafico.solution.objectiveValue) }}</p>
            <div class="var-values">
              <span v-for="(val, idx) in results.grafico.solution.variables" :key="idx">
                X<sub>{{idx+1}}</sub> = {{formatNumber(val)}}
              </span>
            </div>
          </div>
        </div>

        <!-- Recomendación del método más factible -->
        <div class="recommendation-section">
          <h3>Recomendación</h3>
          <div class="recommendation-content">
            <p v-if="problemData.numVariables === 2 && results.grafico && !results.grafico.error" class="recommendation-text">
              <strong>Método Recomendado: Gráfico</strong><br>
              Para problemas con 2 variables, el método gráfico es ideal porque permite visualizar la región factible
              y entender geométricamente la solución. Es más intuitivo y didáctico. Ambos métodos dan el mismo resultado,
              pero el gráfico ofrece mejor comprensión visual.
            </p>
            <p v-else class="recommendation-text">
              <strong>Método Recomendado: Simplex</strong><br>
              El método Simplex es el más eficiente y generalizado para problemas de programación lineal estándar.
              Funciona con cualquier número de variables y es el más utilizado en la industria.
            </p>
          </div>
        </div>
      </div>

      <!-- Botón para volver -->
      <div class="action-buttons">
        <button @click="emit('reset')" class="btn btn-primary">
          Resolver Nuevo Problema
        </button>
      </div>
    </div>

    <!-- Modo: Método Gráfico individual -->
    <div v-else-if="selectedMethod === 'grafico' && results.grafico">
      <div v-if="results.grafico.error" class="error-card">
        <h2>Error al Resolver el Problema</h2>
        <p>{{ results.grafico.message }}</p>
        <button @click="emit('reset')" class="btn btn-primary">Volver a Intentar</button>
      </div>
      <div v-else>
        <!-- Vista simple del método gráfico -->
        <div class="graphic-method-view">
          <div v-for="(step, index) in results.grafico.steps" :key="index" class="iteration-card">
            <h3>{{ step.title }}</h3>
            <div class="iteration-explanation">
              <div v-html="step.explanation"></div>
            </div>
            <div v-if="step.vertices" class="vertices-display">
              <h4>Vértices encontrados:</h4>
              <ul>
                <li v-for="(vertex, idx) in step.vertices" :key="idx">
                  ({{ formatNumber(vertex.x) }}, {{ formatNumber(vertex.y) }})
                </li>
              </ul>
            </div>
          </div>

          <!-- Solución final -->
          <div v-if="results.grafico.solution" class="solution-summary">
            <h2 class="section-title">Solución Óptima Final</h2>
            <div class="solution-grid">
              <div class="solution-variables">
                <h3>Variables de Decisión:</h3>
                <div class="variables-list">
                  <div v-for="(value, index) in results.grafico.solution.variables" :key="index" class="variable-item">
                    <span class="var-name">X<sub>{{ index + 1 }}</sub></span>
                    <span class="var-value">{{ formatNumber(value) }}</span>
                  </div>
                </div>
              </div>
              <div class="solution-objective">
                <h3>Valor de la Función Objetivo:</h3>
                <div class="objective-value">
                  <span class="obj-label">Z =</span>
                  <span class="obj-value">{{ formatNumber(results.grafico.solution.objectiveValue) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="action-buttons">
          <button @click="emit('reset')" class="btn btn-primary">
            Resolver Nuevo Problema
          </button>
        </div>
      </div>
    </div>

    <!-- Modo: Método Simplex o Penalización (usan misma visualización) -->
    <div v-else-if="result && !result.error">
      <!-- Vista de todas las iteraciones -->
      <div class="all-iterations-view">
        <div
          v-for="(iteration, index) in result.iterations"
          :key="'iter-' + index"
          class="iteration-card"
        >
          <h3>
            <span class="title-content">
              <span class="text-gradient">Tabla Inicial</span>
            </span>
            <span v-if="iteration.isOptimal" class="optimal-badge"> Óptima</span>
          </h3>
          <div class="iteration-explanation">
            <div v-html="iteration.explanation"></div>
          </div>

          <SimplexTable
            :tableau="iteration.tableau"
            :iteration="iteration.iteration"
            :pivotRow="iteration.pivotRow"
            :pivotCol="iteration.pivotCol"
            :isOptimal="iteration.isOptimal"
            :numOriginalVars="problemData.numVariables"
          />
        </div>
      </div>

      <!-- Resumen de la solución óptima al final -->
      <div v-if="result.solution" class="solution-summary">
        <h2 class="section-title">Solución Óptima Final</h2>

        <div class="solution-interpretation">
          <div class="interpretation-header">
            <h3>Interpretación de Resultados</h3>
          </div>
          <p class="interpretation-intro">La solución óptima encontrada {{ problemData.type === 'max' ? 'maximiza' : 'minimiza' }} la función objetivo mientras satisface todas las restricciones del problema.</p>
          <div class="interpretation-grid">
            <div class="interpretation-card">
              <h4>Variables de Decisión</h4>
              <p>Representan las cantidades óptimas de cada variable en la solución. Estos valores indican exactamente cuánto producir, asignar o utilizar de cada recurso.</p>
            </div>
            <div class="interpretation-card">
              <h4>Valor de Z</h4>
              <p>Es el valor óptimo de la función objetivo alcanzado. Representa {{ problemData.type === 'max' ? 'la ganancia máxima' : 'el costo mínimo' }} posible bajo las restricciones dadas.</p>
            </div>
            <div class="interpretation-card">
              <h4>Variables en Cero</h4>
              <p>Indican recursos o actividades que no son utilizados en la solución óptima. Su valor cero significa que no contribuyen a mejorar el objetivo.</p>
            </div>
          </div>
        </div>

        <div class="solution-grid">
          <div class="solution-variables">
            <h3>Variables de Decisión:</h3>
            <div class="variables-list">
              <div
                v-for="(value, index) in result.solution.variables"
                :key="'var-' + index"
                class="variable-item"
              >
                <span class="var-name">X<sub>{{ index + 1 }}</sub></span>
                <span class="var-value">{{ formatNumber(value) }}</span>
              </div>
            </div>
          </div>

          <div class="solution-objective">
            <h3>Valor de la Función Objetivo:</h3>
            <div class="objective-value">
              <span class="obj-label">Z =</span>
              <span class="obj-value">{{ formatNumber(result.solution.objectiveValue) }}</span>
            </div>
          </div>
        </div>
      </div>
    <div style="height: 10px;"></div>
      <!-- Acciones -->
      <div class="action-buttons">
        <button @click="exportToText" class="btn btn-secondary">
          Exportar a Texto
        </button>
        <button @click="emit('reset')" class="btn btn-primary">
          Resolver Nuevo Problema
        </button>
      </div>
    </div>

    <div v-else class="loading">
      <p>Resolviendo problema...</p>
    </div>
  </div>
</template>

<style scoped>
.simplex-solution {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.solution-summary {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.solution-interpretation {
  background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 2px solid #1e40af;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
}

.interpretation-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.interpretation-icon {
  font-size: 2rem;
}

.solution-interpretation h3 {
  color: #1e40af;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}

.interpretation-intro {
  color: #333;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #93c5fd;
}

.interpretation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
}

.interpretation-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid #e3f2fd;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.interpretation-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 0;
  background: linear-gradient(180deg, #1e3a8a, #3b82f6, #60a5fa);
  transition: height 0.4s ease;
}

.interpretation-card:hover::after {
  height: 100%;
}

.interpretation-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 8px 24px rgba(30, 64, 175, 0.2);
  border-color: #1e40af;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.interpretation-card h4 {
  color: #1e40af;
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.interpretation-card p {
  color: #555;
  line-height: 1.7;
  font-size: 0.95rem;
  margin: 0;
}

.section-title {
  font-size: 1.5rem;
  color: #1e40af;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.solution-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.solution-variables h3,
.solution-objective h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.variables-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.variable-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.var-name {
  font-weight: 600;
  color: #1e40af;
  font-size: 1.1rem;
}

.var-value {
  font-weight: 700;
  color: #333;
  font-size: 1.1rem;
}

.objective-value {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #1e40af;
  border-radius: 12px;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.obj-label {
  font-size: 1.3rem;
}

.obj-value {
  font-size: 2rem;
}

.iterations-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.iterations-info {
  text-align: center;
  color: #666;
  font-size: 1rem;
}

.iterations-info strong {
  color: #1e40af;
  font-size: 1.2rem;
}

.iteration-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.iteration-indicator {
  min-width: 200px;
  text-align: center;
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.iteration-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.iteration-explanation {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #93c5fd;
  line-height: 1.8;
  color: #333;
}

.all-iterations-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.iteration-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.iteration-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transition: left 0.5s;
}

.iteration-card:hover::before {
  left: 100%;
}

.iteration-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(30, 64, 175, 0.2);
  border-color: #3b82f6;
}

.iteration-card h3 {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.iteration-card h3 .title-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.iteration-card h3 .text-gradient {
  background: linear-gradient(135deg, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.optimal-badge {
  background: #4caf50;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
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
  font-size: 1rem;
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
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

.btn-secondary {
  background: #e5e7eb;
  color: #333;
}

.btn-secondary:hover {
  background: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn-nav {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
}

.btn-nav:hover:not(.disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(30, 64, 175, 0.3);
}

.btn-nav.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-card h2 {
  color: #f44336;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 768px) {
  .solution-grid {
    grid-template-columns: 1fr;
  }

  .iteration-controls {
    flex-direction: column;
  }

  .iteration-indicator {
    min-width: auto;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn {
    width: 100%;
  }

  .variables-list {
    grid-template-columns: 1fr;
  }

  .interpretation-grid {
    grid-template-columns: 1fr;
  }

  .card-icon {
    font-size: 2rem;
  }

  .interpretation-icon {
    font-size: 1.5rem;
  }

  .iteration-card h3 .emoji {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .solution-summary,
  .iteration-card {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .section-title .emoji {
    font-size: 1.5rem;
  }

  .optimal-icon,
  .interpretation-icon {
    font-size: 1.3rem;
  }

  .btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }

  .obj-value {
    font-size: 1.5rem;
  }
}

/* Estilos para explicaciones detalladas */
.iteration-explanation :deep(.explanation-section) {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.iteration-explanation :deep(h3) {
  font-size: 1.6rem;
  color: #1e40af;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #3b82f6;
  font-weight: 700;
}

.iteration-explanation :deep(h4) {
  font-size: 1.2rem;
  color: #1e40af;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.iteration-explanation :deep(.explanation-block) {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.iteration-explanation :deep(.step-block) {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #93c5fd;
  border-radius: 6px;
  padding: 1rem;
}

.iteration-explanation :deep(.formula) {
  background: #fff;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1.15rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  border: 2px dashed #3b82f6;
  margin: 0.5rem 0;
}

.iteration-explanation :deep(.calculation-box) {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  margin: 0.75rem 0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.iteration-explanation :deep(.coefficient-list),
.iteration-explanation :deep(.ratio-list) {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.iteration-explanation :deep(.coefficient-list li),
.iteration-explanation :deep(.ratio-list li) {
  padding: 0.5rem 0.75rem;
  margin: 0.25rem 0;
  background: #f8f9fa;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  transition: all 0.3s;
}

.iteration-explanation :deep(.selected-var) {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%) !important;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  font-weight: 600;
  padding: 0.5rem;
}

.iteration-explanation :deep(.highlight) {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 0.75rem;
  border-radius: 6px;
  border: 2px solid #2196f3;
  font-size: 1.05rem;
  margin: 0.75rem 0;
}

.iteration-explanation :deep(.note) {
  color: #666;
  font-style: italic;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
}

.iteration-explanation :deep(.pivot-box) {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  padding: 1.25rem;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #3b82f6;
  margin: 0.75rem 0;
}

.iteration-explanation :deep(.pivot-value) {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.iteration-explanation :deep(.pivot-location) {
  font-size: 1rem;
  color: #666;
}

.iteration-explanation :deep(.operations-list) {
  background: white;
  padding: 1rem 1rem 1rem 2.5rem;
  border-radius: 6px;
  margin: 0.75rem 0;
}

.iteration-explanation :deep(.operations-list li) {
  margin: 0.75rem 0;
  line-height: 1.6;
}

.iteration-explanation :deep(code) {
  background: #f5f5f5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #d32f2f;
  border: 1px solid #e0e0e0;
  display: inline-block;
  margin-top: 0.25rem;
}

.iteration-explanation :deep(.info-box) {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #4caf50;
  font-size: 1rem;
}

.iteration-explanation :deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.iteration-explanation :deep(ul li) {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.iteration-explanation :deep(p) {
  margin: 0.5rem 0;
}

.iteration-explanation :deep(.explanation-text) {
  font-size: 1.05rem;
  line-height: 1.9;
  color: #444;
  margin: 0.75rem 0;
}

.iteration-explanation :deep(.mini-note) {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin: 0.5rem 0;
}

.iteration-explanation :deep(.strategy-list) {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.iteration-explanation :deep(.strategy-list li) {
  margin: 0.75rem 0;
  line-height: 1.7;
  padding-left: 0.5rem;
}

.iteration-explanation :deep(.result-comparison) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  margin: 1rem 0;
}

.iteration-explanation :deep(.result-item) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.iteration-explanation :deep(.result-label) {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.iteration-explanation :deep(.result-value),
.iteration-explanation :deep(.result-value-after) {
  font-size: 1.8rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
}

.iteration-explanation :deep(.result-value) {
  color: #666;
}

.iteration-explanation :deep(.result-value-after) {
  color: #2196f3;
}

.iteration-explanation :deep(.result-arrow) {
  font-size: 2rem;
  color: #2196f3;
  font-weight: bold;
}

.iteration-explanation :deep(.optimal-box) {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid #4caf50;
}

.iteration-explanation :deep(.optimal-box h5) {
  color: #2e7d32;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  margin-top: 0;
}

.iteration-explanation :deep(.optimal-box p) {
  margin: 0.5rem 0;
  padding-left: 1rem;
}

.iteration-explanation :deep(.negative-coefs-list) {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  margin: 0.5rem 0;
}

.iteration-explanation :deep(.negative-coefs-list li) {
  font-family: 'Courier New', monospace;
  color: #d32f2f;
  font-weight: 600;
}

.iteration-explanation :deep(.pivot-meaning) {
  font-size: 0.95rem;
  color: #666;
  font-style: italic;
  margin-top: 0.5rem;
}

/* Estilos para comparación de métodos */
.all-methods-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.main-title {
  font-size: 2rem;
  color: #1e40af;
  text-align: center;
  margin: 0;
}

.main-description {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.solution-comparison {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.solution-comparison h2 {
  color: #1e40af;
  margin-bottom: 1.5rem;
  text-align: center;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.comparison-card {
  background: #f0f7ff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #3b82f6;
  text-align: center;
  transition: all 0.3s;
}

.comparison-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

/* Sección de recomendación */
.recommendation-section {
  margin-top: 2rem;
  background: #f0fdf4;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #4caf50;
}

.recommendation-section h3 {
  color: #2e7d32;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: center;
}

.recommendation-content {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
}

.recommendation-text {
  color: #333;
  line-height: 1.8;
  font-size: 1rem;
  margin: 0;
}

.recommendation-text strong {
  color: #2e7d32;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 0.5rem;
}

.comparison-card h3 {
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.comparison-card .z-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e40af;
  margin: 0.5rem 0;
}

.comparison-card .var-values {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
}

.comparison-card .var-values span {
  background: white;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #333;
  border: 1px solid #93c5fd;
}

.method-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.method-title {
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error-message {
  background: #fee;
  border: 2px solid #f44336;
  border-radius: 8px;
  padding: 1rem;
  color: #c62828;
  font-weight: 600;
}

.graphic-method-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vertices-display {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.vertices-display h4 {
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.vertices-display ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
}

.vertices-display li {
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  text-align: center;
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .iteration-explanation :deep(.result-comparison) {
    flex-direction: column;
    gap: 1rem;
  }

  .iteration-explanation :deep(.result-arrow) {
    transform: rotate(90deg);
  }

  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .main-title {
    font-size: 1.5rem;
  }
}
</style>