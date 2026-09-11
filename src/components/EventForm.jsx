import { useState } from 'react'

export const EventForm = ({ onAdd }) => {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.length || !date.length) {
      alert("Please fill in both the title and date fields.")
      return
    }

    const id = crypto.randomUUID()
    onAdd({ id, title, date, note })
    clearForm()
  }

  const clearForm = () => {
    setTitle("")
    setDate("")
    setNote("")
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
      </div>
    </form>
  )
}

