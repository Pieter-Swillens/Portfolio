import type { ReactNode, Ref } from 'react'
import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  id: string
  title: string
  intro: ReactNode
  ref?: Ref<HTMLElement>
  isRevealed: boolean
}

export function SectionHeader({
  id,
  title,
  intro,
  ref,
  isRevealed
}: SectionHeaderProps) {
  return (
    <header ref={ ref } className={ styles.header } data-revealed={ isRevealed }>
      <h2 id={ id } className={ styles.title }>{ title }</h2>
      <p className={ styles.intro }>{ intro }</p>
    </header>
  )
}
