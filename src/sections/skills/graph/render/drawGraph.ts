import { POINTER } from '../graph.config.ts'
import { rgba } from '../canvasMath.ts'
import { drawEdges } from './drawEdges.ts'
import { drawEntranceRipples } from './drawEntrance.ts'
import { drawNodes } from './drawNodes.ts'
import type { GraphState } from '../graph.types.ts'

/** Paints one frame: lights first, then edges, then nodes on top. */
export function drawGraph(ctx: CanvasRenderingContext2D, state: GraphState): void {
  const { width, height } = state.viewport
  ctx.clearRect(0, 0, width, height)

  if (state.animated) drawPointerLight(ctx, state)
  drawEntranceRipples(ctx, state)
  drawEdges(ctx, state)
  drawNodes(ctx, state)
}

/** Soft light that follows the pointer. */
function drawPointerLight(ctx: CanvasRenderingContext2D, { viewport, interaction, theme }: GraphState): void {
  const { x, y, glow } = interaction.pointer
  if (glow < 0.01) return

  const light = ctx.createRadialGradient(x, y, 0, x, y, POINTER.glowRadius)
  light.addColorStop(0, rgba(theme.accent, POINTER.glowAlpha * glow))
  light.addColorStop(1, rgba(theme.accent, 0))
  ctx.fillStyle = light
  ctx.fillRect(0, 0, viewport.width, viewport.height)
}
