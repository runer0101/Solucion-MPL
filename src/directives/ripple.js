export const vRipple = {
  mounted(el) {
    el.addEventListener('click', (event) => {
      const ripple = document.createElement('span')
      const rect = el.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + 'px'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.classList.add('ripple-effect')
      el.appendChild(ripple)

      ripple.addEventListener('animationend', () => ripple.remove())
    })
  }
}
