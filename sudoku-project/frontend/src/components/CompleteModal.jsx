import React from 'react'
import { useGame } from '../context/GameContext.jsx'
import { motion, AnimatePresence } from 'framer-motion'

export default function CompleteModal() {
  const { state, setState } = useGame()
  const totalSeconds = Math.floor((state.completeAt ? state.completeAt - state.startTime : state.elapsed) / 1000)

  return (
    <AnimatePresence>
      {state.showComplete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-soft">
            <h2 className="text-2xl font-semibold mb-2">¡Completado! 🎉</h2>
            <p className="opacity-80 mb-4">Tiempo total: <span className="font-medium">{totalSeconds}s</span></p>
            <div className="flex justify-end gap-2">
              <button onClick={()=> setState(s=> ({ ...s, showComplete: false }))} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800">Cerrar</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
