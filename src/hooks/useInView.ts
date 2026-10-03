import { useEffect, useRef, useState } from 'react'

type UseInViewOptions = {
  /** Shrinks the viewport, e.g. '0px 0px -20% 0px' triggers once the element is 20% into the screen. */
  rootMargin?: string
}

/** Becomes true the first time the element scrolls into view, and stays true. Use it to start entrance animations. */
export function useInView<T extends Element>({ rootMargin = '0px' }: UseInViewOptions = {}) {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      setIsInView(true)
      observer.disconnect()
    }, { rootMargin })

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, isInView] as const
}
