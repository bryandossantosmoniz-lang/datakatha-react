import React, { useState, useEffect } from 'react'

function TextToSpeech({ text, mythName }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [rate, setRate] = useState(1) 
  const [pitch, setPitch] = useState(1)
  const [volume, setVolume] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)

  // Charger les voix et sélectionner une voix naturelle
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      
      // Filtrer les meilleures voix françaises
      const frenchVoices = availableVoices.filter(v => 
        v.lang.startsWith('fr') || v.lang.startsWith('FR')
      )

      // Priorité aux voix de meilleure qualité
      const premiumVoices = frenchVoices.filter(v => 
        v.name.includes('Premium') || 
        v.name.includes('Enhanced') ||
        v.name.includes('Natural') ||
        v.name.includes('Neural')
      )

      // Voix Google sont généralement bonnes
      const googleVoices = frenchVoices.filter(v => 
        v.name.includes('Google') ||
        v.name.includes('Français')
      )

      // Ordre de préférence
      const sortedVoices = [
        ...premiumVoices,
        ...googleVoices,
        ...frenchVoices
      ]

      // Enlever les doublons
      const uniqueVoices = Array.from(new Map(
        sortedVoices.map(v => [v.name, v])
      ).values())

      setVoices(uniqueVoices.length > 0 ? uniqueVoices : availableVoices)
      
      // Sélectionner la meilleure voix par défaut
      let defaultVoice = 
        uniqueVoices.find(v => v.lang === 'fr-FR' && !v.name.includes('Hortense')) ||
        uniqueVoices.find(v => v.name.includes('Google') && v.name.includes('FR')) ||
        uniqueVoices.find(v => v.name.includes('Hortense')) ||
        uniqueVoices.find(v => v.name.includes('Premium')) ||
        uniqueVoices.find(v => v.name.includes('Enhanced')) ||
        uniqueVoices[0]

      setSelectedVoice(defaultVoice)
    }

    loadVoices()
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = () => {
    if (!text || text.trim() === '') {
      alert('Aucun texte à lire !')
      return
    }

    // Si déjà en train de parler, arrêter proprement
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // Annuler toute lecture en cours (sécurité)
    speechSynthesis.cancel()

    // Petit délai pour s'assurer que l'annulation est complète
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume
      
      if (selectedVoice) {
        utterance.voice = selectedVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = (e) => {
        // Ignorer l'erreur "interrupted" (normale lors d'annulation)
        if (e.error !== 'interrupted') {
          console.error('Erreur TTS:', e)
        }
        setIsSpeaking(false)
      }

      speechSynthesis.speak(utterance)
    }, 100)
  }

  const stop = () => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  // Afficher le nom de la voix de manière lisible
  const getVoiceDisplayName = (voice) => {
    if (!voice) return ''
    
    // Nettoyer le nom pour le rendre plus lisible
    let name = voice.name
    
    // Enlever les préfixes techniques
    name = name.replace('Microsoft ', '')
    name = name.replace('Google ', '🌐 ')
    name = name.replace(' Online', '')
    name = name.replace(' (Natural)', ' ⭐')
    name = name.replace(' (Enhanced)', ' ⭐')
    name = name.replace(' (Premium)', ' 💎')
    
    return name
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Bouton principal */}
      <button
        onClick={speak}
        style={{
          background: isSpeaking 
            ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' 
            : 'linear-gradient(135deg, #F6AA1C 0%, #e67e22 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '14px 24px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(246, 170, 28, 0.4)',
          transition: 'all 0.3s ease',
          width: '100%',
          justifyContent: 'center',
          marginBottom: '10px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(246, 170, 28, 0.6)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(246, 170, 28, 0.4)'
        }}
      >
        <span style={{ fontSize: '20px' }}>
          {isSpeaking ? '🔊' : '🔉'}
        </span>
        <span>{isSpeaking ? 'Lecture en cours...' : 'Écouter la description'}</span>
      </button>

      {/* Boutons secondaires */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '10px'
      }}>
        {isSpeaking && (
          <button
            onClick={stop}
            style={{
              flex: 1,
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#e74c3c'}
          >
            ⏹️ Arrêter
          </button>
        )}
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            flex: 1,
            background: showSettings ? '#3498db' : '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          ⚙️ Réglages
        </button>
      </div>

      {/* Panel de paramètres */}
      {showSettings && (
        <div style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          animation: 'slideDown 0.3s ease'
        }}>
          <h4 style={{
            margin: '0 0 15px 0',
            fontSize: '15px',
            color: '#2c3e50',
            borderBottom: '2px solid #F6AA1C',
            paddingBottom: '8px'
          }}>
            ⚙️ Paramètres de lecture
          </h4>

          {/* Vitesse */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              🏃 Vitesse: {rate.toFixed(1)}x {rate < 0.8 ? '(Très lent)' : rate < 1 ? '(Lent)' : rate === 1 ? '(Normal)' : '(Rapide)'}
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#F6AA1C'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#7f8c8d',
              marginTop: '4px'
            }}>
              <span>Très lent</span>
              <span>Normal</span>
              <span>Rapide</span>
            </div>
          </div>

          {/* Volume */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              🔊 Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#F6AA1C'
              }}
            />
          </div>

          {/* Voix */}
          {voices.length > 0 && (
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#2c3e50'
              }}>
                🎙️ Voix {selectedVoice && selectedVoice.name.includes('Google') && '(Recommandée ⭐)'}
              </label>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const voice = voices.find(v => v.name === e.target.value)
                  setSelectedVoice(voice)
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '13px',
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                {voices.map((voice, i) => (
                  <option key={i} value={voice.name}>
                    {getVoiceDisplayName(voice)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bouton reset */}
          <button
            onClick={() => {
              setRate(0.9)
              setPitch(1)
              setVolume(1)
            }}
            style={{
              width: '100%',
              marginTop: '15px',
              padding: '10px',
              background: 'white',
              border: '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              color: '#2c3e50',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fa'
              e.currentTarget.style.borderColor = '#F6AA1C'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white'
              e.currentTarget.style.borderColor = '#ddd'
            }}
          >
            🔄 Réinitialiser
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes slideDown {
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
    </div>
  )
}

export default TextToSpeech