<script setup>
import { ref } from 'vue'
import SimplexInput from './components/SimplexInput.vue'
import SimplexSolution from './components/SimplexSolution.vue'
import TransporteInput from './components/TransporteInput.vue'
import CompararTodos from './components/CompararTodos.vue'

const numVariables = ref(2)
const numConstraints = ref(2)
const problemType = ref('max')
const showWelcome = ref(true)
const showSolution = ref(false)
const problemData = ref(null)
const selectedMethod = ref('simplex')
const currentView = ref('welcome') // 'welcome', 'simplex', 'grafico', 'penalizacion', 'todos', 'solution'

const startSolving = (method = 'todos') => {
  selectedMethod.value = method
  currentView.value = method
  showWelcome.value = false
  showSolution.value = false
  problemData.value = null
}

const goToMethod = (method) => {
  selectedMethod.value = method
  currentView.value = method
  showSolution.value = false
  problemData.value = null
}

const handleSolve = (data) => {
  problemData.value = data
  showSolution.value = true
  currentView.value = 'solution'
}

const handleNewProblem = () => {
  showSolution.value = false
  problemData.value = null
  currentView.value = selectedMethod.value
}

const backToWelcome = () => {
  showWelcome.value = true
  showSolution.value = false
  problemData.value = null
  currentView.value = 'welcome'
}
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <img src="/images/upds_logo-1-1-1.png" alt="UPDS Logo" class="header-logo">
        <div class="header-text">
          <h1 class="title">Solución de Modelos de Programación Lineal</h1>
          <p class="subtitle">Método Gráfico, Simplex y Transporte - Resolución paso a paso</p>
        </div>
      </div>
    </header>
 <!-- Pantalla de Bienvenida -->
    <main class="main-content">
      <div v-if="showWelcome" class="welcome-section">
          <div class="welcome-hero">
            <h2 class="hero-title">Solucionador de Programación Lineal</h2>
            <p class="hero-description">
              Resuelve problemas de optimización con explicaciones detalladas paso a paso
            </p>
          </div>
    
        <!-- Métodos disponibles con botones directos -->
     
        <div class="methods-showcase-card">
          <h3 class="showcase-title">Selecciona un Método de Resolución</h3>
          <p class="showcase-subtitle">Haz clic en el método que deseas utilizar</p>
        </div>

        <div class="methods-grid-direct">
          <!-- Método Simplex -->
          <div class="method-card-direct">
            <div class="method-header">
              <h4>Método Simplex</h4>
              <span class="badge badge-blue">Más usado</span>
            </div>
            <div class="method-info">
              <p class="method-desc">Problemas estándar de optimización</p>
              <ul class="method-specs">
                <li><strong>Variables:</strong> 2 o más</li>
                <li><strong>Restricciones:</strong> Tipo ≤</li>
                <li><strong>Nivel:</strong> <span class="difficulty medium">Medio</span></li>
              </ul>
            </div>
            <button @click="startSolving('simplex')" class="btn-method btn-simplex">
              Resolver con Simplex
            </button>
          </div>

          <!-- Método Gráfico -->
          <div class="method-card-direct">
            <div class="method-header">
              <h4>Método Gráfico</h4>
              <span class="badge badge-pink">Visual</span>
            </div>
            <div class="method-info">
              <p class="method-desc">Visualización geométrica de la solución</p>
              <ul class="method-specs">
                <li><strong>Variables:</strong> Exactamente 2</li>
                <li><strong>Restricciones:</strong> Cualquier tipo</li>
                <li><strong>Nivel:</strong> <span class="difficulty easy">Fácil</span></li>
              </ul>
            </div>
            <button @click="startSolving('grafico')" class="btn-method btn-graphic">
              Resolver con Gráfico
            </button>
          </div>

          <!-- Métodos de Transporte -->
          <div class="method-card-direct">
            <div class="method-header">
              <h4>Métodos de Transporte</h4>
              <span class="badge badge-red">Especializado</span>
            </div>
            <div class="method-info">
              <p class="method-desc">Soluciones iniciales para problemas de transporte</p>
              <ul class="method-specs">
                <li><strong>Métodos:</strong> 3 algoritmos</li>
                <li><strong>Tipo:</strong> Esquina NW, Costo Mín, Vogel</li>
                <li><strong>Nivel:</strong> <span class="difficulty hard">Medio-Alto</span></li>
              </ul>
            </div>
            <button @click="startSolving('penalizacion')" class="btn-method btn-penalty">
              Resolver Transporte
            </button>
          </div>
        </div>

        <!-- Botón para comparar todos -->
        <div class="compare-all-section">
          <div class="compare-card">
            <div class="compare-content">
              <h4>¿No estás seguro cuál método usar?</h4>
              <p>Compara los resultados de todos los métodos aplicables para tu problema</p>
            </div>
            <button @click="startSolving('todos')" class="btn-compare-all">
              Comparar Todos los Métodos
            </button>
          </div>
        </div>

        <!-- Sección de Teoría General -->
        <div class="general-theory-section">
          <h2 class="theory-title">Fundamentos de Programación Lineal</h2>
          <p class="theory-intro">
            Conceptos generales sobre la solución de Modelos de Programación Lineal
          </p>

          <div class="theory-content">
            <div class="theory-card">
              <h3>¿Qué es la Programación Lineal?</h3>
              <p>
                La Programación Lineal es una técnica matemática de optimización que permite encontrar
                la mejor solución posible (máxima o mínima) para un problema con recursos limitados.
                Se caracteriza por tener una función objetivo lineal y restricciones lineales.
              </p>
            </div>

            <div class="theory-card">
              <h3>Componentes de un Modelo</h3>
              <ul>
                <li><strong>Variables de decisión:</strong> Lo que queremos determinar (X₁, X₂, ...)</li>
                <li><strong>Función objetivo:</strong> Lo que queremos maximizar o minimizar</li>
                <li><strong>Restricciones:</strong> Limitaciones del problema (desigualdades o ecuaciones)</li>
                <li><strong>Región factible:</strong> Conjunto de soluciones que cumplen todas las restricciones</li>
              </ul>
            </div>

            <div class="theory-card">
              <h3>Métodos de Solución</h3>
              <p>
                Existen diferentes métodos para resolver problemas de programación lineal, cada uno
                con sus propias ventajas según el tipo de problema:
              </p>
              <ul>
                <li><strong>Método Gráfico:</strong> Ideal para problemas con 2 variables, permite visualizar la solución</li>
                <li><strong>Método Simplex:</strong> Algoritmo algebraico para problemas con cualquier número de variables</li>
                <li><strong>Métodos de Transporte:</strong> Especializados en problemas de distribución y asignación</li>
              </ul>
            </div>

            <div class="theory-card">
              <h3>Aplicaciones Prácticas</h3>
              <p>
                La programación lineal se utiliza en diversas áreas como manufactura, logística,
                finanzas, agricultura y planificación de recursos para tomar decisiones óptimas
                que maximicen beneficios o minimicen costos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegación entre métodos -->
      <div v-else-if="!showSolution" class="method-view">
        <!-- Barra de navegación superior -->
        <div class="method-navigation">
          <button @click="backToWelcome" class="nav-back-btn">← Inicio</button>

          <div class="method-tabs">
            <button
              @click="goToMethod('simplex')"
              :class="{ active: currentView === 'simplex' }"
              class="method-tab"
            >
              Método Simplex
            </button>
            <button
              @click="goToMethod('grafico')"
              :class="{ active: currentView === 'grafico' }"
              class="method-tab"
            >
              Método Gráfico
            </button>
            <button
              @click="goToMethod('penalizacion')"
              :class="{ active: currentView === 'penalizacion' }"
              class="method-tab"
            >
              Métodos de Transporte
            </button>
            <button
              @click="goToMethod('todos')"
              :class="{ active: currentView === 'todos' }"
              class="method-tab method-tab-all"
            >
              Comparar Todos
            </button>
          </div>
        </div>

        <!-- Contenido del método actual -->
        <div class="method-content">
          <!-- Componente de Transporte -->
          <TransporteInput v-if="currentView === 'penalizacion'" />

          <!-- Componente de Comparar Todos -->
          <CompararTodos v-else-if="currentView === 'todos'" />

          <!-- Componente de Simplex/Gráfico -->
          <SimplexInput
            v-else
            :key="currentView"
            :numVariables="numVariables"
            :numConstraints="numConstraints"
            :problemType="problemType"
            :selectedMethod="selectedMethod"
            @solve="handleSolve"
            @update:numVariables="numVariables = $event"
            @update:numConstraints="numConstraints = $event"
            @update:problemType="problemType = $event"
          />
        </div>
      </div>

      <!-- Sección de Solución -->
      <div v-else class="solution-section">
        <SimplexSolution
          :problemData="problemData"
          @reset="handleNewProblem"
        />
      </div>
    </main>

    <footer class="footer">
      <p>Métodos de MPL • Investigación Operativa I</p>
      <p>Desarrollado por runer0101</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-base);
  background: var(--color-primary);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: rgba(247, 251, 255, 0.95);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl) var(--spacing-md);
  position: relative;
  overflow: hidden;
}
.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
}

.header-logo {
  height: clamp(100px, 8vw, 100px);
  width: auto;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.header-text {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.title .emoji {
  font-size: 2.5rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.title {
  color: var(--color-primary-dark);
}

.subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    gap: 1rem;
  }

  .header-logo {
    height: 60px;
  }

  .title {
    font-size: 1.6rem;
  }

  .title .emoji {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .main-content {
    padding: 1rem 0.5rem;
  }

  .header {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    gap: 0.75rem;
  }

  .header-logo {
    height: 50px;
  }

  .header-text {
    position: static;
    margin-left: 0.5rem;
  }

  .title {
    font-size: 1.4rem;
    gap: 0.5rem;
  }

  .title .emoji {
    font-size: 1.6rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }
}

/* Estilos de la Pantalla de Bienvenida */
.welcome-section {
  animation: fadeIn 0.6s ease-in;
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

.welcome-hero {
  text-align: center;
  padding: 2.5rem 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #1e40af;
}

.hero-description {
  font-size: 1.15rem;
  color: #64748b;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;
}

.methods-showcase-card {
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: #dfe9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
}

.showcase-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  text-align: center;
  margin-bottom: 0.25rem;
}

.showcase-subtitle {
  font-size: 0.95rem;
  color: #020202;
  text-align: center;
  margin-bottom: 0;
}

/* Grid de tarjetas de métodos */
.methods-grid-direct {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.method-card-direct {
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e2e8f0;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.method-card-direct:hover {
  border-color: #3b82f6;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.15);
}

.method-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.method-header h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.method-info {
  flex: 1;
  margin-bottom: 1.5rem;
}

.method-desc {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.method-specs {
  list-style: none;
  padding: 0;
  margin: 0;
}

.method-specs li {
  padding: 0.4rem 0;
  font-size: 0.9rem;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
}

.method-specs li:last-child {
  border-bottom: none;
}

.method-specs strong {
  color: #1e293b;
  font-weight: 600;
}

/* Botones de método */
.btn-method {
  width: 100%;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.btn-simplex {
  background: #0284c7;
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-simplex:hover {
  background: #0269a1;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.btn-graphic {
  background: #0284c7;
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-graphic:hover {
  background: #0269a1;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}


.btn-penalty {
  background: #0284c7;
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.btn-penalty:hover {
  background: #0269a1;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

/* Sección de comparar todos */
.compare-all-section {
  margin-top: 2.5rem;
}

.compare-card {
  background: #eff6ff;
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  transition: all 0.3s ease;
}

.compare-card:hover {
  border-color: #2563eb;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.25);
  transform: translateY(-2px);
}

.compare-content h4 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.compare-content p {
  color: #1e3a8a;
  font-size: 1rem;
  margin: 0;
}

.btn-compare-all {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-compare-all:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  background: #2563eb;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-blue {
  background: #60a5fa;
  color: white;
}

.badge-pink {
  background: #60a5fa;
  color: white;
}

.badge-red {
  background: #60a5fa;
  color: white;
}

.badge-green {
  background: #60a5fa;
  color: white;
}

.difficulty {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.difficulty.easy {
  background: #dbeafe;
  color: #1e40af;
}

.difficulty.medium {
  background: #93c5fd;
  color: #1e3a8a;
}

.difficulty.hard {
  background: #3b82f6;
  color: white;
}

.difficulty.all {
  background: #1e40af;
  color: white;
}


.cta-section {
  text-align: center;
  padding: 2rem 1rem;
}

.cta-button {
  display: inline-block;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1.1rem 3rem;
  font-size: 1.15rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: #2563eb;
}

.cta-button:active {
  transform: translateY(0);
}

.cta-hint {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.breadcrumb {
  margin-bottom: 2rem;
}

.breadcrumb-link {
  background: white;
  border: 2px solid #e2e8f0;
  color: #3b82f6;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  transform: translateX(-5px);
}

/* Navegación de métodos con pestañas */
.method-view {
  animation: fadeIn 0.6s ease-in;
}

.method-navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
}

.nav-back-btn {
  background: white;
  border: 2px solid #e2e8f0;
  color: #3b82f6;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-back-btn:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  transform: translateX(-5px);
}

.method-tabs {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  flex-wrap: wrap;
}

.method-tab {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;
}

.method-tab:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.method-tab.active {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.method-tab-all.active {
  background: #1e40af;
  border-color: #1e40af;
}

.method-content {
  animation: fadeIn 0.4s ease-in;
}

/* Responsive para pantalla de bienvenida */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .showcase-title {
    font-size: 1.6rem;
  }

  .methods-grid-direct {
    grid-template-columns: 1fr;
  }

  .compare-card {
    flex-direction: column;
    text-align: center;
  }

  .btn-compare-all {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .welcome-hero {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-description {
    font-size: 0.95rem;
  }

  .showcase-title {
    font-size: 1.4rem;
  }

  .showcase-subtitle {
    font-size: 0.95rem;
  }

  .method-card-direct {
    padding: 1.5rem;
  }

  .method-header h4 {
    font-size: 1.1rem;
  }

  .method-specs li {
    font-size: 0.85rem;
  }

  .compare-content h4 {
    font-size: 1.1rem;
  }

  .compare-content p {
    font-size: 0.9rem;
  }

  .btn-compare-all {
    font-size: 0.95rem;
    padding: 0.9rem 2rem;
  }

  .badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }

  .method-navigation {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .nav-back-btn {
    width: 100%;
  }

  .method-tabs {
    flex-direction: column;
  }

  .method-tab {
    width: 100%;
    text-align: center;
  }
}

/* Sección de Teoría General */
.general-theory-section {
  margin-top: 4rem;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.theory-title {
  font-size: 2.5rem;
  color: #1e40af;
  text-align: center;
  margin-bottom: 0.75rem;
  font-weight: 700;
}

.theory-intro {
  text-align: center;
  color: #64748b;
  font-size: 1.2rem;
  margin-bottom: 3rem;
}

.theory-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.theory-card {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
  border: 3.5px solid #3b82f6;
  transition: all 0.3s;
}

.theory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
  border-color: #2563eb;
}

.theory-card h3 {
  color: #1e40af;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.theory-card p {
  color: #475569;
  line-height: 1.8;
  margin-bottom: 0.75rem;
}

.theory-card ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.theory-card ul li {
  padding: 0.75rem 0;
  color: #475569;
  line-height: 1.7;
  border-bottom: 1px solid #e2e8f0;
}

.theory-card ul li:last-child {
  border-bottom: none;
}

.theory-card ul li strong {
  color: #1e40af;
  font-weight: 600;
}

@media (max-width: 768px) {
  .general-theory-section {
    padding: 2rem 1.5rem;
    margin-top: 3rem;
  }

  .theory-title {
    font-size: 2rem;
  }

  .theory-intro {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .theory-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .theory-card {
    padding: 1.5rem;
  }

  .theory-card h3 {
    font-size: 1.2rem;
  }
}
</style>
