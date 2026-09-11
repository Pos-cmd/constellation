import { ConstellationEvent } from '../App';

export const EventDetails = ({ event }: { event: ConstellationEvent | null }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-md m-4 p-4 text-white">
      {event ? (
        <div className="flex flex-col gap-2">
          <h2>{event.title}</h2>
          <p>Date: {event.date}</p>
          <p>Note: {event.note}</p>
        </div>
      ) : (
        <p>No event selected</p>
      )}
    </div>
  )
}

