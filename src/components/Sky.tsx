import { useEffect, useRef } from 'react';
import { ConstellationEvent } from '../App';

export const Sky = ({ events, skySize }: { events: ConstellationEvent[]; skySize: { width: number; height: number } }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
  }

  const drawLine = (ctx: CanvasRenderingContext2D, start: { x: number, y: number }, end: { x: number, y: number }) => {
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.strokeStyle = 'white'
    ctx.stroke()
  }

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    //clear canvas
    ctx?.clearRect(0, 0, skySize.width, skySize.height)

    // Properties for the circle
    const radius = 5

    const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date))

    // Draw circle
    sortedEvents
      .forEach((event, index) => {
        // Draw the circle for the event
        drawCircle(ctx!, event.position.x, event.position.y, radius)

        // Draw line to the next event if it exists
        if (index < sortedEvents.length - 1) {
          const nextEvent = sortedEvents[index + 1]
          drawLine(ctx!, event.position, nextEvent.position)
        }
      })

  }, [events, skySize])

  return (
    <canvas ref={canvasRef} width={skySize.width} height={skySize.height} className="border border-gray-600" />
  )
}

