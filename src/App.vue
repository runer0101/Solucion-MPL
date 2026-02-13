<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import SimplexInput from './components/SimplexInput.vue'
import SimplexSolution from './components/SimplexSolution.vue'
import TransporteInput from './components/TransporteInput.vue'
import CompararTodos from './components/CompararTodos.vue'
import { vRipple } from './directives/ripple.js'

// ===== ESTADO REACTIVO =====
const numVariables = ref(2)
const numConstraints = ref(2)
const problemType = ref('max')
const problemData = ref(null)
const selectedMethod = ref('simplex')
const currentView = ref('welcome')
const mobileMenuOpen = ref(false)
const theoryVisible = ref(false)

// ===== TEMPLATE REFS =====
const theorySectionRef = ref(null)
const intersectionObserver = ref(null)

// ===== FUNCIONES AUXILIARES =====
const setupTheoryObserver = () => {
  if (intersectionObserver.value) intersectionObserver.value.disconnect()

  nextTick(() => {
    if (!theorySectionRef.value) return

    intersectionObserver.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            theoryVisible.value = true
            intersectionObserver.value.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )
    intersectionObserver.value.observe(theorySectionRef.value)
  })
}

// ===== MANEJADORES DE EVENTOS =====
const startSolving = (method = 'todos') => {
  selectedMethod.value = method
  currentView.value = method
  problemData.value = null
  mobileMenuOpen.value = false
}

const goToMethod = (method) => {
  selectedMethod.value = method
  currentView.value = method
  problemData.value = null
  mobileMenuOpen.value = false
}

const handleSolve = (data) => {
  problemData.value = data
  currentView.value = 'solution'
}

const handleNewProblem = () => {
  problemData.value = null
  currentView.value = selectedMethod.value
}

const backToWelcome = () => {
  problemData.value = null
  currentView.value = 'welcome'
  theoryVisible.value = false
  setupTheoryObserver()
}

// ===== CICLO DE VIDA =====
onMounted(() => {
  setupTheoryObserver()
})

onUnmounted(() => {
  if (intersectionObserver.value) intersectionObserver.value.disconnect()
})

// ===== WATCHERS =====
watch(currentView, (newVal) => {
  if (newVal === 'welcome') setupTheoryObserver()
})
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header" role="banner">
      <div class="header-content">
        <img 
          src="/images/upds_logo-1-1-1.png" 
          alt="UPDS Logo" 
          class="header-logo"
          loading="lazy"
        >
        <div class="header-text">
          <h1 class="title">Solución de Modelos de Programación Lineal</h1>
          <p class="subtitle">Método Gráfico, Simplex y Transporte - Resolución paso a paso</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content" role="main">
      <!-- Welcome View -->
      <section v-if="currentView === 'welcome'" class="welcome-section" role="region" aria-label="Sección de bienvenida">
        <div class="welcome-hero">
          <h2 class="hero-title">Solucionador de Programación Lineal</h2>
          <p class="hero-description">
            Resuelve problemas de optimización con explicaciones detalladas paso a paso
          </p>
        </div>

        <!-- Methods Showcase -->
        <div class="methods-showcase-card">
          <h3 class="showcase-title">Selecciona un Método de Resolución</h3>
          <p class="showcase-subtitle">Haz clic en el método que deseas utilizar</p>
        </div>

        <!-- Methods Grid -->
        <div class="methods-grid-direct" role="region" aria-label="Métodos disponibles">
          <!-- Simplex Method Card -->
          <div class="method-card-direct stagger-1" role="article">
            <div class="method-header">
              <h4>Método Simplex</h4>
              <span class="badge badge-blue" aria-label="Más usado">Más usado</span>
            </div>
            <div class="method-info">
              <p class="method-desc">Problemas estándar de optimización</p>
              <ul class="method-specs" aria-label="Características del método Simplex">
                <li><strong>Variables:</strong> 2 o más</li>
                <li><strong>Restricciones:</strong> Tipo ≤</li>
                <li><strong>Nivel:</strong> <span class="difficulty medium">Medio</span></li>
              </ul>
            </div>
            <button
              v-ripple
              @click="startSolving('simplex')"
              class="btn-method btn-simplex"
              aria-label="Resolver con Método Simplex"
              :aria-busy="currentView === 'simplex'"
            >
              Resolver con Simplex
            </button>
          </div>

          <!-- Graphic Method Card -->
          <div class="method-card-direct stagger-2" role="article">
            <div class="method-header">
              <h4>Método Gráfico</h4>
              <span class="badge badge-pink" aria-label="Visualización">Visual</span>
            </div>
            <div class="method-info">
              <p class="method-desc">Visualización geométrica de la solución</p>
              <ul class="method-specs" aria-label="Características del método gráfico">
                <li><strong>Variables:</strong> Exactamente 2</li>
                <li><strong>Restricciones:</strong> Cualquier tipo</li>
                <li><strong>Nivel:</strong> <span class="difficulty easy">Fácil</span></li>
              </ul>
            </div>
            <button
              v-ripple
              @click="startSolving('grafico')"
              class="btn-method btn-graphic"
              aria-label="Resolver con Método Gráfico"
            >
              Resolver con Gráfico
            </button>
          </div>

          <!-- Transport Method Card -->
          <div class="method-card-direct stagger-3" role="article">
            <div class="method-header">
              <h4>Métodos de Transporte</h4>
              <span class="badge badge-red" aria-label="Especializado">Especializado</span>
            </div>
            <div class="method-info">
              <p class="method-desc">Soluciones iniciales para problemas de transporte</p>
              <ul class="method-specs" aria-label="Características de métodos de transporte">
                <li><strong>Métodos:</strong> 3 algoritmos</li>
                <li><strong>Tipo:</strong> Esquina NW, Costo Mín, Vogel</li>
                <li><strong>Nivel:</strong> <span class="difficulty hard">Medio-Alto</span></li>
              </ul>
            </div>
            <button
              v-ripple
              @click="startSolving('penalizacion')"
              class="btn-method btn-penalty"
              aria-label="Resolver con Métodos de Transporte"
            >
              Resolver Transporte
            </button>
          </div>
        </div>

        <!-- Compare All Section -->
        <div class="compare-all-section" role="complementary">
          <div class="compare-card">
            <div class="compare-content">
              <h4>¿No estás seguro cuál método usar?</h4>
              <p>Compara los resultados de todos los métodos aplicables para tu problema</p>
            </div>
            <button
              v-ripple
              @click="startSolving('todos')"
              class="btn-compare-all"
              aria-label="Comparar todos los métodos disponibles"
            >
              Comparar Todos los Métodos
            </button>
          </div>
        </div>

        <!-- Theory Section -->
        <section
          ref="theorySectionRef"
          class="general-theory-section"
          :class="{ 'reveal-visible': theoryVisible }"
          role="region"
          aria-label="Fundamentos de programación lineal"
        >
          <h2 class="theory-title">Fundamentos de Programación Lineal</h2>
          <p class="theory-intro">
            Conceptos generales sobre la solución de Modelos de Programación Lineal
          </p>

          <div class="theory-content">
            <article class="theory-card theory-stagger-1">
              <h3>¿Qué es la Programación Lineal?</h3>
              <p>
                La Programación Lineal es una técnica matemática de optimización que permite encontrar
                la mejor solución posible (máxima o mínima) para un problema con recursos limitados.
                Se caracteriza por tener una función objetivo lineal y restricciones lineales.
              </p>
            </article>

            <article class="theory-card theory-stagger-2">
              <h3>Componentes de un Modelo</h3>
              <ul>
                <li><strong>Variables de decisión:</strong> Lo que queremos determinar (X₁, X₂, ...)</li>
                <li><strong>Función objetivo:</strong> Lo que queremos maximizar o minimizar</li>
                <li><strong>Restricciones:</strong> Limitaciones del problema (desigualdades o ecuaciones)</li>
                <li><strong>Región factible:</strong> Conjunto de soluciones que cumplen todas las restricciones</li>
              </ul>
            </article>

            <article class="theory-card theory-stagger-3">
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
            </article>

            <article class="theory-card theory-stagger-4">
              <h3>Aplicaciones Prácticas</h3>
              <p>
                La programación lineal se utiliza en diversas áreas como manufactura, logística,
                finanzas, agricultura y planificación de recursos para tomar decisiones óptimas
                que maximicen beneficios o minimicen costos.
              </p>
            </article>
          </div>
        </section>
      </section>

      <!-- Method View -->
      <section v-else class="method-view" role="region" aria-label="Resolución de problemas">
        <!-- Navigation Bar -->
        <nav class="method-navigation" role="navigation" aria-label="Métodos disponibles">
          <button 
            @click="backToWelcome" 
            class="nav-back-btn"
            aria-label="Volver a inicio"
          >
            ← Inicio
          </button>

          <!-- Mobile Hamburger Button -->
          <button 
            class="hamburger-btn" 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            :class="{ open: mobileMenuOpen }"
            :aria-expanded="mobileMenuOpen"
            aria-label="Menú de métodos"
          >
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
          </button>

          <!-- Method Tabs -->
          <div class="method-tabs" :class="{ 'mobile-open': mobileMenuOpen }" role="tablist">
            <button
              @click="goToMethod('simplex')"
              :class="{ active: currentView === 'simplex' }"
              class="method-tab"
              role="tab"
              :aria-selected="currentView === 'simplex'"
              aria-label="Método Simplex"
            >
              Método Simplex
            </button>
            <button
              @click="goToMethod('grafico')"
              :class="{ active: currentView === 'grafico' }"
              class="method-tab"
              role="tab"
              :aria-selected="currentView === 'grafico'"
              aria-label="Método Gráfico"
            >
              Método Gráfico
            </button>
            <button
              @click="goToMethod('penalizacion')"
              :class="{ active: currentView === 'penalizacion' }"
              class="method-tab"
              role="tab"
              :aria-selected="currentView === 'penalizacion'"
              aria-label="Métodos de Transporte"
            >
              Métodos de Transporte
            </button>
            <button
              @click="goToMethod('todos')"
              :class="{ active: currentView === 'todos' }"
              class="method-tab method-tab-all"
              role="tab"
              :aria-selected="currentView === 'todos'"
              aria-label="Comparar todos los métodos"
            >
              Comparar Todos
            </button>
          </div>
        </nav>

        <!-- Method Content -->
        <div class="method-content" role="tabpanel">
          <!-- Componente de Transporte -->
          <TransporteInput v-if="currentView === 'penalizacion'" />

          <!-- Componente de Comparar Todos -->
          <CompararTodos v-else-if="currentView === 'todos'" />

          <!-- Componente de Simplex/Gráfico -->
          <SimplexInput
            v-else
            :key="currentView"
            v-model:numVariables="numVariables"
            v-model:numConstraints="numConstraints"
            v-model:problemType="problemType"
            :selectedMethod="selectedMethod"
            @solve="handleSolve"
          />
        </div>
      </section>

      <!-- Sección de Solución -->
      <section v-if="currentView === 'solution' && problemData" class="solution-section" role="region" aria-label="Solución del problema">
        <SimplexSolution
          :problemData="problemData"
          @reset="handleNewProblem"
        />
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer" role="contentinfo">
      <p><strong>Métodos de MPL</strong> • Investigación Operativa I</p>
      <p>Desarrollado por <em>runer0101</em></p>
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

/* ===== HEADER ===== */
.header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 250, 252, 0.97) 100%);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.12);
  padding: clamp(1.25rem, 3%, 2rem) clamp(1rem, 3%, 2rem);
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(226, 232, 240, 0.3);
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.08), transparent);
  animation: shimmer 4s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  position: relative;
}

.header-logo {
  height: clamp(75px, 8vw, 100px);
  width: auto;
  object-fit: contain;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 6px rgba(59, 130, 246, 0.08));
}

.header-text {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}

.title {
  font-size: clamp(1.4rem, 5vw, 2.5rem);
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  line-height: 1.5;
  letter-spacing: 0.01em;
}

/* ===== MAIN ===== */
.main-content {
  flex: 1;
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  background: linear-gradient(180deg, rgba(30, 58, 138, 0.15) 0%, rgba(0, 0, 0, 0.2) 100%);
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
  padding: clamp(1.5rem, 3%, 2rem) clamp(1rem, 3%, 2rem);
  font-size: clamp(0.8rem, 2vw, 0.95rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  letter-spacing: 0.005em;
}

.footer p {
  margin: 0.35rem 0;
  font-weight: 500;
}

/* ===== BIENVENIDA ===== */
.welcome-section {
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-hero {
  text-align: center;
  padding: clamp(1.5rem, 5%, 3rem) clamp(1.25rem, 4%, 2.5rem);
  background: white;
  border-radius: 14px;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(226, 232, 240, 0.4);
}

.hero-title {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  color: #1e40af;
}

.hero-description {
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  color: #475569;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.8;
  letter-spacing: 0.005em;
  font-weight: 500;
}

.methods-showcase-card {
  margin-bottom: 1.75rem;
  padding: 1.25rem 1.75rem;
  background: linear-gradient(135deg, #dfe9f9 0%, #e3f2fd 100%);
  border-radius: 14px;
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.12);
}

.showcase-title {
  font-size: clamp(1.25rem, 4vw, 1.55rem);
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #1e40af;
  text-align: center;
  margin-bottom: 0.4rem;
  line-height: 1.3;
}

.showcase-subtitle {
  font-size: clamp(0.88rem, 2.5vw, 1rem);
  color: #334155;
  text-align: center;
  margin-bottom: 0;
  line-height: 1.6;
  letter-spacing: 0.005em;
  font-weight: 500;
}

/* ===== GRID DE TARJETAS DE METODOS ===== */
.methods-grid-direct {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  margin-bottom: 0;
}

.method-card-direct {
  background: white;
  border-radius: 14px;
  padding: 1.75rem;
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.10);
  border: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  animation: cardSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.method-card-direct.stagger-1 { animation-delay: 0.1s; }
.method-card-direct.stagger-2 { animation-delay: 0.2s; }
.method-card-direct.stagger-3 { animation-delay: 0.3s; }

@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.method-card-direct:hover {
  border-color: #3b82f6;
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.18);
  transform: translateY(-6px);
}

.method-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 2px solid #f1f5f9;
}

.method-header h4 {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1e293b;
  margin: 0;
  line-height: 1.3;
}

.method-info {
  flex: 1;
  margin-bottom: 1.5rem;
}

.method-desc {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 0.875rem;
  line-height: 1.65;
  letter-spacing: 0.005em;
  min-height: 3em;
  font-weight: 500;
}

.method-specs {
  list-style: none;
  padding: 0;
  margin: 0;
}

.method-specs li {
  padding: 0.4rem 0;
  font-size: 0.88rem;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
  line-height: 1.5;
}

.method-specs li:last-child {
  border-bottom: none;
}

.method-specs strong {
  color: #1e293b;
  font-weight: 600;
}

/* ===== BOTONES DE METODO ===== */
.btn-method {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-top: auto;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.32);
  font-weight: 600;
}

.btn-method:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.38);
  background: linear-gradient(135deg, #0369a1 0%, #0284c7 100%);
}

.btn-method:focus-visible {
  outline: 3px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

/* ===== SECCION COMPARAR TODOS ===== */
.compare-all-section {
  margin-top: 2rem;
  margin-bottom: 2.75rem;
}

.compare-card {
  background: linear-gradient(135deg, #dfe9f9 0%, #e3f2fd 100%);
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 14px;
  padding: var(--card-padding);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.10);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.compare-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 12px 28px rgba(59, 130, 246, 0.20);
  transform: translateY(-3px);
}

.compare-content h4 {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1e40af;
  margin-bottom: 0.625rem;
  line-height: 1.3;
}

.compare-content p {
  color: #475569;
  font-size: 1rem;
  margin: 0;
  line-height: 1.7;
  letter-spacing: 0.005em;
  font-weight: 500;
}

.btn-compare-all {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 1.05rem 3rem;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.36);
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.btn-compare-all:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(59, 130, 246, 0.42);
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
}

.btn-compare-all:focus-visible {
  outline: 3px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

/* ===== BADGES ===== */
.badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-blue { background: #3b82f6; color: white; }
.badge-pink { background: #60a5fa; color: white; }
.badge-red { background: #60a5fa; color: white; }
.badge-green { background: #22c55e; color: white; }

/* ===== DIFICULTAD ===== */
.difficulty {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.difficulty.easy { background: #dbeafe; color: #1e40af; }
.difficulty.medium { background: #93c5fd; color: #1e3a8a; }
.difficulty.hard { background: #3b82f6; color: white; }

/* ===== NAVEGACION DE METODOS ===== */
.method-view {
  animation: fadeIn 0.6s ease-in;
}

.method-navigation {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 14px;
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.10);
  flex-wrap: wrap;
  border: 1px solid rgba(226, 232, 240, 0.4);
}

.nav-back-btn {
  background: white;
  border: 2px solid #e2e8f0;
  color: #3b82f6;
  padding: 0.7rem 1.5rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.nav-back-btn:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #2563eb;
}

.method-tabs {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  flex-wrap: wrap;
}

.method-tab {
  padding: 0.7rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.method-tab:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.04);
}

.method-tab.active {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.32);
}

.method-tab-all.active {
  background: #1e40af;
  border-color: #1e40af;
  box-shadow: 0 4px 14px rgba(30, 64, 175, 0.32);
}

.method-content {
  animation: fadeIn 0.4s ease-in;
}

/* ===== SECCION DE TEORIA ===== */
.general-theory-section {
  margin-top: 2.5rem;
  padding: 2.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(226, 232, 240, 0.3);
}

.theory-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #1e40af;
  text-align: center;
  margin-bottom: 0.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.theory-intro {
  text-align: center;
  color: #475569;
  font-size: clamp(0.95rem, 2.5vw, 1.15rem);
  margin-bottom: 2.5rem;
  line-height: 1.8;
  letter-spacing: 0.005em;
  font-weight: 500;
}

.theory-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
  align-items: stretch;
}

.theory-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.75rem;
  border-radius: 14px;
  border: 1px solid rgba(59, 130, 246, 0.10);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.05);
}

.theory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.12);
  border-color: #3b82f6;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.theory-card h3 {
  color: #1e40af;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.theory-card p {
  color: #475569;
  line-height: 1.8;
  margin-bottom: 0.75rem;
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}

.theory-card ul {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
  flex: 1;
}

.theory-card ul li {
  padding: 0.625rem 0;
  color: #475569;
  line-height: 1.7;
  font-size: 0.93rem;
  font-weight: 500;
  border-bottom: 1px solid #f1f5f9;
}

.theory-card ul li:last-child {
  border-bottom: none;
}

.theory-card ul li strong {
  color: #1e40af;
  font-weight: 600;
}

/* ===== HAMBURGUESA (oculto en desktop) ===== */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.hamburger-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.hamburger-line {
  display: block;
  width: 20px;
  height: 2.5px;
  background: #3b82f6;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-btn.open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-btn.open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ===== ANIMACIONES STAGGERED (tarjetas de método) ===== */
@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.method-card-direct.stagger-1 {
  animation: cardSlideUp 0.5s ease-out 0.1s both;
}

.method-card-direct.stagger-2 {
  animation: cardSlideUp 0.5s ease-out 0.25s both;
}

.method-card-direct.stagger-3 {
  animation: cardSlideUp 0.5s ease-out 0.4s both;
}

/* ===== EFECTO RIPPLE EN BOTONES ===== */
.btn-method,
.btn-compare-all {
  position: relative;
  overflow: hidden;
}

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: rippleAnim 0.6s ease-out;
  pointer-events: none;
}

@keyframes rippleAnim {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

/* ===== ACTIVE STATE EN BOTONES ===== */
.btn-method:active {
  transform: scale(0.96);
  box-shadow: 0 1px 4px rgba(14, 165, 233, 0.2);
}

.btn-compare-all:active {
  transform: scale(0.97);
}

.nav-back-btn:active,
.method-tab:active {
  transform: scale(0.95);
}

/* ===== HOVER INTERACTIVO EN TARJETAS ===== */
.method-card-direct {
  position: relative;
}

.method-card-direct::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6);
  border-radius: 12px 12px 0 0;
  transform: scaleX(0);
  transition: transform 0.4s ease;
  transform-origin: left;
}

.method-card-direct:hover::before {
  transform: scaleX(1);
}

/* Badge pulse al hover en tarjeta */
.method-card-direct:hover .badge {
  animation: badgePulse 0.5s ease;
}

@keyframes badgePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

/* Specs list items revelan con delay al hover */
.method-specs li {
  transition: padding-left 0.3s ease, color 0.3s ease;
}

.method-card-direct:hover .method-specs li {
  padding-left: 0.5rem;
  color: #1e293b;
}

/* ===== COMPARE CARD INTERACTIVIDAD ===== */
.compare-card {
  position: relative;
  overflow: hidden;
}

.compare-card::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent);
  transform: translateY(-50%);
  transition: left 0.6s ease;
}

.compare-card:hover::after {
  left: 100%;
}

/* ===== SCROLL REVEAL - SECCION TEORIA ===== */
.general-theory-section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.general-theory-section.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger de tarjetas de teoría al hacer reveal */
.theory-card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.reveal-visible .theory-stagger-1 {
  animation: cardSlideUp 0.5s ease-out 0.15s both;
}

.reveal-visible .theory-stagger-2 {
  animation: cardSlideUp 0.5s ease-out 0.3s both;
}

.reveal-visible .theory-stagger-3 {
  animation: cardSlideUp 0.5s ease-out 0.45s both;
}

.reveal-visible .theory-stagger-4 {
  animation: cardSlideUp 0.5s ease-out 0.6s both;
}

/* ===== HEADER LOGO INTERACTIVO ===== */
.header-logo {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-logo:hover {
  transform: scale(1.05) rotate(-2deg);
}

/* ===== WELCOME HERO ANIMACION ===== */
.hero-title {
  animation: fadeIn 0.6s ease-out 0.1s both;
}

.hero-description {
  animation: fadeIn 0.6s ease-out 0.3s both;
}

.methods-showcase-card {
  animation: fadeIn 0.5s ease-out 0.2s both;
}

/* ===== FOOTER INTERACTIVO ===== */
.footer {
  transition: background 0.3s ease;
}

.footer:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* ===== FOCUS VISIBLE ACCESIBILIDAD ===== */
.btn-method:focus-visible,
.btn-compare-all:focus-visible,
.nav-back-btn:focus-visible,
.method-tab:focus-visible,
.hamburger-btn:focus-visible {
  outline: 3px solid #60a5fa;
  outline-offset: 2px;
}

/* ===== RESPONSIVE 768px ===== */
@media (max-width: 768px) {
  .header-content {
    gap: 1rem;
  }

  .header-logo {
    height: 60px;
  }

  .title {
    font-size: clamp(1.3rem, 4vw, 1.6rem);
  }

  .subtitle {
    font-size: clamp(0.75rem, 2vw, 0.9rem);
  }

  .main-content {
    padding: 1rem 0.75rem;
  }

  .header {
    padding: 1rem 0.75rem;
  }

  .welcome-hero {
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
  }

  .hero-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
  }

  .methods-grid-direct {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .welcome-hero {
    margin-bottom: 2rem;
  }

  .method-desc {
    min-height: auto;
  }

  .compare-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.25rem;
  }

  .btn-compare-all {
    width: 100%;
  }

  .method-navigation {
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .theory-content {
    grid-template-columns: 1fr;
  }

  .general-theory-section {
    margin-top: 1.5rem;
    padding: 1.5rem;
  }
}

/* ===== RESPONSIVE 480px ===== */
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
    font-size: 1.3rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .welcome-hero {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-title {
    font-size: 1.4rem;
  }

  .methods-showcase-card {
    padding: 0.75rem 1rem;
  }

  .method-card-direct {
    padding: 1rem;
  }

  .method-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .compare-card {
    padding: 1rem;
  }

  .badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }

  .method-navigation {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.75rem;
  }

  .nav-back-btn {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    flex: 0 0 auto;
  }

  .hamburger-btn {
    display: flex;
    margin-left: auto;
  }

  .method-tabs {
    display: none;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
    padding-top: 0.5rem;
    border-top: 1px solid #e2e8f0;
    margin-top: 0.25rem;
  }

  .method-tabs.mobile-open {
    display: flex;
    animation: slideDown 0.25s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .method-tab {
    width: 100%;
    text-align: center;
    padding: 0.6rem 1rem;
    font-size: 0.88rem;
  }

  .theory-card {
    padding: 1rem;
  }

  .general-theory-section {
    padding: 1rem;
  }
}
</style>
