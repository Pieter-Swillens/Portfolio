import { buildScene } from './buildScene.ts'
import { FALLBACK_THEME } from './theme.ts'
import type { GraphState, SkillGraphData } from './graph.types.ts'

export function createGraphState(data: SkillGraphData, animated: boolean, random?: () => number): GraphState {
  return {
    scene: buildScene(data, animated, random),
    viewport: { width: 0, height: 0, isCompact: false },
    interaction: {
      selected: null,
      hovered: null,
      dragged: null,
      category: 'all',
      pointer: { x: 0, y: 0, isInside: false, glow: 0 },
    },
    theme: FALLBACK_THEME,
    time: 0,
    animated,
  }
}
