import { useState } from 'react'

function MapViewToggle({ onViewChange, isMobile }) {
  const [view, setView] = useState('2D') // '2D' ou '3D'

  const handleToggle = () => {
    const newView = view === '2D' ? '3D' : '2D'
    setView(newView)
    onViewChange(newView)
  }

  return (
    <button
      onClick={handleToggle}
      style={{
        position: 'absolute',
        top: isMobile ? '80px' : '20px',
        right: isMobile ? '70px' : '340px',
        zIndex: 1001,
        background: 'white',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: isMobile ? '10px 12px' : '12px 16px',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: isMobile ? '13px' : '14px',
        fontWeight: '600',
        color: '#2c3e50',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#f8f9fa'
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'white'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      title={`Passer en mode ${view === '2D' ? '3D (Globe)' : '2D (Plat)'}`}
    >
      <span style={{ fontSize: '18px' }}>
        {view === '2D' ? '🌍' : '🗺️'}
      </span>
      {!isMobile && (
        <span>
          {view === '2D' ? 'Vue 3D' : 'Vue 2D'}
        </span>
      )}
    </button>
  )
}

export default MapViewToggle
