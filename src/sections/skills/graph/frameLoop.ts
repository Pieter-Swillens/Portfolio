import { PHYSICS } from './graph.config.ts'

export type FrameLoop = { start: () => void; stop: () => void }

/** requestAnimationFrame loop that reports the elapsed seconds since the previous frame. */
export function createFrameLoop(onFrame: (dt: number) => void): FrameLoop {
  let frameId = 0
  let lastTimestamp = 0

  const frame = (timestamp: number) => {
    const elapsed = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 1 / 60
    lastTimestamp = timestamp
    onFrame(Math.min(elapsed, PHYSICS.maxFrameSeconds))
    frameId = requestAnimationFrame(frame)
  }

  return {
    start() {
      cancelAnimationFrame(frameId)
      lastTimestamp = 0
      frameId = requestAnimationFrame(frame)
    },
    stop() {
      cancelAnimationFrame(frameId)
    },
  }
}
