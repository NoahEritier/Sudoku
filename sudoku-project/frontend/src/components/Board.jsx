import React, { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext.jsx'
import Cell from './Cell.jsx'

export default function Board() {
  const { state, setCell, toggleNote, setFocused } = useGame()
  const boardRef = useRef(null)

  const isFixed = (r, c) => state.puzzle[r][c] !== 0

  const onKeyDown = (e) => {
    const [r, c] = state.focused
    if (e.key === 'ArrowUp') setFocused([Math.max(0, r-1), c])
    else if (e.key === 'ArrowDown') setFocused([Math.min(8, r+1), c])
    else if (e.key === 'ArrowLeft') setFocused([r, Math.max(0, c-1)])
    else if (e.key === 'ArrowRight') setFocused([r, Math.min(8, c+1)])
    else if (/^[1-9]$/.test(e.key)) {
      const d = parseInt(e.key, 10)
      if (!isFixed(r,c)) {
        if (state.noteDigit !== null && state.board[r][c] === 0) {
          // Notes active: typing numbers toggles notes for that number
          toggleNote(r, c, d)
        } else {
          setCell(r, c, d)
        }
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      if (!isFixed(r,c)) setCell(r, c, 0)
    }
  }

  useEffect(() => {
    boardRef.current?.focus()
  }, [])

  return (
    <div className="flex items-center justify-center">
      <div
        ref={boardRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="outline-none select-none grid grid-cols-9 w-[80vw] max-w-[500px] aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-soft overflow-hidden"
      >
        {Array.from({ length: 9 }).map((_, r) => (
          Array.from({ length: 9 }).map((__, c) => (
            <Cell key={`${r}-${c}`}
              r={r} c={c}
              value={state.board[r][c]}
              fixed={isFixed(r,c)}
              focused={state.focused[0]===r && state.focused[1]===c}
              setFocused={setFocused}
              setCell={setCell}
              notes={state.notes[r][c]}
              validateLive={state.validateLive}
              noteDigit={state.noteDigit}
              toggleNote={toggleNote}
              rowValues={state.board[r]}
              colValues={state.board.map(row=>row[c])}
              boxValues={state.board.slice(Math.floor(r/3)*3, Math.floor(r/3)*3+3).flatMap(row=>row.slice(Math.floor(c/3)*3, Math.floor(c/3)*3+3))}
            />
          ))
        ))}
      </div>
    </div>
  )
}
