// Métodos para Problemas de Transporte
// 1. Método de la Esquina Noroeste
// 2. Método del Costo Mínimo
// 3. Método de Aproximación de Vogel (VAM)

import { formatNumber } from './formatters.js'

/**
 * Clase para resolver problemas de transporte
 */
export class TransporteSolver {
  constructor(problemData) {
    this.problemData = problemData
    this.iterations = []
    this.finalSolution = null
    this.status = null
  }

  calcularCostoTotal(asignacion, costos) {
    let total = 0
    for (let i = 0; i < asignacion.length; i++) {
      for (let j = 0; j < asignacion[i].length; j++) {
        total += asignacion[i][j] * costos[i][j]
      }
    }
    return total
  }

  /**
   * Formatea un número para mostrar
   */
  formatNumber(numero) {
    return formatNumber(numero)
  }

  /**
   * Copia profunda de una matriz
   */
  copyMatrix(matrix) {
    return matrix.map(row => [...row])
  }

  /**
   * MÉTODO 1: ESQUINA NOROESTE (Northwest Corner Method)
   * Algoritmo: Comienza en la esquina superior izquierda y asigna la máxima cantidad posible
   */
  esquinaNoroeste(costos, oferta, demanda) {
    const m = oferta.length // número de orígenes
    const n = demanda.length // número de destinos

    // Copiar arrays para no modificar los originales
    let ofertaRestante = [...oferta]
    let demandaRestante = [...demanda]

    // Matriz de asignación (solución)
    let asignacion = Array(m).fill(null).map(() => Array(n).fill(0))

    // Historial de pasos
    let pasos = []

    let i = 0, j = 0

    while (i < m && j < n) {
      // Asignar el mínimo entre oferta y demanda
      const cantidad = Math.min(ofertaRestante[i], demandaRestante[j])
      asignacion[i][j] = cantidad

      // Registrar paso
      pasos.push({
        origen: i,
        destino: j,
        cantidad,
        costo: costos[i][j],
        ofertaRestante: [...ofertaRestante],
        demandaRestante: [...demandaRestante],
        explicacion: `Asignar ${cantidad} unidades de Origen ${i+1} a Destino ${j+1} (Costo: ${costos[i][j]})`
      })

      // Actualizar oferta y demanda
      ofertaRestante[i] -= cantidad
      demandaRestante[j] -= cantidad

      // Mover al siguiente origen o destino
      if (ofertaRestante[i] === 0) {
        i++
      }
      if (demandaRestante[j] === 0) {
        j++
      }
    }

    const costoTotal = this.calcularCostoTotal(asignacion, costos)

    return {
      metodo: 'Esquina Noroeste',
      asignacion,
      costoTotal,
      pasos,
      explicacion: this.explicarEsquinaNoroeste()
    }
  }

  /**
   * MÉTODO 2: COSTO MÍNIMO (Minimum Cost Method)
   * Algoritmo: Asigna a la celda con el menor costo primero
   */
  costoMinimo(costos, oferta, demanda) {
    const m = oferta.length
    const n = demanda.length

    // Copiar arrays
    let ofertaRestante = [...oferta]
    let demandaRestante = [...demanda]

    // Matriz de asignación
    let asignacion = Array(m).fill(null).map(() => Array(n).fill(0))

    // Historial de pasos
    let pasos = []

    // Crear lista de celdas con sus costos
    let celdas = []
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        celdas.push({ i, j, costo: costos[i][j] })
      }
    }

    // Ordenar por costo ascendente
    celdas.sort((a, b) => a.costo - b.costo)

    // Asignar comenzando por el costo mínimo
    for (let celda of celdas) {
      const { i, j } = celda

      // Si ya no hay oferta o demanda disponible, saltar
      if (ofertaRestante[i] === 0 || demandaRestante[j] === 0) {
        continue
      }

      // Asignar el mínimo entre oferta y demanda
      const cantidad = Math.min(ofertaRestante[i], demandaRestante[j])
      asignacion[i][j] = cantidad

      // Registrar paso
      pasos.push({
        origen: i,
        destino: j,
        cantidad,
        costo: costos[i][j],
        ofertaRestante: [...ofertaRestante],
        demandaRestante: [...demandaRestante],
        explicacion: `Asignar ${cantidad} unidades de Origen ${i+1} a Destino ${j+1} (Costo mínimo: ${costos[i][j]})`
      })

      // Actualizar oferta y demanda
      ofertaRestante[i] -= cantidad
      demandaRestante[j] -= cantidad
    }

    const costoTotal = this.calcularCostoTotal(asignacion, costos)

    return {
      metodo: 'Costo Mínimo',
      asignacion,
      costoTotal,
      pasos,
      explicacion: this.explicarCostoMinimo()
    }
  }

  /**
   * MÉTODO 3: APROXIMACIÓN DE VOGEL (VAM)
   * Algoritmo: Calcula penalizaciones (diferencia entre los dos menores costos) y asigna primero
   * donde la penalización es mayor
   */
  aproximacionVogel(costos, oferta, demanda) {
    const m = oferta.length
    const n = demanda.length

    // Copiar arrays
    let ofertaRestante = [...oferta]
    let demandaRestante = [...demanda]

    // Matriz de asignación
    let asignacion = Array(m).fill(null).map(() => Array(n).fill(0))

    // Historial de pasos
    let pasos = []

    // Arrays para rastrear filas y columnas disponibles
    let filasActivas = Array(m).fill(true)
    let columnasActivas = Array(n).fill(true)

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Verificar si quedan asignaciones por hacer
      let hayOferta = ofertaRestante.some(o => o > 0)
      let hayDemanda = demandaRestante.some(d => d > 0)

      if (!hayOferta || !hayDemanda) {
        break
      }

      // Calcular penalizaciones para filas
      let penalizacionesFilas = []
      for (let i = 0; i < m; i++) {
        if (!filasActivas[i] || ofertaRestante[i] === 0) {
          penalizacionesFilas.push({ valor: -1, indice: i })
          continue
        }

        // Encontrar los dos costos mínimos en esta fila
        let costosFilaActivos = []
        for (let j = 0; j < n; j++) {
          if (columnasActivas[j] && demandaRestante[j] > 0) {
            costosFilaActivos.push(costos[i][j])
          }
        }

        if (costosFilaActivos.length === 0) {
          penalizacionesFilas.push({ valor: -1, indice: i })
        } else if (costosFilaActivos.length === 1) {
          penalizacionesFilas.push({ valor: costosFilaActivos[0], indice: i })
        } else {
          costosFilaActivos.sort((a, b) => a - b)
          const penalizacion = costosFilaActivos[1] - costosFilaActivos[0]
          penalizacionesFilas.push({ valor: penalizacion, indice: i })
        }
      }

      // Calcular penalizaciones para columnas
      let penalizacionesColumnas = []
      for (let j = 0; j < n; j++) {
        if (!columnasActivas[j] || demandaRestante[j] === 0) {
          penalizacionesColumnas.push({ valor: -1, indice: j })
          continue
        }

        // Encontrar los dos costos mínimos en esta columna
        let costosColumnaActivos = []
        for (let i = 0; i < m; i++) {
          if (filasActivas[i] && ofertaRestante[i] > 0) {
            costosColumnaActivos.push(costos[i][j])
          }
        }

        if (costosColumnaActivos.length === 0) {
          penalizacionesColumnas.push({ valor: -1, indice: j })
        } else if (costosColumnaActivos.length === 1) {
          penalizacionesColumnas.push({ valor: costosColumnaActivos[0], indice: j })
        } else {
          costosColumnaActivos.sort((a, b) => a - b)
          const penalizacion = costosColumnaActivos[1] - costosColumnaActivos[0]
          penalizacionesColumnas.push({ valor: penalizacion, indice: j })
        }
      }

      // Encontrar la penalización máxima
      let maxPenalizacionFila = Math.max(...penalizacionesFilas.map(p => p.valor))
      let maxPenalizacionColumna = Math.max(...penalizacionesColumnas.map(p => p.valor))

      let filaSeleccionada = -1
      let columnaSeleccionada = -1

      if (maxPenalizacionFila >= maxPenalizacionColumna) {
        // Seleccionar fila con mayor penalización
        filaSeleccionada = penalizacionesFilas.find(p => p.valor === maxPenalizacionFila).indice

        // En esa fila, encontrar la columna con menor costo
        let minCosto = Infinity
        for (let j = 0; j < n; j++) {
          if (columnasActivas[j] && demandaRestante[j] > 0 && costos[filaSeleccionada][j] < minCosto) {
            minCosto = costos[filaSeleccionada][j]
            columnaSeleccionada = j
          }
        }
      } else {
        // Seleccionar columna con mayor penalización
        columnaSeleccionada = penalizacionesColumnas.find(p => p.valor === maxPenalizacionColumna).indice

        // En esa columna, encontrar la fila con menor costo
        let minCosto = Infinity
        for (let i = 0; i < m; i++) {
          if (filasActivas[i] && ofertaRestante[i] > 0 && costos[i][columnaSeleccionada] < minCosto) {
            minCosto = costos[i][columnaSeleccionada]
            filaSeleccionada = i
          }
        }
      }

      // Asignar cantidad
      const i = filaSeleccionada
      const j = columnaSeleccionada
      const cantidad = Math.min(ofertaRestante[i], demandaRestante[j])
      asignacion[i][j] = cantidad

      // Registrar paso
      pasos.push({
        origen: i,
        destino: j,
        cantidad,
        costo: costos[i][j],
        penalizacionFilas: penalizacionesFilas.map(p => p.valor),
        penalizacionColumnas: penalizacionesColumnas.map(p => p.valor),
        maxPenalizacion: Math.max(maxPenalizacionFila, maxPenalizacionColumna),
        ofertaRestante: [...ofertaRestante],
        demandaRestante: [...demandaRestante],
        explicacion: `Penalización máxima: ${Math.max(maxPenalizacionFila, maxPenalizacionColumna)}. Asignar ${cantidad} unidades de Origen ${i+1} a Destino ${j+1} (Costo: ${costos[i][j]})`
      })

      // Actualizar oferta y demanda
      ofertaRestante[i] -= cantidad
      demandaRestante[j] -= cantidad

      // Desactivar fila o columna si se agotó
      if (ofertaRestante[i] === 0) {
        filasActivas[i] = false
      }
      if (demandaRestante[j] === 0) {
        columnasActivas[j] = false
      }
    }

    const costoTotal = this.calcularCostoTotal(asignacion, costos)

    return {
      metodo: 'Aproximación de Vogel (VAM)',
      asignacion,
      costoTotal,
      pasos,
      explicacion: this.explicarVogel()
    }
  }

  /**
   * Resolver con los tres métodos y comparar
   */
  resolverTodos(costos, oferta, demanda) {
    const resultados = {
      esquinaNoroeste: this.esquinaNoroeste(costos, oferta, demanda),
      costoMinimo: this.costoMinimo(costos, oferta, demanda),
      vogel: this.aproximacionVogel(costos, oferta, demanda)
    }

    return resultados
  }

  /**
   * Explicaciones de cada método
   */
  explicarEsquinaNoroeste() {
    return `
      <div class="explanation-section">
        <h3>MÉTODO DE LA ESQUINA NOROESTE</h3>

        <div class="explanation-block">
          <h4>¿Qué es?</h4>
          <p class="explanation-text">
            El método de la Esquina Noroeste es el más simple para encontrar una solución inicial factible
            en problemas de transporte. Comienza en la celda superior izquierda (esquina noroeste) de la
            tabla de distribución y asigna la máxima cantidad posible.
          </p>
        </div>

        <div class="explanation-block">
          <h4>Algoritmo:</h4>
          <ol>
            <li>Comenzar en la celda (1,1) - esquina superior izquierda</li>
            <li>Asignar el mínimo entre la oferta del origen y la demanda del destino</li>
            <li>Si se agota la oferta, moverse a la siguiente fila</li>
            <li>Si se agota la demanda, moverse a la siguiente columna</li>
            <li>Repetir hasta asignar toda la oferta y demanda</li>
          </ol>
        </div>

        <div class="explanation-block">
          <h4>Ventajas:</h4>
          <ul>
            <li>Muy simple y rápido de aplicar</li>
            <li>Siempre encuentra una solución factible</li>
            <li>No requiere cálculos complejos</li>
          </ul>
        </div>

        <div class="explanation-block">
          <h4>Desventajas:</h4>
          <ul>
            <li>No considera los costos de transporte</li>
            <li>Generalmente produce soluciones con costos más altos</li>
            <li>Requiere optimización posterior con métodos como MODI</li>
          </ul>
        </div>
      </div>
    `
  }

  explicarCostoMinimo() {
    return `
      <div class="explanation-section">
        <h3>MÉTODO DEL COSTO MÍNIMO</h3>

        <div class="explanation-block">
          <h4>¿Qué es?</h4>
          <p class="explanation-text">
            El método del Costo Mínimo busca reducir el costo total desde el inicio asignando primero
            a las rutas más económicas. Es un método más inteligente que la Esquina Noroeste.
          </p>
        </div>

        <div class="explanation-block">
          <h4>Algoritmo:</h4>
          <ol>
            <li>Identificar la celda con el menor costo en toda la tabla</li>
            <li>Asignar el máximo posible a esa celda (mínimo entre oferta y demanda)</li>
            <li>Eliminar la fila o columna que se haya agotado</li>
            <li>Repetir con la siguiente celda de menor costo disponible</li>
            <li>Continuar hasta asignar toda la oferta y demanda</li>
          </ol>
        </div>

        <div class="explanation-block">
          <h4>Ventajas:</h4>
          <ul>
            <li>Considera los costos de transporte desde el inicio</li>
            <li>Produce soluciones iniciales mejores que Esquina Noroeste</li>
            <li>Puede estar cerca de la solución óptima</li>
            <li>Relativamente fácil de aplicar</li>
          </ul>
        </div>

        <div class="explanation-block">
          <h4>Desventajas:</h4>
          <ul>
            <li>Puede quedar atrapado en mínimos locales</li>
            <li>No garantiza la solución óptima</li>
            <li>Requiere ordenar los costos</li>
          </ul>
        </div>
      </div>
    `
  }

  explicarVogel() {
    return `
      <div class="explanation-section">
        <h3>MÉTODO DE APROXIMACIÓN DE VOGEL (VAM)</h3>

        <div class="explanation-block">
          <h4>¿Qué es?</h4>
          <p class="explanation-text">
            El Método de Aproximación de Vogel (VAM) es el más sofisticado de los métodos heurísticos
            para encontrar una solución inicial. Usa el concepto de "penalización" para evitar asignaciones
            costosas y generalmente produce la mejor solución inicial, a menudo muy cercana al óptimo.
          </p>
        </div>

        <div class="explanation-block">
          <h4>Algoritmo:</h4>
          <ol>
            <li>Para cada fila y columna activa, calcular la <strong>penalización</strong>:
                diferencia entre el menor y el segundo menor costo</li>
            <li>Identificar la fila o columna con la mayor penalización</li>
            <li>En esa fila/columna, asignar a la celda con el menor costo</li>
            <li>Asignar el máximo posible (mínimo entre oferta y demanda)</li>
            <li>Eliminar la fila o columna agotada</li>
            <li>Repetir hasta asignar toda la oferta y demanda</li>
          </ol>
        </div>

        <div class="explanation-block">
          <h4>Concepto de Penalización:</h4>
          <p class="explanation-text">
            La penalización representa el <strong>costo adicional</strong> que se incurriría si NO
            se asigna a la celda de menor costo en esa fila/columna. Una penalización alta significa
            que hay una gran diferencia entre la mejor y la segunda mejor opción, por lo que es
            importante tomar la mejor opción ahora.
          </p>
        </div>

        <div class="explanation-block">
          <h4>Ventajas:</h4>
          <ul>
            <li>Produce las mejores soluciones iniciales</li>
            <li>Frecuentemente está muy cerca o es igual a la solución óptima</li>
            <li>Reduce el número de iteraciones necesarias para optimizar</li>
            <li>Considera el costo de oportunidad de cada decisión</li>
          </ul>
        </div>

        <div class="explanation-block">
          <h4>Desventajas:</h4>
          <ul>
            <li>Más complejo de aplicar que los otros métodos</li>
            <li>Requiere más cálculos en cada paso</li>
            <li>Puede ser confuso para principiantes</li>
          </ul>
        </div>

        <div class="info-box">
          <strong>Recomendación:</strong> El método VAM es preferible cuando se busca una solución
          inicial de alta calidad, especialmente en problemas grandes donde cada iteración de
          optimización es costosa en tiempo.
        </div>
      </div>
    `
  }
}

export default TransporteSolver
