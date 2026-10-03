/** Below this canvas width the graph switches to its compact layout. */
export const COMPACT_VIEWPORT_WIDTH = 560

/** Size and typography of a node pill. Compact values are used on small screens. */
export const NODE = {
  height: 22,
  hubHeight: 28,
  compactHeight: 21,
  paddingX: 10,
  compactPaddingX: 8,
  dotRadius: 2.5,
  hubDotRadius: 3.2,
  dotGap: 7,
  fontSize: 10.5,
  compactFontSize: 10,
  hubFontSize: 12,
  /** Extra clickable margin around a pill. */
  hitPadding: 7,
} as const

/** The skill in this category is the hub of the web, and is never dimmed by the category filter. */
export const CENTRE_CATEGORY = 'core'

/** How the web grows out of the hub when the section appears. */
export const ENTRANCE = {
  /** Pause after the section scrolls into view, so the frame has time to open first. */
  leadIn: 0.6,
  hubDelay: 0.1,
  firstLevelDelay: 0.5,
  delayPerLevel: 0.45,
  /** Small per-node offset so a whole level does not pop up at once. */
  jitterStep: 0.09,
  growDuration: 0.55,
  /** The shockwave that leaves the hub every time a new ring of skills is born. */
  rippleDuration: 1.8,
} as const

export const PHYSICS = {
  /** Edge length is derived from the canvas size, within these bounds (px). */
  minEdgeLength: 90,
  maxEdgeLength: 250,
  edgeLengthWidthFactor: 0.22,
  compactEdgeLengthWidthFactor: 0.34,
  edgeLengthHeightFactor: 0.32,

  repulsionStrength: 0.26,
  repulsionRange: 2.2,
  repulsionSoftening: 30,
  nodeGap: 16,
  compactNodeGap: 10,
  overlapPush: 0.11,

  edgeStiffness: 0.018,
  categoryCohesion: 0.004,
  hubGravity: 0.03,
  nodeGravity: 0.0022,
  horizontalGravityShare: 0.55,
  /** On wide canvases the vertical pull stays below this, so the web fills the height as well. */
  maxVerticalGravityRatio: 1.15,
  driftStrength: 0.055,
  damping: 0.9,
  /** Fastest a node may move, in px per 60fps frame. Keeps the entrance a bloom instead of an explosion. */
  maxSpeed: 9,
  /** The hub reacts this much to pushes and pulls: it is the anchor, so it barely moves. */
  hubMobility: 0.2,
  dragFollowRate: 18,
  boundsMargin: 14,

  /** Steps simulated up front when motion is reduced, so the layout is already settled. */
  settleSteps: 600,
  /** Frames longer than this (tab was hidden, etc.) are clamped so physics stays stable. */
  maxFrameSeconds: 0.05,
} as const

export const HIGHLIGHT = {
  selected: 1,
  hovered: 0.7,
  related: 0.45,
  inActiveCategory: 0.3,
  easingSpeed: 8,
} as const

/** Nodes that are not part of the focus or the active category fade into the background. */
export const DIM = {
  /** Target dim value for a node that is unrelated to the focused one. */
  unrelatedToFocus: 0.9,
  /** Share of opacity that a fully dimmed node / edge loses. */
  nodeOpacityLoss: 0.75,
  edgeOpacityLoss: 0.9,
} as const

export const EDGE = {
  restAlpha: 0.17,
  highlightAlpha: 0.85,
  restWidth: 1,
  highlightWidth: 1.8,
  bend: 0.09,
  particleSpeed: 0.1,
  highlightedParticleSpeed: 0.3,
  particlesPerHighlightedEdge: 3,
} as const

export const POINTER = {
  glowRadius: 180,
  glowAlpha: 0.1,
  /** Pointer movement below this (px) still counts as a click, not a drag. */
  dragThreshold: 4,
} as const
