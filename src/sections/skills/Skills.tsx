import { useCallback, useMemo, useState } from 'react'
import { SkillDetail } from './detail/SkillDetail.tsx'
import { CategoryFilter } from './components/CategoryFilter.tsx'
import { SkillGraphCanvas } from './components/SkillGraphCanvas.tsx'
import { useInView } from '@/hooks/useInView.ts'
import { useSkillGraph } from './hooks/useSkillGraph.ts'
import { findConnectedSkills, findSelectedSkill } from './skillSelectors.ts'
import type { SkillsProps } from './Skills.types.ts'
import styles from './Skills.module.css'
import { PortfolioSection } from "@/components/section/PortfolioSection.tsx";

const sectionHeaderInfo = {
  title: "How I build software",
  intro: "The disciplines I rely on, the habits that connect them, and what it takes to keep software healthy in production. Everything in this web is linked to something else, just like in a real system."
}

export function Skills({ skills, relations, categories, featuredSkillKey, sectionId }: SkillsProps) {
  const [explorerRef, isExplorerInView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -20% 0px' })
  const [isIntroInView, setIsIntroInView] = useState(false)

  const graph = useSkillGraph({ skills, relations }, isExplorerInView)

  const selectedSkill = useMemo(
    () => findSelectedSkill({ skills, relations }, graph.selectedKey),
    [skills, relations, graph.selectedKey],
  )
  const connectedSkills = useMemo(
    () => findConnectedSkills({ skills, relations }, graph.selectedKey),
    [skills, relations, graph.selectedKey],
  )

  const { selectSkill } = graph
  const startWithFeaturedSkill = useCallback(
    () => selectSkill(featuredSkillKey), [selectSkill, featuredSkillKey]
  )

  return (
    <PortfolioSection
      anchorId={ sectionId }
      sectionHeaderInfo={ sectionHeaderInfo }
      onIntroInView={ setIsIntroInView }
    >
      <CategoryFilter
        categories={ categories }
        activeCategory={ graph.category }
        isRevealed={ isIntroInView }
        onChange={ graph.filterByCategory }
      />

      <div ref={ explorerRef } className={ styles.layout }>
        <SkillGraphCanvas
          canvasRef={ graph.canvasRef }
          skills={ skills }
          isHintVisible={ graph.isHintVisible }
          isRevealed={ isExplorerInView }
          onSelect={ graph.selectSkill }
          onHover={ graph.hoverSkill }
        />

        <SkillDetail
          skill={ selectedSkill }
          links={ connectedSkills }
          isRevealed={ isExplorerInView }
          startLabel={ skills[featuredSkillKey].label }
          onSelect={ graph.selectSkill }
          onStart={ startWithFeaturedSkill }
          onClear={ graph.clearSelection }
        />
      </div>
    </PortfolioSection>
  )
}
