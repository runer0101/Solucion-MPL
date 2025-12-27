/**
 * Utilidades de formateo compartidas entre componentes
 */

const EPSILON = 0.0001 // Tolerancia para comparaciones numéricas
const DECIMAL_PLACES = 2 // Decimales para formateo

/**
 * Formatea un número para mostrar en la interfaz
 * - Números muy pequeños (cerca de 0) se muestran como "0"
 * - Precisión configurable de decimales
 * - Separador de miles con espacios
 *
 * @param {number} numero - El número a formatear
 * @param {number} decimales - Número de decimales (por defecto 2)
 * @returns {string} - El número formateado como texto
 *
 * @example
 * formatNumber(1234.567)    // "1 234.57"
 * formatNumber(0.0000001)   // "0"
 * formatNumber(1000000, 0)  // "1 000 000"
 */
export function formatNumber(numero, decimales = DECIMAL_PLACES) {
  // Si el número es casi cero, retornar "0"
  if (Math.abs(numero) < EPSILON) {
    return '0'
  }

  // Redondear el número a la cantidad de decimales deseada
  const numeroRedondeado = numero.toFixed(decimales)

  // Separar la parte entera de la parte decimal
  const [parteEntera, parteDecimal] = numeroRedondeado.split('.')

  // Agregar separador de miles (espacio cada 3 dígitos)
  const parteEnteraConSeparador = agregarSeparadorDeMiles(parteEntera)

  // Unir parte entera y decimal
  if (parteDecimal) {
    return `${parteEnteraConSeparador}.${parteDecimal}`
  }

  return parteEnteraConSeparador
}

/**
 * Agrega un separador (espacio) cada 3 dígitos a un número
 *
 * @param {string} numero - El número como string (puede incluir signo negativo)
 * @returns {string} - Número con separadores de miles
 *
 * @example
 * agregarSeparadorDeMiles("1234567")   // "1 234 567"
 * agregarSeparadorDeMiles("-1234567")  // "-1 234 567"
 * agregarSeparadorDeMiles("42")        // "42"
 */
function agregarSeparadorDeMiles(numero) {
  // Manejar el signo negativo si existe
  const esNegativo = numero.startsWith('-')
  const numeroSinSigno = esNegativo ? numero.slice(1) : numero

  // Convertir el número (sin signo) en un array de dígitos invertido
  const digitosInvertidos = numeroSinSigno.split('').reverse()
  const resultado = []

  // Recorrer cada dígito
  for (let i = 0; i < digitosInvertidos.length; i++) {
    // Agregar el dígito
    resultado.push(digitosInvertidos[i])

    // Agregar espacio cada 3 dígitos (excepto al final)
    const esTercerDigito = (i + 1) % 3 === 0
    const noEsElUltimoDigito = i < digitosInvertidos.length - 1

    if (esTercerDigito && noEsElUltimoDigito) {
      resultado.push(' ')
    }
  }

  // Invertir de vuelta y unir en string
  const numeroFormateado = resultado.reverse().join('')

  // Agregar el signo negativo de vuelta si era negativo
  return esNegativo ? `-${numeroFormateado}` : numeroFormateado
}

/**
 * Verifica si un valor es un número válido
 * @param {*} value - Valor a verificar
 * @returns {boolean} - true si es un número válido
 */
export function isValidNumber(value) {
  return value !== '' && value !== null && value !== undefined &&
         !isNaN(value) && isFinite(value)
}

/**
 * Constantes exportadas
 */
export { EPSILON, DECIMAL_PLACES }
