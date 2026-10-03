import { ENTRANCE } from '../graph.config.ts'
import { rgba, TAU } from '../canvasMath.ts'
import type { GraphState } from '../graph.types.ts'

/** One shockwave per birth: the hub, the first ring of skills, the second ring. */
const RIPPLE_STARTS = [
  ENTRANCE.hubDelay,
  ENTRANCE.firstLevelDelay,
  ENTRANCE.firstLevelDelay + ENTRANCE.delayPerLevel,
]

/** Expanding rings that leave the hub while the web grows, as if the hub pushes the skills outwards. */
export function drawEntranceRipples(ctx: CanvasRenderingContext2D, { scene, theme, viewport, time, animated }: GraphState): void {
  if (!animated) return

  const { hub } = scene
  const tone = theme.categoryColors[hub.category]
  const reach = Math.min(viewport.width, viewport.height) * 0.5

  for (const start of RIPPLE_STARTS) {
    const progress = (time - start) / ENTRANCE.rippleDuration
    if (progress <= 0 || progress >= 1) continue

    const eased = 1 - (1 - progress) ** 2
    ctx.strokeStyle = rgba(tone, 0.4 * (1 - progress) ** 2)
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(hub.x, hub.y, eased * reach, 0, TAU)
    ctx.stroke()
  }
}
