import { useEffect, useState } from 'react'

export function useActiveSection(anchors: readonly string[]) {
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null)

  useEffect(() => {
    const elements = anchors
      .map(anchor => document.getElementById(anchor))
      .filter((element): element is HTMLElement => element !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) setActiveAnchor(target.id)
        else setActiveAnchor(current => (current === target.id ? null : current))
      }
    }, { rootMargin: '-40% 0px -59% 0px' })

    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
    }, [anchors])

  return activeAnchor
}
