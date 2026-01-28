import React, { useState, useEffect } from 'react'
import { getMythes } from '../services/supabase'
import { Link } from 'react-router-dom'

function GalleryCard({ myth }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: isHovered 
          ? '0 12px 40px rgba(0,0,0,0.2)' 
          : '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Image de la créature */}
      {myth.creature?.URL_image && (
        <div style={{
          height: '200px',
          overflow: 'hidden',
          background: '#f0f0f0',
          position: 'relative'
        }}>
          <img
            src={myth.creature.URL_image}
            alt={myth.nom_mythe}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          
          {/* Badge thème */}
          {myth.theme && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(155, 89, 182, 0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}>
              {myth.theme.nom_theme}
            </div>
          )}
        </div>
      )}

      {/* Contenu */}
      <div style={{
        padding: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Titre */}
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '18px',
          fontWeight: '700',
          color: '#2c3e50',
          lineHeight: '1.3'
        }}>
          {myth.nom_mythe}
        </h3>

        {/* Culture */}
        {myth.culture && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
            fontSize: '13px',
            color: '#F6AA1C',
            fontWeight: '600'
          }}>
            <span>🌍</span>
            <span>{myth.culture.nom_culture}</span>
          </div>
        )}

        {/* Description */}
        {myth.description_mythe && (
          <p style={{
            fontSize: '14px',
            color: '#7f8c8d',
            lineHeight: '1.6',
            margin: '0 0 15px 0',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}>
            {myth.description_mythe}
          </p>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0'
        }}>
          {/* Période */}
          {myth.periode_texte && (
            <div style={{
              fontSize: '11px',
              color: '#95a5a6',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>⏱️</span>
              <span>{myth.periode_texte.substring(0, 30)}...</span>
            </div>
          )}

          {/* Bouton */}
          <Link
            to={`/carte?mythe=${myth.id_mythe}`}
            style={{
              background: isHovered ? '#F6AA1C' : 'transparent',
              color: isHovered ? 'white' : '#F6AA1C',
              border: `2px solid #F6AA1C`,
              padding: '6px 14px',
              borderRadius: '20px',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            Voir →
          </Link>
        </div>
      </div>
    </div>
  )
}

function GalleryPage() {
  const [mythes, setMythes] = useState([])
  const [filteredMythes, setFilteredMythes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCulture, setSelectedCulture] = useState('all')
  const [selectedTheme, setSelectedTheme] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // grid, list, masonry
  const [cultures, setCultures] = useState([])
  const [themes, setThemes] = useState([])

  useEffect(() => {
    loadMythes()
  }, [])

  useEffect(() => {
    filterMythes()
  }, [searchTerm, selectedCulture, selectedTheme, mythes])

  const loadMythes = async () => {
    const data = await getMythes()
    setMythes(data)
    setFilteredMythes(data)

    // Extraire cultures et thèmes uniques
    const culturesUniques = [...new Map(
      data.map(m => m.culture).filter(Boolean).map(c => [c.id_culture, c])
    ).values()]

    const themesUniques = [...new Map(
      data.map(m => m.theme).filter(Boolean).map(t => [t.id_theme, t])
    ).values()]

    setCultures(culturesUniques)
    setThemes(themesUniques)
    setLoading(false)
  }

  const filterMythes = () => {
    let filtered = mythes

    // Filtre recherche
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.nom_mythe?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description_mythe?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre culture
    if (selectedCulture !== 'all') {
      filtered = filtered.filter(m => m.id_culture === parseInt(selectedCulture))
    }

    // Filtre thème
    if (selectedTheme !== 'all') {
      filtered = filtered.filter(m => m.id_theme === parseInt(selectedTheme))
    }

    setFilteredMythes(filtered)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontSize: '1.2em',
        color: '#F6AA1C'
      }}>
        Chargement de la galerie...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '48px',
            margin: '0 0 15px 0',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🖼️ Galerie des Mythes
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#7f8c8d',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explorez notre collection de {mythes.length} mythes et légendes
          </p>
        </div>

        {/* Barre de filtres */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '15px'
          }}>
            {/* Recherche */}
            <input
              type="text"
              placeholder="🔍 Rechercher un mythe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#F6AA1C'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />

            {/* Culture */}
            <select
              value={selectedCulture}
              onChange={(e) => setSelectedCulture(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="all">Toutes les cultures</option>
              {cultures.map(c => (
                <option key={c.id_culture} value={c.id_culture}>
                  {c.nom_culture}
                </option>
              ))}
            </select>

            {/* Thème */}
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '2px solid #e0e0e0',
                fontSize: '14px',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="all">Tous les thèmes</option>
              {themes.map(t => (
                <option key={t.id_theme} value={t.id_theme}>
                  {t.nom_theme}
                </option>
              ))}
            </select>
          </div>

          {/* Stats et vue */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '15px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#7f8c8d',
              fontWeight: '600'
            }}>
              {filteredMythes.length} mythe{filteredMythes.length > 1 ? 's' : ''} trouvé{filteredMythes.length > 1 ? 's' : ''}
            </div>

            {/* Modes de vue */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: viewMode === 'grid' ? '#F6AA1C' : '#f0f0f0',
                  color: viewMode === 'grid' ? 'white' : '#7f8c8d',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                🔲 Grille
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: viewMode === 'list' ? '#F6AA1C' : '#f0f0f0',
                  color: viewMode === 'list' ? 'white' : '#7f8c8d',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                📋 Liste
              </button>
            </div>
          </div>
        </div>

        {/* Galerie */}
        {filteredMythes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: '#7f8c8d', fontSize: '20px' }}>
              Aucun mythe trouvé
            </h3>
            <p style={{ color: '#95a5a6' }}>
              Essayez de modifier vos filtres
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'list' 
              ? '1fr' 
              : 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            {filteredMythes.map(myth => (
              <GalleryCard key={myth.id_mythe} myth={myth} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GalleryPage
