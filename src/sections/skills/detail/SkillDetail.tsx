import { useCallback, useState } from 'react'
import styles from './SkillDetail.module.css'
import { useIsMobile } from '@/hooks/useIsMobile.ts'
import type { ConnectedSkill, SelectedSkill } from '@/sections/skills/Skills.types.ts'
import { DefaultDetailCard } from '@/sections/skills/detail/components/DefaultDetailCard.tsx'
import { SkillSelectedDetailCard } from '@/sections/skills/detail/components/SkillSelectedDetailCard.tsx'
import { SkillSheet } from '@/sections/skills/detail/SkillSheet.tsx'

const SHEET_QUERY = '(max-width: 63.99rem)'

type SkillDetailProps = {
  skill: SelectedSkill | null
  links: readonly ConnectedSkill[]
  isRevealed: boolean
  startLabel: string
  onSelect: (key: string) => void
  onStart: () => void
  onClear: () => void
}

export function SkillDetail({
  skill,
  links,
  isRevealed,
  startLabel,
  onSelect,
  onStart,
  onClear,
}: SkillDetailProps) {
  const opensAsSheet = useIsMobile(SHEET_QUERY)

  const [lastShown, setLastShown] = useState<{ skill: SelectedSkill; links: readonly ConnectedSkill[] } | null>(null)
  if (skill && (lastShown?.skill !== skill || lastShown.links !== links)) setLastShown({ skill, links })
  const handleExited = useCallback(() => setLastShown(null), [])

  if (opensAsSheet) {
    const shown = skill ? { skill, links } : lastShown
    if (!shown) return null

    return (
      <SkillSheet
        category={ shown.skill.category }
        label={ shown.skill.label }
        onClose={ onClear }
        isClosing={ skill === null }
        onExited={ handleExited }
      >
        <div key={ shown.skill.key } className={ styles.content }>
          <SkillSelectedDetailCard skill={ shown.skill } links={ shown.links } onSelect={ onSelect } onClear={ onClear } />
        </div>
      </SkillSheet>
    )
  }

  return (
    <aside
      className={ styles.panel }
      data-category={ skill?.category }
      data-revealed={ isRevealed }
      aria-live="polite"
      aria-label="Skill details"
    >
      <div key={ skill?.key ?? 'intro' } className={ styles.content }>
        { skill ? (
          <SkillSelectedDetailCard
            skill={ skill }
            links={ links }
            onSelect={ onSelect }
            onClear={ onClear }
          />
        ) : (
          <DefaultDetailCard
            startLabel={ startLabel }
            onStart={ onStart }
          />
        ) }
      </div>
    </aside>
  )
}