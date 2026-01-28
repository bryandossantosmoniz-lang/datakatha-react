import React, { useState } from 'react'

const BASEMAPS = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
    preview: 'https://a.tile.openstreetmap.org/8/132/87.png'
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/8/87/132'
  },
  {
    id: 'dark',
    name: 'Sombre',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB',
    preview: 'https://a.basemaps.cartocdn.com/dark_all/8/132/87.png'
  },
  {
    id: 'light',
    name: 'Clair',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB',
    preview: 'https://a.basemaps.cartocdn.com/light_all/8/132/87.png'
  },
  {
    id: 'terrain',
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenTopoMap',
    preview: 'https://a.tile.opentopomap.org/8/132/87.png'
  },
  {
    id: 'watercolor',
    name: 'Aquarelle',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
    attribution: '&copy; Stamen Design',
    preview: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/8/132/87.jpg'
  },
  {
    id: 'streets',
    name: 'Rues',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB',
    preview: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/8/132/87.png'
  },
  {
    id: 'topo',
    name: 'Topographique',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/8/87/132'
  }
]

function BasemapSelector({ currentBasemap, onBasemapChange }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '20px',
          zIndex: 1000,
          background: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#2c3e50'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <span style={{ fontSize: '18px' }}>🗺️</span>
        <span>Fonds de carte</span>
      </button>

      {/* Panel de sélection */}
      {isOpen && (
        <>
          {/* Overlay pour fermer en cliquant à côté */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1001,
              background: 'rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.2s ease'
            }}
          />

          {/* Panel */}
          <div style={{
            position: 'absolute',
            bottom: '140px',
            right: '20px',
            zIndex: 1002,
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            maxHeight: '70vh',
            overflowY: 'auto',
            minWidth: '300px',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '2px solid #F6AA1C'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                Choisir un fond de carte
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0'
                  e.currentTarget.style.color = '#333'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = '#999'
                }}
              >
                ×
              </button>
            </div>

            {/* Grid de cartes */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {BASEMAPS.map((basemap) => (
                <div
                  key={basemap.id}
                  onClick={() => {
                    onBasemapChange(basemap)
                    setIsOpen(false)
                  }}
                  style={{
                    cursor: 'pointer',
                    border: currentBasemap?.id === basemap.id 
                      ? '3px solid #F6AA1C' 
                      : '2px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    background: 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (currentBasemap?.id !== basemap.id) {
                      e.currentTarget.style.border = '2px solid #F6AA1C'
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentBasemap?.id !== basemap.id) {
                      e.currentTarget.style.border = '2px solid #e0e0e0'
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                >
                  {/* Preview image */}
                  <div style={{
                    width: '100%',
                    height: '100px',
                    overflow: 'hidden',
                    background: '#f5f5f5',
                    position: 'relative'
                  }}>
                    <img
                      src={basemap.preview}
                      alt={basemap.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 40px">🗺️</div>'
                      }}
                    />
                    {currentBasemap?.id === basemap.id && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#F6AA1C',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div style={{
                    padding: '10px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: currentBasemap?.id === basemap.id ? '600' : '500',
                    color: currentBasemap?.id === basemap.id ? '#F6AA1C' : '#2c3e50'
                  }}>
                    {basemap.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
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

export default BasemapSelector
export { BASEMAPS }
