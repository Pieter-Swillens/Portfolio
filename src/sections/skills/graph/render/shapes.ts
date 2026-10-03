/** Traces a pill (fully rounded rectangle) around the given centre. */
export function tracePill(ctx: CanvasRenderingContext2D, centreX: number, centreY: number, width: number, height: number): void {
  const radius = height / 2
  const left = centreX - width / 2
  const right = centreX + width / 2
  const top = centreY - height / 2
  const bottom = centreY + height / 2

  ctx.beginPath()
  ctx.moveTo(left + radius, top)
  ctx.lineTo(right - radius, top)
  ctx.arc(right - radius, centreY, radius, -Math.PI / 2, Math.PI / 2)
  ctx.lineTo(left + radius, bottom)
  ctx.arc(left + radius, centreY, radius, Math.PI / 2, (Math.PI * 3) / 2)
  ctx.closePath()
}

export function traceDot(ctx: CanvasRenderingContext2D, centreX: number, centreY: number, radius: number): void {
  ctx.beginPath()
  ctx.arc(centreX, centreY, radius, 0, Math.PI * 2)
}

/** Where a ray from a pill's centre in direction (ux, uy) leaves its rectangle. */
export function pillBoundaryOffset(halfWidth: number, halfHeight: number, directionX: number, directionY: number): number {
  const alongX = Math.abs(directionX) > 1e-6 ? halfWidth / Math.abs(directionX) : Infinity
  const alongY = Math.abs(directionY) > 1e-6 ? halfHeight / Math.abs(directionY) : Infinity
  return Math.min(alongX, alongY)
}
