import type { SelectedSkill, ConnectedSkill } from './Skills.types.ts'
import type { SkillGraphData } from './graph/graph.types.ts'

export function findSelectedSkill({ skills }: SkillGraphData, skillKey: string | null): SelectedSkill | null {
  const skill = skillKey ? skills[skillKey] : undefined
  return skillKey && skill ? { key: skillKey, ...skill } : null
}

export function findConnectedSkills({ skills, relations }: SkillGraphData, skillKey: string | null): ConnectedSkill[] {
  if (!skillKey) return []

  return relations
    .filter(({ from, to }) => from === skillKey || to === skillKey)
    .map(({ from, to }) => (from === skillKey ? to : from))
    .map(connectedKey => ({
      key: connectedKey,
      label: skills[connectedKey].label,
      category: skills[connectedKey].category,
    }))
}
