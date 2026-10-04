import type { Skill, SkillCategory, SkillCategoryFilter, SkillRelation } from '@/content/skills.ts'

export type RGB = readonly [red: number, green: number, blue: number]

/** The skills and the links between them: everything the graph needs to know about the domain. */
export type SkillGraphData = {
  skills: Readonly<Record<string, Skill>>
  relations: readonly SkillRelation[]
}

/** Callbacks through which the graph reports back to the UI around it. */
export type SkillGraphEvents = {
  onSelect: (skillKey: string | null) => void
  /** Fired when the graph changes the category filter by itself, e.g. after selecting a skill outside it. */
  onCategoryChange: (category: SkillCategoryFilter) => void
  /** Fired when the visitor grabs a node, e.g. to hide the "drag a node" hint. */
  onInteract: () => void
}

/** Per-node random wobble parameters, so the graph looks suspended rather than static. */
export type Drift = {
  frequencyX: number
  frequencyY: number
  phaseX: number
  phaseY: number
}

export type GraphNode = {
  readonly id: string
  readonly label: string
  readonly category: SkillCategory
  readonly isHub: boolean
  /** Number of relations, used to pick the hub and size the layout. */
  readonly degree: number
  readonly drift: Drift
  /** Seconds after start before the node grows out of the hub. */
  readonly spawnDelay: number

  // Size of the pill. Measured from the label, so it is set on every resize.
  width: number
  height: number
  textWidth: number

  // Position and speed, owned by the physics step.
  x: number
  y: number
  vx: number
  vy: number

  // Animated visual state, every value moves smoothly towards its target.
  /** 0 = unborn, 1 = fully grown. */
  appear: number
  /** 0 = normal, 1 = pushed into the background. */
  dim: number
  /** 0 = at rest, 1 = selected. Drives border, tint and shadow in one go. */
  highlight: number
}

export type GraphEdge = {
  readonly from: GraphNode
  readonly to: GraphNode
  /** Signed curvature, alternating per edge so parallel lines do not overlap. */
  readonly bend: number
  /** Offsets the travelling particles so they do not all move in sync. */
  readonly seed: number
  /** 0..1, animated: how strongly this edge belongs to the focused node. */
  highlight: number
}

export type GraphScene = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  hub: GraphNode
  neighbours: ReadonlyMap<string, ReadonlySet<string>>
}

export type Viewport = {
  width: number
  height: number
  /** Small screens get smaller pills and tighter spacing. */
  isCompact: boolean
}

export type PointerState = {
  x: number
  y: number
  isInside: boolean
  /** 0..1, animated: fades the soft light that follows the pointer. */
  glow: number
}

export type Interaction = {
  selected: GraphNode | null
  hovered: GraphNode | null
  dragged: GraphNode | null
  category: SkillCategoryFilter
  pointer: PointerState
}

export type GraphTheme = {
  categoryColors: Record<SkillCategory, RGB>
  text: RGB
  surface: RGB
  accent: RGB
  fontFamily: string
}

/** Everything that changes while the graph is running. Physics, animation and rendering all read this. */
export type GraphState = {
  scene: GraphScene
  viewport: Viewport
  interaction: Interaction
  theme: GraphTheme
  /** Seconds since the graph started. */
  time: number
  /** False when the visitor prefers reduced motion: no entrance, drift or particles. */
  animated: boolean
}
