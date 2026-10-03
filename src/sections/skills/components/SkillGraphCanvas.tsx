import { memo, useCallback } from 'react'
import type { RefObject } from 'react'
import type { SkillGraphData } from '../graph/graph.types.ts'
import styles from './SkillGraphCanvas.module.css'

type SkillGraphCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  skills: SkillGraphData['skills']
  isHintVisible: boolean
  isRevealed: boolean
  onSelect: (skillKey: string) => void
  onHover: (skillKey: string | null) => void
}

export function SkillGraphCanvas({ canvasRef, skills, isHintVisible, isRevealed, onSelect, onHover }: SkillGraphCanvasProps) {
  return (
    <div className={ styles.frame } data-revealed={ isRevealed }>
      <canvas
        ref={ canvasRef }
        className={ styles.canvas }
        aria-label="Interactive web of skills and ways of working. The same skills are available as a list for keyboard users."
      />

      <p className={ styles.hint } data-visible={ isHintVisible } aria-hidden="true">
        Drag a node, or select one to follow its connections
      </p>

      <ul className={ styles.keyboardList }>
        { Object.entries(skills).map(([key, skill]) => (
          <li key={ key }>
            <KeyboardNode
              skillKey={ key }
              label={ `${skill.label} (${skill.categoryLabel})` }
              onSelect={ onSelect }
              onHover={ onHover }
            />
          </li>
        )) }
      </ul>
    </div>
  )
}

type KeyboardNodeProps = {
  skillKey: string
  label: string
  onSelect: (skillKey: string) => void
  onHover: (skillKey: string | null) => void
}

const KeyboardNode = memo(function KeyboardNode({ skillKey, label, onSelect, onHover }: KeyboardNodeProps) {
  const handleClick = useCallback(() => onSelect(skillKey), [skillKey, onSelect])
  const handleFocus = useCallback(() => onHover(skillKey), [skillKey, onHover])
  const handleBlur = useCallback(() => onHover(null), [onHover])

  return (
    <button type="button" className={ styles.keyboardNode } onClick={ handleClick } onFocus={ handleFocus } onBlur={ handleBlur }>
      { label }
    </button>
  )
})
