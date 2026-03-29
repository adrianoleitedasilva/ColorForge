import React, { useState, useEffect } from 'react'
import { getSavedPalettes, deletePalette, clearAllPalettes } from '../../utils/storage.js'
import { getTextColor } from '../../utils/colorUtils.js'
import './SavedPalettes.css'

function PaletteCard({ palette, onDelete, onLoad }) {
  const [copied, setCopied] = useState(false)

  const handleCopyHex = async () => {
    const text = palette.colors.join(', ')
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const date = new Date(palette.createdAt).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <article className="palette-card" aria-label={`Saved palette from ${date}`}>
      <div className="card-swatches">
        {palette.colors.map((color, i) => (
          <div
            key={i}
            className="card-swatch"
            style={{ background: color, color: getTextColor(color) }}
            title={color}
          >
            <span className="card-swatch-hex">{color}</span>
          </div>
        ))}
      </div>

      <div className="card-footer">
        <span className="card-date">{date}</span>
        <div className="card-actions">
          <button
            className="card-btn"
            onClick={handleCopyHex}
            title="Copy all HEX codes"
            aria-label="Copy all colors"
          >
            {copied ? '✓' : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z"/>
              </svg>
            )}
          </button>
          <button
            className="card-btn"
            onClick={() => onLoad(palette.colors)}
            title="Load this palette"
            aria-label="Load palette in generator"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-5 14l-5-5 1.41-1.41L14 14.17l7.59-7.59L23 8l-9 9z"/>
            </svg>
          </button>
          <button
            className="card-btn card-btn--danger"
            onClick={() => onDelete(palette.id)}
            title="Delete palette"
            aria-label="Delete palette"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

export default function SavedPalettes({ onLoadPalette }) {
  const [palettes, setPalettes] = useState([])
  const [loadedId, setLoadedId] = useState(null)

  useEffect(() => {
    setPalettes(getSavedPalettes())
  }, [])

  const handleDelete = (id) => {
    deletePalette(id)
    setPalettes(getSavedPalettes())
  }

  const handleLoad = (colors) => {
    // Store in sessionStorage so generator can pick it up on tab switch
    sessionStorage.setItem('colorforge_load', JSON.stringify(colors))
    // Also copy URL share approach: update hash
    const hash = colors.map(c => c.replace('#', '')).join('-')
    window.location.hash = hash
    // Switch to generator tab via event
    window.dispatchEvent(new CustomEvent('colorforge:load', { detail: colors }))
  }

  const handleClearAll = () => {
    if (window.confirm('Delete all saved palettes?')) {
      clearAllPalettes()
      setPalettes([])
    }
  }

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h1 className="saved-title">Saved Palettes</h1>
        <span className="saved-count">{palettes.length} palette{palettes.length !== 1 ? 's' : ''}</span>
        {palettes.length > 0 && (
          <button className="btn-clear" onClick={handleClearAll}>Clear all</button>
        )}
      </div>

      {palettes.length === 0 ? (
        <div className="saved-empty" role="status">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--text-muted)" aria-hidden="true">
            <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zm3-10H5V5h10v4z"/>
          </svg>
          <p>No saved palettes yet.</p>
          <p className="saved-empty-hint">Generate a palette and click <strong>Save</strong> to store it here.</p>
        </div>
      ) : (
        <div className="saved-grid">
          {palettes.map(palette => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              onDelete={handleDelete}
              onLoad={handleLoad}
            />
          ))}
        </div>
      )}
    </div>
  )
}
