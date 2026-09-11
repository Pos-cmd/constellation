import { useState } from "react"
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
  const [events, setEvents] = useState<ConstellationEvent[]>([])

  const skySize = {
    height: 300,
    width: 500,
  }

  return (

    <div className="bg-slate-950 min-h-screen text-white">
      <EventForm onAdd={(newEvent) => setEvents([...events, newEvent])} skySize={skySize} />

      <Sky events={events} skySize={skySize} />

    </div>
  )
}

export default App
