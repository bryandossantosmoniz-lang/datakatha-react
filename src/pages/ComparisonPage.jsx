import React, { useState, useEffect } from 'react'
import { getMythes } from '../services/supabase'

function ComparisonPage() {
  const [allMythes, setAllMythes] = useState([])
  const [selectedMythes, setSelectedMythes] = useState([null, null, null, null])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    loadMythes()
  }, [])

  const loadMythes = async () => {
    const data = await getMythes()
    setAllMythes(data)
    setLoading(false)
  }

  const handleMythSelect = (index, mythId) => {
    const newSelected = [...selectedMythes]
    
    // Si mythId est vide, on met null
    if (!mythId || mythId === '') {
      newSelected[index] = null
    } else {
      const myth = allMythes.find(m => m.id_mythe === parseInt(mythId))
      newSelected[index] = myth || null
    }
    
    setSelectedMythes(newSelected)
  }

  const removeMythSelection = (index) => {
    const newSelected = [...selectedMythes]
    newSelected[index] = null
    setSelectedMythes(newSelected)
  }

  const clearAll = () => {
    setSelectedMythes([null, null, null, null])
  }

  const selectedCount = selectedMythes.filter(m => m !== null).length

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
        Chargement...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: isMobile ? '20px 10px' : '40px 20px'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: isMobile ? '28px' : '48px',
            margin: '0 0 15px 0',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⚖️ Comparaison de Mythes
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#7f8c8d',
            maxWidth: '600px',
            margin: '0 auto 20px auto'
          }}>
            Sélectionnez jusqu'à 4 mythes pour les comparer
          </p>

          {selectedCount > 0 && (
            <button
              onClick={clearAll}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#e74c3c'}
            >
              🗑️ Tout effacer
            </button>
          )}
        </div>

        {/* Sélecteurs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '16px',
                  color: '#2c3e50',
                  fontWeight: '600'
                }}>
                  Mythe {index + 1}
                </h3>
                {selectedMythes[index] && (
                  <button
                    onClick={() => removeMythSelection(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '0',
                      width: '24px',
                      height: '24px'
                    }}
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                value={selectedMythes[index]?.id_mythe || ''}
                onChange={(e) => handleMythSelect(index, e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '2px solid #e0e0e0',
                  fontSize: '14px',
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                <option value="">-- Choisir un mythe --</option>
                {allMythes.map(myth => (
                  <option 
                    key={myth.id_mythe} 
                    value={myth.id_mythe}
                    disabled={selectedMythes.some(m => m?.id_mythe === myth.id_mythe)}
                  >
                    {myth.nom_mythe}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Tableau de comparaison */}
        {selectedCount >= 2 ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              overflowX: 'auto'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <th style={{
                      padding: '20px',
                      textAlign: 'left',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                      width: '200px',
                      position: 'sticky',
                      left: 0,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      zIndex: 10
                    }}>
                      Caractéristique
                    </th>
                    {selectedMythes.filter(m => m !== null).map((myth, i) => (
                      <th key={i} style={{
                        padding: '20px',
                        textAlign: 'left',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '16px'
                      }}>
                        {myth.nom_mythe}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Culture */}
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{
                      padding: '15px 20px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      background: '#f8f9fa',
                      position: 'sticky',
                      left: 0,
                      zIndex: 5
                    }}>
                      🌍 Culture
                    </td>
                    {selectedMythes.filter(m => m !== null).map((myth, i) => (
                      <td key={i} style={{ padding: '15px 20px', color: '#7f8c8d' }}>
                        {myth.culture?.nom_culture || '-'}
                      </td>
                    ))}
                  </tr>

                  {/* Thème */}
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{
                      padding: '15px 20px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      background: '#f8f9fa',
                      position: 'sticky',
                      left: 0,
                      zIndex: 5
                    }}>
                      🎭 Thème
                    </td>
                    {selectedMythes.filter(m => m !== null).map((myth, i) => (
                      <td key={i} style={{ padding: '15px 20px', color: '#7f8c8d' }}>
                        {myth.theme?.nom_theme || '-'}
                      </td>
                    ))}
                  </tr>

                  {/* Créature */}
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{
                      padding: '15px 20px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      background: '#f8f9fa',
                      position: 'sticky',
                      left: 0,
                      zIndex: 5
                    }}>
                      🐉 Créature
                    </td>
                    {selectedMythes.filter(m => m !== null).map((myth, i) => (
                      <td key={i} style={{ padding: '15px 20px', color: '#7f8c8d' }}>
                        {myth.creature?.nom_creature || 
                         myth.creature?.type_creature || 
                         myth.creature?.nom || '-'}
                      </td>
                    ))}
                  </tr>

                  {/* Période */}
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{
                      padding: '15px 20px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      background: '#f8f9fa',
                      position: 'sticky',
                      left: 0,
                      zIndex: 5
                    }}>
                      ⏱️ Période
                    </td>
                    {selectedMythes.filter(m => m !== null).map((myth, i) => (
                      <td key={i} style={{ padding: '15px 20px', color: '#7f8c8d' }}>
                        {myth.periode_texte || '-'}
                      </td>
                    ))}
                  </tr>

                  {/* Date */}
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{
                      padding: '15px 20px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      background: '#f8f9fa',
                      position: 'sticky',
                      left: 0,
                      zIndex: 5
                    }}>
                      📅 Date estimée
                    </td>
                    {selectedMythes.filter(m => m !== null).map((myth, i) => (
                      <td key={i} style={{ padding: '15px 20px', color: '#7f8c8d' }}>
                        {myth.date_entier 
                          ? (myth.date_entier < 0 
                            ? `${Math.abs(myth.date_entier)} av. J.-C.`
                            : `${myth.date_entier} apr. J.-C.`)
                          : '-'}
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr>
                    <td style={{
                      padding: '15px 20px',
                      fontWeight: '600',
                      color: '#2c3e50',
                      background: '#f8f9fa',
                      position: 'sticky',
                      left: 0,
                      zIndex: 5,
                      verticalAlign: 'top'
                    }}>
                      📖 Description
                    </td>
                    {selectedMythes.filter(m => m !== null).map((myth, i) => (
                      <td key={i} style={{
                        padding: '15px 20px',
                        color: '#7f8c8d',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        maxWidth: '400px'
                      }}>
                        {myth.description_mythe || 'Aucune description disponible'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚖️</div>
            <h3 style={{
              color: '#2c3e50',
              fontSize: '24px',
              marginBottom: '10px'
            }}>
              Sélectionnez au moins 2 mythes
            </h3>
            <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
              Choisissez des mythes dans les menus déroulants ci-dessus pour les comparer
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComparisonPage