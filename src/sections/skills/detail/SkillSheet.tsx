import { useCallback, useEffect, useRef } from 'react'
import type { AnimationEvent, ReactNode } from 'react'
import type { SkillCategory } from '@/content/skills.ts'
import styles from './SkillSheet.module.css'

type SkillSheetProps = {
  category: SkillCategory
  label: string
  onClose: () => void
  isClosing: boolean
  onExited: () => void
  children: ReactNode
}

export function SkillSheet({ category, label, onClose, isClosing, onExited, children }: SkillSheetProps) {
  const sheetRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    sheetRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    if (isClosing && window.matchMedia('(prefers-reduced-motion: reduce)').matches) onExited()
  }, [isClosing, onExited])

  const handleAnimationEnd = useCallback((event: AnimationEvent<HTMLDialogElement>) => {
    if (isClosing && event.target === event.currentTarget) onExited()
  }, [isClosing, onExited])

  return (
    <div className={ styles.root } data-closing={ isClosing }>
      <button type="button" className={ styles.backdrop } onClick={ onClose } aria-label="Close skill details" tabIndex={ -1 } />
      <dialog
        ref={ sheetRef }
        open
        className={ styles.sheet }
        data-category={ category }
        aria-label={ label }
        tabIndex={ -1 }
        onAnimationEnd={ handleAnimationEnd }
      >
        <span className={ styles.handle } aria-hidden="true" />
        { children }
      </dialog>
    </div>
  )
}
