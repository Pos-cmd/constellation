import { useEffect, useRef } from 'react';
import { ConstellationEvent } from '../App';

export const Sky = ({ events, skySize, onEventSelect }:
  {
    events: ConstellationEvent[];
    skySize: { width: number; height: number };
    onEventSelect: (event: ConstellationEvent | null) => void
  }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dprScale = window.devicePixelRatio || 1


  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, skySize.width, skySize.height)
  }

  const drawCircle = (ctx: CanvasRenderingContext2D, position: { x: number, y: number }, radius: number, opacity: number) => {
    ctx.beginPath()
    ctx.arc(position.x * skySize.width, position.y * skySize.height, radius, 0, 2 * Math.PI)
    ctx.globalAlpha = opacity
    ctx.fillStyle = 'white'
    ctx.fill()
  }

  const drawLine = (ctx: CanvasRenderingContext2D, start: { x: number, y: number }, end: { x: number, y: number }, opacity: number) => {
    ctx.beginPath()
    ctx.moveTo(start.x * skySize.width, start.y * skySize.height)
    ctx.lineTo(end.x * skySize.width, end.y * skySize.height)
    ctx.globalAlpha = opacity
    ctx.strokeStyle = 'white'
    ctx.stroke()
  }

  const getEventAtPosition = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const onClickRect = canvasRef.current?.getBoundingClientRect()
    if (!onClickRect) return


    const onClickX = (e.clientX - onClickRect.left) / dprScale
    const onClickY = (e.clientY - onClickRect.top) / dprScale

    const closestEvent = events.reduce((closest, event) => {
      const distance = Math.hypot(onClickX - event.position.x * skySize.width, onClickY - event.position.y * skySize.height)

      return distance < closest.distance ? { event, distance } : closest
    }, { event: null as ConstellationEvent | null, distance: Infinity })


    if (closestEvent.distance < 20 && closestEvent.event) {
      onEventSelect(closestEvent.event)
    } else {
      onEventSelect(null)
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = Math.floor(skySize.width * dprScale);
      canvasRef.current.height = Math.floor(skySize.height * dprScale);
    }

    // Set the canvas context to account for device pixel ratio
    const ctx = canvasRef.current?.getContext('2d')
    ctx?.scale(window.devicePixelRatio, window.devicePixelRatio)

    //clear canvas
    clearCanvas(ctx!)

    // Properties for the circle
    const radius = 5

    const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date))

    const animate = () => {

      clearCanvas(ctx!)

      sortedEvents
        .forEach((event, index) => {

          const opacity = Math.sin(Date.now() / 1000 + index) / 2 // Oscillate between 0 and 1

          // Draw the circle for the event
          drawCircle(ctx!, event.position, radius, opacity)

          // Draw line to the next event if it exists
          if (index < sortedEvents.length - 1) {
            const nextEvent = sortedEvents[index + 1]
            drawLine(ctx!, event.position, nextEvent.position, 0.5)
          }
        })
      requestAnimationFrame(animate)
    }

    animate()

  }, [events, skySize])

  return (
    <canvas ref={canvasRef} width={skySize.width} height={skySize.height} className="border border-gray-600" onClick={(e) => getEventAtPosition(e)} />
  )
}

