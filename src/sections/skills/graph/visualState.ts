import { CENTRE_CATEGORY, DIM, ENTRANCE, HIGHLIGHT } from './graph.config.ts'
import { approach, clamp } from './canvasMath.ts'
import type { GraphNode, GraphState } from './graph.types.ts'

/**
 * The node that the visitor is currently looking at: hovered wins over selected.
 * Hovering previews how another node connects, and the selection comes back once the pointer leaves.
 */
export const focusedNode = ({ interaction }: GraphState): GraphNode | null =>
  interaction.hovered ?? interaction.selected

/** Is this node shown for the active category filter? The core node is always shown. */
export const isInActiveCategory = ({ interaction }: GraphState, node: GraphNode) =>
  interaction.category === 'all' || node.category === CENTRE_CATEGORY || node.category === interaction.category

/** Moves every animated value (entrance, dimming, highlight) a step closer to where it should be. */
export function animateVisualState(state: GraphState, dt: number): void {
  const { scene, interaction, time, animated } = state
  const focus = focusedNode(state)
  const easing = Math.min(1, dt * HIGHLIGHT.easingSpeed)

  scene.nodes.forEach(node => {
    if (animated) node.appear = clamp((time - node.spawnDelay) / ENTRANCE.growDuration, 0, 1)
    node.dim = approach(node.dim, dimTarget(state, node, focus), easing)
    node.highlight = approach(node.highlight, highlightTarget(state, node, focus), easing)
  })

  scene.edges.forEach(edge => {
    const touchesFocus = focus !== null && (edge.from === focus || edge.to === focus)
    edge.highlight = approach(edge.highlight, touchesFocus ? 1 : 0, easing)
  })

  const pointer = interaction.pointer
  pointer.glow = approach(pointer.glow, pointer.isInside ? 1 : 0, easing)
}

function dimTarget(state: GraphState, node: GraphNode, focus: GraphNode | null): number {
  if (!isInActiveCategory(state, node)) return 1
  if (node === state.interaction.selected) return 0 // the selection stays readable while previewing another node
  if (focus && !isRelatedTo(state, focus, node)) return DIM.unrelatedToFocus
  return 0
}

function highlightTarget(state: GraphState, node: GraphNode, focus: GraphNode | null): number {
  const { selected, hovered, category } = state.interaction
  if (node === selected) return HIGHLIGHT.selected
  if (node === hovered) return HIGHLIGHT.hovered
  if (focus && isRelatedTo(state, focus, node)) return HIGHLIGHT.related
  if (category !== 'all' && node.category === category) return HIGHLIGHT.inActiveCategory
  return 0
}

/** True for the focused node itself and for everything directly connected to it. */
function isRelatedTo(state: GraphState, focus: GraphNode, node: GraphNode): boolean {
  return node === focus || (state.scene.neighbours.get(focus.id)?.has(node.id) ?? false)
}
