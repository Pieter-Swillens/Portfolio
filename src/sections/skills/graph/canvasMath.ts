import type { RGB } from './graph.types.ts'

export const TAU = Math.PI * 2

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

/** Moves `current` a fraction of the way to `target`. Use with a per-frame easing factor. */
export const approach = (current: number, target: number, factor: number) => lerp(current, target, factor)

export const easeOutBack = (t: number) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2

export const randomBetween = (min: number, max: number, random: () => number) => min + random() * (max - min)

export const rgba = ([red, green, blue]: RGB, alpha: number) =>
  `rgba(${red},${green},${blue},${alpha.toFixed(3)})`

export const mixColors = (from: RGB, to: RGB, amount: number): RGB => [
  Math.round(lerp(from[0], to[0], amount)),
  Math.round(lerp(from[1], to[1], amount)),
  Math.round(lerp(from[2], to[2], amount)),
]
