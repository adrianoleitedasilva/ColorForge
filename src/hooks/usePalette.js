import { useReducer, useEffect, useCallback } from 'react'
import { randomHex, parseColorsFromHash, colorsToHash } from '../utils/colorUtils.js'

const DEFAULT_SIZE = 5
const MIN_SIZE = 2
const MAX_SIZE = 8
const MAX_HISTORY = 60

function buildInitialSnapshot() {
  const fromHash = parseColorsFromHash(window.location.hash)
  return {
    colors: fromHash || Array.from({ length: DEFAULT_SIZE }, randomHex),
    locked: (fromHash || Array(DEFAULT_SIZE)).map(() => false),
  }
}

function reducer(state, action) {
  const { history, index } = state
  const current = history[index]

  switch (action.type) {
    case 'PUSH': {
      const next = [...history.slice(0, index + 1), action.snapshot].slice(-MAX_HISTORY)
      return { history: next, index: next.length - 1 }
    }
    case 'UNDO':
      return index > 0 ? { ...state, index: index - 1 } : state
    case 'REDO':
      return index < history.length - 1 ? { ...state, index: index + 1 } : state
    case 'TOGGLE_LOCK': {
      const newLocked = current.locked.map((l, i) => i === action.index ? !l : l)
      const next = [...history.slice(0, index + 1), { ...current, locked: newLocked }].slice(-MAX_HISTORY)
      return { history: next, index: next.length - 1 }
    }
    default:
      return state
  }
}

export function usePalette() {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    history: [buildInitialSnapshot()],
    index: 0,
  }))

  const { history, index } = state
  const { colors, locked } = history[index]

  // Sync URL hash
  useEffect(() => {
    window.history.replaceState(null, '', '#' + colorsToHash(colors))
  }, [colors])

  const generate = useCallback(() => {
    const current = history[index]
    dispatch({
      type: 'PUSH',
      snapshot: {
        colors: current.colors.map((c, i) => current.locked[i] ? c : randomHex()),
        locked: current.locked,
      },
    })
  }, [history, index])

  const toggleLock = useCallback((i) => {
    dispatch({ type: 'TOGGLE_LOCK', index: i })
  }, [])

  const setColor = useCallback((i, hex) => {
    const current = history[index]
    dispatch({
      type: 'PUSH',
      snapshot: {
        colors: current.colors.map((c, j) => j === i ? hex.toUpperCase() : c),
        locked: current.locked,
      },
    })
  }, [history, index])

  const reorder = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return
    const current = history[index]
    const newColors = [...current.colors]
    const newLocked = [...current.locked]
    const [spliceColor] = newColors.splice(fromIndex, 1)
    const [spliceLock] = newLocked.splice(fromIndex, 1)
    newColors.splice(toIndex, 0, spliceColor)
    newLocked.splice(toIndex, 0, spliceLock)
    dispatch({ type: 'PUSH', snapshot: { colors: newColors, locked: newLocked } })
  }, [history, index])

  const loadPalette = useCallback((savedColors) => {
    dispatch({
      type: 'PUSH',
      snapshot: { colors: savedColors, locked: savedColors.map(() => false) },
    })
  }, [])

  const addColor = useCallback(() => {
    const current = history[index]
    if (current.colors.length >= MAX_SIZE) return
    dispatch({
      type: 'PUSH',
      snapshot: {
        colors: [...current.colors, randomHex()],
        locked: [...current.locked, false],
      },
    })
  }, [history, index])

  const removeColor = useCallback((i) => {
    const current = history[index]
    if (current.colors.length <= MIN_SIZE) return
    dispatch({
      type: 'PUSH',
      snapshot: {
        colors: current.colors.filter((_, j) => j !== i),
        locked: current.locked.filter((_, j) => j !== i),
      },
    })
  }, [history, index])

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])

  return {
    colors,
    locked,
    generate,
    toggleLock,
    setColor,
    reorder,
    addColor,
    removeColor,
    loadPalette,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
    canAdd: colors.length < MAX_SIZE,
    canRemove: colors.length > MIN_SIZE,
  }
}
