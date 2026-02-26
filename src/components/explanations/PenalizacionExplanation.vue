<template>
  <div>
    <!-- INTRO -->
    <div v-if="activeSection === 'intro'">
      <h3><span class="text-gradient">Métodos de Solución Inicial para Problemas de Transporte</span></h3>
      <p class="intro-text">
        Los problemas de transporte requieren una <strong>solución básica factible inicial</strong> para comenzar
        el proceso de optimización. Existen tres métodos principales para encontrar esta solución inicial, cada uno
        con diferentes estrategias y niveles de eficiencia.
      </p>

      <div class="key-concepts">
        <div class="concept-card">
          <h4>Método de la Esquina Noroeste</h4>
          <p>
            <strong>Estrategia:</strong> Comienza en la celda superior izquierda (esquina noroeste) y asigna
            el máximo posible, moviéndose sistemáticamente hacia la derecha y hacia abajo.
          </p>
          <p>
            <strong>Ventajas:</strong> Muy simple y rápido de aplicar, no requiere cálculos complejos.
          </p>
          <p>
            <strong>Desventajas:</strong> No considera los costos de transporte, generalmente produce
            soluciones con costos más altos que requieren muchas iteraciones para optimizar.
          </p>
        </div>

        <div class="concept-card">
          <h4>Método del Costo Mínimo</h4>
          <p>
            <strong>Estrategia:</strong> Asigna primero a las celdas con menor costo de transporte,
            priorizando las rutas más económicas disponibles en cada paso.
          </p>
          <p>
            <strong>Ventajas:</strong> Considera los costos desde el inicio, produce soluciones iniciales
            significativamente mejores que la Esquina Noroeste, reduciendo el trabajo de optimización.
          </p>
          <p>
            <strong>Desventajas:</strong> Puede quedar atrapado en mínimos locales, requiere ordenar
            y comparar costos en cada iteración.
          </p>
        </div>

        <div class="concept-card">
          <h4>Método de Aproximación de Vogel (VAM)</h4>
          <p>
            <strong>Estrategia:</strong> Calcula "penalizaciones" (diferencia entre los dos menores costos)
            para cada fila y columna, asignando donde la penalización es mayor.
          </p>
          <p>
            <strong>Ventajas:</strong> Produce las mejores soluciones iniciales, frecuentemente muy cercanas
            o iguales a la solución óptima, minimiza las iteraciones de optimización posteriores.
          </p>
          <p>
            <strong>Desventajas:</strong> El más complejo de aplicar, requiere más cálculos en cada paso.
          </p>
        </div>
      </div>

      <div class="importance-section">
        <h4>¿Cuándo usar cada método?</h4>
        <ul class="applications-list">
          <li>
            <strong>Esquina Noroeste:</strong> Ideal para aprendizaje y problemas muy pequeños donde
            la simplicidad es más importante que la eficiencia. Útil para entender los conceptos básicos.
          </li>
          <li>
            <strong>Costo Mínimo:</strong> Recomendado para problemas de tamaño medio donde se busca
            un balance entre simplicidad y eficiencia. Buena opción general para la mayoría de casos.
          </li>
          <li>
            <strong>Aproximación de Vogel:</strong> Preferible para problemas grandes o cuando se requiere
            la mejor solución inicial posible. El tiempo extra de cálculo se compensa con menos iteraciones
            de optimización posteriores.
          </li>
        </ul>
      </div>
    </div>

    <!-- STEPS -->
    <div v-if="activeSection === 'steps'">
      <div class="algorithm-header">
        <h3><span class="text-gradient">Métodos de Transporte - Comparación Paso a Paso</span></h3>
        <p class="algorithm-subtitle">Tres métodos para encontrar soluciones iniciales factibles en problemas de distribución</p>
      </div>

      <div class="step-container">
        <div class="step-card method-highlight">
          <div class="step-number">Método 1</div>
          <h4>Esquina Noroeste - Algoritmo Simple</h4>
          <div class="method-description">
            <p><strong>Principio:</strong> Método sistemático que comienza en la esquina superior izquierda y avanza de forma ordenada.</p>
            <p><strong>Característica:</strong> No considera costos, solo satisface oferta y demanda.</p>
          </div>
          <div class="algorithm-steps">
            <h5>Pasos del Algoritmo:</h5>
            <ol>
              <li><strong>Iniciar en celda (1,1)</strong><p>Posicionarse en la esquina superior izquierda de la tabla de transporte</p></li>
              <li><strong>Asignar cantidad</strong><p>Cantidad = min(Oferta disponible del origen, Demanda disponible del destino)</p></li>
              <li><strong>Actualizar disponibilidad</strong><p>Reducir la oferta y demanda según la cantidad asignada</p></li>
              <li><strong>Mover posición</strong><p>• Si la oferta se agota → Mover a la siguiente fila<br>• Si la demanda se agota → Mover a la siguiente columna</p></li>
              <li><strong>Repetir</strong><p>Continuar hasta que toda la oferta esté asignada y toda la demanda satisfecha</p></li>
            </ol>
          </div>
          <div class="pros-cons">
            <div class="pros">
              <h6>Ventajas</h6>
              <ul>
                <li>Extremadamente simple de aplicar</li>
                <li>No requiere cálculos complejos</li>
                <li>Rápido de ejecutar manualmente</li>
                <li>Ideal para aprender conceptos básicos</li>
              </ul>
            </div>
            <div class="cons">
              <h6>Desventajas</h6>
              <ul>
                <li>Ignora completamente los costos</li>
                <li>Produce soluciones de alto costo</li>
                <li>Requiere muchas iteraciones para optimizar</li>
                <li>No recomendado para uso práctico</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="step-card method-highlight">
          <div class="step-number">Método 2</div>
          <h4>Costo Mínimo - Algoritmo Voraz</h4>
          <div class="method-description">
            <p><strong>Principio:</strong> Estrategia voraz que prioriza las rutas más económicas disponibles en cada paso.</p>
            <p><strong>Característica:</strong> Considera los costos desde el inicio para obtener mejores soluciones.</p>
          </div>
          <div class="algorithm-steps">
            <h5>Pasos del Algoritmo:</h5>
            <ol>
              <li><strong>Identificar celda de costo mínimo</strong><p>Buscar en toda la tabla la celda con el valor más bajo entre las celdas activas</p></li>
              <li><strong>Asignar cantidad máxima</strong><p>Cantidad = min(Oferta disponible, Demanda disponible)</p></li>
              <li><strong>Actualizar disponibilidad</strong><p>Reducir la oferta del origen y demanda del destino</p></li>
              <li><strong>Eliminar fila o columna saturada</strong><p>• Si Oferta = 0 → Eliminar fila<br>• Si Demanda = 0 → Eliminar columna</p></li>
              <li><strong>Repetir con tabla reducida</strong><p>Buscar el siguiente costo mínimo entre las celdas restantes</p></li>
              <li><strong>Finalizar</strong><p>Terminar cuando todas las ofertas y demandas sean cero</p></li>
            </ol>
          </div>
          <div class="pros-cons">
            <div class="pros">
              <h6>Ventajas</h6>
              <ul>
                <li>Considera los costos en cada decisión</li>
                <li>Soluciones mucho mejores que Esquina Noroeste</li>
                <li>Razonablemente simple de aplicar</li>
                <li>Buen balance entre simplicidad y eficiencia</li>
              </ul>
            </div>
            <div class="cons">
              <h6>Desventajas</h6>
              <ul>
                <li>Requiere ordenar y comparar costos</li>
                <li>Puede quedar atrapado en mínimos locales</li>
                <li>No siempre produce la mejor solución inicial</li>
                <li>Más complejo que Esquina Noroeste</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="step-card method-highlight">
          <div class="step-number">Método 3</div>
          <h4>Aproximación de Vogel (VAM) - Algoritmo Avanzado</h4>
          <div class="method-description">
            <p><strong>Principio:</strong> Algoritmo heurístico que utiliza el "costo de oportunidad" para evitar asignaciones costosas.</p>
            <p><strong>Característica:</strong> Generalmente produce la mejor solución inicial, frecuentemente cercana al óptimo.</p>
          </div>
          <div class="algorithm-steps">
            <h5>Pasos del Algoritmo:</h5>
            <ol>
              <li><strong>Calcular penalizaciones por fila</strong><p>Penalización = Segundo menor costo - Menor costo (en cada fila activa)</p></li>
              <li><strong>Calcular penalizaciones por columna</strong><p>Penalización = Segundo menor costo - Menor costo (en cada columna activa)</p></li>
              <li><strong>Seleccionar máxima penalización</strong><p>Elegir la fila o columna con la penalización más alta</p></li>
              <li><strong>Asignar en celda de menor costo</strong><p>En la fila/columna seleccionada, asignar a la celda con el costo más bajo<br>Cantidad = min(Oferta disponible, Demanda disponible)</p></li>
              <li><strong>Actualizar y eliminar</strong><p>Reducir oferta y demanda; eliminar fila o columna agotada</p></li>
              <li><strong>Repetir desde paso 1</strong><p>Continuar con la tabla reducida hasta completar todas las asignaciones</p></li>
            </ol>
          </div>
          <div class="formula-box">
            <h6>Concepto Clave: Penalización</h6>
            <p>La penalización representa el <em>costo de oportunidad</em> por NO elegir la mejor opción disponible.
            Una penalización alta indica que es crítico asignar a la mejor ruta ahora.</p>
            <div class="formula-example">
              <p><strong>Ejemplo:</strong></p>
              <p>Fila con costos [4, 8, 16] → Penalización = 8 - 4 = 4</p>
              <p>Fila con costos [10, 12, 15] → Penalización = 12 - 10 = 2</p>
              <p>La primera fila tiene mayor penalización (4 > 2): es más urgente asignar ahí.</p>
            </div>
          </div>
          <div class="pros-cons">
            <div class="pros">
              <h6>Ventajas</h6>
              <ul>
                <li>Produce las mejores soluciones iniciales</li>
                <li>Frecuentemente muy cercano al óptimo (5-10%)</li>
                <li>Minimiza iteraciones de optimización posterior</li>
                <li>Considera tanto costos como oportunidades</li>
              </ul>
            </div>
            <div class="cons">
              <h6>Desventajas</h6>
              <ul>
                <li>El más complejo de los tres métodos</li>
                <li>Requiere más cálculos en cada iteración</li>
                <li>Puede ser confuso para principiantes</li>
                <li>Toma más tiempo ejecutar manualmente</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="step-card">
          <div class="step-number">Comparación</div>
          <h4>Eficiencia Comparativa de los Métodos</h4>
          <table class="mini-table">
            <thead>
              <tr>
                <th>Método</th>
                <th>Calidad Solución</th>
                <th>Complejidad</th>
                <th>Uso Recomendado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Esquina Noroeste</td>
                <td>Regular</td>
                <td>Muy Baja</td>
                <td>Aprendizaje</td>
              </tr>
              <tr>
                <td>Costo Mínimo</td>
                <td>Buena</td>
                <td>Media</td>
                <td>Uso General</td>
              </tr>
              <tr>
                <td>Vogel (VAM)</td>
                <td>Excelente</td>
                <td>Alta</td>
                <td>Problemas Grandes</td>
              </tr>
            </tbody>
          </table>
          <div class="convergence-box">
            <strong>Dato importante:</strong> El método VAM produce soluciones iniciales dentro del 5-10% del costo óptimo final,
            mientras que Esquina Noroeste puede estar 30-50% por encima del óptimo.
          </div>
        </div>
      </div>

      <div class="cases-section">
        <h4>Consideraciones Importantes</h4>
        <div class="special-cases">
          <div class="case-card info">
            <h5>Problema Balanceado</h5>
            <p>Los tres métodos requieren que el problema esté balanceado: Σ Ofertas = Σ Demandas.
            Si no está balanceado, se debe agregar una fila o columna ficticia con costo cero.</p>
          </div>
          <div class="case-card warning">
            <h5>Empates en la Selección</h5>
            <p>
              <strong>Costo Mínimo:</strong> Si hay varios costos iguales mínimos, elegir arbitrariamente.<br>
              <strong>Vogel:</strong> Si hay empate en penalizaciones, elegir la fila/columna con menor costo mínimo.
            </p>
          </div>
          <div class="case-card info">
            <h5>Optimización Posterior</h5>
            <p>Las soluciones iniciales de estos métodos generalmente NO son óptimas.
            Se aplican métodos como <strong>MODI</strong> o <strong>Stepping Stone</strong>
            para mejorar la solución hasta alcanzar el óptimo.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeSection: { type: String, default: 'intro' }
})
</script>
