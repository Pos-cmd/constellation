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

  useEffect(() => {
    localStorage.setItem("constellation.events", JSON.stringify(events))
  }, [events])

  const skySize = {
    height: 300,
    width: 500,
  }

  return (

    <div className="bg-slate-950 min-h-screen text-white">
      <div className="flex flex-col md:flex-row gap-4 justify-center items-start p-4">
        <EventForm
          skySize={skySize}
          selectedEvent={selectedEvent}
          onAdd={(newEvent) => setEvents([...events, newEvent])}
        />

        <EventDetails event={selectedEvent} />

      </div>

      <Sky events={events} skySize={skySize} onEventSelect={setSelectedEvent} />

    </div>
  )
}

export default App
