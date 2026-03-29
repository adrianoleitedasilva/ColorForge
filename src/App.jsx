import React, { useState, useEffect, useRef } from 'react'
import Header from './components/Header/Header.jsx'
import PaletteGenerator from './pages/PaletteGenerator/PaletteGenerator.jsx'
import SavedPalettes from './pages/SavedPalettes/SavedPalettes.jsx'
import { useTheme } from './hooks/useTheme.js'
import './styles/global.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('generator')
  const loadRef = useRef(null)
  const { theme, toggle: toggleTheme } = useTheme()

  useEffect(() => {
    const handler = (e) => {
      loadRef.current = e.detail
      setActiveTab('generator')
    }
    window.addEventListener('colorforge:load', handler)
    return () => window.removeEventListener('colorforge:load', handler)
  }, [])

  return (
    <div className="app">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="main-content">
        {activeTab === 'generator' && (
          <PaletteGenerator pendingLoad={loadRef} />
        )}
        {activeTab === 'saved' && <SavedPalettes />}
      </main>
    </div>
  )
}
