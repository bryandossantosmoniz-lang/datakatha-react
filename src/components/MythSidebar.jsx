import { useState, useEffect } from 'react'
import { getMythImages } from '../services/supabase'
import TextToSpeech from './TextToSpeech'

function MythSidebar({ myth, onClose }) {
  const [images, setImages] = useState([])
  const [loadingImages, setLoadingImages] = useState(true)

  // Charger les images quand le mythe change
  useEffect(() => {
    if (myth?.id_mythe) {
      loadImages()
    }
  }, [myth?.id_mythe])

  const loadImages = async () => {
    setLoadingImages(true)
    const imgs = await getMythImages(myth.id_mythe)
    setImages(imgs || [])
    setLoadingImages(false)
  }

  if (!myth) return null

  // Image principale : soit depuis media, soit depuis créature
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

      {/* IMAGE EN HAUT */}
      {loadingImages ? (
        <div style={{
          height: '250px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          Chargement de l'image...
        </div>
      ) : mainImage ? (
        <div style={{ position: 'relative' }}>
          <img 
            src={mainImage} 
            alt={myth.nom_mythe} 
            style={{ 
              width: '100%', 
              height: '250px',
              objectFit: 'cover'
            }} 
          />
          {/* Badge nombre d'images */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '5px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              🖼️ {images.length} photos
            </div>
          )}
        </div>
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

        {/* Galerie d'images (si plusieurs) */}
        {images.length > 1 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              📸 Galerie ({images.length})
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {images.slice(1, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${myth.nom_mythe} ${idx + 2}`}
                  onClick={() => window.open(img.url, '_blank')}
                  style={{
                    width: '100%',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              ))}
              {images.length > 4 && (
                <div style={{
                  width: '100%',
                  height: '80px',
                  borderRadius: '6px',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#666'
                }}>
                  +{images.length - 4}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lecteur audio */}
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