import { COMPACT_VIEWPORT_WIDTH, ENTRANCE, PHYSICS } from './graph.config.ts'
import { createGraphState } from './createGraphState.ts'
import { createFrameLoop } from './frameLoop.ts'
import { gatherNodesAtCentre, measureNodes } from './nodeLayout.ts'
import { observeSize, observeThemeChanges, observeVisibility } from './observers.ts'
import { attachPointerInput } from './pointerInput.ts'
import { stepPhysics } from './physics.ts'
import { drawGraph } from './render/drawGraph.ts'
import { readTheme } from './theme.ts'
import { animateVisualState, isInActiveCategory } from './visualState.ts'
import type { SkillCategoryFilter } from '@/content/skills.ts'
import type { GraphState, SkillGraphData, SkillGraphEvents } from './graph.types.ts'

/**
 * Interactive web of skills, drawn on a canvas.
 * This class only wires things together: the simulation lives in physics.ts,
 * the drawing in render/, the input in pointerInput.ts.
 */
export class SkillGraph {
  private readonly state: GraphState
  private readonly loop = createFrameLoop(dt => this.tick(dt))
  private readonly disposers: Array<() => void> = []
  private hasEntered = false

  static create(canvas: HTMLCanvasElement, data: SkillGraphData, events: SkillGraphEvents): SkillGraph | null {
    const context = canvas.getContext('2d')
    return context ? new SkillGraph(canvas, context, data, events) : null
  }

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly context: CanvasRenderingContext2D,
    data: SkillGraphData,
    private readonly events: SkillGraphEvents,
  ) {
    const animated = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.state = createGraphState(data, animated)
    this.state.theme = readTheme(canvas)
  }

  // ── Public API ──────────────────────────────────────

  start(): void {
    this.disposers.push(
      attachPointerInput(this.canvas, this.state, {
        onInteract: this.events.onInteract,
        onSelect: key => this.selectNode(key),
      }),
      observeSize(this.canvas, () => this.resize()),
      observeVisibility(this.canvas, isVisible => (isVisible ? this.loop.start() : this.loop.stop())),
      observeThemeChanges(() => this.refreshTheme()),
    )
    this.resize()
    this.loop.start()
  }

  /** Plays the entrance: the web grows out of the hub. Call this when the graph scrolls into view. */
  enter(): void {
    if (this.hasEntered) return
    this.hasEntered = true
    this.state.time = this.state.animated ? -ENTRANCE.leadIn : 0
  }

  destroy(): void {
    this.loop.stop()
    this.disposers.forEach(dispose => dispose())
  }

  setCategory(category: SkillCategoryFilter): void {
    this.state.interaction.category = category
    this.selectNode(null)
  }

  selectNode(key: string | null): void {
    const selected = key ? this.findNode(key) : null
    if (selected && !isInActiveCategory(this.state, selected)) this.showAllCategories()
    this.state.interaction.selected = selected
    this.events.onSelect(selected?.id ?? null)
  }

  /** Picking a skill outside the active filter would leave it dimmed, so the filter steps aside. */
  private showAllCategories(): void {
    this.state.interaction.category = 'all'
    this.events.onCategoryChange('all')
  }

  hoverNode(key: string | null): void {
    this.state.interaction.hovered = key ? this.findNode(key) : null
  }

  // ── Internals ───────────────────────────────────────

  private findNode(key: string) {
    return this.state.scene.nodes.find(node => node.id === key) ?? null
  }

  private tick(dt: number): void {
    const { state } = this
    if (!state.viewport.width || !this.hasEntered) return

    state.time += dt
    animateVisualState(state, dt)
    stepPhysics(state, dt)
    drawGraph(this.context, state)
  }

  private refreshTheme(): void {
    this.state.theme = readTheme(this.canvas)
    measureNodes(this.context, this.state) // the font may have changed with the theme
  }

  private resize(): void {
    const { canvas, context, state } = this
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return

    const previous = state.viewport
    const isFirstLayout = previous.width === 0

    const pixelRatio = window.devicePixelRatio || 1
    canvas.width = Math.round(width * pixelRatio)
    canvas.height = Math.round(height * pixelRatio)
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

    state.viewport = { width, height, isCompact: width < COMPACT_VIEWPORT_WIDTH }
    measureNodes(context, state)

    if (isFirstLayout) this.placeNodesAtCentre()
    else this.rescaleNodePositions(previous.width, previous.height)
  }

  /** Every node starts on top of the hub. Reduced-motion visitors get an already settled layout. */
  private placeNodesAtCentre(): void {
    const { state } = this
    gatherNodesAtCentre(state)

    if (!state.animated) {
      for (let step = 0; step < PHYSICS.settleSteps; step++) stepPhysics(state, 1 / 60)
    }
  }

  private rescaleNodePositions(previousWidth: number, previousHeight: number): void {
    const { width, height } = this.state.viewport
    this.state.scene.nodes.forEach(node => {
      node.x *= width / previousWidth
      node.y *= height / previousHeight
    })
  }
}
