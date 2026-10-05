import type { Skill, SkillCategory, SkillCategoryFilter } from '@/content/skills.ts'
import type { Link } from '@/types/Link.ts'
import type { SkillGraphData } from './graph/graph.types.ts'

export type SkillsProps = SkillGraphData & {
  categories: Readonly<Record<SkillCategoryFilter, { label: string }>>
  featuredSkillKey: string,
  sectionId: string
}

export type SelectedSkill = Skill & { key: string }
export type ConnectedSkill = Link & { category: SkillCategory }
