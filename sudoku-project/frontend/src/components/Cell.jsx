import React from 'react'
import { useGame } from '../context/GameContext.jsx'

export default function Cell({ r, c, value, fixed, focused, setFocused, setCell, notes, validateLive, rowValues, colValues, boxValues, noteDigit, toggleNote }) {
  const { state } = useGame()
  const [fr, fc] = state.focused
  const sameRow = fr === r
  const sameCol = fc === c
  const sameBox = Math.floor(fr/3) === Math.floor(r/3) && Math.floor(fc/3) === Math.floor(c/3)
  const conflict = validateLive && value !== 0 && (
    rowValues.filter(v=>v===value).length>1 ||
    colValues.filter(v=>v===value).length>1 ||
    boxValues.filter(v=>v===value).length>1
  )

  const onClick = () => {
    setFocused([r,c])
    if (fixed) return
    if (noteDigit && value === 0) {
      toggleNote(r, c, noteDigit)
    }
  }

  return (
    <div
      onClick={onClick}
      className={[
        'relative flex items-center justify-center aspect-square border border-gray-200 dark:border-gray-700 rounded-md',
        r%3===0?'border-t-2':'', c%3===0?'border-l-2':'', (r+1)%3===0?'border-b-2':'', (c+1)%3===0?'border-r-2':'',
        sameRow || sameCol || sameBox ? 'bg-accent/10 dark:bg-accent/5' : '',
        focused?'bg-accent/25 dark:bg-accent/10 ring-2 ring-accent/60':'',
        fixed?'font-semibold text-gray-900 dark:text-gray-100':'text-accent-900 dark:text-accent-100',
        conflict?'bg-red-100 dark:bg-red-900/30':''
      ].filter(Boolean).join(' ')}
    >
      {value !== 0 ? (
        <span className="text-xl select-none">{value}</span>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1 text-[10px]">
          {Array.from({length:9}).map((_,i)=>{
            const d = i+1
            const active = notes && notes[d]
            const selectedNote = state.noteDigit === d
            const cls = selectedNote || active ? 'text-accent font-semibold' : 'text-gray-400 dark:text-gray-500'
            return (
              <div key={i} className={["text-center select-none", cls].join(' ')}>{d}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}
