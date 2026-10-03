import styles from './SkillDetail.module.css'
import type { ConnectedSkill, SelectedSkill } from '@/sections/skills/Skills.types.ts'
import { DefaultDetailCard } from '@/sections/skills/detail/components/DefaultDetailCard.tsx'
import { SkillSelectedDetailCard } from '@/sections/skills/detail/components/SkillSelectedDetailCard.tsx'

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
  return (
    <aside
      className={ styles.panel }
      data-category={ skill?.category }
      data-revealed={ isRevealed }
      aria-live="polite"
      aria-label="Skill details"
    >
      {/* The key restarts the content animation every time another skill is shown. */}
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