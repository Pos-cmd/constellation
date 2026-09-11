import { useState } from 'react'
import { ConstellationEvent } from '../App'

export const EventForm = ({ onAdd, skySize }: { onAdd: (event: ConstellationEvent) => void; skySize: { width: number; height: number } }) => {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [note, setNote] = useState("")

  const generateRandomPosition = () => {
    const randomX = Math.floor(Math.random() * skySize.width)
    const randomY = Math.floor(Math.random() * skySize.height)
    return { x: randomX, y: randomY }
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.length || !date.length) {
      alert("Please fill in both the title and date fields.")
      return
    }

    const id = crypto.randomUUID()

    const position = generateRandomPosition()

    onAdd({ id, title, date, note, position })
    clearForm()
  }

  const clearForm = () => {
    setTitle("")
    setDate("")
    setNote("")
  }

  const randomEvent = () => {
    clearForm()

    const id = crypto.randomUUID()

    const position = generateRandomPosition()

    setTitle("Random Event")
    // Randomly generate a date within the last 10 years
    const randomDate = new Date()
    randomDate.setFullYear(randomDate.getFullYear() - Math.floor(Math.random() * 10))
    setDate(randomDate.toISOString().split('T')[0])
    setNote("This is a randomly generated event.")
    onAdd({ id, title, date, note, position })

  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <label htmlFor="title" className="mr-2">
            Title:
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="date" className="mr-2">
            Date:
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="note" className="mr-2">
            Note:
          </label>
          <textarea
            id="note"
            name="note"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Event
        </button>

        <button
          type="button"
          onClick={randomEvent}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Random Event
        </button>
      </div>
    </form>
  )
}

