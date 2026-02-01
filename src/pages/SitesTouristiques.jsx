import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

function SitesTouristiques() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSite, setSelectedSite] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    const { data, error } = await supabase
      .from('sites_touristiques')
      .select('*')
      .order('visiteurs_par_an', { ascending: false, nullsFirst: false })
    
    if (error) {
      console.error('Erreur chargement sites:', error)
      setSites([])
    } else {
      setSites(data || [])
    }
    setLoading(false)
  }

  const filteredSites = sites.filter(site => 
    site.nom_site?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.nom_mythe?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        Chargement des sites...
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '48px',
            margin: '0 0 15px 0',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            🏛️ Sites Touristiques Mythologiques
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto 30px'
          }}>
            Découvrez les lieux réels qui ont inspiré ou abritent les mythes du monde entier
          </p>

          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="🔍 Rechercher un site ou un mythe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 20px',
              width: '100%',
              maxWidth: '500px',
              borderRadius: '25px',
              border: 'none',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          />
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏛️</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{sites.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Sites</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {(sites.reduce((sum, s) => sum + (s.visiteurs_par_an || 0), 0) / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Visiteurs/an</div>
          </div>
        </div>

        {/* Grille des sites */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {filteredSites.map((site) => (
            <SiteCard 
              key={site.id_site} 
              site={site}
              onClick={() => setSelectedSite(site)}
            />
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '50px',
            fontSize: '18px'
          }}>
            Aucun site trouvé pour "{searchTerm}"
          </div>
        )}
      </div>

      {/* Modal détail */}
      {selectedSite && (
        <SiteModal 
          site={selectedSite} 
          onClose={() => setSelectedSite(null)} 
        />
      )}
    </div>
  )
}

function SiteCard({ site, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'
      }}
    >
      {/* Image */}
      <div style={{
        height: '220px',
        background: `url(${site.image}) center/cover`,
        position: 'relative'
      }}>
        {site.visiteurs_par_an && (
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(246, 170, 28, 0.95)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '700',
            backdropFilter: 'blur(10px)'
          }}>
            👥 {(site.visiteurs_par_an / 1000).toFixed(0)}K/an
          </div>
        )}
      </div>

      {/* Contenu */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '20px',
          fontWeight: '700',
          color: '#2c3e50',
          lineHeight: '1.3'
        }}>
          {site.nom_site}
        </h3>

        {site.nom_mythe && (
          <div style={{
            display: 'inline-block',
            background: '#f0f0f0',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#667eea',
            marginBottom: '12px'
          }}>
            📖 {site.nom_mythe}
          </div>
        )}

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
          {site.description}
        </p>

        <button
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Voir les détails →
        </button>
      </div>
    </div>
  )
}

function SiteModal({ site, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9998,
          animation: 'fadeIn 0.3s ease'
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        borderRadius: '20px',
        maxWidth: '900px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        zIndex: 9999,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease'
      }}>
        {/* Image header */}
        <div style={{
          height: '300px',
          background: `url(${site.image}) center/cover`,
          position: 'relative',
          borderRadius: '20px 20px 0 0'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenu */}
        <div style={{ padding: '30px' }}>
          <h2 style={{
            margin: '0 0 15px 0',
            fontSize: '32px',
            fontWeight: '700',
            color: '#2c3e50'
          }}>
            {site.nom_site}
          </h2>

          {site.nom_mythe && (
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '15px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              📖 Mythe associé : {site.nom_mythe}
            </div>
          )}

          <p style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.8',
            marginBottom: '25px'
          }}>
            {site.description}
          </p>

          {/* Stats */}
          {site.visiteurs_par_an && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <strong style={{ color: '#F6AA1C', fontSize: '18px' }}>
                👥 {site.visiteurs_par_an.toLocaleString()}
              </strong>
              <span style={{ color: '#666', marginLeft: '10px' }}>
                visiteurs par an
              </span>
            </div>
          )}

          {/* Boutons d'action */}
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            {site.source && (
              <a
                href={site.source}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '14px 25px',
                  background: '#3498db',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                🌐 Site officiel
              </a>
            )}

            {site.itineraire && (
              <a
                href={site.itineraire}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '14px 25px',
                  background: '#27ae60',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                🗺️ Itinéraire
              </a>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translate(-50%, -45%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}
      </style>
    </>
  )
}

export default SitesTouristiques
