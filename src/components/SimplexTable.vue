<script setup>
// Componente de tabla Simplex
import { computed } from 'vue'
import { formatNumber } from '../utils/formatters.js'

const props = defineProps({
  tableau: Array,
  iteration: Number,
  pivotRow: Number,
  pivotCol: Number,
  isOptimal: Boolean,
  numOriginalVars: Number,
  compact: {
    type: Boolean,
    default: false
  }
})

// Reorganizar el tableau para que Z esté primero
const reorderedTableau = computed(() => {
  if (!props.tableau || props.tableau.length === 0) return []

  const zRow = props.tableau[props.tableau.length - 1]
  const otherRows = props.tableau.slice(0, -1)

  return [zRow, ...otherRows]
})

const getColumnHeader = (index) => {
  if (index < props.numOriginalVars) {
    return `X<sub>${index + 1}</sub>`
  } else if (index === props.tableau[0].length - 1) {
    return 'LD'
  } else {
    return `S<sub>${index - props.numOriginalVars + 1}</sub>`
  }
}

const getRowHeader = (displayIndex) => {
  // displayIndex es el índice en la tabla reordenada
  if (displayIndex === 0) {
    return 'Z'
  } else {
    // Encontrar qué variable es básica en esta fila
    const originalRowIndex = getOriginalIndex(displayIndex)
    const basicVar = findBasicVariableInRow(originalRowIndex)
    return basicVar || `S<sub>${displayIndex}</sub>`
  }
}

// Encontrar la variable básica en una fila específica
const findBasicVariableInRow = (rowIndex) => {
  if (!props.tableau || rowIndex < 0 || rowIndex >= props.tableau.length - 1) return null

  const numCols = props.tableau[0].length - 1
  const numRows = props.tableau.length - 1

  // Buscar columna con 1 en esta fila y 0 en las demás
  for (let j = 0; j < numCols; j++) {
    if (Math.abs(props.tableau[rowIndex][j] - 1) < 0.0001) {
      // Verificar que sea la única fila con 1 en esta columna
      let isBasic = true
      for (let i = 0; i < numRows; i++) {
        if (i !== rowIndex && Math.abs(props.tableau[i][j]) > 0.0001) {
          isBasic = false
          break
        }
      }

      if (isBasic) {
        // Esta es la variable básica
        if (j < props.numOriginalVars) {
          return `X<sub>${j + 1}</sub>`
        } else {
          return `S<sub>${j - props.numOriginalVars + 1}</sub>`
        }
      }
    }
  }

  return null
}

// Convertir el índice de la tabla reordenada al índice original
const getOriginalIndex = (displayIndex) => {
  if (displayIndex === 0) {
    return props.tableau.length - 1 // Z row
  } else {
    return displayIndex - 1 // Otras filas
  }
}

const isCellHighlighted = (displayIndex, colIndex) => {
  if (props.pivotRow === undefined || props.pivotCol === undefined) return false
  const originalIndex = getOriginalIndex(displayIndex)
  return originalIndex === props.pivotRow || colIndex === props.pivotCol
}

const isPivotCell = (displayIndex, colIndex) => {
  if (props.pivotRow === undefined || props.pivotCol === undefined) return false
  const originalIndex = getOriginalIndex(displayIndex)
  return originalIndex === props.pivotRow && colIndex === props.pivotCol
}

const isZRow = (displayIndex) => {
  return displayIndex === 0
}
</script>

<template>
  <div class="simplex-table-container" :class="{ compact: compact }">
    <div class="table-wrapper">
      <table class="simplex-table" role="table" aria-label="Tabla del Método Simplex">
        <thead>
          <tr role="row">
            <th class="header-cell" scope="col">V.B</th>
            <th
              v-for="(_, colIndex) in tableau[0]"
              :key="'header-' + colIndex"
              class="header-cell"
              :class="{
                'pivot-col': colIndex === pivotCol && !isOptimal,
                'rhs-col': colIndex === tableau[0].length - 1
              }"
            >
              <span v-html="getColumnHeader(colIndex)"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, displayIndex) in reorderedTableau"
            :key="'row-' + displayIndex"
            :class="{
              'pivot-row': getOriginalIndex(displayIndex) === pivotRow && !isOptimal,
              'z-row': isZRow(displayIndex),
              'optimal-row': isZRow(displayIndex) && isOptimal
            }"
          >
            <td class="row-header" :class="{ 'z-row-header': isZRow(displayIndex) }">
              <span v-html="getRowHeader(displayIndex)"></span>
            </td>
            <td
              v-for="(cell, colIndex) in row"
              :key="'cell-' + displayIndex + '-' + colIndex"
              class="data-cell"
              :class="{
                'highlighted': isCellHighlighted(displayIndex, colIndex) && !isOptimal,
                'pivot-cell': isPivotCell(displayIndex, colIndex) && !isOptimal,
                'rhs-cell': colIndex === row.length - 1,
                'z-cell': isZRow(displayIndex)
              }"
            >
              {{ formatNumber(cell) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!compact && pivotRow !== undefined && pivotCol !== undefined && !isOptimal" class="pivot-info">
      <div class="pivot-info-header">
        <span class="pivot-title">Información del Pivote</span>
      </div>
      <div class="pivot-details">
        <div class="info-item">
          <span class="info-label">Elemento Pivote:</span>
          <span class="info-value pivot-highlight">{{ formatNumber(tableau[pivotRow][pivotCol]) }}</span>
        </div>
        <div class="info-separator"></div>
        <div class="info-item">
          <span class="info-label">Ubicación:</span>
          <span class="info-value">Fila {{ pivotRow + 1 }}, Columna {{ pivotCol + 1 }}</span>
        </div>
      </div>
    </div>

    <div v-if="!compact && isOptimal" class="optimal-indicator">
      <span class="optimal-icon">[ÓPTIMA]</span>
      <div class="optimal-content">
        <span class="optimal-title">Solución Óptima</span>
        <span class="optimal-subtitle">Todos los coeficientes de la fila Z son ≥ 0</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.simplex-table-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.simplex-table-container.compact {
  padding: 1rem;
}

.table-wrapper {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.simplex-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
}

.compact .simplex-table {
  font-size: 0.85rem;
}

.header-cell {
  background: linear-gradient(#1e3a8a 100%);
  color: white;
  padding: 0.75rem;
  font-weight: 600;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 10;
}

.compact .header-cell {
  padding: 0.5rem;
  font-size: 0.85rem;
}

.header-cell.pivot-col {
  background: #3b82f6;
  animation: pulse 1.5s infinite;
}

.header-cell.rhs-col {
  background: #4caf50;
}

.row-header {
  background: #f0f0f0;
  font-weight: 600;
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #ddd;
  color: #1e40af;
  min-width: 60px;
}

.compact .row-header {
  padding: 0.5rem;
}

.row-header.z-row-header {
  background: linear-gradient( #1e3a8a 100%);
  color: white;
  font-weight: 700;
}

.data-cell {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #ddd;
  background: white;
  transition: all 0.3s;
}

.compact .data-cell {
  padding: 0.5rem;
}

.data-cell.highlighted {
  background: #fff9e6;
}

.data-cell.pivot-cell {
  background: #3b82f6;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  animation: pulse 1.5s infinite;
}

.data-cell.rhs-cell {
  background: #e8f5e9;
  font-weight: 600;
}

.data-cell.z-cell {
  background: #eff6ff;
  font-weight: 600;
}

.pivot-row {
  background: #dbeafe;
}

.z-row {
  background: #eff6ff;
  font-weight: 600;
}

.optimal-row {
  background: #e8f5e9;
}

.pivot-info {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-radius: 12px;
  margin-top: 1.5rem;
  border: 2px solid #3b82f6;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.pivot-info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #3b82f6;
  color: white;
}

.pivot-icon {
  font-size: 1.5rem;
}

.pivot-title {
  font-weight: 700;
  font-size: 1.1rem;
}

.pivot-details {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1.25rem;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.info-label {
  font-weight: 600;
  color: #898787;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-weight: 700;
  color: #333;
  font-size: 1.2rem;
  font-family: 'Courier New', monospace;
}

.pivot-highlight {
  color: #1e40af;
  font-size: 1.8rem;
  text-shadow: 0 2px 4px rgba(30, 64, 175, 0.3);
}

.info-separator {
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, #3b82f6, transparent);
}

.optimal-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 12px;
  border: 2px solid #4caf50;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.optimal-icon {
  font-size: 2rem;
}

.optimal-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.optimal-title {
  font-weight: 700;
  font-size: 1.2rem;
  color: #2e7d32;
}

.optimal-subtitle {
  font-size: 0.95rem;
  color: #558b2f;
  font-style: italic;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 152, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 152, 0, 0.8);
  }
}

.simplex-table {
  animation: slideIn 0.5s ease-out;
}

.data-cell.pivot-cell {
  animation: pulse 1.5s infinite, glow 2s infinite;
}

@media (max-width: 768px) {
  .simplex-table {
    font-size: 0.8rem;
  }

  .header-cell,
  .row-header,
  .data-cell {
    padding: 0.5rem 0.25rem;
  }

  .pivot-details {
    flex-direction: column;
    gap: 1rem;
  }

  .info-separator {
    width: 60%;
    height: 2px;
    background: linear-gradient(to right, transparent, #3b82f6, transparent);
  }

  .optimal-indicator {
    flex-direction: column;
    text-align: center;
  }
}
</style>