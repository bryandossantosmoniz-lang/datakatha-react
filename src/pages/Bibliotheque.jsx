import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

function BibliothequeCard({ title, items, icon, color, onItemClick }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDefinition, setShowDefinition] = useState(false)

  const definitions = {
    'Cultures': "Ensemble de croyances, traditions, récits et pratiques propres à un peuple, qui ont façonné la création et l'interprétation des mythes.",
    'Thèmes': "Catégorie indiquant le contexte dans lequel un mythe a été créé, permettant de comprendre son origine et sa fonction.",
    'Créatures': "Être imaginaire issu de mythes, doté de capacités surnaturelles, dont l'apparence s'éloigne des êtres vivants réels.",
    'Familles de Créatures': "Catégories regroupant des créatures partageant des caractéristiques communes (dragons, esprits, démons...).",
    'Régions': "Espace géographique ou culturel auquel un mythe est associé, utilisé pour situer son origine."
  }

  // TRI ALPHABÉTIQUE DES ITEMS
  const sortedItems = [...items].sort((a, b) => 
    a.name.localeCompare(b.name, 'fr')
  )

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      marginBottom: '20px'
    }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${color}dd 0%, ${color} 100%)`,
          padding: '20px',
          color: 'white',
          position: 'relative'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: definitions[title] && showDefinition ? '10px' : '0'
        }}>
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            <span style={{ fontSize: '32px' }}>{icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                {title}
              </h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                {items.length} élément{items.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {definitions[title] && (
              <button
                onClick={() => setShowDefinition(!showDefinition)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title="Voir la définition"
              >
                ℹ️
              </button>
            )}
            
            <span 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                fontSize: '24px',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s',
                cursor: 'pointer'
              }}
            >
              ▼
            </span>
          </div>
        </div>

        {definitions[title] && showDefinition && (
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: '1.5',
            marginTop: '10px'
          }}>
            <strong>Définition :</strong> {definitions[title]}
          </div>
        )}
      </div>

      {isExpanded && (
        <div style={{
          maxHeight: '500px',
          overflowY: 'auto',
          padding: '10px'
        }}>
          <div className="filter-section" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '15px'
          }}>
            {sortedItems.map((item, i) => (
              <div
                key={i}
                onClick={() => onItemClick && onItemClick(item)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: onItemClick ? 'pointer' : 'default',
                  transition: 'all 0.3s',
                  border: '2px solid transparent',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = `0 8px 20px ${color}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {item.image && (
                  <div style={{
                    height: '160px',
                    background: `url(${item.image}) center/cover`,
                    position: 'relative'
                  }}>
                    {item.count !== undefined && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backdropFilter: 'blur(10px)'
                      }}>
                        📊 {item.count}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ padding: '15px' }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px'
                  }}>
                    {item.name}
                  </div>
                  
                  {item.description && (
                    <div style={{
                      fontSize: '13px',
                      color: '#7f8c8d',
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {item.description}
                    </div>
                  )}

                  <div style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: color,
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    {item.count !== undefined && (
                      <span>📍 {item.count} mythe{item.count > 1 ? 's' : ''}</span>
                    )}
                    <span style={{ fontSize: '16px' }}>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Bibliotheque() {
  const navigate = useNavigate()
  const [cultures, setCultures] = useState([])
  const [themes, setThemes] = useState([])
  const [creatures, setCreatures] = useState([])
  const [famillesCreature, setFamillesCreature] = useState([])
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const { data: culturesData } = await supabase
        .from('culture')
        .select('*')
      
      const { data: themesData } = await supabase
        .from('theme')
        .select('*')
      
      const { data: creaturesData } = await supabase
        .from('creature')
        .select('*')
      
      const { data: famillesData } = await supabase
        .from('famille_creature')
        .select('*')
      
      const { data: regionsData } = await supabase
        .from('region')
        .select('*')

      // Récupérer mythes avec leur culture
      const { data: mythes } = await supabase
        .from('mythes')
        .select('id_mythe, id_culture, id_theme, id_typologie')

      // Récupérer table pivot culture_region
      const { data: cultureRegions } = await supabase
        .from('culture_region')
        .select('id_culture, id_region')

      // Compter mythes par région
      const regionCounts = {}
      regionsData?.forEach(r => {
        regionCounts[r.id_region] = 0
      })

      mythes?.forEach(myth => {
        // Trouver les régions de cette culture
        const regionsOfCulture = cultureRegions?.filter(cr => 
          cr.id_culture === myth.id_culture
        )
        
        // Incrémenter chaque région
        regionsOfCulture?.forEach(cr => {
          if (regionCounts[cr.id_region] !== undefined) {
            regionCounts[cr.id_region]++
          }
        })
      })

      setCultures(culturesData?.map(c => ({
        name: c.nom_culture,
        description: c.resume_culture,
        count: mythes?.filter(m => m.id_culture === c.id_culture).length || 0,
        id: c.id_culture,
        type: 'culture'
      })) || [])

      setThemes(themesData?.map(t => ({
        name: t.nom_theme,
        description: t.resume_theme,
        count: mythes?.filter(m => m.id_theme === t.id_theme).length || 0,
        id: t.id_theme,
        type: 'theme'
      })) || [])

      setCreatures(creaturesData?.map(cr => ({
        name: cr.nom_creature || cr.type_creature || cr.nom,
        description: cr.resume_creature,
        image: cr.URL_image,
        count: mythes?.filter(m => m.id_typologie === cr.id_typologie).length || 0,
        id: cr.id_typologie,
        type: 'creature'
      })) || [])

      setFamillesCreature(famillesData?.map(f => ({
        name: f.nom_famille_creature,
        description: f.resume_famille_creature,
        image: f.URL_image,
        count: creaturesData?.filter(c => c.id_famille_creature === f.id_famille_creature).length || 0,
        id: f.id_famille_creature,
        type: 'famille'
      })) || [])

      setRegions(regionsData?.map(r => ({
        name: r.nom_region,
        description: r.resume_region,
        count: regionCounts[r.id_region] || 0,
        id: r.id_region,
        type: 'region'
      })) || [])

      setLoading(false)
    } catch (error) {
      console.error('Erreur chargement:', error)
      setLoading(false)
    }
  }

  const handleItemClick = (item) => {
    sessionStorage.setItem('mapFilter', JSON.stringify({
      type: item.type,
      value: item.name,
      id: item.id
    }))
    navigate('/carte')
  }

  if (loading) {
    return (
      <div className="loading-section" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontSize: '1.2em',
        color: '#F6AA1C'
      }}>
        Chargement de la bibliothèque...
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
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '50px'
        }}>
          <h1 style={{
            fontSize: '48px',
            margin: '0 0 15px 0',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            📚 Bibliothèque des Mythes
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explorez les cultures, thèmes, créatures et régions qui composent notre collection de mythes
          </p>
        </div>

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
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌍</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{cultures.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Cultures</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎭</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{themes.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Thèmes</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🐉</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{creatures.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Créatures</div>
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
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{famillesCreature.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Familles</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            padding: '20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{regions.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Régions</div>
          </div>
        </div>

        <div className="myth-card" style={{ display: 'grid', gap: '20px' }}>
          <BibliothequeCard
            title="Cultures"
            items={cultures}
            icon="🌍"
            color="#3498db"
            onItemClick={handleItemClick}
          />
          
          <BibliothequeCard
            title="Thèmes"
            items={themes}
            icon="🎭"
            color="#9b59b6"
            onItemClick={handleItemClick}
          />
          
          <BibliothequeCard
            title="Créatures"
            items={creatures}
            icon="🐉"
            color="#e74c3c"
            onItemClick={handleItemClick}
          />
          
          <BibliothequeCard
            title="Familles de Créatures"
            items={famillesCreature}
            icon="👥"
            color="#f39c12"
            onItemClick={handleItemClick}
          />
          
          <BibliothequeCard
            title="Régions"
            items={regions}
            icon="📍"
            color="#27ae60"
            onItemClick={handleItemClick}
          />
        </div>
      </div>
    </div>
  )
}

export default Bibliotheque