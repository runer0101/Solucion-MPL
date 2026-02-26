<script setup>
import { ref, computed } from 'vue'
import TodosExplanation from './explanations/TodosExplanation.vue'
import SimplexExplanation from './explanations/SimplexExplanation.vue'
import GraficoExplanation from './explanations/GraficoExplanation.vue'
import PenalizacionExplanation from './explanations/PenalizacionExplanation.vue'

const props = defineProps({
  selectedMethod: {
    type: String,
    default: 'simplex'
  }
})

const activeSection = ref('intro')

const headerTitle = computed(() => {
  const titles = {
    'simplex': 'Método Simplex - Algoritmo de Optimización Lineal',
    'grafico': 'Método Gráfico - Solución Visual de Programación Lineal',
    'penalizacion': 'Métodos de Solución Inicial - Problemas de Transporte',
    'todos': 'Guía de Solución de Modelos de Programación Lineal'
  }
  return titles[props.selectedMethod] || titles['todos']
})

const headerDescription = computed(() => {
  const descriptions = {
    'simplex': 'El método algebraico más importante para resolver problemas de optimización lineal con múltiples variables',
    'grafico': 'Método visual e intuitivo para resolver problemas de programación lineal con 2 variables de decisión',
    'penalizacion': 'Esquina Noroeste, Costo Mínimo y Aproximación de Vogel para encontrar soluciones básicas factibles iniciales',
    'todos': 'Aprende los métodos para resolver problemas de optimización: Gráfico, Simplex y Penalización'
  }
  return descriptions[props.selectedMethod] || descriptions['todos']
})
</script>

<template>
  <div class="method-explanation">
    <div class="explanation-header">
      <h2>{{ headerTitle }}</h2>
      <p>{{ headerDescription }}</p>
    </div>

    <div class="explanation-nav">
      <button
        :class="{ active: activeSection === 'intro' }"
        class="nav-btn"
        @click="activeSection = 'intro'"
      >
        Introducción
      </button>
      <button
        :class="{ active: activeSection === 'steps' }"
        class="nav-btn"
        @click="activeSection = 'steps'"
      >
        Pasos del Algoritmo
      </button>
    </div>

    <div class="explanation-content content-section">
      <TodosExplanation v-if="selectedMethod === 'todos'" :active-section="activeSection" />
      <SimplexExplanation v-else-if="selectedMethod === 'simplex'" :active-section="activeSection" />
      <GraficoExplanation v-else-if="selectedMethod === 'grafico'" :active-section="activeSection" />
      <PenalizacionExplanation v-else-if="selectedMethod === 'penalizacion'" :active-section="activeSection" />


    </div>
  </div>
</template>

<style scoped>
.method-explanation {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.explanation-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 3px solid #1e40af;
}

.explanation-header h2 {
  font-size: 2rem;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.explanation-header p {
  color: #666;
  font-size: 1.1rem;
}

.explanation-nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: center;
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  color: #666;
}

.nav-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.nav-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.content-section {
  animation: fadeIn 0.5s ease-in;
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

.content-section h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.content-section h3 .text-gradient {
  color: #1e40af;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
}

.key-concepts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.concept-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid #93c5fd;
  transition: all 0.3s ease;
  position: relative;
}

.concept-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2);
}

.concept-card h4 {
  color: #1e40af;
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.concept-card p {
  color: #666;
  line-height: 1.6;
}

.importance-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-top: 2rem;
  border: 1px solid #bae6fd;
}

.importance-section h4 {
  color: #0369a1;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.applications-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.applications-list li {
  padding: 1.25rem 1.5rem;
  margin: 0;
  background: white;
  border-radius: 10px;
  border: 2px solid #93c5fd;
  line-height: 1.7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.applications-list li:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  border-width: 2px;
}

.algorithm-header {
  text-align: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 2px solid #93c5fd;
}

.algorithm-subtitle {
  color: #0369a1;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.step-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 2rem;
  position: relative;
  padding-top: 1rem;
}

.step-number {
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

.step-card h4 {
  color: #1e40af;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.step-card ul,
.step-card ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.step-card li {
  margin: 0.5rem 0;
  line-height: 1.7;
}

.example-box,
.info-box,
.warning-box,
.formula-box {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.example-box {
  background: #e8f5e9;
  border: 2px solid #4caf50;
  font-family: 'Courier New', monospace;
  line-height: 1.8;
}

.info-box {
  background: #e3f2fd;
  border: 2px solid #2196f3;
}

.warning-box {
  background: #dbeafe;
  border: 2px solid #3b82f6;
  font-weight: 600;
}

.formula-box {
  background: #eff6ff;
  border: 2px solid #3b82f6;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
}

.mini-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-family: 'Courier New', monospace;
}

.mini-table th,
.mini-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: center;
}

.mini-table th {
  background: #3b82f6;
  color: white;
  font-weight: 600;
}

.mini-table .z-row {
  background: #eff6ff;
  font-weight: 600;
}

.pivot-operations {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.pivot-operations li {
  margin: 1rem 0;
}

.convergence-box,
.solution-example {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 2px solid #4caf50;
}

.cases-section {
  margin-top: 2rem;
}

.cases-section h4 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.special-cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.case-card {
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid;
}

.case-card.warning {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #3b82f6;
}

.case-card.error {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border-color: #f44336;
}

.case-card.info {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-color: #2196f3;
}

.case-card h5 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.case-card p {
  line-height: 1.6;
  margin: 0.5rem 0;
}

/* Estilos para tarjetas comparativas de métodos */
.methods-comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin: 2.5rem 0;
}

.method-comparison-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 3px solid;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.method-comparison-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.graphic-card {
  border-color: #ec4899;
}

.simplex-card {
  border-color: #3b82f6;
}

.transport-card {
  border-color: #f59e0b;
}

.method-card-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid;
}

.graphic-card .method-card-header {
  background: #fdf2f8;
  border-bottom-color: #ec4899;
}

.simplex-card .method-card-header {
  background: #eff6ff;
  border-bottom-color: #3b82f6;
}

.transport-card .method-card-header {
  background: #fffbeb;
  border-bottom-color: #f59e0b;
}

.method-card-header h4 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.graphic-card .method-card-header h4 {
  color: #be185d;
}

.simplex-card .method-card-header h4 {
  color: #1e40af;
}

.transport-card .method-card-header h4 {
  color: #92400e;
}

.method-badge {
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  color: white;
}

.badge-graphic {
  background: #ec4899;
}

.badge-simplex {
  background: #3b82f6;
}

.badge-transport {
  background: #f59e0b;
}

.method-card-body {
  padding: 1.75rem;
}

.card-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid #f1f5f9;
}

.card-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.card-section h5 {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.card-section p {
  color: #475569;
  line-height: 1.7;
  font-size: 1.05rem;
}

.data-list {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0 0;
}

.data-list li {
  padding: 0.6rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #334155;
  font-size: 1.05rem;
  line-height: 1.6;
}

.data-number {
  background: #3b82f6;
  color: white;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.example-section {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.example-data {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.example-data p {
  margin: 0.4rem 0;
  font-size: 1rem;
  color: #1e293b;
}

.result-section {
  background: #ecfdf5;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #10b981;
  color: #065f46;
  font-size: 1.05rem;
  text-align: center;
}

.table-title {
  color: #1e40af;
  font-size: 1.4rem;
  margin: 2.5rem 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 4px solid #3b82f6;
}

@media (max-width: 768px) {
  .methods-comparison-grid {
    grid-template-columns: 1fr;
  }

  .step-card {
    padding: 1.5rem;
  }

  .step-number {
    font-size: 0.95rem;
    padding: 0.4rem 1rem;
  }

  .key-concepts,
  .special-cases {
    grid-template-columns: 1fr;
  }

  .content-section h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .explanation-header h2 {
    font-size: 1.5rem;
  }

  .content-section h3 {
    font-size: 1.3rem;
  }

  .concept-card {
    padding: 1rem;
  }

  .step-card {
    padding: 1.5rem;
  }
}

/* Estilos para la tabla de comparación */
.comparison-table-container {
  overflow-x: auto;
  margin: 2rem 0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 0.95rem;
}

.comparison-table thead {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.comparison-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border: 1px solid #2563eb;
}

.comparison-table th:first-child {
  border-top-left-radius: 12px;
}

.comparison-table th:last-child {
  border-top-right-radius: 12px;
}

.comparison-table td {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  line-height: 1.6;
}

.comparison-table tbody tr:nth-child(even) {
  background: #f8f9fa;
}

.comparison-table tbody tr:hover {
  background: #e3f2fd;
  transition: background 0.3s ease;
}

.decision-guide {
  margin-top: 3rem;
}

.decision-guide h4 {
  font-size: 1.5rem;
  color: #1e40af;
  margin-bottom: 1.5rem;
  text-align: center;
}

.table-structure {
  overflow-x: auto;
  margin: 1rem 0;
}

@media (max-width: 768px) {
  .comparison-table {
    font-size: 0.85rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 0.75rem 0.5rem;
  }
}

/* Estilos mejorados para los métodos de transporte */
.method-highlight {
  border-left: 4px solid #3b82f6;
}

.method-description {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #93c5fd;
}

.method-description p {
  margin: 0.5rem 0;
  line-height: 1.7;
  color: #1e3a8a;
}

.algorithm-steps {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border: 1px solid #e2e8f0;
}

.algorithm-steps h5 {
  color: #1e40af;
  font-size: 1.15rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.algorithm-steps ol {
  counter-reset: step-counter;
  list-style: none;
  padding-left: 0;
}

.algorithm-steps ol > li {
  counter-increment: step-counter;
  position: relative;
  padding-left: 3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.algorithm-steps ol > li:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.algorithm-steps ol > li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.95rem;
}

.algorithm-steps ol > li strong {
  display: block;
  color: #1e40af;
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
}

.algorithm-steps ol > li p {
  margin: 0.4rem 0;
  line-height: 1.7;
  color: #475569;
}

.example-steps {
  margin-top: 1rem;
  background: white;
  border-radius: 6px;
  padding: 1rem;
}

.step-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  align-items: flex-start;
}

.step-label {
  color: #1e40af;
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 100px;
  flex-shrink: 0;
}

.step-item span:last-child {
  color: #475569;
  line-height: 1.6;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.pros, .cons {
  padding: 1.25rem;
  border-radius: 8px;
  border: 2px solid;
}

.pros {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-color: #10b981;
}

.cons {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: #ef4444;
}

.pros h6, .cons h6 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.pros h6 {
  color: #059669;
}

.cons h6 {
  color: #dc2626;
}

.pros ul, .cons ul {
  margin: 0;
  padding-left: 1.5rem;
}

.pros li, .cons li {
  margin: 0.6rem 0;
  line-height: 1.6;
}

.pros li {
  color: #065f46;
}

.cons li {
  color: #991b1b;
}

.formula-box h6 {
  color: #1e40af;
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.formula-example {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  border-left: 4px solid #3b82f6;
}

.formula-example p {
  margin: 0.4rem 0;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .pros-cons {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .algorithm-steps ol > li {
    padding-left: 2.5rem;
  }

  .algorithm-steps ol > li::before {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.85rem;
  }

  .step-item {
    flex-direction: column;
    gap: 0.5rem;
  }

  .step-label {
    min-width: auto;
  }
}
</style>
