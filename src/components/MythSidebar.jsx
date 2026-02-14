// Dans MythSidebar.jsx

import { useState, useEffect } from 'react'
import { getMythImages, supabase } from '../services/supabase'
import TextToSpeech from './TextToSpeech'

function MythSidebar({ myth, onClose, onToggleDiffusion }) {  // <-- AJOUTER onToggleDiffusion prop
  const [images, setImages] = useState([])
  const [loadingImages, setLoadingImages] = useState(true)
  const [hasDiffusion, setHasDiffusion] = useState(false)
  const [diffusionActive, setDiffusionActive] = useState(false)

  useEffect(() => {
    if (myth?.id_mythe) {
      loadImages()
      checkDiffusion()
    }
  }, [myth?.id_mythe])

  const loadImages = async () => {
    setLoadingImages(true)
    const imgs = await getMythImages(myth.id_mythe)
    setImages(imgs || [])
    setLoadingImages(false)
  }

  // Vérifier si le mythe a des diffusions
  const checkDiffusion = async () => {
    const { data } = await supabase
      .from('diffusion')
      .select('id_diffusion')
      .eq('id_mythe', myth.id_mythe)
      .limit(1)
    
    setHasDiffusion(data && data.length > 0)
  }

  // Toggle diffusion
  const handleToggleDiffusion = () => {
    const newState = !diffusionActive
    setDiffusionActive(newState)
    if (onToggleDiffusion) {
      onToggleDiffusion(myth.id_mythe, newState)
    }
  }

  if (!myth) return null

  const mainImage = images.length > 0 ? images[0].url : myth.creature?.URL_image

  return (
    <div style={{
      width: '400px',
      background: 'white',
      height: '100%',
      overflowY: 'auto',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {/* Bouton fermeture */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#F6AA1C',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          zIndex: 10
        }}
      >
        ×
      </button>

      {/* Image */}
      {loadingImages ? (
        <div style={{
          height: '250px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          Chargement...
        </div>
      ) : mainImage ? (
        <img 
          src={mainImage} 
          alt={myth.nom_mythe} 
          style={{ 
            width: '100%', 
            height: '250px',
            objectFit: 'cover'
          }} 
        />
      ) : (
        <div style={{
          height: '250px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '60px'
        }}>
          📖
        </div>
      )}

      <div style={{ padding: '20px' }}>
        {/* Titre */}
        <h2 style={{ 
          color: '#F6AA1C', 
          marginBottom: '20px',
          paddingRight: '40px'
        }}>
          {myth.nom_mythe}
        </h2>

        {/* Culture */}
        {myth.culture && (
          <div style={{
            display: 'inline-block',
            background: '#f0f8ff',
            color: '#3498db',
            padding: '6px 12px',
            borderRadius: '15px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            🌍 {myth.culture.nom_culture}
          </div>
        )}

        {/* BOUTON TOGGLE DIFFUSION */}
        {hasDiffusion && (
          <div style={{
            background: diffusionActive ? '#e8f4f8' : '#f8f9fa',
            border: `2px solid ${diffusionActive ? '#3498db' : '#ddd'}`,
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px',
            transition: 'all 0.3s'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                  🌊 Diffusion du mythe
                </div>
                <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '3px' }}>
                  Voir les chemins de propagation
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={handleToggleDiffusion}
                style={{
                  position: 'relative',
                  width: '50px',
                  height: '26px',
                  background: diffusionActive ? '#3498db' : '#ccc',
                  borderRadius: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  padding: 0
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  left: diffusionActive ? '26px' : '3px',
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  transition: 'left 0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </button>
            </div>
            
            {diffusionActive && (
              <div style={{
                fontSize: '11px',
                color: '#3498db',
                fontStyle: 'italic',
                marginTop: '8px',
                padding: '8px',
                background: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '6px'
              }}>
                ✓ Les lignes de diffusion sont maintenant visibles sur la carte
              </div>
            )}
          </div>
        )}

        {/* TextToSpeech */}
        {myth.description_mythe && (
          <div style={{ marginBottom: '20px' }}>
            <TextToSpeech 
              text={myth.description_mythe}
              mythName={myth.nom_mythe}
            />
          </div>
        )}

        {/* Description */}
        {myth.description_mythe && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#2c3e50', marginBottom: '10px' }}>
              📖 Description
            </h3>
            <p style={{ 
              color: '#555', 
              lineHeight: '1.6',
              fontSize: '14px'
            }}>
              {myth.description_mythe}
            </p>
          </div>
        )}

        {/* Période */}
        {myth.periode_texte && (
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              ⏱️ Période
            </h4>
            <p style={{ color: '#555', fontSize: '14px' }}>
              {myth.periode_texte}
            </p>
          </div>
        )}

        {/* Thème */}
        {myth.theme && (
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              🎭 Thème
            </h4>
            <p style={{ color: '#555', fontSize: '14px' }}>
              {myth.theme.nom_theme}
            </p>
          </div>
        )}

        {/* Créature */}
        {myth.creature && (
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              🐉 Créature
            </h4>
            <p style={{ color: '#555', fontSize: '14px' }}>
              {myth.creature.nom_creature || myth.creature.type_creature || myth.creature.nom}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MythSidebar