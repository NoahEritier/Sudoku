import React, { useEffect, useState } from 'react'
import { GameProvider } from './context/GameContext.jsx'
import Board from './components/Board.jsx'
import ControlBar from './components/ControlBar.jsx'
import CompleteModal from './components/CompleteModal.jsx'

export default function App() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6 font-poppins bg-surface-light dark:bg-surface-dark transition-colors">
        <header className="w-full max-w-6xl flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Sudoku</h1>
          <button onClick={() => setDark(d => !d)} className="px-3 py-2 rounded-2xl bg-white dark:bg-gray-800 shadow-soft text-sm">{dark ? '☾ Modo oscuro' : '☀ Modo claro'}</button>
        </header>

        <main className="w-full max-w-6xl flex flex-col items-center justify-center gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-4 w-full">
            <Board />
          </div>
          <ControlBar />
        </main>
        <CompleteModal />
      </div>
    </GameProvider>
  )
}
