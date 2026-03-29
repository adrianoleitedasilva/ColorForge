import React, { useState } from 'react'
import { exportAsCSS, exportAsJSON, exportAsTailwind } from '../../utils/colorUtils.js'
import './ExportModal.css'

const FORMATS = [
  { id: 'json',     label: 'JSON',     fn: exportAsJSON },
  { id: 'css',      label: 'CSS Vars', fn: exportAsCSS },
  { id: 'tailwind', label: 'Tailwind', fn: exportAsTailwind },
]

export default function ExportModal({ colors, onClose }) {
  const [activeFormat, setActiveFormat] = useState('json')
  const [copied, setCopied] = useState(false)

  const currentFn = FORMATS.find(f => f.id === activeFormat)?.fn
  const output = currentFn ? currentFn(colors) : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Export palette">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Export Palette</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="modal-tabs" role="tablist">
          {FORMATS.map(f => (
            <button
              key={f.id}
              className={`modal-tab${activeFormat === f.id ? ' active' : ''}`}
              onClick={() => setActiveFormat(f.id)}
              role="tab"
              aria-selected={activeFormat === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>

        <pre className="modal-code" tabIndex={0}>{output}</pre>

        <div className="modal-footer">
          <button className="btn-copy-export" onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
      </div>
    </div>
  )
}
