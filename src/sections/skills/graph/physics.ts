import { PHYSICS } from './graph.config.ts'
import { clamp } from './canvasMath.ts'
import type { GraphEdge, GraphNode, GraphState, Viewport } from './graph.types.ts'

/**
 * Advances the force simulation by `dt` seconds.
 * Pills repel each other (as rectangles, not points), edges act as springs, and
 * weak forces keep categories loosely together and everything near the centre.
 */
export function stepPhysics(state: GraphState, dt: number): void {
  const { nodes, edges, hub } = state.scene
  const timeScale = dt * 60 // forces were tuned at 60fps
  const edgeLength = idealEdgeLength(state.viewport)
  const simulated = nodes.filter(node => state.animated ? node.appear > 0 : true)

  applyRepulsion(simulated, edgeLength, state.viewport, timeScale)
  applySprings(edges, edgeLength, timeScale, state.animated)
  applyCategoryCohesion(simulated, timeScale)
  applyCentreGravity(simulated, state, timeScale)
  if (state.animated) applyDrift(simulated, state.time, timeScale)
  moveNodes(simulated, state, dt, timeScale)
  if (state.animated) keepUnbornNodesInHub(nodes, hub)
}

const mobilityOf = (node: GraphNode) => (node.isHub ? PHYSICS.hubMobility : 1)

function idealEdgeLength({ width, height, isCompact }: Viewport): number {
  const widthFactor = isCompact ? PHYSICS.compactEdgeLengthWidthFactor : PHYSICS.edgeLengthWidthFactor
  return clamp(
    Math.min(width * widthFactor, height * PHYSICS.edgeLengthHeightFactor),
    PHYSICS.minEdgeLength,
    PHYSICS.maxEdgeLength,
  )
}

/** Distance between the centres at which two pills touch, measured along the line connecting them. */
function touchingDistance(a: GraphNode, b: GraphNode, directionX: number, directionY: number): number {
  const reachX = (a.width + b.width) / 2
  const reachY = (a.height + b.height) / 2
  const alongX = Math.abs(directionX) > 1e-6 ? reachX / Math.abs(directionX) : Infinity
  const alongY = Math.abs(directionY) > 1e-6 ? reachY / Math.abs(directionY) : Infinity
  // Two pills exactly on top of each other (a node just born in the hub) have no direction yet.
  return Math.min(alongX, alongY, Math.max(reachX, reachY))
}

function applyRepulsion(nodes: GraphNode[], edgeLength: number, viewport: Viewport, timeScale: number): void {
  const strength = edgeLength * edgeLength * PHYSICS.repulsionStrength
  const range = edgeLength * PHYSICS.repulsionRange
  const gap = viewport.isCompact ? PHYSICS.compactNodeGap : PHYSICS.nodeGap

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const distance = Math.sqrt(dx * dx + dy * dy + PHYSICS.repulsionSoftening)
      if (distance > range) continue

      const directionX = dx / distance
      const directionY = dy / distance
      let force = strength / (distance * distance)

      const minimumDistance = touchingDistance(a, b, directionX, directionY) + gap
      if (distance < minimumDistance) force += (minimumDistance - distance) * PHYSICS.overlapPush

      force *= timeScale
      a.vx += directionX * force * mobilityOf(a)
      a.vy += directionY * force * mobilityOf(a)
      b.vx -= directionX * force * mobilityOf(b)
      b.vy -= directionY * force * mobilityOf(b)
    }
  }
}

function applySprings(edges: GraphEdge[], edgeLength: number, timeScale: number, animated: boolean): void {
  edges.forEach(({ from, to }) => {
    const bothBorn = from.appear > 0 && to.appear > 0
    if (animated && !bothBorn) return

    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.hypot(dx, dy) || 1
    const force = (distance - edgeLength) * PHYSICS.edgeStiffness * timeScale
    from.vx += (dx / distance) * force * mobilityOf(from)
    from.vy += (dy / distance) * force * mobilityOf(from)
    to.vx -= (dx / distance) * force * mobilityOf(to)
    to.vy -= (dy / distance) * force * mobilityOf(to)
  })
}

/** Pulls each node towards the centre of its own category, so categories form loose clusters. */
function applyCategoryCohesion(nodes: GraphNode[], timeScale: number): void {
  const sums = new Map<string, { x: number; y: number; count: number }>()
  nodes.forEach(node => {
    const sum = sums.get(node.category) ?? { x: 0, y: 0, count: 0 }
    sum.x += node.x
    sum.y += node.y
    sum.count++
    sums.set(node.category, sum)
  })

  nodes.forEach(node => {
    const sum = sums.get(node.category)
    if (!sum || sum.count < 2) return
    node.vx += (sum.x / sum.count - node.x) * PHYSICS.categoryCohesion * timeScale
    node.vy += (sum.y / sum.count - node.y) * PHYSICS.categoryCohesion * timeScale
  })
}

function applyCentreGravity(nodes: GraphNode[], { viewport }: GraphState, timeScale: number): void {
  const { width, height } = viewport
  nodes.forEach(node => {
    const gravity = (node.isHub ? PHYSICS.hubGravity : PHYSICS.nodeGravity) * timeScale
    node.vx += (width / 2 - node.x) * gravity * PHYSICS.horizontalGravityShare
    node.vy += (height / 2 - node.y) * gravity * Math.min(width / height, PHYSICS.maxVerticalGravityRatio)
  })
}

/** Slow, low-amplitude wobble keeps the graph feeling alive without jitter. */
function applyDrift(nodes: GraphNode[], time: number, timeScale: number): void {
  nodes.forEach(node => {
    const { drift } = node
    node.vx += Math.sin(time * drift.frequencyX + drift.phaseX) * PHYSICS.driftStrength * timeScale
    node.vy += Math.cos(time * drift.frequencyY + drift.phaseY) * PHYSICS.driftStrength * timeScale
  })
}

function moveNodes(nodes: GraphNode[], state: GraphState, dt: number, timeScale: number): void {
  const { dragged, pointer } = state.interaction
  const { width, height } = state.viewport

  nodes.forEach(node => {
    if (node === dragged) {
      const follow = Math.min(1, dt * PHYSICS.dragFollowRate)
      node.x += (pointer.x - node.x) * follow
      node.y += (pointer.y - node.y) * follow
      node.vx = 0
      node.vy = 0
    } else {
      const damping = Math.pow(PHYSICS.damping, timeScale)
      node.vx *= damping
      node.vy *= damping
      limitSpeed(node)
      node.x += node.vx * timeScale
      node.y += node.vy * timeScale
    }

    // Keep the whole pill inside the canvas.
    const marginX = node.width / 2 + PHYSICS.boundsMargin
    const marginY = node.height / 2 + PHYSICS.boundsMargin
    node.x = clamp(node.x, marginX, Math.max(marginX, width - marginX))
    node.y = clamp(node.y, marginY, Math.max(marginY, height - marginY))
  })
}

function limitSpeed(node: GraphNode): void {
  const speed = Math.hypot(node.vx, node.vy)
  if (speed <= PHYSICS.maxSpeed) return
  node.vx *= PHYSICS.maxSpeed / speed
  node.vy *= PHYSICS.maxSpeed / speed
}

/** Nodes that have not been born yet wait inside the hub. */
function keepUnbornNodesInHub(nodes: GraphNode[], hub: GraphNode): void {
  nodes.forEach(node => {
    if (node.appear > 0) return
    node.x = hub.x
    node.y = hub.y
    node.vx = 0
    node.vy = 0
  })
}
