<template>
  <div>
    <!-- INTRO -->
    <div v-if="activeSection === 'intro'">
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

    <!-- STEPS -->
    <div v-if="activeSection === 'steps'">
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
  </div>
</template>

<script setup>
defineProps({
  activeSection: { type: String, default: 'intro' }
})
</script>
