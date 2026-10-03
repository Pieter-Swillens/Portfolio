import { DIM } from '../graph.config.ts'
import { easeOutBack, mixColors, rgba } from '../canvasMath.ts'
import { dotOffsetX, dotRadiusOf, labelFont, labelOffsetX } from '../nodeLayout.ts'
import { traceDot, tracePill } from './shapes.ts'
import type { GraphNode, GraphState, RGB } from '../graph.types.ts'

/** How a single node looks right now, derived from its animated state. */
type NodeLook = {
  scale: number
  /** Whole-node opacity: only the entrance animation, so edges never shine through a pill. */
  opacity: number
  /** Opacity of border, dot and label. Dimmed nodes fade here, while the plate stays solid. */
  contentOpacity: number
  /** The category colour of this node. */
  tone: RGB
  borderColor: RGB
  borderAlpha: number
  tintAlpha: number
  shadowAlpha: number
  shadowBlur: number
}

/** The hub always looks slightly "lit", so it reads as the centre without needing a loud fill. */
const HUB_BASE_HIGHLIGHT = 0.4

/**
 * Every node is a small pill: a dot in its category colour, then the label.
 * The label is the only information on the graph. Details live in the card next to it.
 * Draw order: weakly highlighted first, so the selected node ends up on top.
 */
export function drawNodes(ctx: CanvasRenderingContext2D, state: GraphState): void {
  const inDrawOrder = [...state.scene.nodes].sort((a, b) => a.highlight - b.highlight)
  for (const node of inDrawOrder) {
    if (node.appear > 0.001) drawNode(ctx, state, node)
  }
}

function drawNode(ctx: CanvasRenderingContext2D, state: GraphState, node: GraphNode): void {
  const look = describeLook(state, node)

  ctx.save()
  ctx.translate(node.x, node.y)
  ctx.scale(look.scale, look.scale)
  ctx.globalAlpha = look.opacity

  drawPlate(ctx, state, node, look)
  drawDot(ctx, state, node, look)
  drawLabel(ctx, state, node, look)
  if (node === state.interaction.selected) drawSelectionHalo(ctx, state, node, look)

  ctx.restore()
}

function describeLook(state: GraphState, node: GraphNode): NodeLook {
  const { text } = state.theme
  const tone = state.theme.categoryColors[node.category]
  const level = node.isHub ? Math.max(node.highlight, HUB_BASE_HIGHLIGHT) : node.highlight
  const hoverScale = node === state.interaction.hovered ? 1.04 : 1

  return {
    scale: (state.animated ? easeOutBack(node.appear) : 1) * hoverScale,
    opacity: node.appear,
    contentOpacity: 1 - node.dim * DIM.nodeOpacityLoss,
    tone,
    borderColor: mixColors(text, tone, level),
    borderAlpha: 0.14 + 0.7 * level,
    tintAlpha: 0.1 * level,
    shadowAlpha: 0.05 + 0.25 * level ** 2,
    shadowBlur: 6 + 14 * level,
  }
}

function drawPlate(ctx: CanvasRenderingContext2D, state: GraphState, node: GraphNode, look: NodeLook): void {
  tracePill(ctx, 0, 0, node.width, node.height)

  ctx.shadowColor = rgba(look.tone, look.shadowAlpha)
  ctx.shadowBlur = look.shadowBlur
  ctx.shadowOffsetY = 2
  ctx.fillStyle = rgba(state.theme.surface, 0.92)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  if (look.tintAlpha > 0.005) {
    ctx.fillStyle = rgba(look.tone, look.tintAlpha)
    ctx.fill()
  }

  ctx.strokeStyle = rgba(look.borderColor, look.borderAlpha * look.contentOpacity)
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawDot(ctx: CanvasRenderingContext2D, state: GraphState, node: GraphNode, look: NodeLook): void {
  traceDot(ctx, -node.width / 2 + dotOffsetX(node, state), 0, dotRadiusOf(node))
  ctx.fillStyle = rgba(look.tone, look.contentOpacity)
  ctx.fill()
}

function drawLabel(ctx: CanvasRenderingContext2D, state: GraphState, node: GraphNode, look: NodeLook): void {
  ctx.font = labelFont(node, state)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  const labelAlpha = 0.72 + 0.28 * Math.max(node.highlight, node.isHub ? 1 : 0)
  ctx.fillStyle = rgba(state.theme.text, labelAlpha * look.contentOpacity)
  ctx.fillText(node.label, -node.width / 2 + labelOffsetX(node, state), 0.5)
}

/** Selection language: a slowly rotating dashed outline plus a ripple that fades outwards. */
function drawSelectionHalo(ctx: CanvasRenderingContext2D, state: GraphState, node: GraphNode, look: NodeLook): void {
  const { time, animated } = state
  const pulse = animated ? 0.5 + 0.5 * Math.sin(time * 2.4) : 0.5
  const margin = 5 + pulse

  ctx.setLineDash([4, 4])
  ctx.lineDashOffset = animated ? -time * 5 : 0
  ctx.strokeStyle = rgba(look.tone, 0.5 + 0.2 * pulse)
  ctx.lineWidth = 1
  tracePill(ctx, 0, 0, node.width + margin * 2, node.height + margin * 2)
  ctx.stroke()
  ctx.setLineDash([])

  if (!animated) return
  const ripple = (time * 0.7) % 1
  ctx.strokeStyle = rgba(look.tone, (1 - ripple) * 0.28)
  tracePill(ctx, 0, 0, node.width + 10 + ripple * 28, node.height + 10 + ripple * 28)
  ctx.stroke()
}
