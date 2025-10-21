import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

const API = 'https://sudoku-backend-iwe7.onrender.com'

function emptyState() {
  return {
    board: Array.from({ length: 9 }, () => Array(9).fill(0)),
    puzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
    notes: Array.from({ length: 9 }, () => Array(9).fill(null)),
    history: [],
    future: [],
    difficulty: 'easy',
    hintsUsed: 0,
    validateLive: true,
    gameId: null,
    startTime: Date.now(),
    elapsed: 0,
    noteDigit: null,
    focused: [0,0],
    errors: 0,
    completeAt: null,
    showComplete: false,
    gameStarted: false,
    loading: false,
    lastError: null,
  }
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('sudoku-state')
    return saved ? JSON.parse(saved) : emptyState()
  })
  const timerRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('sudoku-state', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    clearInterval(timerRef.current)
    if (state.gameStarted) {
      timerRef.current = setInterval(() => {
        setState(s => ({ ...s, elapsed: Date.now() - s.startTime }))
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [state.gameStarted])

  const setFocused = (pos) => setState(s => ({ ...s, focused: pos }))

  const setCell = (r, c, v) => {
    setState(s => {
      if (s.puzzle[r][c] !== 0) return s
      const prev = s.board[r][c]
      if (prev === v) return s
      const board = s.board.map(row => row.slice())
      board[r][c] = v
      return { ...s, board, history: [...s.history, { r, c, prev }], future: [] }
    })
  }

  const undo = () => setState(s => {
    const last = s.history[s.history.length - 1]
    if (!last) return s
    const board = s.board.map(row => row.slice())
    board[last.r][last.c] = last.prev
    return { ...s, board, history: s.history.slice(0, -1), future: [...s.future, last] }
  })

  const redo = () => setState(s => {
    const nxt = s.future[s.future.length - 1]
    if (!nxt) return s
    const board = s.board.map(row => row.slice())
    // Apply stored move again
    const current = board[nxt.r][nxt.c]
    board[nxt.r][nxt.c] = current === nxt.prev ? 0 : current
    return { ...s, board, future: s.future.slice(0, -1), history: [...s.history, nxt] }
  })

  const toggleNoteDigit = (d) => setState(s => ({ ...s, noteDigit: s.noteDigit === d ? null : d }))

  const toggleNote = (r, c, n) => {
    setState(s => {
      const notes = s.notes.map(row => row ? row.slice() : Array(9).fill(null))
      notes[r] = notes[r] || Array(9).fill(null)
      const cell = notes[r][c] ? notes[r][c].slice() : Array(10).fill(false)
      cell[n] = !cell[n]
      notes[r][c] = cell
      return { ...s, notes }
    })
  }

  const newGame = async (difficulty) => {
    setState(s => ({ ...s, loading: true, lastError: null }))
    try {
      const res = await fetch(`${API}/api/generate?difficulty=${difficulty}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setState({
        ...emptyState(),
        difficulty,
        puzzle: data.puzzle,
        board: data.puzzle.map(row => row.slice()),
        startTime: Date.now(),
        gameStarted: true,
        loading: false,
        lastError: null,
      })
    } catch (e) {
      setState(s => ({ ...s, loading: false, lastError: String(e) }))
      alert(`No se pudo crear un nuevo juego. Intenta nuevamente en unos segundos. Detalle: ${String(e)}`)
    }
  }

  const solve = async () => {
    try {
      const res = await fetch(`${API}/api/solve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ board: state.board }) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data.ok) setState(s => ({ ...s, board: data.solution }))
    } catch (e) {
      setState(s => ({ ...s, lastError: String(e) }))
      alert(`No se pudo resolver el tablero. Detalle: ${String(e)}`)
    }
  }

  const verify = async () => {
    try {
      const res = await fetch(`${API}/api/solve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ board: state.board }) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!data.ok) return false
      let mismatches = 0
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (state.board[r][c] !== 0 && state.board[r][c] !== data.solution[r][c]) mismatches++
        }
      }
      setState(s => ({ ...s, errors: Math.min(3, s.errors + (mismatches > 0 ? 1 : 0)) }))
      const complete = state.board.every(row => row.every(v => v !== 0))
      if (complete) {
        const correct = state.board.flat().every((v, i) => v === data.solution[Math.floor(i/9)][i%9])
        if (correct) setState(s => ({ ...s, showComplete: true, completeAt: Date.now() }))
      }
      return mismatches === 0
    } catch (e) {
      setState(s => ({ ...s, lastError: String(e) }))
      alert(`No se pudo verificar el tablero. Detalle: ${String(e)}`)
      return false
    }
  }

  return (
    <GameContext.Provider value={{ state, setState, setCell, undo, redo, toggleNote, toggleNoteDigit, newGame, solve, verify, setFocused }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
