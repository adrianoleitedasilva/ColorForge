import { useEffect } from 'react'

export function useKeyboard({ onSpace, onUndo, onRedo }) {
  useEffect(() => {
    const handler = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return

      if (e.code === 'Space') {
        e.preventDefault()
        onSpace?.()
        return
      }

      if (e.ctrlKey || e.metaKey) {
        if (!e.shiftKey && e.key === 'z') {
          e.preventDefault()
          onUndo?.()
        } else if ((e.shiftKey && e.key === 'Z') || e.key === 'y') {
          e.preventDefault()
          onRedo?.()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSpace, onUndo, onRedo])
}
