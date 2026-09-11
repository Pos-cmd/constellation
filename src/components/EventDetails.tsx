import { ConstellationEvent } from '../App';

export const EventDetails = ({ selectedEvent, eventList, onRemoveEvent }: { selectedEvent: ConstellationEvent | null; eventList: ConstellationEvent[]; onRemoveEvent: (id: string) => void }) => {
  return (
    <div>
      {/* Events list, with scrollbar and action for remove an event */}
      <div className="bg-slate-800 rounded-lg shadow-md m-4 p-4 text-white max-h-64 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">Events List</h2>
        {eventList.length > 0 ? (
          <ul className="list-disc pl-5">
            {eventList.map((event) => (
              <li key={event.id} className="mb-2">
                <span className="font-semibold">{event.title}</span> - {event.date}
                <button
                  onClick={() => onRemoveEvent(event.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events to display</p>
        )}
      </div>

      {/* Event Details */}
      <div className="bg-slate-800 rounded-lg shadow-md m-4 p-4 text-white">
        {selectedEvent ? (
          <div className="flex flex-col gap-2">
            <div>
              <h2>{selectedEvent.title}</h2>
              <p>Date: {selectedEvent.date}</p>
              <p>Note: {selectedEvent.note}</p>
            </div>
            <button
              onClick={() => onRemoveEvent(selectedEvent.id)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
            >
              Remove
            </button>
          </div>
        ) : (
          <p>No event selected</p>
        )}
      </div>
    </div>
  )
}
