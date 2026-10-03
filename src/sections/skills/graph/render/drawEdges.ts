import { DIM, EDGE } from '../graph.config.ts'
import { mixColors, rgba } from '../canvasMath.ts'
import { focusedNode } from '../visualState.ts'
import { pillBoundaryOffset } from './shapes.ts'
import type { GraphEdge, GraphNode, GraphState, RGB } from '../graph.types.ts'

type Point = { x: number; y: number }

/** A slightly bent line. It starts at the node that was born first, so it can grow towards the newer one. */
type EdgeCurve = {
  start: Point
  control: Point
  end: Point
  startsAt: GraphNode
  endsAt: GraphNode
}

/**
 * Edges draw themselves outwards while the web is born, and are quiet hairlines at rest.
 * Edges of the focused node light up and carry flowing particles.
 */
export function drawEdges(ctx: CanvasRenderingContext2D, state: GraphState): void {
  const focus = focusedNode(state)
  const highlightTone = focus ? state.theme.categoryColors[focus.category] : state.theme.accent

  for (const edge of state.scene.edges) {
    const growth = Math.min(edge.from.appear, edge.to.appear)
    if (growth <= 0.01) continue

    const curve = curveBetween(edge)
    const dimmed = Math.max(edge.from.dim, edge.to.dim) * (1 - edge.highlight)
    const opacity = 1 - dimmed * DIM.edgeOpacityLoss
    const color = mixColors(state.theme.text, highlightTone, edge.highlight)
    const alpha = EDGE.restAlpha + (EDGE.highlightAlpha - EDGE.restAlpha) * edge.highlight

    ctx.strokeStyle = rgba(color, alpha * opacity)
    ctx.lineWidth = EDGE.restWidth + (EDGE.highlightWidth - EDGE.restWidth) * edge.highlight
    strokeGrowingCurve(ctx, curve, easeOutCubic(growth))

    if (state.animated && edge.highlight > 0.05) {
      const flowsBackwards = focus === curve.endsAt
      drawFlowingParticles(ctx, highlightTone, state.time, edge, curve, flowsBackwards, opacity)
    }
  }
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

function curveBetween({ from, to, bend }: GraphEdge): EdgeCurve {
  const [startsAt, endsAt] = from.spawnDelay <= to.spawnDelay ? [from, to] : [to, from]
  const dx = endsAt.x - startsAt.x
  const dy = endsAt.y - startsAt.y
  const distance = Math.hypot(dx, dy) || 1
  const ux = dx / distance
  const uy = dy / distance
  const startOffset = pillBoundaryOffset(startsAt.width / 2, startsAt.height / 2, ux, uy)
  const endOffset = pillBoundaryOffset(endsAt.width / 2, endsAt.height / 2, ux, uy)

  return {
    start: { x: startsAt.x + ux * startOffset, y: startsAt.y + uy * startOffset },
    end: { x: endsAt.x - ux * endOffset, y: endsAt.y - uy * endOffset },
    control: {
      x: (startsAt.x + endsAt.x) / 2 - uy * distance * bend,
      y: (startsAt.y + endsAt.y) / 2 + ux * distance * bend,
    },
    startsAt,
    endsAt,
  }
}

/** Strokes the first `fraction` (0..1) of the curve: the quadratic curve is split at that point. */
function strokeGrowingCurve(ctx: CanvasRenderingContext2D, { start, control, end }: EdgeCurve, fraction: number): void {
  const head = pointOnCurve(start, control, end, fraction)
  const headControl = {
    x: start.x + (control.x - start.x) * fraction,
    y: start.y + (control.y - start.y) * fraction,
  }

  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.quadraticCurveTo(headControl.x, headControl.y, head.x, head.y)
  ctx.stroke()
}

function pointOnCurve(start: Point, control: Point, end: Point, t: number): Point {
  const u = 1 - t
  return {
    x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
    y: u * u * start.y + 2 * u * t * control.y + t * t * end.y,
  }
}

/** Particles travel away from the focused node, so the direction reads as "this connects to that". */
function drawFlowingParticles(
  ctx: CanvasRenderingContext2D,
  tone: RGB,
  time: number,
  edge: GraphEdge,
  { start, control, end }: EdgeCurve,
  flowsBackwards: boolean,
  opacity: number,
): void {
  const count = EDGE.particlesPerHighlightedEdge
  const speed = EDGE.particleSpeed + (EDGE.highlightedParticleSpeed - EDGE.particleSpeed) * edge.highlight

  ctx.fillStyle = rgba(tone, 0.9 * edge.highlight * opacity)
  for (let i = 0; i < count; i++) {
    const progress = (time * speed + edge.seed + i / count) % 1
    const { x, y } = pointOnCurve(start, control, end, flowsBackwards ? 1 - progress : progress)
    ctx.beginPath()
    ctx.arc(x, y, 1.4 + 1.3 * edge.highlight, 0, Math.PI * 2)
    ctx.fill()
  }
}
