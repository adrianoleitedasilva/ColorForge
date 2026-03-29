import React, { useState, useEffect, useRef, useCallback } from 'react'
import ColorSwatch from '../../components/ColorSwatch/ColorSwatch.jsx'
import ExportModal from '../../components/ExportModal/ExportModal.jsx'
import { usePalette } from '../../hooks/usePalette.js'
import { useKeyboard } from '../../hooks/useKeyboard.js'
import { useCopyFeedback } from '../../hooks/useCopyFeedback.js'
import { savePalette } from '../../utils/storage.js'
import { downloadPNG, downloadJPG, downloadTXT } from '../../utils/downloadUtils.js'
import './PaletteGenerator.css'

export default function PaletteGenerator({ pendingLoad }) {
  const {
    colors, locked, generate, toggleLock, setColor,
    reorder, addColor, removeColor, loadPalette,
    undo, redo, canUndo, canRedo, canAdd, canRemove,
  } = usePalette()

  const { copiedIndex, copy } = useCopyFeedback()
  const [showExport, setShowExport] = useState(false)
  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [saveLibFlash, setSaveLibFlash] = useState(false)
  const [shareFlash, setShareFlash] = useState(false)
  const [copyAllFlash, setCopyAllFlash] = useState(false)
  const saveMenuRef = useRef(null)

  // Drag state
  const dragIndexRef = useRef(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Close save dropdown on outside click
  useEffect(() => {
    if (!showSaveMenu) return
    const handler = (e) => {
      if (saveMenuRef.current && !saveMenuRef.current.contains(e.target)) {
        setShowSaveMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showSaveMenu])

  // Handle palette loaded from SavedPalettes
  useEffect(() => {
    if (pendingLoad?.current) {
      loadPalette(pendingLoad.current)
      pendingLoad.current = null
    }
  }, [pendingLoad, loadPalette])

  useKeyboard({ onSpace: generate, onUndo: undo, onRedo: redo })

  const handleSaveLibrary = () => {
    savePalette(colors)
    setSaveLibFlash(true)
    setShowSaveMenu(false)
    setTimeout(() => setSaveLibFlash(false), 1600)
  }

  const handleDownload = (fn) => {
    fn(colors)
    setShowSaveMenu(false)
  }

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setShareFlash(true)
    setTimeout(() => setShareFlash(false), 1600)
  }

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(colors.join(', '))
    setCopyAllFlash(true)
    setTimeout(() => setCopyAllFlash(false), 1600)
  }

  // Drag handlers
  const handleDragStart = useCallback((index) => (e) => {
    dragIndexRef.current = index
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragEnter = useCallback((index) => (e) => {
    e.preventDefault()
    if (dragIndexRef.current !== index) setDragOverIndex(index)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((index) => (e) => {
    e.preventDefault()
    if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
      reorder(dragIndexRef.current, index)
    }
    dragIndexRef.current = null
    setDragIndex(null)
    setDragOverIndex(null)
  }, [reorder])

  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  return (
    <div className="generator">
      {/* Toolbar */}
      <div className="toolbar" role="toolbar" aria-label="Palette actions">
        <button className="toolbar-btn toolbar-btn--primary" onClick={generate} aria-label="Generate new palette">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Generate
        </button>

        {/* Undo / Redo */}
        <button
          className="toolbar-btn toolbar-btn--icon"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
          </svg>
        </button>
        <button
          className="toolbar-btn toolbar-btn--icon"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          aria-label="Redo"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16a8 8 0 017.6-5.5c1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
          </svg>
        </button>

        <div className="toolbar-divider" aria-hidden="true" />

        {/* Save dropdown */}
        <div className="save-wrapper" ref={saveMenuRef}>
          <button
            className={`toolbar-btn save-btn${saveLibFlash ? ' toolbar-btn--flash' : ''}`}
            onClick={() => setShowSaveMenu(v => !v)}
            aria-haspopup="true"
            aria-expanded={showSaveMenu}
            aria-label="Save options"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zm3-10H5V5h10v4z"/>
            </svg>
            {saveLibFlash ? 'Saved!' : 'Save'}
            <svg className={`chevron${showSaveMenu ? ' chevron--up' : ''}`} width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>

          {showSaveMenu && (
            <div className="save-dropdown" role="menu">
              <button className="dropdown-item" onClick={handleSaveLibrary} role="menuitem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16a3 3 0 110-6 3 3 0 010 6zm3-10H5V5h10v4z"/>
                </svg>
                Save to library
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={() => handleDownload(downloadPNG)} role="menuitem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Download PNG
              </button>
              <button className="dropdown-item" onClick={() => handleDownload(downloadJPG)} role="menuitem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Download JPG
              </button>
              <button className="dropdown-item" onClick={() => handleDownload(downloadTXT)} role="menuitem">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h3v1.5H8V10z"/>
                </svg>
                Download TXT
              </button>
            </div>
          )}
        </div>

        <button
          className={`toolbar-btn${shareFlash ? ' toolbar-btn--flash' : ''}`}
          onClick={handleShare}
          title="Copy shareable URL"
          aria-label="Share palette URL"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 000-6 3 3 0 00-3 3c0 .24.04.47.09.7L8.04 9.81A2.99 2.99 0 006 9a3 3 0 000 6c.79 0 1.5-.31 2.04-.81l7.12 4.15c-.05.21-.08.43-.08.66a2.92 2.92 0 002.92 2.92 2.92 2.92 0 000-5.84z"/>
          </svg>
          {shareFlash ? 'Link copied!' : 'Share'}
        </button>

        <button
          className="toolbar-btn"
          onClick={() => setShowExport(true)}
          title="Export palette"
          aria-label="Export palette"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
          Export
        </button>

        <button
          className={`toolbar-btn${copyAllFlash ? ' toolbar-btn--flash' : ''}`}
          onClick={handleCopyAll}
          title="Copy all HEX codes"
          aria-label="Copy all HEX codes"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z"/>
          </svg>
          {copyAllFlash ? 'Copied!' : 'Copy All'}
        </button>

        <div className="toolbar-count" aria-label={`${colors.length} cores`}>
          {colors.length} / 8
        </div>
      </div>

      {/* Swatches + Add button */}
      <div className="palette" role="list" aria-label="Color palette">
        {colors.map((color, i) => (
          <ColorSwatch
            key={i}
            color={color}
            locked={locked[i]}
            onToggleLock={() => toggleLock(i)}
            onCopy={() => copy(color, i)}
            copied={copiedIndex === i}
            onColorChange={(hex) => setColor(i, hex)}
            onRemove={() => removeColor(i)}
            canRemove={canRemove}
            dragging={dragIndex === i}
            dragOver={dragOverIndex === i}
            onDragStart={handleDragStart(i)}
            onDragEnter={handleDragEnter(i)}
            onDragOver={handleDragOver}
            onDrop={handleDrop(i)}
            onDragEnd={handleDragEnd}
          />
        ))}

        {canAdd && (
          <button
            className="add-color-btn"
            onClick={addColor}
            title="Add color"
            aria-label="Add a new color"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        )}
      </div>

      {showExport && (
        <ExportModal colors={colors} onClose={() => setShowExport(false)} />
      )}
    </div>
  )
}
