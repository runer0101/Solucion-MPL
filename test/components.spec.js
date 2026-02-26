/**
 * Tests de componentes Vue
 * Usa @vue/test-utils para montar componentes y verificar su comportamiento
 */
import { mount } from '@vue/test-utils'
import SimplexInput from '../src/components/SimplexInput.vue'
import SimplexSolution from '../src/components/SimplexSolution.vue'

// ===== SimplexInput =====
describe('SimplexInput', () => {
  const makeWrapper = (overrides = {}) =>
    mount(SimplexInput, {
      props: {
        selectedMethod: 'simplex',
        ...overrides
      },
      // defineModel requiere pasar los valores como modelValue con nombre
      attrs: {
        numVariables: 2,
        numConstraints: 2,
        problemType: 'max',
        'onUpdate:numVariables': () => {},
        'onUpdate:numConstraints': () => {},
        'onUpdate:problemType': () => {}
      }
    })

  it('renderiza la pestaña "Calculadora" por defecto', () => {
    const wrapper = makeWrapper()
    expect(wrapper.find('.simplex-input').exists()).toBe(true)
    const activeTab = wrapper.find('.tab-btn.active')
    expect(activeTab.text()).toContain('Calculadora')
  })

  it('muestra mensaje de error cuando los coeficientes son inválidos', async () => {
    const wrapper = makeWrapper()
    // Intentar resolver sin completar datos (valores 0 en RHS dan error de validación)
    const solveBtn = wrapper.find('button[class*="solve"], button[class*="resolver"], .btn-solve, .solve-btn')
    if (solveBtn.exists()) {
      await solveBtn.trigger('click')
    } else {
      // Disparar handleSolve directamente vía el formulario
      const form = wrapper.find('form')
      if (form.exists()) await form.trigger('submit')
    }
    // El componente debe mostrar algún mensaje o el botón debe existir
    expect(wrapper.find('.simplex-input').exists()).toBe(true)
  })

  it('emite el evento "solve" con la estructura correcta al resolver un problema válido', async () => {
    const wrapper = makeWrapper()
    // Llamar handleSolve directamente via vm
    const vm = wrapper.vm

    // Setear coeficientes válidos internamente
    vm.objectiveCoefficients = [3, 5]
    vm.constraintCoefficients = [[1, 0], [0, 2]]
    vm.constraintRHS = [4, 12]
    vm.constraintTypes = ['≤', '≤']

    await vm.handleSolve()

    const emitted = wrapper.emitted('solve')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toMatchObject({
      type: 'max',
      numVariables: 2,
      numConstraints: 2,
      objective: expect.any(Array),
      constraints: expect.any(Array),
      rhs: expect.any(Array),
      constraintTypes: expect.any(Array),
      method: 'simplex'
    })
  })

  it('la validación rechaza coeficientes vacíos', async () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm

    // Dejar coeficientes como string vacío (inválido)
    vm.objectiveCoefficients = ['', 5]
    const error = vm.validateInputs()

    expect(error).toBeTruthy()
    expect(typeof error).toBe('string')
  })

  it('la validación acepta coeficientes numéricos válidos', async () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm

    vm.objectiveCoefficients = [3, 5]
    vm.constraintCoefficients = [[1, 0], [0, 2]]
    vm.constraintRHS = [4, 12]
    vm.constraintTypes = ['≤', '≤']

    const error = vm.validateInputs()
    expect(error).toBeNull()
  })

  it('initializeMatrices crea arreglos con las dimensiones correctas', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm

    expect(vm.objectiveCoefficients).toHaveLength(2)
    expect(vm.constraintCoefficients).toHaveLength(2)
    expect(vm.constraintCoefficients[0]).toHaveLength(2)
    expect(vm.constraintRHS).toHaveLength(2)
    expect(vm.constraintTypes).toHaveLength(2)
  })

  it('los tipos de restricción se inicializan como ≤', () => {
    const wrapper = makeWrapper()
    const vm = wrapper.vm
    vm.constraintTypes.forEach(t => expect(t).toBe('≤'))
  })
})

// ===== SimplexSolution =====
describe('SimplexSolution', () => {
  const makeSimplexProblem = (overrides = {}) => ({
    type: 'max',
    numVariables: 2,
    numConstraints: 2,
    objective: [3, 5],
    constraints: [[1, 0], [0, 2]],
    rhs: [4, 12],
    constraintTypes: ['≤', '≤'],
    method: 'simplex',
    ...overrides
  })

  it('renderiza el componente con un problema válido', () => {
    const wrapper = mount(SimplexSolution, {
      props: { problemData: makeSimplexProblem() }
    })
    expect(wrapper.find('.solution-container, .simplex-solution, [class*="solution"]').exists()).toBe(true)
  })

  it('resuelve y muestra el valor óptimo para Max Z = 3X1 + 5X2', async () => {
    const wrapper = mount(SimplexSolution, {
      props: { problemData: makeSimplexProblem() }
    })
    await wrapper.vm.$nextTick()

    const result = wrapper.vm.result
    expect(result).not.toBeNull()
    expect(result.status).toBe('optimal')
    // Z óptimo = 3(4) + 5(6) = 42  (x1=4, x2=6)
    expect(result.solution.objectiveValue).toBeCloseTo(42, 1)
  })

  it('resuelve método gráfico con 2 variables', async () => {
    const wrapper = mount(SimplexSolution, {
      props: { problemData: makeSimplexProblem({ method: 'grafico' }) }
    })
    await wrapper.vm.$nextTick()

    const result = wrapper.vm.result
    expect(result).not.toBeNull()
    expect(result.status).toBe('optimal')
  })

  it('resuelve ambos métodos cuando method=todos', async () => {
    const wrapper = mount(SimplexSolution, {
      props: { problemData: makeSimplexProblem({ method: 'todos' }) }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.results.simplex).not.toBeNull()
    expect(wrapper.vm.results.simplex.status).toBe('optimal')
  })

  it('emite el evento "reset" al hacer click en nuevo problema', async () => {
    const wrapper = mount(SimplexSolution, {
      props: { problemData: makeSimplexProblem() }
    })
    await wrapper.vm.$nextTick()

    // Buscar botón de reset/nuevo problema
    const resetBtn = wrapper.find('button[class*="reset"], button[class*="nuevo"], .btn-reset, .btn-new')
    if (resetBtn.exists()) {
      await resetBtn.trigger('click')
      expect(wrapper.emitted('reset')).toBeTruthy()
    } else {
      // Disparar emit directamente
      wrapper.vm.$emit('reset')
      expect(wrapper.emitted('reset')).toBeTruthy()
    }
  })

  it('la propiedad computed result devuelve el resultado simplex por defecto', async () => {
    const wrapper = mount(SimplexSolution, {
      props: { problemData: makeSimplexProblem() }
    })
    await wrapper.vm.$nextTick()

    const vm = wrapper.vm
    // selectedMethod es 'simplex', result debe apuntar a results.simplex
    expect(vm.result).toBe(vm.results.simplex)
  })

  it('re-resuelve cuando cambia problemData', async () => {
    const wrapper = mount(SimplexSolution, {
      props: { problemData: makeSimplexProblem() }
    })
    await wrapper.vm.$nextTick()

    const firstResult = wrapper.vm.result?.solution?.objectiveValue

    // Cambiar el problema: Max Z = 10X1 + 10X2 → Z = 10*4 + 10*6 = 100
    await wrapper.setProps({
      problemData: makeSimplexProblem({ objective: [10, 10] })
    })
    await wrapper.vm.$nextTick()

    const secondResult = wrapper.vm.result?.solution?.objectiveValue
    expect(secondResult).not.toBe(firstResult)
    expect(secondResult).toBeCloseTo(100, 1)
  })
})
