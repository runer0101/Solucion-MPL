<script setup>
import { ref, computed } from 'vue'
import TransporteSolver from '../utils/transporte.js'
import MethodExplanation from './MethodExplanation.vue'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const emit = defineEmits(['solve'])

// Datos del problema
const numOrigenes = ref(3)
const numDestinos = ref(3)

// Matrices de costos
const costos = ref([
  [4, 8, 8],
  [16, 24, 16],
  [8, 16, 24]
])

// Oferta y demanda
const oferta = ref([76, 82, 77])
const demanda = ref([72, 102, 41])

// Método seleccionado
const metodoSeleccionado = ref('todos')

// Soluciones
const soluciones = ref(null)
const mostrarSoluciones = ref(false)

// Control de visibilidad de pasos detallados
const mostrarPasosEsquina = ref(false)
const mostrarPasosCosto = ref(false)
const mostrarPasosVogel = ref(false)

// Control de pestañas: 'calculadora', 'teoria', 'pasoapaso'
const activeTab = ref('calculadora')

// Actualizar tamaños de matrices cuando cambian las dimensiones
const actualizarTamanos = () => {
  const m = numOrigenes.value
  const n = numDestinos.value

  // Ajustar matriz de costos
  const nuevosCostos = []
  for (let i = 0; i < m; i++) {
    nuevosCostos[i] = []
    for (let j = 0; j < n; j++) {
      nuevosCostos[i][j] = (costos.value[i] && costos.value[i][j]) || 0
    }
  }
  costos.value = nuevosCostos

  // Ajustar oferta
  const nuevaOferta = []
  for (let i = 0; i < m; i++) {
    nuevaOferta[i] = oferta.value[i] || 0
  }
  oferta.value = nuevaOferta

  // Ajustar demanda
  const nuevaDemanda = []
  for (let j = 0; j < n; j++) {
    nuevaDemanda[j] = demanda.value[j] || 0
  }
  demanda.value = nuevaDemanda
}

// Validar problema balanceado
const esBalanceado = computed(() => {
  const totalOferta = oferta.value.reduce((sum, val) => sum + val, 0)
  const totalDemanda = demanda.value.reduce((sum, val) => sum + val, 0)
  return totalOferta === totalDemanda
})

const totalOferta = computed(() => oferta.value.reduce((sum, val) => sum + val, 0))
const totalDemanda = computed(() => demanda.value.reduce((sum, val) => sum + val, 0))

// Resolver problema
const resolver = () => {
  console.log('=== INICIO RESOLVER ===')
  console.log('Método seleccionado:', metodoSeleccionado.value)
  console.log('Balance:', esBalanceado.value)
  console.log('Costos:', costos.value)
  console.log('Oferta:', oferta.value)
  console.log('Demanda:', demanda.value)

  if (!esBalanceado.value) {
    alert('El problema no está balanceado. La oferta total debe ser igual a la demanda total.')
    return
  }

  try {
    console.log('Creando TransporteSolver...')
    const solver = new TransporteSolver({
      costos: costos.value,
      oferta: oferta.value,
      demanda: demanda.value
    })
    console.log('TransporteSolver creado:', solver)

    if (metodoSeleccionado.value === 'todos') {
      console.log('Ejecutando resolver todos...')
      const resultado = solver.resolverTodos(costos.value, oferta.value, demanda.value)
      console.log('Resultado de resolverTodos:', resultado)
      soluciones.value = resultado
    } else if (metodoSeleccionado.value === 'esquina') {
      console.log('Ejecutando esquina noroeste...')
      soluciones.value = {
        esquinaNoroeste: solver.esquinaNoroeste(costos.value, oferta.value, demanda.value)
      }
    } else if (metodoSeleccionado.value === 'costo') {
      console.log('Ejecutando costo mínimo...')
      soluciones.value = {
        costoMinimo: solver.costoMinimo(costos.value, oferta.value, demanda.value)
      }
    } else if (metodoSeleccionado.value === 'vogel') {
      console.log('Ejecutando Vogel...')
      soluciones.value = {
        vogel: solver.aproximacionVogel(costos.value, oferta.value, demanda.value)
      }
    }

    console.log('Soluciones asignadas:', soluciones.value)
    console.log('Verificando estructura:')
    console.log('- esquinaNoroeste?', !!soluciones.value?.esquinaNoroeste)
    console.log('- costoMinimo?', !!soluciones.value?.costoMinimo)
    console.log('- vogel?', !!soluciones.value?.vogel)

    console.log('Estableciendo mostrarSoluciones = true')
    mostrarSoluciones.value = true
    console.log('mostrarSoluciones ahora es:', mostrarSoluciones.value)
    console.log('=== FIN RESOLVER ===')
  } catch (error) {
    console.error('=== ERROR EN RESOLVER ===')
    console.error('Error completo:', error)
    console.error('Stack trace:', error.stack)
    alert('Error al resolver el problema: ' + error.message)
  }
}

// Reiniciar
const reiniciar = () => {
  mostrarSoluciones.value = false
  soluciones.value = null
  mostrarPasosEsquina.value = false
  mostrarPasosCosto.value = false
  mostrarPasosVogel.value = false
}

// Ejemplo de problema
const cargarEjemplo = () => {
  numOrigenes.value = 3
  numDestinos.value = 3
  costos.value = [
    [4, 8, 8],
    [16, 24, 16],
    [8, 16, 24]
  ]
  oferta.value = [76, 82, 77]
  demanda.value = [72, 102, 41]
}

// Funciones para comparación de calidad
const getQualityClass = (costo) => {
  if (!soluciones.value) return ''

  const costos = []
  if (soluciones.value.esquinaNoroeste) costos.push(soluciones.value.esquinaNoroeste.costoTotal)
  if (soluciones.value.costoMinimo) costos.push(soluciones.value.costoMinimo.costoTotal)
  if (soluciones.value.vogel) costos.push(soluciones.value.vogel.costoTotal)

  const minCosto = Math.min(...costos)
  const maxCosto = Math.max(...costos)

  if (costo === minCosto) return 'quality-best'
  if (costo === maxCosto) return 'quality-worst'
  return 'quality-medium'
}

const getQualityText = (costo) => {
  if (!soluciones.value) return ''

  const costos = []
  if (soluciones.value.esquinaNoroeste) costos.push(soluciones.value.esquinaNoroeste.costoTotal)
  if (soluciones.value.costoMinimo) costos.push(soluciones.value.costoMinimo.costoTotal)
  if (soluciones.value.vogel) costos.push(soluciones.value.vogel.costoTotal)

  const minCosto = Math.min(...costos)
  const maxCosto = Math.max(...costos)

  if (costo === minCosto) return 'Mejor Solución'
  if (costo === maxCosto) return 'Solución Básica'
  return 'Solución Intermedia'
}

// Exportar a PDF
const exportarPDF = () => {
  if (!soluciones.value) return

  const doc = new jsPDF()
  let yPosition = 20

  // Título
  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('Solución de Problema de Transporte', 105, yPosition, { align: 'center' })
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont(undefined, 'normal')
  doc.text('Métodos: Esquina Noroeste, Costo Mínimo y Aproximación de Vogel', 105, yPosition, { align: 'center' })
  yPosition += 15

  // Tabla de Costos Original
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text('Tabla de Costos de Transporte', 14, yPosition)
  yPosition += 8

  const costosHeaders = ['Origen\\Destino', ...Array.from({ length: numDestinos.value }, (_, i) => `D${i + 1}`), 'Oferta']
  const costosBody = []

  for (let i = 0; i < numOrigenes.value; i++) {
    const row = [`O${i + 1}`, ...costos.value[i], oferta.value[i]]
    costosBody.push(row)
  }
  costosBody.push(['Demanda', ...demanda.value, totalOferta.value])

  doc.autoTable({
    startY: yPosition,
    head: [costosHeaders],
    body: costosBody,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
    styles: { halign: 'center', fontSize: 10 },
    margin: { left: 14 }
  })

  yPosition = doc.lastAutoTable.finalY + 15

  // Función para agregar método al PDF
  const agregarMetodo = (metodo, nombreMetodo, solucion) => {
    // Verificar si necesitamos nueva página
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(nombreMetodo, 14, yPosition)
    yPosition += 8

    // Tabla de asignación
    const asignacionHeaders = ['O\\D', ...Array.from({ length: numDestinos.value }, (_, i) => `D${i + 1}`)]
    const asignacionBody = []

    for (let i = 0; i < numOrigenes.value; i++) {
      const row = [`O${i + 1}`]
      for (let j = 0; j < numDestinos.value; j++) {
        if (solucion.asignacion[i][j] > 0) {
          row.push(`${solucion.asignacion[i][j]} (${costos.value[i][j]})`)
        } else {
          row.push('-')
        }
      }
      asignacionBody.push(row)
    }

    doc.autoTable({
      startY: yPosition,
      head: [asignacionHeaders],
      body: asignacionBody,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
      styles: { halign: 'center', fontSize: 9 },
      margin: { left: 14 }
    })

    yPosition = doc.lastAutoTable.finalY + 8

    // Costo total
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(`Costo Total: ${solucion.costoTotal}`, 14, yPosition)
    yPosition += 10

    // Pasos del algoritmo (resumido)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Número de asignaciones: ${solucion.pasos.length}`, 14, yPosition)
    yPosition += 15
  }

  // Agregar cada método si existe
  if (soluciones.value.esquinaNoroeste) {
    agregarMetodo('esquinaNoroeste', 'Método de la Esquina Noroeste', soluciones.value.esquinaNoroeste)
  }

  if (soluciones.value.costoMinimo) {
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }
    agregarMetodo('costoMinimo', 'Método del Costo Mínimo', soluciones.value.costoMinimo)
  }

  if (soluciones.value.vogel) {
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }
    agregarMetodo('vogel', 'Método de Aproximación de Vogel (VAM)', soluciones.value.vogel)
  }

  // Tabla comparativa si hay los 3 métodos
  if (soluciones.value.esquinaNoroeste && soluciones.value.costoMinimo && soluciones.value.vogel) {
    if (yPosition > 230) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('Comparación de Métodos', 14, yPosition)
    yPosition += 8

    const comparacionHeaders = ['Método', 'Costo Total', 'Calidad']
    const comparacionBody = [
      ['Esquina Noroeste', soluciones.value.esquinaNoroeste.costoTotal.toString(), getQualityText(soluciones.value.esquinaNoroeste.costoTotal)],
      ['Costo Mínimo', soluciones.value.costoMinimo.costoTotal.toString(), getQualityText(soluciones.value.costoMinimo.costoTotal)],
      ['Aproximación de Vogel', soluciones.value.vogel.costoTotal.toString(), getQualityText(soluciones.value.vogel.costoTotal)]
    ]

    doc.autoTable({
      startY: yPosition,
      head: [comparacionHeaders],
      body: comparacionBody,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175], fontStyle: 'bold' },
      styles: { halign: 'center', fontSize: 10 },
      margin: { left: 14 }
    })

    yPosition = doc.lastAutoTable.finalY + 10

    // Mejor método
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.setTextColor(16, 185, 129)
    doc.text(`Mejor Método: ${getMejorMetodo()} (Costo: ${getCostoMinimo()})`, 14, yPosition)
    doc.setTextColor(0, 0, 0)
  }

  // Guardar PDF
  const fecha = new Date().toISOString().split('T')[0]
  doc.save(`problema-transporte-${fecha}.pdf`)
}

const getCostoMinimo = () => {
  if (!soluciones.value) return 0
  const costos = []
  if (soluciones.value.esquinaNoroeste) costos.push(soluciones.value.esquinaNoroeste.costoTotal)
  if (soluciones.value.costoMinimo) costos.push(soluciones.value.costoMinimo.costoTotal)
  if (soluciones.value.vogel) costos.push(soluciones.value.vogel.costoTotal)
  return Math.min(...costos)
}

const getMejorMetodo = () => {
  if (!soluciones.value) return ''
  const minCosto = getCostoMinimo()
  if (soluciones.value.esquinaNoroeste?.costoTotal === minCosto) return 'Esquina Noroeste'
  if (soluciones.value.costoMinimo?.costoTotal === minCosto) return 'Costo Mínimo'
  if (soluciones.value.vogel?.costoTotal === minCosto) return 'Aproximación de Vogel'
  return ''
}
</script>

<template>
  <div class="transporte-container">
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
        <h2>Tutorial Paso a Paso - Problema de Transporte</h2>
        <p class="tutorial-intro">Aprende a resolver problemas de transporte siguiendo estos pasos:</p>

        <div class="tutorial-steps">
          <div class="tutorial-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Identificar Orígenes y Destinos</h3>
              <p>Determina cuántas fábricas/almacenes (orígenes) y cuántas tiendas/clientes (destinos) tienes.</p>
              <div class="step-example">
                <strong>Ejemplo:</strong> 3 fábricas que deben abastecer a 3 tiendas.
              </div>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Definir Oferta y Demanda</h3>
              <p>Especifica cuánto puede producir cada origen y cuánto necesita cada destino.</p>
              <div class="step-example">
                <strong>Ejemplo:</strong><br>
                Oferta: Fábrica 1 = 76, Fábrica 2 = 82, Fábrica 3 = 77<br>
                Demanda: Tienda 1 = 72, Tienda 2 = 102, Tienda 3 = 41
              </div>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Establecer Costos de Transporte</h3>
              <p>Define el costo de enviar una unidad desde cada origen a cada destino.</p>
              <div class="step-example">
                <strong>Ejemplo:</strong> El costo de enviar de Fábrica 1 a Tienda 1 es $4 por unidad.
              </div>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Verificar Balance</h3>
              <p>Asegúrate de que la oferta total sea igual a la demanda total.</p>
              <div class="step-example">
                <strong>Importante:</strong> Si no están balanceados, necesitarás agregar un origen o destino ficticio.
              </div>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">5</div>
            <div class="step-content">
              <h3>Elegir un Método</h3>
              <p>Selecciona el método de solución inicial (Esquina Noroeste, Costo Mínimo, o Vogel).</p>
            </div>
          </div>

          <div class="tutorial-step">
            <div class="step-number">6</div>
            <div class="step-content">
              <h3>Usar la Calculadora</h3>
              <p>Ingresa todos los datos en la pestaña "Calculadora" y obtén la solución óptima.</p>
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
        <MethodExplanation :selectedMethod="'penalizacion'" />
      </div>
    </div>

    <!-- Contenido: Calculadora -->
    <div v-else class="tab-content">
    <!-- Configuración del problema -->
    <div v-if="!mostrarSoluciones" class="config-section">
      <div class="section-header">
        <h2>Configurar Problema de Transporte</h2>
        <p class="subtitle">Encuentra la solución inicial óptima para minimizar costos de distribución</p>
      </div>

      <!-- Explicación del problema -->
      <div class="problem-explanation">
        <div class="explanation-card">
          <h3>¿Qué es un Problema de Transporte?</h3>
          <p>El problema de transporte busca determinar cómo distribuir productos desde varios <strong>orígenes</strong> (fábricas, almacenes)
          hacia varios <strong>destinos</strong> (tiendas, clientes) de forma que se <strong>minimice el costo total</strong> de transporte.</p>
        </div>

        <div class="data-requirements">
          <h4>Datos que debes proporcionar:</h4>
          <div class="requirement-grid">
            <div class="requirement-item">
              <div class="requirement-number">1</div>
              <div class="requirement-content">
                <strong>Dimensiones del problema</strong>
                <p>Cantidad de orígenes y destinos</p>
              </div>
            </div>
            <div class="requirement-item">
              <div class="requirement-number">2</div>
              <div class="requirement-content">
                <strong>Costos de transporte</strong>
                <p>Costo por unidad desde cada origen a cada destino</p>
              </div>
            </div>
            <div class="requirement-item">
              <div class="requirement-number">3</div>
              <div class="requirement-content">
                <strong>Oferta disponible</strong>
                <p>Capacidad o cantidad disponible en cada origen</p>
              </div>
            </div>
            <div class="requirement-item">
              <div class="requirement-number">4</div>
              <div class="requirement-content">
                <strong>Demanda requerida</strong>
                <p>Cantidad necesaria en cada destino</p>
              </div>
            </div>
          </div>
          <div class="important-note">
            <strong>Importante:</strong> La suma total de la oferta DEBE ser igual a la suma total de la demanda (problema balanceado).
          </div>
        </div>
      </div>

      <!-- Dimensiones -->
      <div class="dimensions-config">
        <h3>Paso 1: Define las dimensiones del problema</h3>
        <div class="dimensions-inputs">
          <div class="dimension-input">
            <label>
              <span class="label-title">Número de Orígenes (m):</span>
              <span class="label-help">¿Cuántas fábricas o almacenes tienes?</span>
            </label>
            <input
              type="number"
              v-model.number="numOrigenes"
              min="2"
              max="5"
              @change="actualizarTamanos"
            >
          </div>
          <div class="dimension-input">
            <label>
              <span class="label-title">Número de Destinos (n):</span>
              <span class="label-help">¿Cuántos clientes o tiendas debes abastecer?</span>
            </label>
            <input
              type="number"
              v-model.number="numDestinos"
              min="2"
              max="5"
              @change="actualizarTamanos"
            >
          </div>
          <button @click="cargarEjemplo" class="btn-ejemplo">
            Cargar Ejemplo Completo
          </button>
        </div>
      </div>

      <!-- Tabla de Costos -->
      <div class="table-section">
        <h3>Paso 2: Completa la tabla de costos, oferta y demanda</h3>
        <div class="table-instructions">
          <p><strong>Instrucciones:</strong></p>
          <ul>
            <li><strong>Celdas internas:</strong> Ingresa el costo de transportar UNA unidad desde el origen (fila) al destino (columna)</li>
            <li><strong>Columna "Oferta":</strong> Cantidad total disponible en cada origen</li>
            <li><strong>Fila "Demanda":</strong> Cantidad total requerida en cada destino</li>
          </ul>
        </div>
        <div class="table-container">
          <table class="costos-table">
            <thead>
              <tr>
                <th>Origen \ Destino</th>
                <th v-for="j in numDestinos" :key="`dest-${j}`">D{{ j }}</th>
                <th>Oferta</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in numOrigenes" :key="`origen-${i}`">
                <td class="row-header">O{{ i }}</td>
                <td v-for="j in numDestinos" :key="`celda-${i}-${j}`">
                  <input
                    type="number"
                    v-model.number="costos[i-1][j-1]"
                    min="0"
                    class="costo-input"
                  >
                </td>
                <td>
                  <input
                    type="number"
                    v-model.number="oferta[i-1]"
                    min="0"
                    class="oferta-input"
                  >
                </td>
              </tr>
              <tr class="demanda-row">
                <td class="row-header">Demanda</td>
                <td v-for="j in numDestinos" :key="`demanda-${j}`">
                  <input
                    type="number"
                    v-model.number="demanda[j-1]"
                    min="0"
                    class="demanda-input"
                  >
                </td>
                <td class="balance-cell" :class="{ balanced: esBalanceado, unbalanced: !esBalanceado }">
                  {{ esBalanceado ? 'OK' : 'X' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Validación de balance -->
        <div class="balance-info" :class="{ balanced: esBalanceado, unbalanced: !esBalanceado }">
          <div class="balance-item">
            <strong>Total Oferta:</strong> {{ totalOferta }}
          </div>
          <div class="balance-item">
            <strong>Total Demanda:</strong> {{ totalDemanda }}
          </div>
          <div class="balance-item">
            <strong>Balance:</strong>
            <span v-if="esBalanceado" class="balanced-text">Balanceado</span>
            <span v-else class="unbalanced-text">No Balanceado (Diferencia: {{ Math.abs(totalOferta - totalDemanda) }})</span>
          </div>
        </div>
      </div>

      <!-- Selección de método -->
      <div class="method-selection">
        <h3>Paso 3: Selecciona el método de solución</h3>
        <p class="method-help">Todos los métodos buscan MINIMIZAR el costo total de transporte. Elige uno o compara todos.</p>
        <div class="method-buttons">
          <button
            @click="metodoSeleccionado = 'esquina'"
            :class="{ active: metodoSeleccionado === 'esquina' }"
            class="method-btn"
          >
            <span class="method-name">Esquina Noroeste</span>
            <span class="method-desc">Método simple y rápido</span>
          </button>
          <button
            @click="metodoSeleccionado = 'costo'"
            :class="{ active: metodoSeleccionado === 'costo' }"
            class="method-btn"
          >
            <span class="method-name">Costo Mínimo</span>
            <span class="method-desc">Busca costos bajos primero</span>
          </button>
          <button
            @click="metodoSeleccionado = 'vogel'"
            :class="{ active: metodoSeleccionado === 'vogel' }"
            class="method-btn"
          >
            <span class="method-name">Aproximación de Vogel</span>
            <span class="method-desc">El más eficiente (recomendado)</span>
          </button>
          <button
            @click="metodoSeleccionado = 'todos'"
            :class="{ active: metodoSeleccionado === 'todos' }"
            class="method-btn method-btn-all"
          >
            <span class="method-name">Comparar Todos</span>
            <span class="method-desc">Ver los 3 métodos y comparar</span>
          </button>
        </div>
      </div>

      <!-- Botón resolver -->
      <div class="action-buttons">
        <button @click="resolver" class="btn-resolver" :disabled="!esBalanceado">
          <span v-if="esBalanceado">Resolver y Minimizar Costos</span>
          <span v-else>El problema debe estar balanceado primero</span>
        </button>
        <p v-if="!esBalanceado" class="balance-warning">
          Ajusta la oferta o demanda para que las sumas coincidan
        </p>
      </div>
    </div>

    <!-- Soluciones -->
    <div v-else class="solutions-section">
      <div class="solutions-header">
        <h2>Soluciones del Problema de Transporte</h2>
        <div class="header-buttons">
          <button @click="exportarPDF" class="btn-export">Exportar PDF</button>
          <button @click="reiniciar" class="btn-back">← Nuevo Problema</button>
        </div>
      </div>

      <!-- Esquina Noroeste -->
      <div v-if="soluciones.esquinaNoroeste" class="solution-card">
        <div class="solution-header">
          <h3>Método de la Esquina Noroeste</h3>
          <p class="method-description">Método simple que comienza asignando desde la esquina superior izquierda (noroeste), asignando la máxima cantidad posible en cada celda.</p>
        </div>

        <div class="solution-content">
          <div class="solution-summary">
            <div class="summary-item">
              <span class="summary-label">Costo Total:</span>
              <span class="summary-value costo-destacado">{{ soluciones.esquinaNoroeste.costoTotal }}</span>
            </div>
          </div>

          <div class="solution-table">
            <h4>Tabla de Asignación</h4>
            <table class="resultado-table">
              <thead>
                <tr>
                  <th>O\D</th>
                  <th v-for="j in numDestinos" :key="`d-${j}`">D{{ j }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in numOrigenes" :key="`o-${i}`">
                  <td class="row-header">O{{ i }}</td>
                  <td v-for="j in numDestinos" :key="`c-${i}-${j}`">
                    <span v-if="soluciones.esquinaNoroeste.asignacion[i-1][j-1] > 0" class="asignacion-activa">
                      {{ soluciones.esquinaNoroeste.asignacion[i-1][j-1] }}
                      <br>
                      <small>(Costo: {{ costos[i-1][j-1] }})</small>
                    </span>
                    <span v-else class="asignacion-vacia">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button @click="mostrarPasosEsquina = !mostrarPasosEsquina" class="btn-toggle-pasos">
            {{ mostrarPasosEsquina ? 'Ocultar Pasos Detallados' : 'Ver Pasos Detallados' }}
          </button>

          <div v-if="mostrarPasosEsquina" class="pasos-detalle">
            <h4>Pasos del Algoritmo:</h4>
            <div v-for="(paso, index) in soluciones.esquinaNoroeste.pasos" :key="index" class="paso-item">
              <div class="paso-numero">Paso {{ index + 1 }}</div>
              <p>{{ paso.explicacion }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Costo Mínimo -->
      <div v-if="soluciones.costoMinimo" class="solution-card">
        <div class="solution-header">
          <h3>Método del Costo Mínimo</h3>
          <p class="method-description">Busca primero las rutas con menor costo y asigna la máxima cantidad posible, priorizando siempre los costos más bajos.</p>
        </div>

        <div class="solution-content">
          <div class="solution-summary">
            <div class="summary-item">
              <span class="summary-label">Costo Total:</span>
              <span class="summary-value costo-destacado">{{ soluciones.costoMinimo.costoTotal }}</span>
            </div>
          </div>

          <div class="solution-table">
            <h4>Tabla de Asignación</h4>
            <table class="resultado-table">
              <thead>
                <tr>
                  <th>O\D</th>
                  <th v-for="j in numDestinos" :key="`d-${j}`">D{{ j }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in numOrigenes" :key="`o-${i}`">
                  <td class="row-header">O{{ i }}</td>
                  <td v-for="j in numDestinos" :key="`c-${i}-${j}`">
                    <span v-if="soluciones.costoMinimo.asignacion[i-1][j-1] > 0" class="asignacion-activa">
                      {{ soluciones.costoMinimo.asignacion[i-1][j-1] }}
                      <br>
                      <small>(Costo: {{ costos[i-1][j-1] }})</small>
                    </span>
                    <span v-else class="asignacion-vacia">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button @click="mostrarPasosCosto = !mostrarPasosCosto" class="btn-toggle-pasos">
            {{ mostrarPasosCosto ? 'Ocultar Pasos Detallados' : 'Ver Pasos Detallados' }}
          </button>

          <div v-if="mostrarPasosCosto" class="pasos-detalle">
            <h4>Pasos del Algoritmo:</h4>
            <div v-for="(paso, index) in soluciones.costoMinimo.pasos" :key="index" class="paso-item">
              <div class="paso-numero">Paso {{ index + 1 }}</div>
              <p>{{ paso.explicacion }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vogel -->
      <div v-if="soluciones.vogel" class="solution-card">
        <div class="solution-header">
          <h3>Método de Aproximación de Vogel (VAM)</h3>
          <p class="method-description">Método más eficiente que calcula penalizaciones (diferencias entre los dos menores costos) y asigna donde hay mayor penalización, minimizando el costo de no elegir la mejor opción.</p>
        </div>

        <div class="solution-content">
          <div class="solution-summary">
            <div class="summary-item">
              <span class="summary-label">Costo Total:</span>
              <span class="summary-value costo-destacado">{{ soluciones.vogel.costoTotal }}</span>
            </div>
          </div>

          <div class="solution-table">
            <h4>Tabla de Asignación</h4>
            <table class="resultado-table">
              <thead>
                <tr>
                  <th>O\D</th>
                  <th v-for="j in numDestinos" :key="`d-${j}`">D{{ j }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in numOrigenes" :key="`o-${i}`">
                  <td class="row-header">O{{ i }}</td>
                  <td v-for="j in numDestinos" :key="`c-${i}-${j}`">
                    <span v-if="soluciones.vogel.asignacion[i-1][j-1] > 0" class="asignacion-activa">
                      {{ soluciones.vogel.asignacion[i-1][j-1] }}
                      <br>
                      <small>(Costo: {{ costos[i-1][j-1] }})</small>
                    </span>
                    <span v-else class="asignacion-vacia">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button @click="mostrarPasosVogel = !mostrarPasosVogel" class="btn-toggle-pasos">
            {{ mostrarPasosVogel ? 'Ocultar Pasos Detallados' : 'Ver Pasos Detallados' }}
          </button>

          <div v-if="mostrarPasosVogel" class="pasos-detalle">
            <h4>Pasos del Algoritmo:</h4>
            <div v-for="(paso, index) in soluciones.vogel.pasos" :key="index" class="paso-item">
              <div class="paso-numero">Paso {{ index + 1 }}</div>
              <p>{{ paso.explicacion }}</p>
              <div v-if="paso.penalizacionFilas" class="penalizaciones">
                <small><strong>Penalizaciones Filas:</strong> {{ paso.penalizacionFilas.filter(p => p >= 0).join(', ') }}</small><br>
                <small><strong>Penalizaciones Columnas:</strong> {{ paso.penalizacionColumnas.filter(p => p >= 0).join(', ') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparación -->
      <div v-if="soluciones.esquinaNoroeste && soluciones.costoMinimo && soluciones.vogel" class="comparison-card">
        <h3>Comparación de Métodos</h3>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Método</th>
              <th>Costo Total</th>
              <th>Calidad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Esquina Noroeste</td>
              <td>{{ soluciones.esquinaNoroeste.costoTotal }}</td>
              <td>
                <span class="quality-badge" :class="getQualityClass(soluciones.esquinaNoroeste.costoTotal)">
                  {{ getQualityText(soluciones.esquinaNoroeste.costoTotal) }}
                </span>
              </td>
            </tr>
            <tr>
              <td>Costo Mínimo</td>
              <td>{{ soluciones.costoMinimo.costoTotal }}</td>
              <td>
                <span class="quality-badge" :class="getQualityClass(soluciones.costoMinimo.costoTotal)">
                  {{ getQualityText(soluciones.costoMinimo.costoTotal) }}
                </span>
              </td>
            </tr>
            <tr>
              <td>Aproximación de Vogel</td>
              <td>{{ soluciones.vogel.costoTotal }}</td>
              <td>
                <span class="quality-badge" :class="getQualityClass(soluciones.vogel.costoTotal)">
                  {{ getQualityText(soluciones.vogel.costoTotal) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="best-method">
          <h4>Mejor Método: {{ getMejorMetodo() }}</h4>
          <p>Con un costo total de {{ getCostoMinimo() }}</p>
        </div>
      </div>
    </div>
    </div>
    <!-- Fin tab-content calculadora -->
  </div>
</template>

<style scoped>
.transporte-container {
  max-width: 1200px;
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

/* Theory Section */
.theory-section {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.theory-section h2 {
  color: #1e40af;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.theory-block {
  margin-bottom: 2.5rem;
}

.theory-block h3 {
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.theory-block p {
  color: #475569;
  line-height: 1.8;
  font-size: 1.05rem;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.component-card {
  background: #f0f7ff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #3b82f6;
}

.component-card h4 {
  color: #1e40af;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.component-card p {
  color: #64748b;
  font-size: 0.95rem;
}

.methods-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.method-card {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.method-card h4 {
  color: #1e40af;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.method-card p {
  color: #475569;
  margin-bottom: 0.5rem;
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
  border-left: 4px solid #f59e0b;
  transition: all 0.3s;
}

.tutorial-step:hover {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
  transform: translateX(5px);
}

.step-number {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: #f59e0b;
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
  border: 2px solid #fef3c7;
  margin-top: 0.75rem;
}

.step-example strong {
  color: #92400e;
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

.transporte-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: #dfe9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.95rem;
  color: #020202;
  margin-bottom: 0;
}

.dimensions-config {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.dimension-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dimension-input label {
  font-weight: 600;
}

.dimension-input input {
  width: 80px;
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 6px;
}

.btn-ejemplo {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.table-section {
  margin-bottom: 2rem;
}

.table-section h3 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.table-container {
  overflow-x: auto;
}

.costos-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.costos-table th,
.costos-table td {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #ddd;
}

.costos-table th {
  background: #3b82f6;
  color: white;
  font-weight: 600;
}

.row-header {
  background: #eff6ff;
  font-weight: 600;
}

.costo-input,
.oferta-input,
.demanda-input {
  width: 80px;
  padding: 0.4rem;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 4px;
}

.demanda-row {
  background: #f8fafc;
}

.balance-cell {
  font-size: 1.5rem;
  font-weight: bold;
}

.balance-cell.balanced {
  color: #10b981;
}

.balance-cell.unbalanced {
  color: #ef4444;
}

.balance-info {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  justify-content: center;
}

.balance-info.balanced {
  background: #d1fae5;
  border: 2px solid #10b981;
}

.balance-info.unbalanced {
  background: #fee2e2;
  border: 2px solid #ef4444;
}

.balanced-text {
  color: #10b981;
  font-weight: 600;
}

.unbalanced-text {
  color: #ef4444;
  font-weight: 600;
}

.method-selection {
  margin-bottom: 2rem;
}

.method-selection h3 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.method-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.method-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.method-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.method-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.method-btn-all.active {
  background: #1e40af;
  border-color: #1e40af;
}

.action-buttons {
  text-align: center;
}

.btn-resolver {
  padding: 1rem 3rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-resolver:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
}

.btn-resolver:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.solutions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.solutions-header h2 {
  color: #1e40af;
  font-size: 2rem;
}

.header-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-export {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-export:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #eff6ff;
  transform: translateX(-3px);
}

.solution-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.solution-card h3 {
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.solution-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.method-description {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0.5rem 0 0 0;
}

.solution-summary {
  background: #f0f7ff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.summary-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.summary-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e40af;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.costo-destacado {
  color: #10b981;
  background: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  border: 2px solid #10b981;
}

.btn-toggle-pasos {
  width: 100%;
  padding: 1rem;
  margin: 1.5rem 0;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-toggle-pasos:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.resultado-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.resultado-table th,
.resultado-table td {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #ddd;
}

.resultado-table th {
  background: #3b82f6;
  color: white;
}

.asignacion-activa {
  font-weight: 700;
  color: #10b981;
}

.asignacion-vacia {
  color: #cbd5e1;
}

.costo-total {
  text-align: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #eff6ff;
  border-radius: 8px;
}

.costo-valor {
  color: #1e40af;
  font-size: 1.5rem;
}

.pasos-detalle {
  margin-top: 1.5rem;
}

.paso-item {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
}

.paso-numero {
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.penalizaciones {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #e0f2fe;
  border-radius: 4px;
}

.comparison-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.comparison-card h3 {
  color: #1e40af;
  margin-bottom: 1.5rem;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin-bottom: 1.5rem;
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: center;
  border: 1px solid #ddd;
}

.comparison-table th {
  background: #1e40af;
  color: white;
}

.quality-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
}

.quality-badge.quality-best {
  background: #d1fae5;
  color: #10b981;
}

.quality-badge.quality-medium {
  background: #dbeafe;
  color: #3b82f6;
}

.quality-badge.quality-worst {
  background: #fef3c7;
  color: #f59e0b;
}

.quality-badge.regular {
  background: #fef3c7;
  color: #f59e0b;
}

.best-method {
  text-align: center;
  padding: 1rem;
  background: #d1fae5;
  border: 2px solid #10b981;
  border-radius: 8px;
}

.best-method h4 {
  color: #10b981;
  margin-bottom: 0.5rem;
}

/* Responsive para botones de header */
@media (max-width: 768px) {
  .solutions-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn-export,
  .btn-back {
    width: 100%;
    justify-content: center;
  }
}

/* Estilos para la nueva interfaz mejorada */
.problem-explanation {
  margin: 2rem 0;
  background: #f0f9ff;
  border-radius: 12px;
  padding: 2.5rem;
  border: 3px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.explanation-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  border: 2px solid #93c5fd;
  margin-bottom: 2rem;
}

.explanation-card h3 {
  color: #1e40af;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #3b82f6;
}

.explanation-card p {
  font-size: 1.1rem;
  line-height: 1.9;
  color: #1e293b;
}

.data-requirements {
  margin-top: 2rem;
}

.data-requirements h4 {
  color: #1e40af;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  border-left: 4px solid #3b82f6;
}

.requirement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.requirement-item {
  display: flex;
  gap: 1.25rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 3px solid #bfdbfe;
  transition: all 0.3s ease;
}

.requirement-item:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.25);
}

.requirement-number {
  width: 3rem;
  height: 3rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

.requirement-content strong {
  display: block;
  color: #1e40af;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.requirement-content p {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.important-note {
  background: #fef3c7;
  border: 3px solid #f59e0b;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  color: #92400e;
  font-size: 1.1rem;
}

.important-note strong {
  color: #78350f;
  font-size: 1.15rem;
}

.dimensions-config,
.table-section,
.method-selection {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  margin: 1.5rem 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.dimensions-config h3,
.table-section h3,
.method-selection h3 {
  color: #1e40af;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 4px solid #3b82f6;
  font-weight: 700;
}

.dimensions-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 2rem;
  align-items: end;
}

.dimension-input {
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 10px;
  border: 2px solid #cbd5e1;
}

.dimension-input label {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.label-title {
  font-weight: 700;
  color: #1e40af;
  font-size: 1.1rem;
}

.label-help {
  font-size: 0.95rem;
  color: #64748b;
  font-style: italic;
  background: white;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.table-instructions {
  background: #dbeafe;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 3px solid #3b82f6;
}

.table-instructions p {
  margin: 0 0 1rem 0;
  color: #1e40af;
  font-weight: 700;
  font-size: 1.15rem;
}

.table-instructions ul {
  margin: 0;
  padding-left: 2rem;
}

.table-instructions li {
  color: #1e293b;
  line-height: 1.9;
  margin: 0.75rem 0;
  font-size: 1.05rem;
}

.table-instructions li strong {
  color: #1e40af;
}

.method-help {
  color: #475569;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  font-weight: 500;
}

.method-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-width: 3px;
}

.method-name {
  font-size: 1.15rem;
  font-weight: 700;
}

.method-desc {
  font-size: 0.95rem;
  color: #64748b;
  text-align: center;
  font-weight: 500;
}

.method-btn.active .method-desc {
  color: white;
}

.balance-warning {
  color: #dc2626;
  font-weight: 700;
  text-align: center;
  margin-top: 1rem;
  font-size: 1.15rem;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 8px;
  border: 2px solid #dc2626;
}

.btn-resolver {
  font-size: 1.2rem;
  padding: 1.25rem 3rem;
  font-weight: 700;
  border: 3px solid #10b981;
}

.btn-resolver:hover:not(:disabled) {
  border-color: #059669;
}

.btn-resolver:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #cbd5e1;
}

@media (max-width: 768px) {
  .requirement-grid {
    grid-template-columns: 1fr;
  }

  .dimensions-inputs {
    grid-template-columns: 1fr;
  }

  .problem-explanation {
    padding: 1.5rem;
  }

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

  .method-buttons {
    flex-direction: column;
  }

  .method-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .transporte-container {
    padding: 0.75rem;
  }

  .section-header {
    max-width: 100%;
    padding: 1rem;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  /* Tabs responsive */
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

  /* Explicación del problema */
  .problem-explanation {
    padding: 1rem;
    margin: 1rem 0;
  }

  .explanation-card {
    padding: 1rem;
    margin-bottom: 1.25rem;
  }

  .explanation-card h3 {
    font-size: 1.15rem;
  }

  .explanation-card p {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .data-requirements h4 {
    font-size: 1.1rem;
    padding-left: 0.75rem;
  }

  .requirement-item {
    padding: 1rem;
    gap: 0.75rem;
  }

  .requirement-number {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1rem;
  }

  .requirement-content strong {
    font-size: 0.95rem;
  }

  .requirement-content p {
    font-size: 0.88rem;
  }

  .important-note {
    padding: 1rem;
    font-size: 0.95rem;
  }

  /* Configuración de dimensiones */
  .dimensions-config,
  .table-section,
  .method-selection {
    padding: 1rem;
    margin: 1rem 0;
  }

  .dimensions-config h3,
  .table-section h3,
  .method-selection h3 {
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }

  .dimension-input {
    padding: 0.75rem;
  }

  .label-title {
    font-size: 0.95rem;
  }

  .label-help {
    font-size: 0.85rem;
  }

  .dimension-input input {
    width: 70px;
  }

  /* Tabla de costos */
  .table-instructions {
    padding: 1rem;
  }

  .table-instructions p {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .table-instructions li {
    font-size: 0.9rem;
    line-height: 1.7;
    margin: 0.5rem 0;
  }

  .costos-table th,
  .costos-table td {
    padding: 0.4rem;
    font-size: 0.85rem;
  }

  .costo-input,
  .oferta-input,
  .demanda-input {
    width: 60px;
    padding: 0.3rem;
    font-size: 0.85rem;
  }

  .balance-info {
    gap: 1rem;
    padding: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .balance-cell {
    font-size: 1.2rem;
  }

  /* Métodos */
  .method-help {
    font-size: 0.95rem;
    padding: 0.75rem;
  }

  .method-btn {
    padding: 1rem;
  }

  .method-name {
    font-size: 1rem;
  }

  .method-desc {
    font-size: 0.85rem;
  }

  .balance-warning {
    font-size: 1rem;
    padding: 0.6rem;
  }

  /* Botón resolver */
  .btn-resolver {
    padding: 1rem 2rem;
    font-size: 1.05rem;
  }

  /* Soluciones */
  .solutions-header h2 {
    font-size: 1.3rem;
  }

  .solution-card {
    padding: 1.25rem;
  }

  .solution-card h3 {
    font-size: 1.2rem;
  }

  .method-description {
    font-size: 0.88rem;
  }

  .solution-summary {
    padding: 1rem;
  }

  .summary-label {
    font-size: 0.95rem;
  }

  .summary-value {
    font-size: 1.2rem;
  }

  .resultado-table th,
  .resultado-table td {
    padding: 0.5rem;
    font-size: 0.85rem;
  }

  .costo-valor {
    font-size: 1.2rem;
  }

  .paso-item {
    padding: 0.75rem;
  }

  /* Comparación */
  .comparison-card {
    padding: 1.25rem;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 0.6rem 0.5rem;
    font-size: 0.85rem;
  }

  /* Teoría */
  .theory-section,
  .tutorial-section {
    padding: 1.25rem;
  }

  .theory-section h2,
  .tutorial-section h2 {
    font-size: 1.4rem;
    margin-bottom: 1.25rem;
  }

  .theory-block h3 {
    font-size: 1.2rem;
  }

  .theory-block p {
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .component-card {
    padding: 1rem;
  }

  .component-card h4 {
    font-size: 1rem;
  }

  .method-card {
    padding: 1rem;
  }

  .method-card h4 {
    font-size: 1rem;
  }

  /* Tutorial */
  .tutorial-intro {
    font-size: 0.95rem;
  }

  .tutorial-step {
    gap: 1rem;
    padding: 1rem;
  }

  .step-number {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .step-content h3 {
    font-size: 1.1rem;
  }

  .step-content p {
    font-size: 0.9rem;
  }

  .btn-go-calculator {
    padding: 1rem;
    font-size: 1rem;
  }

  .btn-export,
  .btn-back {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
