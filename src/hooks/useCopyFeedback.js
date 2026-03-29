import { useState, useCallback, useRef } from 'react'

export function useCopyFeedback(timeout = 1500) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const timerRef = useRef(null)

  const copy = useCallback(async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      if (timerRef.current) clearTimeout(timerRef.current)
      setCopiedIndex(index)
      timerRef.current = setTimeout(() => setCopiedIndex(null), timeout)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (timerRef.current) clearTimeout(timerRef.current)
      setCopiedIndex(index)
      timerRef.current = setTimeout(() => setCopiedIndex(null), timeout)
    }
  }, [timeout])

  return { copiedIndex, copy }
}
