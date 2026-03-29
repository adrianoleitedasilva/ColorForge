import React from 'react'
import { getTextColor, getContrastRatio, getContrastRating, hexToRgb } from '../../utils/colorUtils.js'
import './ColorSwatch.css'

function LockIcon({ locked }) {
  return locked ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1C9.24 1 7 3.24 7 6v2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V10a2 2 0 00-2-2h-2V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm0 9a2 2 0 110 4 2 2 0 010-4z"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1C9.24 1 7 3.24 7 6v2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V10a2 2 0 00-2-2h-9V6c0-1.66 1.34-3 3-3 1.28 0 2.38.8 2.82 1.93L18.41 3.4C17.5 1.96 15.86 1 14 1h-2zm0 11a2 2 0 110 4 2 2 0 010-4z"/>
    </svg>
  )
}

function DragHandle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 4a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM9 12a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0zM9 20a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  )
}

export default function ColorSwatch({
  color, locked, onToggleLock, onCopy, copied, onColorChange,
  onRemove, canRemove,
  // drag props
  dragging, dragOver, onDragStart, onDragEnter, onDragOver, onDragEnd, onDrop,
}) {
  const textColor = getTextColor(color)
  const contrastRatio = getContrastRatio(color, textColor)
  const rating = getContrastRating(contrastRatio)
  const rgb = hexToRgb(color)

  let classNames = 'swatch'
  if (locked) classNames += ' swatch--locked'
  if (dragging) classNames += ' swatch--dragging'
  if (dragOver) classNames += ' swatch--drag-over'

  return (
    <article
      className={classNames}
      style={{ '--swatch-bg': color, '--swatch-text': textColor }}
      aria-label={`Color ${color}${locked ? ', locked' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      <div className="swatch-bg" />

      <div className="swatch-content">
        {/* Top actions */}
        <div className="swatch-actions">
          <span className="swatch-btn drag-handle" title="Drag to reorder" aria-hidden="true">
            <DragHandle />
          </span>

          <button
            className={`swatch-btn lock-btn${locked ? ' lock-btn--active' : ''}`}
            onClick={onToggleLock}
            title={locked ? 'Unlock color' : 'Lock color'}
            aria-label={locked ? 'Unlock color' : 'Lock color'}
            aria-pressed={locked}
          >
            <LockIcon locked={locked} />
          </button>

          {canRemove && (
            <button
              className="swatch-btn remove-btn"
              onClick={onRemove}
              title="Remove color"
              aria-label="Remove color"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          )}
        </div>

        {/* Center: color info */}
        <div className="swatch-info">
          <button
            className={`swatch-hex${copied ? ' swatch-hex--copied' : ''}`}
            onClick={() => onCopy(color)}
            title="Click to copy HEX"
            aria-label={`Copy HEX ${color}`}
          >
            <span className="hex-icon">
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z"/>
                </svg>
              )}
            </span>
            <span className="hex-value">{color}</span>
          </button>

          {copied && (
            <span className="copy-toast" role="status" aria-live="polite">Copied!</span>
          )}
        </div>

        {/* Bottom: meta + color picker */}
        <div className="swatch-meta">
          {rgb && (
            <span className="swatch-meta-value" title="RGB value">
              {rgb.r} {rgb.g} {rgb.b}
            </span>
          )}
          <span
            className={`contrast-badge contrast-badge--${rating.level}`}
            title={`Contrast ratio: ${contrastRatio.toFixed(2)}:1`}
            aria-label={`Contrast rating: ${rating.label}`}
          >
            {rating.label}
          </span>

          <div className="picker-wrapper">
            <button
              className="swatch-btn picker-btn"
              title="Pick a color"
              aria-label="Open color picker"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a1 1 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96a1 1 0 000-1.41z"/>
              </svg>
            </button>
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="color-picker-input"
              aria-label="Color picker"
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
    </article>
  )
}
