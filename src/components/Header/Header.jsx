import React from 'react'
import './Header.css'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 7a5 5 0 100 10A5 5 0 0012 7zm0-5a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.7.71a1 1 0 11-1.41 1.41l-.71-.7a1 1 0 010-1.42zm13.44 13.44a1 1 0 011.41 0l.71.71a1 1 0 11-1.41 1.41l-.71-.71a1 1 0 010-1.41zM3 12a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm16 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.93 18.36a1 1 0 010-1.42l.7-.7a1 1 0 111.42 1.41l-.71.71a1 1 0 01-1.41 0zm13.44-13.44a1 1 0 010-1.41l.71-.71a1 1 0 111.41 1.42l-.71.7a1 1 0 01-1.41 0z"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/>
    </svg>
  )
}

export default function Header({ activeTab, onTabChange, theme, onToggleTheme }) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="header-brand">
          <div className="brand-icon" aria-hidden="true">
            <span style={{ background: '#FF6B6B' }} />
            <span style={{ background: '#FFE66D' }} />
            <span style={{ background: '#4ECDC4' }} />
            <span style={{ background: '#7c6af7' }} />
          </div>
          <span className="brand-name"><span className="brand-color">Color</span><strong>Forge</strong></span>
        </div>

        <nav className="header-nav" aria-label="Main navigation">
          <button
            className={`nav-btn${activeTab === 'generator' ? ' active' : ''}`}
            onClick={() => onTabChange('generator')}
            aria-current={activeTab === 'generator' ? 'page' : undefined}
          >
            Generator
          </button>
          <button
            className={`nav-btn${activeTab === 'saved' ? ' active' : ''}`}
            onClick={() => onTabChange('saved')}
            aria-current={activeTab === 'saved' ? 'page' : undefined}
          >
            Saved
          </button>
        </nav>

        <div className="header-right">
          <div className="header-hint" aria-label="Keyboard shortcut hint">
            Press <kbd>Space</kbd> to generate
          </div>

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
