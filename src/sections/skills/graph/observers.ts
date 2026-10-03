type Dispose = () => void

export function observeSize(element: Element, onChange: () => void): Dispose {
  const observer = new ResizeObserver(onChange)
  observer.observe(element)
  return () => observer.disconnect()
}

export function observeVisibility(element: Element, onChange: (isVisible: boolean) => void): Dispose {
  const observer = new IntersectionObserver(([entry]) => onChange(entry?.isIntersecting ?? true))
  observer.observe(element)
  return () => observer.disconnect()
}

/** Calls back when the light/dark theme changes, either through `data-theme` or the system setting. */
export function observeThemeChanges(onChange: () => void): Dispose {
  const attributeObserver = new MutationObserver(onChange)
  attributeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  const systemScheme = window.matchMedia('(prefers-color-scheme: dark)')
  systemScheme.addEventListener('change', onChange)

  return () => {
    attributeObserver.disconnect()
    systemScheme.removeEventListener('change', onChange)
  }
}
