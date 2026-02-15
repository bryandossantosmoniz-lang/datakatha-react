import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

function SiteCard({ site, onCardClick }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCardClick(site)}
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
      <div style={{
        height: '280px',
        overflow: 'hidden',
        background: site.image
          ? `url(${site.image}) center/cover`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {!site.image && (
          <div style={{ color: 'white', fontSize: '60px' }}>🏛️</div>
        )}
        {site.visiteurs_par_an && (
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
            👥 {(site.visiteurs_par_an / 1000).toFixed(0)}K/an
          </div>
        )}
      </div>

      <div style={{
        padding: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '18px',
          fontWeight: '700',
          color: '#2c3e50',
          lineHeight: '1.3'
        }}>
          {site.nom_site}
        </h3>

        {site.nom_mythe && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
            fontSize: '13px',
            color: '#F6AA1C',
            fontWeight: '600'
          }}>
            <span>📖</span>
            <span>{site.nom_mythe}</span>
          </div>
        )}

        {site.description && (
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
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0'
        }}>
          {site.visiteurs_par_an ? (
            <div style={{
              fontSize: '11px',
              color: '#95a5a6',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>👥</span>
              <span>{(site.visiteurs_par_an / 1000).toFixed(0)}K visiteurs/an</span>
            </div>
          ) : (
            <div /> 
          )}

          <div style={{
            background: isHovered ? '#F6AA1C' : 'transparent',
            color: isHovered ? 'white' : '#F6AA1C',
            border: '2px solid #F6AA1C',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}>
            Voir →
          </div>
        </div>
      </div>
    </div>
  )
}

function SitesTouristiques() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSite, setSelectedSite] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadSites()
  }, [])

  const loadSites = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('sites_touristiques')
      .select('id_site, id_mythe, nom_mythe, nom_site, source, description, visiteurs_par_an, image, itineraire')
      .order('nom_site', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('Erreur chargement sites:', error)
      setSites([])
    } else {
      setSites(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }

  const filteredSites = sites.filter(site =>
    (site.nom_site?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (site.nom_mythe?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
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
            🏛️ Sites Touristiques
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#7f8c8d',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Découvrez les lieux qui ont inspiré ou abritent les mythes du monde entier
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <input
            type="text"
            placeholder="🔍 Rechercher un site ou un mythe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '2px solid #e0e0e0',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s',
              width: '100%',
              maxWidth: '400px'
            }}
            onFocus={(e) => { e.target.style.borderColor = '#F6AA1C' }}
            onBlur={(e) => { e.target.style.borderColor = '#e0e0e0' }}
          />
          <div style={{
            fontSize: '14px',
            color: '#7f8c8d',
            fontWeight: '600',
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #f0f0f0'
          }}>
            {filteredSites.length} site{filteredSites.length !== 1 ? 's' : ''} trouvé{filteredSites.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredSites.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>
              {sites.length === 0 ? '🏛️' : '🔍'}
            </div>
            <h3 style={{ color: '#7f8c8d', fontSize: '20px' }}>
              {sites.length === 0
                ? 'Aucun site touristique en base'
                : 'Aucun site ne correspond à votre recherche'}
            </h3>
            <p style={{ color: '#95a5a6', marginBottom: searchTerm ? '20px' : 0 }}>
              {sites.length === 0
                ? 'Les sites apparaîtront ici une fois ajoutés dans la base de données.'
                : 'Essayez un autre mot-clé ou réinitialisez la recherche.'}
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  padding: '12px 24px',
                  background: '#F6AA1C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '25px'
          }}>
            {filteredSites.map((site) => (
              <SiteCard
                key={site.id_site}
                site={site}
                onCardClick={setSelectedSite}
              />
            ))}
          </div>
        )}
      </div>

      {selectedSite && (
        <SiteModal site={selectedSite} onClose={() => setSelectedSite(null)} />
      )}
    </div>
  )
}

function SiteModal({ site, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9998
        }}
      />
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
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          height: '400px',
          background: site.image
            ? `url(${site.image}) center/cover`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {!site.image && <div style={{ color: 'white', fontSize: '72px' }}>🏛️</div>}
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
              📖 {site.nom_mythe}
            </div>
          )}
          {site.description && (
            <p style={{
              fontSize: '16px',
              color: '#555',
              lineHeight: '1.8',
              marginBottom: '25px'
            }}>
              {site.description}
            </p>
          )}
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
              <span style={{ color: '#666', marginLeft: '10px' }}>visiteurs par an</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {site.itineraire && (
              <a
                href={site.itineraire}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '14px 25px',
                  background: '#27ae60',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                🗺️ Itinéraire
              </a>
            )}
            {site.source && (
              <a
                href={site.source}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '14px 25px',
                  background: '#3498db',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '15px'
                }}
              >
                🌐 Site officiel
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SitesTouristiques
