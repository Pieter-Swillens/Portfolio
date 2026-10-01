export type ParticleFieldOptions = {
  color: string
  quantity: number
  size: number
  speed: number
  connected: boolean
  connectionDistance: number
}

type Particle = { x: number; y: number; vx: number; vy: number; radius: number }

const MIN_RADIUS = 1
const DOT_OPACITY = 0.6
const LINE_WIDTH = 0.5

export class ParticleField {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly options: ParticleFieldOptions

  private particles: Particle[] = []
  private width = 0
  private height = 0
  private color = ''
  private isVisible = true
  private frameId = 0

  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  private readonly systemTheme = window.matchMedia('(prefers-color-scheme: dark)')

  private readonly handleResize = () => {
    this.resizeCanvas()
    this.particles = createParticles(this.options, this.width, this.height)
    this.updateLoop()
  }

  private readonly handleVisibilityChange = (entries: IntersectionObserverEntry[]) => {
    const latest = entries[entries.length - 1] // de recentste meting staat achteraan
    this.isVisible = latest.isIntersecting
    this.updateLoop()
  }

  private readonly handleColorChange = () => {
    this.readColor()
    this.updateLoop()
  }

  private readonly handleMotionPreferenceChange = () => {
    this.updateLoop()
  }

  private readonly tick = () => {
    moveParticles(this.particles, this.width, this.height)
    this.render()
    this.frameId = requestAnimationFrame(this.tick)
  }

  private readonly resizeObserver = new ResizeObserver(this.handleResize)
  private readonly visibilityObserver = new IntersectionObserver(this.handleVisibilityChange)
  private readonly themeObserver = new MutationObserver(this.handleColorChange)

  static create(canvas: HTMLCanvasElement, options: ParticleFieldOptions): ParticleField | null {
    const ctx = canvas.getContext('2d')
    return ctx ? new ParticleField(canvas, ctx, options) : null
  }

  private constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, options: ParticleFieldOptions) {
    this.canvas = canvas
    this.ctx = ctx
    this.options = options

    this.canvas.style.color = options.color
    this.readColor()
    this.startListening()
  }

  destroy() {
    cancelAnimationFrame(this.frameId)
    this.resizeObserver.disconnect()
    this.visibilityObserver.disconnect()
    this.themeObserver.disconnect()
    this.systemTheme.removeEventListener('change', this.handleColorChange)
    this.reducedMotion.removeEventListener('change', this.handleMotionPreferenceChange)
  }

  private startListening() {
    this.resizeObserver.observe(this.canvas)
    this.visibilityObserver.observe(this.canvas)
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    this.systemTheme.addEventListener('change', this.handleColorChange)
    this.reducedMotion.addEventListener('change', this.handleMotionPreferenceChange)
  }

  private readColor() {
    this.color = getComputedStyle(this.canvas).color
  }

  private resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1
    this.width = this.canvas.clientWidth
    this.height = this.canvas.clientHeight
    this.canvas.width = this.width * pixelRatio
    this.canvas.height = this.height * pixelRatio
    this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  private get shouldAnimate() {
    return this.isVisible && !this.reducedMotion.matches
  }

  private updateLoop() {
    cancelAnimationFrame(this.frameId)
    if (this.shouldAnimate) {
      this.frameId = requestAnimationFrame(this.tick)
    } else {
      this.render()
    }
  }

  private render() {
    const { ctx, particles, color, options } = this

    ctx.save()
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.fillStyle = color
    ctx.strokeStyle = color
    drawDots(ctx, particles)
    if (options.connected) drawLines(ctx, particles, options.connectionDistance)
    ctx.restore()
  }
}

function createParticles({ quantity, speed, size }: ParticleFieldOptions, width: number, height: number): Particle[] {
  return Array.from({ length: quantity }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: randomVelocity(speed),
    vy: randomVelocity(speed),
    radius: MIN_RADIUS + Math.random() * size,
  }))
}

function randomVelocity(speed: number) {
  return (Math.random() - 0.5) * speed
}

function moveParticles(particles: Particle[], width: number, height: number) {
  for (const particle of particles) {
    particle.x = wrap(particle.x + particle.vx, width)
    particle.y = wrap(particle.y + particle.vy, height)
  }
}

function wrap(value: number, max: number) {
  return max > 0 ? ((value % max) + max) % max : 0
}

function drawDots(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  ctx.globalAlpha = DOT_OPACITY
  for (const { x, y, radius } of particles) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawLines(ctx: CanvasRenderingContext2D, particles: Particle[], maxDistance: number) {
  const maxSquared = maxDistance * maxDistance
  ctx.lineWidth = LINE_WIDTH

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const squared = squaredDistance(particles[i], particles[j])
      if (squared >= maxSquared) continue

      const closeness = 1 - Math.sqrt(squared) / maxDistance
      strokeLine(ctx, particles[i], particles[j], closeness)
    }
  }
}

function squaredDistance(a: Particle, b: Particle) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

function strokeLine(ctx: CanvasRenderingContext2D, from: Particle, to: Particle, opacity: number) {
  ctx.globalAlpha = opacity
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}