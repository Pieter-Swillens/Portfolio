import styles from './styles/DetailCard.module.css'
import skillSelectedStyles from './styles/SkillSelectedDetailCard.module.css'
import { LinkButton } from "@/components/buttons/link-button/LinkButton.tsx";
import type { ConnectedSkill, SelectedSkill } from "@/sections/skills/Skills.types.ts";


type SkillSelectedDetailCardProps = {
  skill: SelectedSkill
  links: readonly ConnectedSkill[],
  onSelect: (key: string) => void
  onClear: () => void
}

export function SkillSelectedDetailCard({
  skill,
  links,
  onSelect,
  onClear
}: SkillSelectedDetailCardProps) {

  return (
    <>
      <div className={ skillSelectedStyles.top_row }>
        <p className={ skillSelectedStyles.category }>{ skill.categoryLabel }</p>
        <button
          type="button"
          className={ skillSelectedStyles.clear }
          onClick={ onClear }
          aria-label="Clear selection"
        >
          ×
        </button>
      </div>

      <h3 className={ styles.title }>{ skill.label }</h3>
      <p className={ styles.description }>{ skill.description }</p>

      { links.length > 0 && (
        <div className={ skillSelectedStyles.connected_to_skills }>
          <h4 className={ skillSelectedStyles.subhead }>
            Connected to <span className={ skillSelectedStyles.count }>{ links.length }</span>
          </h4>
          <ul className={ skillSelectedStyles.links }>{ links.map(connectedSkill => (
            <li key={ connectedSkill.key } data-category={ connectedSkill.category }>
              <LinkButton link={ connectedSkill } onSelect={ onSelect }/>
            </li>
          )) }</ul>
        </div>
      ) }
    </>
  )
}