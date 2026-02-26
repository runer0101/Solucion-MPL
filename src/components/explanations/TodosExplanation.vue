<template>
  <div>
    <!-- INTRO -->
    <div v-if="activeSection === 'intro'">
      <h3><span class="text-gradient">¿Qué es la Programación Lineal?</span></h3>
      <p class="intro-text">
        La <strong>Programación Lineal</strong> es una técnica matemática para resolver problemas de optimización
        donde buscamos maximizar o minimizar una función objetivo, sujeta a restricciones lineales. Existen varios
        <strong>métodos de solución</strong>: el Método Gráfico (para 2 variables), el Método Simplex (el más usado),
        y los Métodos de Penalización (para casos especiales).
      </p>

      <div class="key-concepts">
        <div class="concept-card">
          <h4>Método Gráfico</h4>
          <p>
            Se usa cuando hay 2 variables de decisión. Consiste en graficar las restricciones,
            identificar la región factible, y evaluar la función objetivo en los vértices para
            encontrar la solución óptima. Es visual e intuitivo.
          </p>
        </div>

        <div class="concept-card">
          <h4>Método Simplex</h4>
          <p>
            El método más importante y utilizado, creado por George Dantzig en 1947.
            Funciona con cualquier número de variables. Usa álgebra para moverse entre
            vértices de la región factible hasta encontrar la solución óptima.
          </p>
        </div>

        <div class="concept-card">
          <h4>Métodos de Transporte</h4>
          <p>
            Técnicas especializadas (Esquina Noroeste, Costo Mínimo, Aproximación de Vogel)
            para encontrar soluciones básicas factibles iniciales en problemas de distribución.
            Optimizan el transporte de productos desde orígenes a destinos.
          </p>
        </div>
      </div>

      <div class="importance-section">
        <h4>Aplicaciones Prácticas</h4>
        <ul class="applications-list">
          <li>
            <strong>Producción Industrial:</strong> Optimizar la mezcla de productos para maximizar ganancias
            con recursos limitados (materias primas, mano de obra, tiempo de máquina).
          </li>
          <li>
            <strong>Logística y Transporte:</strong> Minimizar costos de transporte de mercancías desde
            almacenes a destinos, considerando capacidades y demandas.
          </li>
          <li>
            <strong>Planificación Financiera:</strong> Optimizar portafolios de inversión para maximizar
            retornos mientras se minimiza el riesgo.
          </li>
          <li>
            <strong>Asignación de Recursos:</strong> Distribuir recursos limitados (presupuesto, personal,
            equipos) entre diferentes proyectos o actividades.
          </li>
          <li>
            <strong>Industria Alimentaria:</strong> Diseñar dietas óptimas que cumplan requisitos nutricionales
            al menor costo (problema de la dieta).
          </li>
          <li>
            <strong>Telecomunicaciones:</strong> Optimizar el enrutamiento de datos en redes para maximizar
            el flujo de información.
          </li>
        </ul>
      </div>
    </div>

    <!-- STEPS -->
    <div v-if="activeSection === 'steps'">
      <div class="algorithm-header">
        <h3><span class="text-gradient">Guía Completa: Comparación de Métodos</span></h3>
        <p class="algorithm-subtitle">Entiende qué método usar y qué datos necesitas para cada uno</p>
      </div>

      <div class="methods-comparison-grid">
        <!-- Método Gráfico -->
        <div class="method-comparison-card graphic-card">
          <div class="method-card-header">
            <h4>Método Gráfico</h4>
            <span class="method-badge badge-graphic">2 Variables</span>
          </div>
          <div class="method-card-body">
            <div class="card-section">
              <h5>¿Cuándo usarlo?</h5>
              <p>Cuando tu problema tiene <strong>exactamente 2 variables</strong> (X₁ y X₂)</p>
            </div>
            <div class="card-section">
              <h5>Datos que necesitas:</h5>
              <ul class="data-list">
                <li><span class="data-number">1</span> Tipo: Maximizar o Minimizar</li>
                <li><span class="data-number">2</span> Coeficientes de Z (función objetivo)</li>
                <li><span class="data-number">3</span> Restricciones con X₁ y X₂</li>
                <li><span class="data-number">4</span> Tipo de cada restricción (≤, ≥, =)</li>
              </ul>
            </div>
            <div class="card-section example-section">
              <h5>Ejemplo de datos:</h5>
              <div class="example-data">
                <p><strong>Maximizar</strong> Z = 3X₁ + 5X₂</p>
                <p><strong>Restricciones:</strong></p>
                <p>• X₁ ≤ 4</p>
                <p>• 2X₂ ≤ 12</p>
                <p>• 3X₁ + 2X₂ ≤ 18</p>
              </div>
            </div>
            <div class="card-section result-section">
              <strong>Resultado:</strong> Solución óptima directa con gráfica
            </div>
          </div>
        </div>

        <!-- Método Simplex -->
        <div class="method-comparison-card simplex-card">
          <div class="method-card-header">
            <h4>Método Simplex</h4>
            <span class="method-badge badge-simplex">2+ Variables</span>
          </div>
          <div class="method-card-body">
            <div class="card-section">
              <h5>¿Cuándo usarlo?</h5>
              <p>Para problemas con <strong>2 o más variables</strong> y múltiples restricciones</p>
            </div>
            <div class="card-section">
              <h5>Datos que necesitas:</h5>
              <ul class="data-list">
                <li><span class="data-number">1</span> Tipo: Maximizar o Minimizar</li>
                <li><span class="data-number">2</span> Número de variables (n)</li>
                <li><span class="data-number">3</span> Coeficientes de la función objetivo</li>
                <li><span class="data-number">4</span> Número de restricciones (m)</li>
                <li><span class="data-number">5</span> Coeficientes de cada restricción</li>
                <li><span class="data-number">6</span> Tipo de cada restricción (≤, ≥, =)</li>
              </ul>
            </div>
            <div class="card-section example-section">
              <h5>Ejemplo de datos:</h5>
              <div class="example-data">
                <p><strong>Maximizar</strong> Z = 2X₁ + 3X₂ + X₃</p>
                <p><strong>Restricciones:</strong></p>
                <p>• X₁ + 2X₂ + X₃ ≤ 10</p>
                <p>• 2X₁ + X₂ + 3X₃ ≤ 15</p>
              </div>
            </div>
            <div class="card-section result-section">
              <strong>Resultado:</strong> Solución óptima algebraica
            </div>
          </div>
        </div>

        <!-- Métodos de Transporte -->
        <div class="method-comparison-card transport-card">
          <div class="method-card-header">
            <h4>Métodos de Transporte</h4>
            <span class="method-badge badge-transport">Distribución</span>
          </div>
          <div class="method-card-body">
            <div class="card-section">
              <h5>¿Cuándo usarlo?</h5>
              <p>Para problemas de <strong>distribución</strong> desde orígenes a destinos</p>
            </div>
            <div class="card-section">
              <h5>Datos que necesitas:</h5>
              <ul class="data-list">
                <li><span class="data-number">1</span> Número de orígenes (m)</li>
                <li><span class="data-number">2</span> Número de destinos (n)</li>
                <li><span class="data-number">3</span> Costos de transporte (tabla m×n)</li>
                <li><span class="data-number">4</span> Oferta disponible en cada origen</li>
                <li><span class="data-number">5</span> Demanda requerida en cada destino</li>
              </ul>
            </div>
            <div class="card-section example-section">
              <h5>Ejemplo de datos:</h5>
              <div class="example-data">
                <p><strong>3 Fábricas → 3 Tiendas</strong></p>
                <p><strong>Oferta:</strong> [76, 82, 77]</p>
                <p><strong>Demanda:</strong> [72, 102, 41]</p>
                <p><strong>Costos:</strong> Tabla 3×3</p>
              </div>
            </div>
            <div class="card-section result-section">
              <strong>Resultado:</strong> Solución inicial factible (requiere optimización posterior)
            </div>
          </div>
        </div>
      </div>

      <div class="comparison-table-container">
        <h4 class="table-title">Tabla Comparativa Rápida</h4>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Característica</th>
              <th>Método Gráfico</th>
              <th>Método Simplex</th>
              <th>Métodos de Transporte</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Tipo de Problema</strong></td>
              <td>Programación Lineal</td>
              <td>Programación Lineal</td>
              <td>Problemas de Transporte</td>
            </tr>
            <tr>
              <td><strong>Variables</strong></td>
              <td>Exactamente 2</td>
              <td>2 o más</td>
              <td>m × n (orígenes × destinos)</td>
            </tr>
            <tr>
              <td><strong>Objetivo</strong></td>
              <td>Max/Min función objetivo</td>
              <td>Max/Min función objetivo</td>
              <td>Minimizar costos de distribución</td>
            </tr>
            <tr>
              <td><strong>Complejidad</strong></td>
              <td>Muy simple</td>
              <td>Moderada</td>
              <td>Simple a Alta (según método)</td>
            </tr>
            <tr>
              <td><strong>Resultado</strong></td>
              <td>Solución óptima directa</td>
              <td>Solución óptima directa</td>
              <td>Solución inicial (no óptima)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="decision-guide">
        <h4>Guía de Decisión: ¿Qué Método Usar?</h4>
        <div class="step-container">
          <div class="step-card">
            <div class="step-number">Paso 1</div>
            <h4>Identifica el Tipo de Problema</h4>
            <p><strong>¿Es un problema de transporte o distribución?</strong></p>
            <ul>
              <li><strong>SÍ:</strong> Usa los <strong>Métodos de Transporte</strong> (Esquina Noroeste, Costo Mínimo o Vogel) para encontrar una solución inicial, luego optimiza con MODI o Stepping Stone.</li>
              <li><strong>NO:</strong> Es un problema de Programación Lineal, pasa al Paso 2.</li>
            </ul>
          </div>
          <div class="step-card">
            <div class="step-number">Paso 2</div>
            <h4>Cuenta las Variables de Decisión</h4>
            <p><strong>¿Tienes exactamente 2 variables?</strong></p>
            <ul>
              <li><strong>SÍ:</strong> Usa el <strong>Método Gráfico</strong>. Es rápido, visual y fácil de verificar.</li>
              <li><strong>NO (3 o más variables):</strong> Pasa al Paso 3.</li>
            </ul>
          </div>
          <div class="step-card">
            <div class="step-number">Paso 3</div>
            <h4>Revisa los Tipos de Restricciones</h4>
            <p><strong>¿Todas tus restricciones son "menor o igual" (≤)?</strong></p>
            <ul>
              <li><strong>SÍ:</strong> Usa el <strong>Método Simplex Estándar</strong>. Es el más eficiente para este caso.</li>
              <li><strong>NO:</strong> Para restricciones de igualdad (=) o mayor-igual (≥), necesitas técnicas avanzadas del Simplex con variables artificiales.</li>
            </ul>
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
