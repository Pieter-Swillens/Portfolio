import { NODE, POINTER } from './graph.config.ts'
import type { GraphNode, GraphState } from './graph.types.ts'

type Point = { x: number; y: number }

export type PointerHandlers = {
  /** The visitor grabbed a node. */
  onInteract: () => void
  /** A node was clicked (its id), or empty space / the selected node was clicked (null). */
  onSelect: (nodeId: string | null) => void
}

/**
 * Translates pointer events on the canvas into graph interaction:
 * hover, drag to move a node, click to select (or deselect) it.
 * Returns a function that removes all listeners again.
 */
export function attachPointerInput(
  canvas: HTMLCanvasElement,
  state: GraphState,
  handlers: PointerHandlers,
): () => void {
  const { interaction } = state
  let dragStart: Point = { x: 0, y: 0 }
  let hasDragged = false

  const toCanvasPoint = (event: PointerEvent): Point => {
    const box = canvas.getBoundingClientRect()
    return { x: event.clientX - box.left, y: event.clientY - box.top }
  }

  const trackPointer = (point: Point) => {
    interaction.pointer.x = point.x
    interaction.pointer.y = point.y
    interaction.pointer.isInside = true
  }

  const restingCursor = () => (interaction.hovered ? 'grab' : 'default')

  const handleDown = (event: PointerEvent) => {
    const point = toCanvasPoint(event)
    trackPointer(point)

    const node = findNodeAt(state, point)
    if (node) {
      interaction.dragged = node
      dragStart = point
      hasDragged = false
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
      handlers.onInteract()
    } else if (interaction.selected) {
      handlers.onSelect(null) // clicking empty space clears the selection
    }
  }

  const handleMove = (event: PointerEvent) => {
    const point = toCanvasPoint(event)
    trackPointer(point)

    if (interaction.dragged) {
      if (Math.hypot(point.x - dragStart.x, point.y - dragStart.y) > POINTER.dragThreshold) hasDragged = true
      return
    }
    if (event.pointerType === 'touch') return // no hover on touch

    interaction.hovered = findNodeAt(state, point)
    canvas.style.cursor = restingCursor()
  }

  const handleUp = (event: PointerEvent) => {
    const node = interaction.dragged
    interaction.dragged = null
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)

    const wasClick = node !== null && !hasDragged
    if (wasClick) handlers.onSelect(node === interaction.selected ? null : node.id)

    canvas.style.cursor = restingCursor()
    if (event.pointerType === 'touch') {
      interaction.pointer.isInside = false
      interaction.hovered = null
    }
  }

  const handleCancel = () => {
    interaction.dragged = null
    interaction.pointer.isInside = false
  }

  const handleLeave = () => {
    interaction.pointer.isInside = false
    if (!interaction.dragged) interaction.hovered = null
  }

  const listeners: Array<[keyof HTMLElementEventMap, EventListener]> = [
    ['pointerdown', handleDown as EventListener],
    ['pointermove', handleMove as EventListener],
    ['pointerup', handleUp as EventListener],
    ['pointercancel', handleCancel],
    ['pointerleave', handleLeave],
  ]
  listeners.forEach(([type, listener]) => canvas.addEventListener(type, listener))
  return () => listeners.forEach(([type, listener]) => canvas.removeEventListener(type, listener))
}

/** Topmost node under the point. Unborn nodes cannot be hit; nodes outside the active filter can, so you can jump to them. */
function findNodeAt(state: GraphState, point: Point): GraphNode | null {
  const { nodes } = state.scene
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (node.appear <= 0.5) continue

    const reachX = node.width / 2 + NODE.hitPadding
    const reachY = node.height / 2 + NODE.hitPadding
    if (Math.abs(point.x - node.x) <= reachX && Math.abs(point.y - node.y) <= reachY) return node
  }
  return null
}
