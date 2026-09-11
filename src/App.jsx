import { useState } from "react"
import { EventForm } from "./components/EventForm"

function App() {
  const [events, setEvents] = useState([])

  return (

    <div className="bg-slate-950 min-h-screen text-white">
      <EventForm onAdd={(newEvent) => setEvents([...events, newEvent])} />

      <div className="flex flex-col gap-4 p-4">
        {events.map((e) => (
          <div key={e.id} className="bg-slate-800 p-4 rounded">
            <h2 className="text-xl font-bold">{e.title}</h2>
            <p className="text-gray-400">{e.date}</p>
            <p>{e.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
