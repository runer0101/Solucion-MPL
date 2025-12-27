<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  selectedMethod: {
    type: String,
    default: 'simplex'
  }
})

const activeSection = ref('intro')

// Computed properties for dynamic headers and titles
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
        @click="activeSection = 'intro'"
        :class="{ active: activeSection === 'intro' }"
        class="nav-btn"
      >
        Introducción
      </button>
      <button
        @click="activeSection = 'steps'"
        :class="{ active: activeSection === 'steps' }"
        class="nav-btn"
      >
        Pasos del Algoritmo
      </button>
    </div>

    <div class="explanation-content">
      <!-- Sección Introducción -->
      <div v-if="activeSection === 'intro'" class="content-section">
        <!-- Contenido para TODOS los métodos -->
        <div v-if="selectedMethod === 'todos'">
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

        <!-- Contenido específico para SIMPLEX -->
        <div v-if="selectedMethod === 'simplex'">
          <h3><span class="text-gradient">¿Qué es el Método Simplex?</span></h3>
          <p class="intro-text">
            El <strong>Método Simplex</strong> es un algoritmo algebraico desarrollado por George Dantzig en 1947
            para resolver problemas de programación lineal. Es el método más utilizado en la práctica porque puede
            manejar problemas con cualquier número de variables y restricciones de manera eficiente.
          </p>

          <div class="key-concepts">
            <div class="concept-card">
              <h4>Concepto Fundamental</h4>
              <p>
                El método Simplex se basa en el <strong>Teorema Fundamental de la Programación Lineal</strong>:
                si existe una solución óptima, se encuentra en uno de los vértices (puntos extremos) de la
                región factible. El algoritmo se mueve de vértice en vértice mejorando la función objetivo
                hasta encontrar el óptimo.
              </p>
            </div>

            <div class="concept-card">
              <h4>Ventajas del Método</h4>
              <p>
                <strong>• Eficiencia:</strong> Resuelve problemas grandes en tiempo razonable<br>
                <strong>• Generalidad:</strong> Funciona con cualquier número de variables<br>
                <strong>• Confiabilidad:</strong> Garantiza encontrar la solución óptima si existe<br>
                <strong>• Detección:</strong> Identifica cuando no hay solución o es no acotada
              </p>
            </div>

            <div class="concept-card">
              <h4>¿Cuándo Usar Simplex?</h4>
              <p>
                Usa el método Simplex cuando tienes más de 2 variables de decisión, o cuando el método
                gráfico no es práctico. Es ideal para problemas de producción, asignación de recursos,
                mezclas óptimas y planificación industrial. Requiere que todas las restricciones sean
                desigualdades tipo "≤" (o convertidas a esta forma).
              </p>
            </div>
          </div>

          <div class="importance-section">
            <h4>Ejemplo Ilustrativo</h4>
            <div class="example-box" style="margin-top: 1rem;">
              <strong>Problema de Producción:</strong><br><br>
              Una fábrica produce dos productos: A y B. El producto A deja una ganancia de $3 por unidad
              y el producto B de $5 por unidad. La producción está limitada por:<br>
              • Disponibilidad de materia prima: cada A necesita 1 kg, cada B necesita 0 kg (máximo 4 kg)<br>
              • Tiempo de máquina: cada A necesita 0 horas, cada B necesita 2 horas (máximo 12 horas)<br>
              • Mano de obra: cada A necesita 3 horas, cada B necesita 2 horas (máximo 18 horas)<br><br>
              <strong>¿Cuánto producir de cada uno para maximizar ganancias?</strong><br><br>
              El Método Simplex resuelve este problema sistemáticamente, encontrando que debe producir
              2 unidades de A y 6 unidades de B para obtener una ganancia máxima de $36.
            </div>
          </div>
        </div>

        <!-- Contenido específico para GRÁFICO -->
        <div v-if="selectedMethod === 'grafico'">
          <h3><span class="text-gradient">¿Qué es el Método Gráfico?</span></h3>
          <p class="intro-text">
            El <strong>Método Gráfico</strong> es una técnica visual para resolver problemas de programación lineal
            con exactamente <strong>2 variables de decisión</strong>. Permite visualizar el espacio de soluciones
            y encontrar el óptimo de forma intuitiva mediante la representación gráfica de restricciones y la
            función objetivo.
          </p>

          <div class="key-concepts">
            <div class="concept-card">
              <h4>Principio Visual</h4>
              <p>
                Cada restricción se representa como una <strong>línea recta en el plano cartesiano</strong>.
                La intersección de todas las restricciones forma la <strong>región factible</strong>
                (área donde se cumplen todas las condiciones). Los vértices de esta región son candidatos
                para la solución óptima.
              </p>
            </div>

            <div class="concept-card">
              <h4>Ventajas del Método</h4>
              <p>
                <strong>• Intuitividad:</strong> Fácil de entender y visualizar<br>
                <strong>• Didáctico:</strong> Excelente para aprender conceptos de PL<br>
                <strong>• Rapidez:</strong> Para 2 variables es muy rápido<br>
                <strong>• Verificación:</strong> Permite confirmar resultados visualmente
              </p>
            </div>

            <div class="concept-card">
              <h4>Limitaciones</h4>
              <p>
                Solo funciona con <strong>2 variables de decisión</strong> (X₁ y X₂). Para 3 o más variables,
                la visualización se vuelve imposible y debes usar el Método Simplex. Sin embargo, para problemas
                pequeños, es la forma más rápida y clara de encontrar la solución.
              </p>
            </div>
          </div>

          <div class="importance-section">
            <h4>Casos de Uso Típicos</h4>
            <ul class="applications-list">
              <li>
                <strong>Problemas de Mezcla:</strong> Combinar dos ingredientes para obtener un producto
                con especificaciones óptimas (por ejemplo, mezcla de granos, combustibles, o fertilizantes).
              </li>
              <li>
                <strong>Producción Simple:</strong> Fabricar dos productos con recursos limitados
                (tiempo, materiales, capacidad de almacenamiento).
              </li>
              <li>
                <strong>Planificación de Dieta:</strong> Combinar dos alimentos para satisfacer
                requerimientos nutricionales al menor costo.
              </li>
              <li>
                <strong>Asignación de Publicidad:</strong> Distribuir presupuesto entre dos medios
                (TV y radio) para maximizar alcance.
              </li>
            </ul>
          </div>
        </div>

        <!-- Contenido específico para PENALIZACIÓN -->
        <div v-if="selectedMethod === 'penalizacion'">
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
                para cada fila y columna, asignando donde la penalización es mayor. Esto representa el costo
                de oportunidad de no elegir la mejor opción.
              </p>
              <p>
                <strong>Ventajas:</strong> Produce las mejores soluciones iniciales, frecuentemente muy cercanas
                o iguales a la solución óptima, minimiza las iteraciones de optimización posteriores.
              </p>
              <p>
                <strong>Desventajas:</strong> El más complejo de aplicar, requiere más cálculos en cada paso,
                puede ser confuso para principiantes.
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
      </div>

      <!-- Sección Pasos del Algoritmo -->
      <div v-if="activeSection === 'steps'" class="content-section">

        <!-- Pasos para TODOS (Comparación) -->
        <div v-if="selectedMethod === 'todos'">
          <div class="algorithm-header">
            <h3><span class="text-gradient">Guía Completa: Comparación de Métodos</span></h3>
            <p class="algorithm-subtitle">Entiende qué método usar y qué datos necesitas para cada uno</p>
          </div>

          <!-- Tarjetas visuales de cada método -->
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

          <!-- Tabla comparativa tradicional (más compacta) -->
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

        <!-- Pasos para SIMPLEX -->
        <div v-if="selectedMethod === 'simplex'">
          <div class="algorithm-header">
            <h3><span class="text-gradient">Método Simplex - Paso a Paso</span></h3>
            <p class="algorithm-subtitle">Aprende a resolver MPL usando el método algebraico más importante</p>
          </div>

        <div class="step-container">
          <div class="step-card">
            <div class="step-number">Paso 1</div>
            <h4>Formulación del Problema</h4>
            <p>Define claramente:</p>
            <ul>
              <li><strong>Variables de decisión:</strong> Las incógnitas a determinar (X₁, X₂, ..., Xₙ)</li>
              <li><strong>Función objetivo:</strong> La expresión a maximizar o minimizar</li>
              <li><strong>Restricciones:</strong> Las limitaciones que deben cumplirse</li>
              <li><strong>No negatividad:</strong> Todas las variables ≥ 0</li>
            </ul>
            <div class="example-box">
              <strong>Ejemplo:</strong><br>
              Maximizar Z = 3X₁ + 5X₂<br>
              Sujeto a:<br>
              X₁ ≤ 4<br>
              2X₂ ≤ 12<br>
              3X₁ + 2X₂ ≤ 18<br>
              X₁, X₂ ≥ 0
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">Paso 2</div>
            <h4>Conversión a Forma Estándar</h4>
            <p>El método Simplex trabaja con ecuaciones (=), no con desigualdades. Por eso debemos convertir:</p>
            <ul>
              <li><strong>Si tienes "≤" (menor o igual):</strong> Suma una variable de holgura S<br>
              Ejemplo: X₁ ≤ 4 se convierte en X₁ + S₁ = 4</li>
              <li><strong>Si tienes "≥" (mayor o igual):</strong> Resta una variable de exceso<br>
              Ejemplo: X₁ ≥ 4 se convierte en X₁ - S₁ = 4</li>
            </ul>
            <div class="info-box">
              <strong>¿Qué significan estas variables nuevas?</strong><br>
              Las variables de holgura (S) representan cuánto "sobra" de un recurso que no estás usando completamente.
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">Paso 3</div>
            <h4>Crear la Tabla Simplex</h4>
            <p>Organiza toda la información en una tabla:</p>
            <ul>
              <li><strong>Columnas:</strong> Una para cada variable (X₁, X₂, S₁, S₂, etc.) y una columna final "Solución"</li>
              <li><strong>Filas:</strong> Una fila por cada restricción, más una fila especial al final llamada "Z"</li>
              <li><strong>Fila Z:</strong> Aquí van los coeficientes de tu función objetivo, pero con el signo contrario<br>
              Ejemplo: Si es Maximizar Z = 3X₁ + 5X₂, en la fila Z pones -3 y -5</li>
            </ul>
            <div class="table-structure">
              <table class="mini-table">
                <thead>
                  <tr>
                    <th>Base</th>
                    <th>X₁</th>
                    <th>X₂</th>
                    <th>S₁</th>
                    <th>S₂</th>
                    <th>RHS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>S₁</td>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>S₂</td>
                    <td>0</td>
                    <td>2</td>
                    <td>0</td>
                    <td>1</td>
                    <td>12</td>
                  </tr>
                  <tr class="z-row">
                    <td>Z</td>
                    <td>-3</td>
                    <td>-5</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">Paso 4</div>
            <h4>¿Ya terminamos? (Test de Optimalidad)</h4>
            <p>Revisa la fila Z para saber si ya encontraste la mejor solución:</p>
            <ul>
              <li><strong>Si estás MAXIMIZANDO:</strong> ¿Todos los números en la fila Z son positivos o cero?<br>
              → SÍ: ¡Felicidades! Ya terminaste ✓<br>
              → NO: Continúa al siguiente paso</li>
              <li><strong>Si estás MINIMIZANDO:</strong> ¿Todos los números en la fila Z son negativos o cero?<br>
              → SÍ: ¡Felicidades! Ya terminaste ✓<br>
              → NO: Continúa al siguiente paso</li>
            </ul>
            <div class="warning-box">
              Si hay números negativos (en maximización), significa que podemos mejorar la solución
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">Paso 5</div>
            <h4>Elegir qué Variable Entra</h4>
            <p>Busca en la fila Z el número MÁS NEGATIVO (el más alejado de cero hacia la izquierda):</p>
            <ul>
              <li><strong>Paso 1:</strong> Mira todos los números en la fila Z</li>
              <li><strong>Paso 2:</strong> Encuentra el más negativo (por ejemplo: entre -3 y -5, elige -5)</li>
              <li><strong>Paso 3:</strong> La columna donde está ese número es tu "columna pivote"</li>
            </ul>
            <div class="info-box">
              <strong>¿Por qué el más negativo?</strong><br>
              Porque ese es el que más puede ayudarnos a mejorar nuestra ganancia (o función objetivo).
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">Paso 6</div>
            <h4>Elegir qué Variable Sale</h4>
            <p>Ahora debemos decidir qué fila será nuestra "fila pivote". Usa la regla del cociente mínimo:</p>
            <ul>
              <li><strong>Paso 1:</strong> Toma cada fila (excepto la fila Z)</li>
              <li><strong>Paso 2:</strong> Divide el valor de la columna "Solución" entre el número de la columna pivote<br>
              Ejemplo: Si Solución = 12 y columna pivote = 2, entonces 12 ÷ 2 = 6</li>
              <li><strong>Paso 3:</strong> Ignora divisiones entre números negativos o cero</li>
              <li><strong>Paso 4:</strong> La fila con el resultado MÁS PEQUEÑO es tu "fila pivote"</li>
            </ul>
            <div class="info-box">
              <strong>¿Por qué hacemos esto?</strong><br>
              Para asegurarnos de no violar las restricciones. Elegimos el cambio más pequeño que podemos hacer sin romper las reglas.
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">Paso 7</div>
            <h4>Transformar la Tabla (Pivoteo)</h4>
            <p>Esta es la parte matemática. Vas a actualizar TODA la tabla en dos pasos:</p>
            <div class="example-box">
              <strong>Primero:</strong> Convierte el "elemento pivote" en 1<br>
              • El elemento pivote es donde se cruzan la fila pivote y columna pivote<br>
              • Divide TODA la fila pivote entre ese número<br>
              Ejemplo: Si el pivote es 2, divide toda esa fila entre 2
            </div>
            <div class="example-box">
              <strong>Segundo:</strong> Convierte los demás números de la columna pivote en 0<br>
              • Para cada otra fila, usa operaciones de suma/resta<br>
              • El objetivo: que solo quede un "1" en la columna pivote (en la fila pivote)<br>
              • Todos los demás números de esa columna deben ser 0
            </div>
            <div class="info-box">
              <strong>Tip:</strong> Este es el paso más mecánico. Sigue las operaciones con cuidado y no te saltes ninguna fila.
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">Paso 8</div>
            <h4>Repetir hasta Terminar</h4>
            <p>¡Ahora vuelve al Paso 4 y repite el proceso!</p>
            <ul>
              <li><strong>1.</strong> Revisa si ya terminaste (Paso 4)</li>
              <li><strong>2.</strong> Si NO terminaste, elige nueva variable que entra (Paso 5)</li>
              <li><strong>3.</strong> Elige qué variable sale (Paso 6)</li>
              <li><strong>4.</strong> Transforma la tabla (Paso 7)</li>
              <li><strong>5.</strong> Repite hasta que todos los números en fila Z sean positivos</li>
            </ul>
            <div class="convergence-box">
              <strong>¡No te preocupes!</strong> El método Simplex siempre termina en un número finito de pasos.
              Normalmente son pocas iteraciones (entre 3 y 10 para problemas pequeños).
            </div>
          </div>

          <div class="step-card">
            <div class="step-number">Paso 9</div>
            <h4>Leer la Solución Final</h4>
            <p>¡Ya terminaste! Ahora lee tu respuesta de la tabla final:</p>
            <ul>
              <li><strong>El valor de Z:</strong> Mira la columna "Solución" en la fila Z. Ese es tu resultado final (ganancia máxima o costo mínimo)</li>
              <li><strong>Valores de X₁, X₂, etc.:</strong> Lee la columna "Solución" donde aparece cada variable</li>
              <li><strong>Si una variable NO aparece:</strong> Su valor es 0</li>
            </ul>
            <div class="solution-example">
              <strong>Ejemplo de lectura:</strong><br>
              • Si en la fila Z, columna Solución dice "36" → Tu ganancia máxima es 36<br>
              • Si X₁ está en una fila con Solución = 2 → X₁ = 2<br>
              • Si X₂ está en una fila con Solución = 6 → X₂ = 6<br>
              <em>Interpretación: Debes producir 2 unidades del producto 1 y 6 unidades del producto 2 para ganar $36</em>
            </div>
          </div>
        </div>

        <div class="cases-section">
          <h4>Casos Especiales</h4>
          <div class="special-cases">
            <div class="case-card warning">
              <h5>Solución No Acotada</h5>
              <p>
                Ocurre cuando todos los coeficientes en la columna pivote son ≤ 0.
                Significa que la función objetivo puede crecer indefinidamente.
              </p>
              <p><strong>Causa:</strong> El problema está mal formulado o la región factible es no acotada.</p>
            </div>

            <div class="case-card error">
              <h5>Solución No Factible</h5>
              <p>
                Cuando el problema no tiene solución que satisfaga todas las restricciones.
                Se detecta si variables artificiales permanecen en la base con valor positivo.
              </p>
              <p><strong>Causa:</strong> Las restricciones son contradictorias.</p>
            </div>

            <div class="case-card info">
              <h5>Soluciones Múltiples</h5>
              <p>
                Cuando una variable no básica tiene coeficiente 0 en la fila Z en la tabla óptima.
                Existen infinitas soluciones óptimas.
              </p>
              <p><strong>Significado:</strong> Hay flexibilidad en la solución óptima.</p>
            </div>

            <div class="case-card warning">
              <h5>Degeneración</h5>
              <p>
                Cuando una o más variables básicas tienen valor 0. Puede causar ciclado
                (volver a la misma tabla en iteraciones futuras).
              </p>
              <p><strong>Solución:</strong> Usar reglas de perturbación o regla de Bland.</p>
            </div>
          </div>
        </div>
        </div>

        <!-- Pasos para GRÁFICO -->
        <div v-if="selectedMethod === 'grafico'">
          <div class="algorithm-header">
            <h3><span class="text-gradient">Método Gráfico - Paso a Paso</span></h3>
            <p class="algorithm-subtitle">Resuelve problemas de 2 variables de forma visual e intuitiva</p>
          </div>

          <div class="step-container">
            <div class="step-card">
              <div class="step-number">Paso 1</div>
              <h4>Verificar Requisitos del Método</h4>
              <p>Antes de empezar, confirma que tu problema cumple las condiciones:</p>
              <ul>
                <li><strong>Exactamente 2 variables de decisión:</strong> X₁ y X₂ (o como las llames)</li>
                <li><strong>Función objetivo lineal:</strong> Forma Z = aX₁ + bX₂</li>
                <li><strong>Restricciones lineales:</strong> Todas deben ser ecuaciones o desigualdades lineales</li>
                <li><strong>Variables no negativas:</strong> X₁ ≥ 0, X₂ ≥ 0</li>
              </ul>
              <div class="warning-box">
                Si tienes 3 o más variables, NO puedes usar el método gráfico. Usa Simplex en su lugar.
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">Paso 2</div>
              <h4>Preparar el Sistema de Coordenadas</h4>
              <p>Dibuja un plano cartesiano para graficar:</p>
              <ul>
                <li><strong>Eje horizontal (X):</strong> Representa la primera variable (X₁)</li>
                <li><strong>Eje vertical (Y):</strong> Representa la segunda variable (X₂)</li>
                <li><strong>Solo cuadrante positivo:</strong> Porque X₁ ≥ 0 y X₂ ≥ 0</li>
                <li><strong>Escala apropiada:</strong> Ajusta la escala según los valores de las restricciones</li>
              </ul>
              <div class="info-box">
                <strong>Consejo:</strong> Usa papel milimetrado o software de graficación para mayor precisión.
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">Paso 3</div>
              <h4>Graficar Cada Restricción</h4>
              <p>Para cada restricción, sigue estos pasos:</p>
              <ul>
                <li><strong>Paso A:</strong> Convierte la desigualdad en igualdad (cambia ≤, ≥ por =)</li>
                <li><strong>Paso B:</strong> Encuentra dos puntos de la línea:
                  <ul>
                    <li>Cuando X₁ = 0, calcula X₂</li>
                    <li>Cuando X₂ = 0, calcula X₁</li>
                  </ul>
                </li>
                <li><strong>Paso C:</strong> Traza la línea recta que une estos dos puntos</li>
                <li><strong>Paso D:</strong> Determina qué lado de la línea satisface la desigualdad original</li>
              </ul>
              <div class="example-box">
                <strong>Ejemplo:</strong> Para 2X₁ + 3X₂ ≤ 12<br>
                • Cuando X₁ = 0: 3X₂ = 12 → X₂ = 4 (punto: 0, 4)<br>
                • Cuando X₂ = 0: 2X₁ = 12 → X₁ = 6 (punto: 6, 0)<br>
                • Traza la línea y sombrea hacia el origen (lado que cumple ≤)
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">Paso 4</div>
              <h4>Identificar la Región Factible</h4>
              <p>La región factible es el área donde se cumplen TODAS las restricciones simultáneamente:</p>
              <ul>
                <li><strong>Busca la intersección:</strong> El área donde se sobreponen todas las zonas sombreadas</li>
                <li><strong>Debe estar en el cuadrante positivo:</strong> X₁ ≥ 0 y X₂ ≥ 0</li>
                <li><strong>Puede ser:</strong> Un polígono (lo más común), un área no acotada, un punto, o vacía</li>
                <li><strong>Marca claramente:</strong> Resalta esta región con un color diferente</li>
              </ul>
              <div class="info-box">
                <strong>¿Región vacía?</strong> Si no hay área que cumpla todas las restricciones, el problema no tiene solución factible.
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">Paso 5</div>
              <h4>Encontrar los Vértices (Puntos Extremos)</h4>
              <p>Los vértices son los puntos donde se intersectan las líneas de restricción:</p>
              <ul>
                <li><strong>Identifica todos los vértices:</strong> Marca cada esquina de la región factible</li>
                <li><strong>Incluye intersecciones con los ejes:</strong> No olvides los puntos sobre X₁ = 0 o X₂ = 0</li>
                <li><strong>Calcula coordenadas exactas:</strong> Resuelve sistemas de 2 ecuaciones para cada vértice</li>
                <li><strong>Verifica que estén en la región factible:</strong> Todos los vértices deben cumplir todas las restricciones</li>
              </ul>
              <div class="example-box">
                <strong>Ejemplo de cálculo de vértice:</strong><br>
                Intersección de 2X₁ + 3X₂ = 12 y 3X₁ + 2X₂ = 18:<br>
                Resolviendo el sistema: X₁ = 3.6, X₂ = 1.6
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">Paso 6</div>
              <h4>Evaluar la Función Objetivo en Cada Vértice</h4>
              <p>Calcula el valor de Z en cada vértice encontrado:</p>
              <ul>
                <li><strong>Para cada vértice (X₁, X₂):</strong> Sustituye en Z = aX₁ + bX₂</li>
                <li><strong>Organiza en una tabla:</strong> Lista cada vértice y su valor de Z</li>
                <li><strong>Compara los valores:</strong> Encuentra el mayor (maximización) o menor (minimización)</li>
              </ul>
              <div class="example-box">
                <strong>Ejemplo:</strong> Z = 3X₁ + 5X₂<br>
                • Vértice (0, 0): Z = 3(0) + 5(0) = 0<br>
                • Vértice (4, 0): Z = 3(4) + 5(0) = 12<br>
                • Vértice (2, 6): Z = 3(2) + 5(6) = 36 ← Máximo<br>
                • Vértice (0, 4): Z = 3(0) + 5(4) = 20
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">Paso 7</div>
              <h4>Determinar la Solución Óptima</h4>
              <p>¡El vértice con el mejor valor de Z es tu solución óptima!</p>
              <ul>
                <li><strong>Maximización:</strong> El vértice con el MAYOR valor de Z</li>
                <li><strong>Minimización:</strong> El vértice con el MENOR valor de Z</li>
                <li><strong>Solución óptima:</strong> Los valores de X₁ y X₂ en ese vértice</li>
                <li><strong>Valor óptimo:</strong> El valor de Z en ese punto</li>
              </ul>
              <div class="solution-example">
                <strong>Interpretación:</strong><br>
                Si el vértice óptimo es (2, 6) con Z = 36:<br>
                • X₁ = 2 unidades<br>
                • X₂ = 6 unidades<br>
                • Ganancia/costo óptimo = 36<br>
                <em>Esta es la combinación que optimiza tu objetivo respetando todas las restricciones.</em>
              </div>
            </div>

            <div class="step-card">
              <div class="step-number">Paso 8</div>
              <h4>Verificar y Validar (Opcional pero Recomendado)</h4>
              <p>Confirma que tu solución es correcta:</p>
              <ul>
                <li><strong>Sustituye en todas las restricciones:</strong> Verifica que se cumplan</li>
                <li><strong>Revisa las no negatividades:</strong> X₁ ≥ 0 y X₂ ≥ 0</li>
                <li><strong>Grafica la línea de isovalor:</strong> Dibuja la línea Z = valor óptimo para visualizar</li>
                <li><strong>Sentido común:</strong> ¿La solución tiene sentido en el contexto del problema?</li>
              </ul>
            </div>
          </div>

          <div class="cases-section">
            <h4>Casos Especiales en el Método Gráfico</h4>
            <div class="special-cases">
              <div class="case-card warning">
                <h5>Solución No Acotada</h5>
                <p>
                  La región factible se extiende al infinito en la dirección que mejora Z.
                  Las líneas de isovalor se pueden alejar indefinidamente.
                </p>
                <p><strong>Indicador:</strong> No hay límite superior (max) o inferior (min) para Z.</p>
              </div>

              <div class="case-card error">
                <h5>Sin Solución Factible</h5>
                <p>
                  Las restricciones son contradictorias y no hay región factible (área vacía).
                  Las zonas de las restricciones no se intersectan.
                </p>
                <p><strong>Gráficamente:</strong> No existe área que cumpla todas las restricciones.</p>
              </div>

              <div class="case-card info">
                <h5>Soluciones Múltiples</h5>
                <p>
                  La línea de la función objetivo es paralela a uno de los lados de la región factible.
                  Todos los puntos sobre ese lado son óptimos.
                </p>
                <p><strong>Resultado:</strong> Infinitas soluciones con el mismo valor óptimo de Z.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pasos para PENALIZACIÓN - Métodos de Transporte -->
        <div v-if="selectedMethod === 'penalizacion'">
          <div class="algorithm-header">
            <h3><span class="text-gradient">Métodos de Transporte - Comparación Paso a Paso</span></h3>
            <p class="algorithm-subtitle">Tres métodos para encontrar soluciones iniciales factibles en problemas de distribución</p>
          </div>

          <div class="step-container">
            <!-- Método Esquina Noroeste -->
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
                  <li>
                    <strong>Iniciar en celda (1,1)</strong>
                    <p>Posicionarse en la esquina superior izquierda de la tabla de transporte</p>
                  </li>
                  <li>
                    <strong>Asignar cantidad</strong>
                    <p>Cantidad = min(Oferta disponible del origen, Demanda disponible del destino)</p>
                  </li>
                  <li>
                    <strong>Actualizar disponibilidad</strong>
                    <p>Reducir la oferta y demanda según la cantidad asignada</p>
                  </li>
                  <li>
                    <strong>Mover posición</strong>
                    <p>• Si la oferta se agota → Mover a la siguiente fila (origen siguiente)<br>
                    • Si la demanda se agota → Mover a la siguiente columna (destino siguiente)</p>
                  </li>
                  <li>
                    <strong>Repetir</strong>
                    <p>Continuar hasta que toda la oferta esté asignada y toda la demanda satisfecha</p>
                  </li>
                </ol>
              </div>

              <div class="example-box">
                <strong>Ejemplo Ilustrativo:</strong>
                <p>Problema 3×3 con Oferta=[76, 82, 77] y Demanda=[72, 102, 41]</p>
                <div class="example-steps">
                  <div class="step-item">
                    <span class="step-label">Iteración 1:</span>
                    <span>Celda (O1,D1) → Asignar min(76, 72) = 72 unidades</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Iteración 2:</span>
                    <span>D1 satisfecho, mover a (O1,D2) → Asignar min(4, 102) = 4 unidades</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Iteración 3:</span>
                    <span>O1 agotado, mover a (O2,D2) → Asignar min(82, 98) = 82 unidades</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Continúa:</span>
                    <span>Siguiendo el mismo patrón hasta completar todas las asignaciones</span>
                  </div>
                </div>
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
                    <li>Produce soluciones de alta costo</li>
                    <li>Requiere muchas iteraciones para optimizar</li>
                    <li>No recomendado para uso práctico</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Método Costo Mínimo -->
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
                  <li>
                    <strong>Identificar celda de costo mínimo</strong>
                    <p>Buscar en toda la tabla de costos la celda con el valor más bajo entre las celdas activas</p>
                  </li>
                  <li>
                    <strong>Asignar cantidad máxima</strong>
                    <p>Cantidad = min(Oferta disponible del origen, Demanda disponible del destino)</p>
                  </li>
                  <li>
                    <strong>Actualizar disponibilidad</strong>
                    <p>Reducir la oferta del origen y demanda del destino según la cantidad asignada</p>
                  </li>
                  <li>
                    <strong>Eliminar fila o columna saturada</strong>
                    <p>• Si Oferta = 0 → Eliminar fila (origen completo)<br>
                    • Si Demanda = 0 → Eliminar columna (destino completo)</p>
                  </li>
                  <li>
                    <strong>Repetir con tabla reducida</strong>
                    <p>Buscar el siguiente costo mínimo entre las celdas restantes</p>
                  </li>
                  <li>
                    <strong>Finalizar</strong>
                    <p>Terminar cuando todas las ofertas y demandas sean cero</p>
                  </li>
                </ol>
              </div>

              <div class="example-box">
                <strong>Ejemplo Ilustrativo:</strong>
                <p>Problema 3×3 con los siguientes costos:</p>
                <div class="example-steps">
                  <div class="step-item">
                    <span class="step-label">Paso 1:</span>
                    <span>Costo mínimo = 4 en (O1,D1) → Asignar 72 unidades</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Paso 2:</span>
                    <span>Siguiente mínimo = 8 en (O1,D2) o (O3,D1) → Asignar según disponibilidad</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Paso 3:</span>
                    <span>Continuar seleccionando costos mínimos hasta completar</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Resultado:</span>
                    <span>Solución con costo 20-40% menor que Esquina Noroeste</span>
                  </div>
                </div>
              </div>

              <div class="info-box">
                <strong>Rendimiento:</strong> Al priorizar los costos bajos desde el inicio, este método típicamente produce
                una solución inicial con un costo total 20-40% menor que el método de Esquina Noroeste, reduciendo
                significativamente el trabajo de optimización posterior.
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

            <!-- Método Vogel -->
            <div class="step-card method-highlight">
              <div class="step-number">Método 3</div>
              <h4>Aproximación de Vogel (VAM) - Algoritmo Avanzado</h4>

              <div class="method-description">
                <p><strong>Principio:</strong> Algoritmo heurístico que utiliza el concepto de "costo de oportunidad" para evitar asignaciones costosas.</p>
                <p><strong>Característica:</strong> Generalmente produce la mejor solución inicial, frecuentemente cercana al óptimo.</p>
              </div>

              <div class="algorithm-steps">
                <h5>Pasos del Algoritmo:</h5>
                <ol>
                  <li>
                    <strong>Calcular penalizaciones por fila</strong>
                    <p>Para cada fila activa:</p>
                    <p>• Identificar los dos costos más bajos en la fila<br>
                    • Penalización (Fila) = Segundo menor costo - Menor costo</p>
                  </li>
                  <li>
                    <strong>Calcular penalizaciones por columna</strong>
                    <p>Para cada columna activa:</p>
                    <p>• Identificar los dos costos más bajos en la columna<br>
                    • Penalización (Columna) = Segundo menor costo - Menor costo</p>
                  </li>
                  <li>
                    <strong>Seleccionar máxima penalización</strong>
                    <p>Elegir la fila o columna que tenga la penalización más alta</p>
                    <p>(Si hay empate, elegir arbitrariamente o por costo mínimo)</p>
                  </li>
                  <li>
                    <strong>Asignar en celda de menor costo</strong>
                    <p>En la fila/columna seleccionada, asignar a la celda con el costo más bajo</p>
                    <p>Cantidad = min(Oferta disponible, Demanda disponible)</p>
                  </li>
                  <li>
                    <strong>Actualizar y eliminar</strong>
                    <p>• Reducir oferta y demanda según cantidad asignada<br>
                    • Eliminar fila o columna que se haya agotado</p>
                  </li>
                  <li>
                    <strong>Repetir desde paso 1</strong>
                    <p>Continuar con la tabla reducida hasta completar todas las asignaciones</p>
                  </li>
                </ol>
              </div>

              <div class="formula-box">
                <h6>Concepto Clave: Penalización</h6>
                <p><strong>¿Qué es la penalización?</strong></p>
                <p>La penalización representa el <em>costo de oportunidad</em> o "castigo" por NO elegir
                la mejor opción disponible en esa fila o columna.</p>
                <p><strong>¿Por qué es importante?</strong></p>
                <p>Una penalización alta indica que es crítico asignar a la mejor ruta ahora, porque
                la segunda mejor opción es mucho más costosa. Ignorar esta oportunidad resultaría
                en un incremento significativo del costo total.</p>
                <div class="formula-example">
                  <p><strong>Ejemplo:</strong></p>
                  <p>Fila con costos [4, 8, 16] → Penalización = 8 - 4 = 4</p>
                  <p>Fila con costos [10, 12, 15] → Penalización = 12 - 10 = 2</p>
                  <p>La primera fila tiene mayor penalización (4 > 2), indicando que es más urgente
                  asignar ahí para aprovechar el costo de 4.</p>
                </div>
              </div>

              <div class="example-box">
                <strong>Ejemplo Ilustrativo:</strong>
                <p>Tabla de costos 3×3:</p>
                <div class="example-steps">
                  <div class="step-item">
                    <span class="step-label">Iteración 1:</span>
                    <span>Calcular penalizaciones: Filas=[4,8,8], Columnas=[4,8,8]</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Selección:</span>
                    <span>Máxima penalización = 8 → Seleccionar esa fila/columna</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Asignación:</span>
                    <span>Asignar en la celda de menor costo de esa fila/columna</span>
                  </div>
                  <div class="step-item">
                    <span class="step-label">Resultado:</span>
                    <span>Solución típicamente dentro del 5-10% del óptimo</span>
                  </div>
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

            <!-- Comparación de eficiencia -->
            <div class="step-card">
              <div class="step-number">Comparación</div>
              <h4>Eficiencia Comparativa de los Métodos</h4>
              <p>Para un problema típico de transporte:</p>
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
                <strong>Dato importante:</strong> En estudios empíricos, el método VAM produce soluciones
                iniciales que están, en promedio, dentro del 5-10% del costo óptimo final, mientras que
                el método de Esquina Noroeste puede estar 30-50% por encima del óptimo.
              </div>
            </div>

            <!-- Ejemplo completo -->
            <div class="step-card">
              <div class="step-number">Ejemplo</div>
              <h4>Problema Completo - Aplicación de los 3 Métodos</h4>
              <div class="example-box">
                <strong>Enunciado:</strong><br>
                Una empresa tiene 3 plantas (orígenes) y debe abastecer a 3 almacenes (destinos).<br><br>

                <strong>Costos de transporte ($/unidad):</strong><br>
                <table class="mini-table" style="margin: 1rem 0;">
                  <tr><th></th><th>D1</th><th>D2</th><th>D3</th><th>Oferta</th></tr>
                  <tr><td>O1</td><td>4</td><td>8</td><td>8</td><td>76</td></tr>
                  <tr><td>O2</td><td>16</td><td>24</td><td>16</td><td>82</td></tr>
                  <tr><td>O3</td><td>8</td><td>16</td><td>24</td><td>77</td></tr>
                  <tr><td>Demanda</td><td>72</td><td>102</td><td>41</td><td></td></tr>
                </table>

                <strong>Soluciones esperadas:</strong><br>
                • <strong>Esquina Noroeste:</strong> Costo ≈ 3,100 - 3,400 (el más alto)<br>
                • <strong>Costo Mínimo:</strong> Costo ≈ 2,600 - 2,900 (intermedio)<br>
                • <strong>Vogel (VAM):</strong> Costo ≈ 2,460 - 2,600 (el más bajo)<br><br>

                <em>Los costos exactos dependen de cómo se rompen los empates durante la asignación.</em>
              </div>
            </div>
          </div>

          <div class="cases-section">
            <h4>Consideraciones Importantes</h4>
            <div class="special-cases">
              <div class="case-card info">
                <h5>Problema Balanceado</h5>
                <p>
                  Los tres métodos requieren que el problema esté balanceado: la suma total de ofertas
                  debe igualar la suma total de demandas. Si no está balanceado, se debe agregar una
                  fila o columna ficticia con costo cero.
                </p>
                <p><strong>Verificación:</strong> Σ Ofertas = Σ Demandas</p>
              </div>

              <div class="case-card warning">
                <h5>Empates en la Selección</h5>
                <p>
                  <strong>Esquina Noroeste:</strong> No hay empates posibles.<br>
                  <strong>Costo Mínimo:</strong> Si hay varios costos iguales mínimos, elegir arbitrariamente.<br>
                  <strong>Vogel:</strong> Si hay empate en penalizaciones, elegir la fila/columna con menor costo mínimo.
                </p>
              </div>

              <div class="case-card info">
                <h5>Optimización Posterior</h5>
                <p>
                  Las soluciones iniciales de estos tres métodos generalmente NO son óptimas.
                  Después de obtener la solución inicial, se aplican métodos de optimización como
                  <strong>MODI (Multiplicadores de Distribución)</strong> o <strong>Stepping Stone</strong>
                  para mejorar la solución hasta alcanzar el óptimo.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

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
