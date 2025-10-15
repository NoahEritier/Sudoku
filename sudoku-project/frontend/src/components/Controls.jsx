import React from 'react'

export default function Controls({ newGame, validate, solve, undo, redo, hint, save, load, state, setState }) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-64">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft space-y-2">
        <div className="text-sm opacity-70">Nueva partida</div>
        <div className="grid grid-cols-2 gap-2">
          {['easy','medium','hard','expert'].map(d => (
            <button key={d} onClick={() => newGame(d)} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm capitalize">{d}</button>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft space-y-2">
        <div className="text-sm opacity-70">Acciones</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setState(s=>({ ...s, validateLive: !s.validateLive }))} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">Validación {state.validateLive? 'ON':'OFF'}</button>
          <button onClick={validate} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">Validar</button>
          <button onClick={solve} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">Resolver</button>
          <button onClick={hint} disabled={state.hintsUsed>=3} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 disabled:opacity-50">Pista ({state.hintsUsed}/3)</button>
          <button onClick={undo} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">Undo</button>
          <button onClick={redo} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">Redo</button>
          <button onClick={save} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">Guardar</button>
          <button onClick={load} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">Cargar</button>
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-soft space-y-2">
        <div className="text-sm opacity-70">Notas</div>
        <div className="grid grid-cols-9 gap-1">
          {Array.from({length:9}).map((_,i)=> (
            <button key={i} onClick={()=> setState(s=>({ ...s, noteDigit: i+1 }))} className={`px-2 py-1 rounded-md text-sm ${state.noteDigit===i+1? 'bg-accent text-black':'bg-gray-100 dark:bg-gray-700'}`}>{i+1}</button>
          ))}
        </div>
        <div className="text-xs opacity-60">Presiona números para escribir. Usa notas activando un dígito y clic en celdas vacías (futuro: alternar notas con tecla).</div>
      </div>
    </div>
  )
}
