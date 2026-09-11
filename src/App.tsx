import { useEffect, useState } from "react"
import { EventDetails } from "./components/EventDetails"
import { EventForm } from "./components/EventForm"
import { Sky } from "./components/Sky"


export interface ConstellationEvent {
  id: string
  title: string
  date: string
  note: string
  position: {
    x: number
    y: number
  }
}

function App() {
  const [events, setEvents] = useState<ConstellationEvent[]>(() => JSON.parse(localStorage.getItem("constellation.events") || '[]'))
  const [selectedEvent, setSelectedEvent] = useState<ConstellationEvent | null>(null)
  const [skySize, setSkySize] = useState({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.6 })

  useEffect(() => {
    const handleResize = () => {
      setSkySize({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.6 })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const clearEvents = () => {
    setEvents([])
    setSelectedEvent(null)
    localStorage.removeItem("constellation.events")
  }

  useEffect(() => {
    localStorage.setItem("constellation.events", JSON.stringify(events))
  }, [events])

  return (

    <div className="bg-slate-950 min-h-screen text-white">
      <div className="flex flex-col md:flex-row gap-4 justify-center items-start p-4">
        <EventForm
          skySize={skySize}
          onAdd={(newEvent) => setEvents([...events, newEvent])}
          onClearEvents={clearEvents}
        />

        <EventDetails selectedEvent={selectedEvent} eventList={events} onRemoveEvent={(id) => {
          setEvents(events.filter((e) => e.id !== id))
          if (selectedEvent?.id === id) {
            setSelectedEvent(null)
          }
        }} />

      </div>

      <Sky events={events} skySize={skySize} onEventSelect={setSelectedEvent} />

    </div>
  )
}

export default App
