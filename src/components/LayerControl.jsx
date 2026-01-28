import { useState } from 'react'

function LayerControl({ onLayerChange, isMobile }) {
  const [isOpen, setIsOpen] = useState(false)
  const [layers, setLayers] = useState({
    mythes: true,        // Couche principale (toujours visible)
    diffusion: false,    // Couche diffusion
    cultures: false,     // Couche cultures
    regions: false       // Couche régions
  })

  const handleToggleLayer = (layerName) => {
    if (layerName === 'mythes') return // Ne pas désactiver la couche principale
    
    const newLayers = {
      ...layers,
      [layerName]: !layers[layerName]
    }
    setLayers(newLayers)
    onLayerChange(newLayers)
  }

  return (
    <>
      {/* Bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          top: isMobile ? '80px' : '20px',
          right: isMobile ? '10px' : '20px',
          zIndex: 1001,
          background: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: isMobile ? '10px' : '12px',
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
      >
        <span style={{ fontSize: '18px' }}>🗂️</span>
        {!isMobile && <span>Couches</span>}
      </button>

      {/* Panel des couches */}
      {isOpen && (
        <>
          <div
            style={{
              position: 'absolute',
              top: isMobile ? '130px' : '70px',
              right: isMobile ? '10px' : '20px',
              zIndex: 1001,
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              padding: isMobile ? '15px' : '20px',
              minWidth: isMobile ? '260px' : '300px',
              animation: 'slideIn 0.3s ease'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '2px solid #e0e0e0'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '700',
                color: '#2c3e50'
              }}>
                🗂️ Gestion des couches
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#7f8c8d',
                  padding: '0',
                  width: '24px',
                  height: '24px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Liste des couches */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {/* Couche Mythes (toujours active) */}
              <LayerItem
                name="mythes"
                label="Mythes"
                icon="📍"
                color="#667eea"
                enabled={layers.mythes}
                locked={true}
                onToggle={handleToggleLayer}
                isMobile={isMobile}
              />

              {/* Couche Diffusion */}
              <LayerItem
                name="diffusion"
                label="Diffusion"
                icon="🌊"
                color="#3498db"
                enabled={layers.diffusion}
                description="Affiche la propagation des mythes dans l'espace"
                onToggle={handleToggleLayer}
                isMobile={isMobile}
              />

              {/* Couche Cultures */}
              <LayerItem
                name="cultures"
                label="Cultures"
                icon="🌍"
                color="#9b59b6"
                enabled={layers.cultures}
                description="Zones d'influence culturelle"
                onToggle={handleToggleLayer}
                isMobile={isMobile}
              />

              {/* Couche Régions */}
              <LayerItem
                name="regions"
                label="Régions"
                icon="📍"
                color="#27ae60"
                enabled={layers.regions}
                description="Délimitations géographiques historiques"
                onToggle={handleToggleLayer}
                isMobile={isMobile}
              />
            </div>

            {/* Info */}
            <div style={{
              marginTop: '15px',
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: isMobile ? '11px' : '12px',
              color: '#7f8c8d',
              lineHeight: '1.4'
            }}>
              💡 <strong>Astuce :</strong> Activez plusieurs couches pour comparer les données
            </div>
          </div>

          {/* Overlay pour fermer */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.2)',
              zIndex: 1000
            }}
          />
        </>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  )
}

function LayerItem({ name, label, icon, color, enabled, locked, description, onToggle, isMobile }) {
  return (
    <div
      onClick={() => !locked && onToggle(name)}
      style={{
        padding: isMobile ? '10px' : '12px',
        background: enabled ? `${color}11` : '#f8f9fa',
        border: `2px solid ${enabled ? color : '#e0e0e0'}`,
        borderRadius: '10px',
        cursor: locked ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: locked ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (!locked) {
          e.currentTarget.style.transform = 'translateX(5px)'
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'
        }
      }}
      onMouseLeave={(e) => {
        if (!locked) {
          e.currentTarget.style.transform = 'translateX(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: description ? '5px' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <span style={{
            fontWeight: '600',
            color: '#2c3e50',
            fontSize: isMobile ? '13px' : '14px'
          }}>
            {label}
          </span>
          {locked && (
            <span style={{ fontSize: '14px', opacity: 0.5 }}>🔒</span>
          )}
        </div>

        {/* Toggle switch */}
        <div style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: enabled ? color : '#bdc3c7',
          position: 'relative',
          transition: 'background 0.3s'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: '2px',
            left: enabled ? '22px' : '2px',
            transition: 'left 0.3s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
        </div>
      </div>

      {/* Description */}
      {description && (
        <div style={{
          fontSize: isMobile ? '11px' : '12px',
          color: '#7f8c8d',
          marginTop: '5px',
          lineHeight: '1.3'
        }}>
          {description}
        </div>
      )}
    </div>
  )
}

export default LayerControl
