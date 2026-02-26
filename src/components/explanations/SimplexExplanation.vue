<template>
  <div>
    <!-- INTRO -->
    <div v-if="activeSection === 'intro'">
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

    <!-- STEPS -->
    <div v-if="activeSection === 'steps'">
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
  </div>
</template>

<script setup>
defineProps({
  activeSection: { type: String, default: 'intro' }
})
</script>
