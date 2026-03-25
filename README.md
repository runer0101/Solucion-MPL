<div align="center">

# Solucion MPL

**Aplicacion educativa para resolver problemas de Programacion Lineal**
Simplex · Grafico · Transporte · Comparacion cruzada

[![CI](https://github.com/runer0101/Solucion-MPL/actions/workflows/ci.yml/badge.svg)](https://github.com/runer0101/Solucion-MPL/actions/workflows/ci.yml)
[![Deploy](https://github.com/runer0101/Solucion-MPL/actions/workflows/deploy.yml/badge.svg)](https://github.com/runer0101/Solucion-MPL/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)

**[Ver Demo en Vivo](https://runer0101.github.io/Solucion-MPL/)** · **[Reportar Bug](https://github.com/runer0101/Solucion-MPL/issues/new?template=bug_report.md)** · **[Solicitar Feature](https://github.com/runer0101/Solucion-MPL/issues/new?template=feature_request.md)**

</div>

---

## Que es esto

Herramienta web interactiva para resolver y aprender **Programacion Lineal**. Desarrollada como apoyo academico para el curso de Investigacion Operativa I en la **Universidad Privada Domingo Savio (UPDS)**.

Cada metodo muestra el proceso completo paso a paso — no solo el resultado final.

---

## Metodos disponibles

| Metodo | Descripcion | Variables |
|--------|-------------|-----------|
| **Simplex** | Resolucion algebraica iterativa con tablas completas | N variables |
| **Grafico** | Visualizacion geometrica de la region factible | Solo 2 variables |
| **Transporte** | Esquina Noroeste, Costo Minimo y Vogel (VAM) | M origenes × N destinos |
| **Comparacion** | Validacion cruzada automatica entre todos los metodos | N variables |

---

## Funcionalidades

- **Paso a paso** — cada iteracion explicada con notacion matematica
- **Comparacion de costos** — identifica el metodo optimo de transporte y calcula el ahorro
- **Validacion cruzada** — verifica que Simplex y Grafico convergen al mismo resultado
- **Ejemplos precargados** — casos listos para empezar sin configurar nada
- **Tutorial integrado** — guia interactiva para formular problemas desde cero
- **Teoria completa** — referencia matematica de cada metodo dentro de la app
- **Exportacion** — descarga la solucion en formato texto o PDF
- **Responsive** — funciona en desktop, tablet y movil

---

## Stack tecnologico

| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| Vue.js | 3.5 | Framework reactivo (Composition API) |
| Vite | 7 | Build tool y dev server |
| jsPDF + AutoTable | 3 / 5 | Generacion y exportacion de PDFs |
| Vitest | 3 | Tests unitarios |
| ESLint + Prettier | — | Calidad y formato de codigo |
| GitHub Actions | — | CI/CD automatico |
| GitHub Pages | — | Hosting estatico |

**Patrones Vue 3 modernos:** `<script setup>`, `defineModel()`, directivas personalizadas (`v-ripple`), `computed()`, `watch()`, `nextTick()`, lazy loading de componentes.

---

## Inicio rapido

**Prerequisito:** Node.js v20.19+ o v22.12+

```bash
git clone https://github.com/runer0101/Solucion-MPL.git
cd Solucion-MPL
npm install
npm run dev
```

El servidor estara disponible en `http://localhost:5173`

### Comandos disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Compilacion para produccion
npm run preview   # Previsualizar build
npm run lint      # Linter ESLint
npm run format    # Formatear con Prettier
npm run test      # Tests unitarios (Vitest)
```

---

## Estructura del proyecto

```
Solucion-MPL/
├── src/
│   ├── components/
│   │   ├── SimplexInput.vue       # Formulario (defineModel, pestanas)
│   │   ├── SimplexSolution.vue    # Visualizacion de resultados
│   │   ├── SimplexTable.vue       # Tabla Simplex iterativa
│   │   ├── TransporteInput.vue    # Formulario de transporte
│   │   ├── CompararTodos.vue      # Comparacion cruzada
│   │   └── MethodExplanation.vue  # Explicaciones teoricas
│   ├── utils/
│   │   ├── simplex.js             # Algoritmo Simplex (Big-M)
│   │   ├── grafico.js             # Metodo Grafico
│   │   ├── transporte.js          # NW, Costo Minimo, Vogel
│   │   └── formatters.js          # Formato numerico
│   ├── directives/
│   │   └── ripple.js              # Directiva v-ripple
│   ├── data/
│   │   └── examples.js            # Ejemplos compartidos
│   ├── assets/
│   │   └── variables.css          # Variables CSS globales
│   ├── App.vue                    # Componente raiz
│   └── main.js                   # Punto de entrada
├── test/
│   └── simplex.spec.js            # Tests unitarios
├── .github/workflows/
│   ├── ci.yml                     # CI: lint, test, build
│   └── deploy.yml                 # Deploy a GitHub Pages
├── vite.config.js
├── vitest.config.js
└── package.json
```

---

## Algoritmos

### Simplex
Resolucion algebraica con pivoteo Gauss-Jordan. Maneja variables de holgura, exceso y artificiales (metodo Big-M). Detecta soluciones infactibles y no acotadas. Complejidad: O(n³) por iteracion.

### Grafico
Calcula intersecciones de restricciones, identifica los vertices del poligono factible y evalua la funcion objetivo en cada extremo. Solo para 2 variables.

### Transporte

| Metodo | Estrategia | Complejidad |
|--------|-----------|-------------|
| Esquina Noroeste | Asigna desde la celda superior izquierda | O(m×n) |
| Costo Minimo | Prioriza celdas de menor costo | O(m×n log(m×n)) |
| Vogel (VAM) | Penalizacion por diferencia de costos | O(m²×n²) |

Los tres metodos verifican balance automaticamente (oferta = demanda) y se comparan entre si para identificar el de menor costo total.

---

## Como usar

### Simplex / Grafico

1. Selecciona el metodo desde la pantalla de bienvenida
2. Configura variables, restricciones y tipo de problema (Max / Min)
3. Ingresa coeficientes de la funcion objetivo y restricciones
4. Haz clic en **Resolver Problema**

Los resultados muestran la solucion optima, las iteraciones completas y (para el metodo Grafico) la grafica de la region factible.

### Transporte

1. Define origenes, destinos, oferta, demanda y matriz de costos
2. La app resuelve automaticamente con los 3 metodos y compara resultados

### Comparacion

Ejecuta todos los metodos aplicables sobre el mismo problema y muestra si convergen al mismo resultado optimo.

---

## Contexto academico

Desarrollado para el curso de **Investigacion Operativa I** — Universidad Privada Domingo Savio (UPDS). El objetivo es complementar la teoria con visualizaciones interactivas que faciliten la comprension de los algoritmos de optimizacion lineal.

---

## Contribuciones

Las contribuciones son bienvenidas.

```bash
# 1. Fork el repositorio
# 2. Crea tu rama
git checkout -b feat/nueva-funcionalidad

# 3. Commit con formato convencional
git commit -m "feat: descripcion del cambio"

# 4. Push y abre un Pull Request
git push origin feat/nueva-funcionalidad
```

Areas donde puedes contribuir: correccion de bugs matematicos, nuevos metodos de optimizacion, mejoras de UI/UX, traduccion a otros idiomas, mas tests unitarios.

---

## Licencia

MIT — consulta el archivo [LICENSE](LICENSE) para mas detalles.

---

<div align="center">

Desarrollado por **[Cesar Camacho Duran](https://github.com/runer0101)** · UPDS · Investigacion Operativa I

</div>
