import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-slate-600 mb-6">
          If you can see this nice card with spacing, colors, and rounded corners, Tailwind is working!
        </p>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white transition"
        >
          Clicked {count} times
        </button>
      </div>
    </div>
  )
}

export default App
