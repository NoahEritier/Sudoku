import React from 'react'
import { useGame } from '../context/GameContext.jsx'
import { motion } from 'framer-motion'

export default function ControlBar() {
  const { state, setState, setCell, undo, redo, toggleNote, toggleNoteDigit, newGame, solve, verify } = useGame()

  const onDigit = (d) => {
    const [r,c] = state.focused
    if (state.puzzle[r][c] !== 0) return
    if (state.noteDigit) {
      toggleNote(r, c, d)
    } else {
      setCell(r, c, d)
    }
  }

  const onErase = () => {
    const [r,c] = state.focused
    if (state.puzzle[r][c] !== 0) return
    setCell(r, c, 0)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl p-3 md:p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-soft">
      <div className="flex flex-wrap items-start justify-center gap-3 md:gap-4">
        {/* Números */}
        <div className="flex-1 min-w-[260px] max-w-[520px]">
          <div className="text-xs opacity-70 mb-2 px-1">Números</div>
          <div className="grid grid-cols-9 gap-1 md:gap-2">
            {Array.from({length:9}).map((_,i)=> (
              <button key={i} onClick={()=> onDigit(i+1)} disabled={state.loading} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium leading-none whitespace-nowrap">
                {i+1}
              </button>
            ))}
            <button onClick={onErase} disabled={state.loading} className="col-span-9 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-none whitespace-nowrap">Borrar</button>
          </div>
        </div>

        {/* Controles */}
        <div className="flex-1 min-w-[240px] max-w-[420px]">
          <div className="text-xs opacity-70 mb-2 px-1">Controles</div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={()=> setState(s=>({ ...s, validateLive: !s.validateLive }))} disabled={state.loading} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-none whitespace-nowrap">Validación {state.validateLive? 'ON':'OFF'}</button>
            <button onClick={verify} disabled={state.loading} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-none whitespace-nowrap">Verificar</button>
            <button onClick={solve} disabled={state.loading} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-none whitespace-nowrap">Resolver</button>
            <button onClick={undo} disabled={state.loading} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-none whitespace-nowrap">Undo</button>
            <button onClick={redo} disabled={state.loading} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-none whitespace-nowrap">Redo</button>
            <button onClick={()=> toggleNoteDigit(state.noteDigit || 1)} disabled={state.loading} className={`px-3 py-2 rounded-xl text-sm leading-none whitespace-nowrap ${state.noteDigit? 'bg-accent text-white':'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'}`}>Notas</button>
          </div>
        </div>

        {/* Nuevo juego */}
        <div className="flex-1 min-w-[240px] max-w-[420px]">
          <div className="text-xs opacity-70 mb-2 px-1">Nuevo juego</div>
          <div className="flex flex-wrap items-center gap-2">
            {['easy','medium','hard','expert'].map(d => (
              <button key={d} onClick={()=> newGame(d)} disabled={state.loading} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm leading-none capitalize whitespace-nowrap">{d}</button>
            ))}
            {state.loading && <div className="ml-2 text-xs opacity-70">Cargando...</div>}
            <div className="ml-auto text-xs opacity-70 whitespace-nowrap">Tiempo {Math.floor(state.elapsed/1000)}s · Errores {state.errors}/3</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
