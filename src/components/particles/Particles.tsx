import { useEffect, useRef } from 'react'
import { ParticleField, type ParticleFieldOptions } from './Particlefield.ts'
import styles from './Particles.module.css'

type ParticlesProps = Partial<ParticleFieldOptions>

export function Particles({
  color = 'var(--color-accent)',
  quantity = 80,
  size = 1,
  speed = 0.5,
  connected = false,
  connectionDistance = 100,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const field = ParticleField.create(canvas, { color, quantity, size, speed, connected, connectionDistance })
    return () => field?.destroy()
  }, [color, quantity, size, speed, connected, connectionDistance])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}