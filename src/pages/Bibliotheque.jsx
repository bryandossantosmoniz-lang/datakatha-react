import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

function BibliothequeCard({ title, items, icon, color, onItemClick }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDefinition, setShowDefinition] = useState(false)

  // Définitions
  const definitions = {
    'Cultures': "Ensemble de croyances, traditions, récits et pratiques propres à un peuple, qui ont façonné la création et l'interprétation des mythes.",
    'Thèmes': "Catégorie indiquant le contexte dans lequel un mythe a été créé, permettant de comprendre son origine et sa fonction.",
    'Créatures': "Être imaginaire issu de mythes, doté de capacités surnaturelles, dont l'apparence s'éloigne des êtres vivants réels.",
    'Familles de Créatures': "Catégories regroupant des créatures partageant des caractéristiques communes (dragons, esprits, démons...).",
    'Régions': "Espace géographique ou culturel auquel un mythe est associé, utilisé pour situer son origine."
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
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
            {/* Bouton info */}
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
            
            {/* Flèche expand */}
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

        {/* Définition */}
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

      {/* Liste */}
      {isExpanded && (
        <div style={{
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '10px'
        }}>
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => onItemClick && onItemClick(item)}
              style={{
                padding: '15px',
                borderBottom: i < items.length - 1 ? '1px solid #f0f0f0' : 'none',
                cursor: onItemClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                borderRadius: '8px',
                margin: '5px 0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa'
                e.currentTarget.style.transform = 'translateX(5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '5px'
              }}>
                {item.name}
              </div>
              {item.description && (
                <div style={{
                  fontSize: '13px',
                  color: '#7f8c8d',
                  lineHeight: '1.5'
                }}>
                  {item.description}
                </div>
              )}
              {item.count !== undefined && (
                <div style={{
                  fontSize: '12px',
                  color: color,
                  fontWeight: '600',
                  marginTop: '8px'
                }}>
                  📊 {item.count} mythe{item.count > 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Bibliotheque() {
  const [cultures, setCultures] = useState([])
  const [themes, setThemes] = useState([])
  const [creatures, setCreatures] = useState([])
  const [famillesCreature, setFamillesCreature] = useState([])
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      // Cultures
      const { data: culturesData } = await supabase
        .from('culture')
        .select('*')
      
      // Themes
      const { data: themesData } = await supabase
        .from('theme')
        .select('*')
      
      // Creatures
      const { data: creaturesData } = await supabase
        .from('creature')
        .select('*')
      
      // Familles de créatures
      const { data: famillesData } = await supabase
        .from('famille_creature')
        .select('*')
      
      // Régions
      const { data: regionsData } = await supabase
        .from('region')
        .select('*')
      
      // Compter les mythes par catégorie
      const { data: mythes } = await supabase
        .from('mythes')
        .select('id_culture, id_theme, id_typologie')

      // Formater les données
      setCultures(culturesData?.map(c => ({
        name: c.nom_culture,
        description: c.resume_culture,
        count: mythes?.filter(m => m.id_culture === c.id_culture).length || 0,
        id: c.id_culture
      })) || [])

      setThemes(themesData?.map(t => ({
        name: t.nom_theme,
        description: t.resume_theme,
        count: mythes?.filter(m => m.id_theme === t.id_theme).length || 0,
        id: t.id_theme
      })) || [])

      setCreatures(creaturesData?.map(cr => ({
        name: cr.nom_creature || cr.type_creature || cr.nom,
        description: cr.resume_creature,
        count: mythes?.filter(m => m.id_typologie === cr.id_typologie).length || 0,
        id: cr.id_typologie
      })) || [])

      setFamillesCreature(famillesData?.map(f => ({
        name: f.nom_famille_creature,
        description: f.resume_famille_creature,
        count: creaturesData?.filter(c => c.id_famille_creature === f.id_famille_creature).length || 0,
        id: f.id_famille_creature
      })) || [])

      setRegions(regionsData?.map(r => ({
        name: r.nom_region,
        description: r.resume_region,
        id: r.id_region
      })) || [])

      setLoading(false)
    } catch (error) {
      console.error('Erreur chargement:', error)
      setLoading(false)
    }
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
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
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

        {/* Stats globales */}
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
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{regions.length}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Régions</div>
          </div>
        </div>

        {/* Cartes */}
        <div style={{
          display: 'grid',
          gap: '20px'
        }}>
          <BibliothequeCard
            title="Cultures"
            items={cultures}
            icon="🌍"
            color="#3498db"
            onItemClick={(item) => setSelectedItem(item)}
          />
          
          <BibliothequeCard
            title="Thèmes"
            items={themes}
            icon="🎭"
            color="#9b59b6"
            onItemClick={(item) => setSelectedItem(item)}
          />
          
          <BibliothequeCard
            title="Créatures"
            items={creatures}
            icon="🐉"
            color="#e74c3c"
            onItemClick={(item) => setSelectedItem(item)}
          />
          
          <BibliothequeCard
            title="Familles de Créatures"
            items={famillesCreature}
            icon="👥"
            color="#f39c12"
            onItemClick={(item) => setSelectedItem(item)}
          />
          
          <BibliothequeCard
            title="Régions"
            items={regions}
            icon="📍"
            color="#27ae60"
            onItemClick={(item) => setSelectedItem(item)}
          />
        </div>
      </div>
    </div>
  )
}

export default Bibliotheque