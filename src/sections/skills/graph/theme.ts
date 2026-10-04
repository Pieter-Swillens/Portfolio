import type { SkillCategory } from '@/content/skills.ts'
import type { GraphTheme, RGB } from './graph.types.ts'

/** Used when a CSS variable cannot be read, e.g. before the stylesheet has loaded. */
export const FALLBACK_THEME: GraphTheme = {
  categoryColors: {
    core: [230, 184, 76],
    architecture: [127, 168, 255],
    practice: [92, 207, 230],
    workflow: [245, 139, 176],
    platform: [125, 223, 143],
    tech: [185, 160, 255],
  },
  text: [232, 242, 236],
  surface: [23, 26, 33],
  accent: [230, 184, 76],
  fontFamily: 'system-ui, sans-serif',
}

/** Canvas cannot use CSS variables, so the theme is read once and again whenever light/dark changes. */
export function readTheme(canvas: HTMLCanvasElement): GraphTheme {
  const read = (cssValue: string, fallback: RGB) => resolveCssColor(canvas, cssValue, fallback)
  const categories = Object.keys(FALLBACK_THEME.categoryColors) as SkillCategory[]

  return {
    categoryColors: Object.fromEntries(
      categories.map(category => [
        category,
        read(`var(--color-category-${category})`, FALLBACK_THEME.categoryColors[category]),
      ]),
    ) as GraphTheme['categoryColors'],
    text: read('var(--color-text)', FALLBACK_THEME.text),
    surface: read('var(--color-surface)', FALLBACK_THEME.surface),
    accent: read('var(--color-accent)', FALLBACK_THEME.accent),
    fontFamily: getComputedStyle(canvas).fontFamily || FALLBACK_THEME.fontFamily,
  }
}

/** Lets the browser compute the colour (var(), light-dark(), color-mix()...) and parses the result. */
function resolveCssColor(canvas: HTMLCanvasElement, cssValue: string, fallback: RGB): RGB {
  const host = canvas.parentElement ?? document.body
  const probe = document.createElement('i')
  probe.style.color = cssValue
  host.appendChild(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()

  const numbers = computed.match(/[\d.]+/g)?.map(Number)
  if (!numbers || numbers.length < 3) return fallback

  const [red = 0, green = 0, blue = 0] = numbers
  const channelScale = computed.startsWith('color(') ? 255 : 1 // color(srgb 0..1 ...) vs rgb(0..255 ...)
  return [Math.round(red * channelScale), Math.round(green * channelScale), Math.round(blue * channelScale)]
}
