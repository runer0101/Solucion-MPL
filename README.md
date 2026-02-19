# 📊 Solucion de Modelos de Programacion Lineal

Una aplicacion web interactiva y educativa para resolver problemas de Programacion Lineal utilizando los metodos Simplex, Grafico y Transporte. Desarrollada con Vue 3 y Vite, ofrece explicaciones paso a paso detalladas, validacion cruzada entre metodos y una interfaz visual intuitiva.

![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## 🌐 Demo en Vivo

**https://runer0101.github.io/Solucion-MPL/**

---

## ✨ Caracteristicas

### 🎯 Metodos de Solucion

#### Metodo Simplex
Resolucion algebraica para problemas con cualquier numero de variables.

- Manejo automatico de variables de holgura y artificiales
- Iteraciones detalladas con tablas Simplex
- Identificacion de soluciones optimas, no acotadas o infactibles
- Explicaciones matematicas paso a paso

#### Metodo Grafico
Visualizacion geometrica para problemas con 2 variables.

- Representacion visual de la region factible
- Identificacion de puntos extremos
- Grafica de la funcion objetivo
- Analisis grafico de restricciones

#### Metodos de Transporte
Tres algoritmos para problemas de distribucion y logistica.

- **Esquina Noroeste**: Metodo heuristico basico para solucion inicial
- **Costo Minimo**: Prioriza asignaciones de menor costo
- **Aproximacion de Vogel (VAM)**: Metodo de penalizacion mas eficiente
- Comparacion automatica de costos entre los 3 metodos

#### Modo Comparacion
Validacion cruzada y comparacion automatica entre todos los metodos aplicables para verificar convergencia de resultados.

### 🎨 Funcionalidades

- **Resolucion Paso a Paso**: Visualiza cada iteracion con explicaciones matematicas detalladas
- **Sistema de Pestañas**: Navegacion intuitiva entre Calculadora, Tutorial y Teoria
- **Validacion Cruzada**: Verifica convergencia entre Simplex y Grafico automaticamente
- **Comparacion de Costos**: Identifica el metodo optimo y calcula ahorro de costos
- **Teoria Integrada**: Explicaciones matematicas completas de cada metodo
- **Tutorial Interactivo**: Guia paso a paso para aprender a formular problemas
- **Ejemplos Precargados**: Casos de prueba listos para Simplex, Grafico y Transporte
- **Diseño Responsive**: Optimizado para desktop, tablet y movil
- **Interfaz Moderna**: Diseño con gradientes, animaciones y componentes interactivos
- **Exportacion de Resultados**: Descarga soluciones en formato texto
- **Deploy Automatico**: CI/CD con GitHub Actions

---

## 🚀 Inicio Rapido

### Prerequisitos

- [Node.js](https://nodejs.org/) v20.19+ o v22.12+
- npm (incluido con Node.js)

### Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/runer0101/Solucion-MPL.git
cd Solucion-MPL

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor de desarrollo estara disponible en `http://localhost:5173`

### Comandos de calidad y pruebas

```bash
# Ejecutar linter
npm run lint

# Formatear codigo
npm run format

# Ejecutar tests unitarios
npm run test
```

### Compilacion para Produccion

```bash
npm run build
```

Los archivos compilados se generaran en el directorio `dist/`

---

## 📖 Guia de Uso

### Metodo Simplex / Grafico

1. Selecciona el metodo desde la pantalla de bienvenida
2. Configura el numero de variables y restricciones
3. Elige el tipo de problema: Maximizar o Minimizar
4. Ingresa los coeficientes de la funcion objetivo
5. Define las restricciones con sus coeficientes y tipos (≤, ≥, =)
6. Haz clic en "Resolver Problema"

**Resultados:**
- Solucion optima con valores de variables
- Iteraciones paso a paso (Simplex)
- Grafica de la region factible (Grafico - solo 2 variables)
- Explicacion detallada del resultado

**Consejo**: Usa la pestaña "Tutorial" para aprender a formular problemas y la pestaña "Teoria" para entender el metodo matematico.

### Metodo de Transporte

1. Selecciona "Metodos de Transporte"
2. Define el numero de origenes (fuentes) y destinos
3. Ingresa la oferta disponible en cada origen
4. Ingresa la demanda requerida en cada destino
5. Define la matriz de costos de transporte
6. La aplicacion resolvera automaticamente con los 3 metodos

**Resultados:**
- Matriz de asignaciones para cada metodo
- Costo total de transporte calculado
- Comparacion de costos y metodo optimo
- Ahorro calculado entre metodos

### Comparar Todos los Metodos

1. Selecciona "Comparar Todos los Metodos"
2. Define tu problema de programacion lineal
3. La aplicacion ejecutara todos los metodos aplicables
4. Mostrara si los metodos convergen a la misma solucion
5. Identificara el metodo mas recomendado

---

## 🏗️ Estructura del Proyecto

```
Solucion-MPL/
├── src/
│   ├── components/
│   │   ├── SimplexInput.vue       # Formulario con pestañas (defineModel)
│   │   ├── SimplexSolution.vue    # Visualizacion de soluciones
│   │   ├── SimplexTable.vue       # Tabla Simplex iterativa
│   │   ├── TransporteInput.vue    # Formulario de transporte
│   │   ├── CompararTodos.vue      # Modo comparacion
│   │   └── MethodExplanation.vue  # Explicaciones teoricas
│   ├── utils/
│   │   ├── simplex.js            # Algoritmo Simplex
│   │   ├── grafico.js            # Metodo Grafico
│   │   ├── transporte.js         # Metodos de transporte
│   │   └── formatters.js         # Formato numerico
│   ├── directives/
│   │   └── ripple.js             # Directiva v-ripple para botones
│   ├── data/
│   │   └── examples.js           # Ejemplos compartidos
│   ├── assets/
│   │   └── variables.css         # Variables CSS globales
│   ├── App.vue                   # Componente raiz
│   └── main.js                   # Punto de entrada
├── public/
│   └── images/                   # Recursos graficos
├── .github/workflows/
│   ├── deploy.yml                # GitHub Actions deploy a GitHub Pages
│   └── ci.yml                    # CI: lint, tests, build
├── test/
│   └── simplex.spec.js           # Tests unitarios (Vitest)
├── .eslintrc.cjs                 # Configuracion ESLint
├── .prettierrc                   # Configuracion Prettier
├── vite.config.js                # Configuracion de Vite
├── vitest.config.js              # Configuracion de Vitest
├── jsconfig.json                 # Configuracion de paths (@/)
├── package.json                  # Dependencias y scripts
└── README.md                     # Documentacion
```

---

## 🛠️ Stack Tecnologico

| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| Vue.js | 3.5.25 | Framework JavaScript reactivo |
| Vite | 7.2.4 | Build tool y dev server |
| Node.js | 20+ | Entorno de ejecucion |
| jsPDF | 3.0.4 | Generacion de PDFs |
| jsPDF-AutoTable | 5.0.2 | Tablas para PDFs |
| CSS3 | - | Estilos modernos |
| GitHub Actions | - | CI/CD pipeline |
| GitHub Pages | - | Hosting estatico |

### Patrones Vue 3 Modernos Utilizados

- **`<script setup>`** en todos los componentes (Composition API)
- **`defineModel()`** para two-way binding declarativo (SimplexInput)
- **`v-model:prop`** para comunicacion padre-hijo sin boilerplate
- **Template refs** con `ref()` para acceso al DOM (IntersectionObserver)
- **Directivas personalizadas** (`v-ripple`) para efectos reutilizables
- **`computed()`** y **`watch()`** para reactividad derivada
- **`nextTick()`** para operaciones post-render
- **Modulo de datos compartido** para evitar duplicacion de ejemplos

---

## 📚 Algoritmos Implementados

### Metodo Simplex

Algoritmo iterativo basado en algebra lineal para resolver problemas de programacion lineal con n variables.

**Implementacion:**
- Conversion automatica a forma estandar
- Manejo de variables de holgura, exceso y artificiales
- Deteccion de soluciones no acotadas e infactibles
- Pivoteo con metodo de Gauss-Jordan
- Registro completo de iteraciones

**Complejidad:** O(n³) por iteracion

### Metodo Grafico

Visualizacion geometrica de la region factible para problemas bidimensionales.

**Implementacion:**
- Calculo de intersecciones de restricciones
- Identificacion de vertices del poligono factible
- Evaluacion de la funcion objetivo en puntos extremos
- Renderizado grafico de restricciones y region factible

**Limitacion:** Solo aplicable para 2 variables

### Metodos de Transporte

#### Esquina Noroeste
Metodo heuristico que asigna desde la esquina superior izquierda.

**Complejidad:** O(m×n)

#### Costo Minimo
Prioriza asignaciones en celdas con menor costo unitario.

**Complejidad:** O(m×n log(m×n))

#### Vogel (VAM)
Metodo de penalizacion que considera diferencias de costos.

**Complejidad:** O(m²×n²)

**Caracteristicas comunes:**
- Verificacion automatica de balance (oferta = demanda)
- Calculo de costo total de transporte
- Matriz de asignaciones resultante
- Comparacion automatica entre metodos

---

## 🎓 Contexto Academico

Este proyecto fue desarrollado como herramienta educativa para el curso de **Investigacion Operativa I** en la **Universidad Privada Domingo Savio (UPDS)**.

**Objetivos educativos:**
- Facilitar el aprendizaje de metodos de optimizacion lineal
- Proporcionar visualizaciones interactivas de conceptos matematicos
- Ofrecer explicaciones paso a paso de cada iteracion
- Permitir comparacion practica entre diferentes metodos
- Integrar material teorico con la practica

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a tu rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Ideas para Contribuir

- Reportar bugs o errores matematicos
- Proponer nuevos metodos de optimizacion
- Mejorar la documentacion o teoria
- Mejorar la UI/UX
- Traducir a otros idiomas
- Optimizar rendimiento de algoritmos
- Agregar tests unitarios

---

## 📄 Licencia

Este proyecto esta bajo la Licencia MIT. Consulta el archivo `LICENSE` para mas detalles.

---

## 👤 Autor

**Cesar Camacho Duran**

- GitHub: [@runer0101](https://github.com/runer0101)
- Proyecto: [Solucion MPL](https://github.com/runer0101/Solucion-MPL)

---

## 🙏 Agradecimientos

- Universidad Privada Domingo Savio (UPDS)
- Curso de Investigacion Operativa I
- Comunidad de desarrolladores de Vue.js
- Contribuidores del proyecto

---

## ⭐ Soporte

Si este proyecto te ha sido util, considera:

- ⭐ Darle una estrella en GitHub
- 🔀 Hacer fork para tus propios proyectos
- 📢 Compartir con otros estudiantes
- 🐛 Reportar bugs o sugerir mejoras

---

<div align="center">

**[🌐 Ver Demo](https://runer0101.github.io/Solucion-MPL/)** · **[🐛 Reportar Bug](https://github.com/runer0101/Solucion-MPL/issues)** · **[✨ Solicitar Feature](https://github.com/runer0101/Solucion-MPL/issues)**

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Desarrollado para estudiantes de Investigacion Operativa**

</div>
