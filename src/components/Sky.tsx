import { useEffect, useRef } from 'react'
import { ConstellationEvent } from '../App'

export const Sky = ({ events, skySize }: { events: ConstellationEvent[]; skySize: { width: number; height: number } }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    //clear canvas
    ctx?.clearRect(0, 0, skySize.width, skySize.height)

    // Properties for the circle
    const radius = 5

    // Draw circle
    events.forEach((event) => {
      drawCircle(ctx!, event.position.x, event.position.y, radius)
    })

  }, [events, skySize])

  return (
    <canvas ref={canvasRef} width={skySize.width} height={skySize.height} className="border border-gray-600" />
  )
}

