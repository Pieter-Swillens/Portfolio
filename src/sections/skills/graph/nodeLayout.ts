import { NODE } from './graph.config.ts'
import type { GraphNode, GraphState } from './graph.types.ts'

export const dotRadiusOf = (node: GraphNode) => (node.isHub ? NODE.hubDotRadius : NODE.dotRadius)

export const nodePaddingX = (state: GraphState) =>
  state.viewport.isCompact ? NODE.compactPaddingX : NODE.paddingX

export function labelFont(node: GraphNode, state: GraphState): string {
  const { isCompact } = state.viewport
  const size = node.isHub ? NODE.hubFontSize : isCompact ? NODE.compactFontSize : NODE.fontSize
  const weight = node.isHub ? 700 : 600
  return `${weight} ${size}px ${state.theme.fontFamily}`
}

/** Horizontal distance from the pill's left edge to where the label starts. */
export const labelOffsetX = (node: GraphNode, state: GraphState) =>
  nodePaddingX(state) + dotRadiusOf(node) * 2 + NODE.dotGap

/** Distance from the pill's left edge to the centre of its category dot. */
export const dotOffsetX = (node: GraphNode, state: GraphState) =>
  nodePaddingX(state) + dotRadiusOf(node)

/** Puts every node on the centre, each at its own angle, so the web blooms outwards evenly from there. */
export function gatherNodesAtCentre({ scene, viewport }: GraphState): void {
  const { nodes } = scene
  nodes.forEach((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2
    node.x = viewport.width / 2 + Math.cos(angle) * 2
    node.y = viewport.height / 2 + Math.sin(angle) * 2
    node.vx = 0
    node.vy = 0
  })
}

/** Pill sizes depend on the measured label, so they are recalculated on resize and theme (font) changes. */
export function measureNodes(context: CanvasRenderingContext2D, state: GraphState): void {
  const { isCompact } = state.viewport
  state.scene.nodes.forEach(node => {
    context.font = labelFont(node, state)
    node.textWidth = context.measureText(node.label).width
    node.width = labelOffsetX(node, state) + node.textWidth + nodePaddingX(state)
    node.height = node.isHub ? NODE.hubHeight : isCompact ? NODE.compactHeight : NODE.height
  })
}
