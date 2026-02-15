// ============= TUTORIEL AVEC POSITIONS FIXES SIMPLES =============

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const TUTORIAL_STEPS = [
  {
    id: 1,
    page: '/',
    title: "Bienvenue sur DataKatha ! 🌍",
    description: "Explorez la mythologie mondiale. Laissez-moi vous guider !",
    position: 'center'
  },
  {
    id: 2,
    page: '/carte',
    title: "La Carte Interactive 🗺️",
    description: "Cliquez sur les marqueurs pour découvrir les mythes.",
    position: 'center'
  },
  {
    id: 3,
    page: '/carte',
    target: '.filter-panel',
    title: "FilterPanel 🎛️",
    description: "Filtrez par Culture, Région, Thème ou Créature. Les résultats s'affichent instantanément !",
    position: 'right',
    highlight: true
  },
  {
    id: 4,
    page: '/carte',
    target: '.layer-control',
    title: "Gestion des Couches 🗂️",
    description: "Activez les couches Cultures, Régions et Diffusion pour enrichir la visualisation.",
    position: 'left',
    highlight: true
  },
  {
    id: 5,
    page: '/carte',
    target: '.time-slider',
    title: "Timeline Temporelle ⏱️",
    description: "Voyagez de -3100 av. J.-C. à 2000 apr. J.-C. pour voir l'évolution des mythes.",
    position: 'top',
    highlight: true
  },
  {
    id: 6,
    page: '/bibliotheque',
    title: "La Bibliothèque 📚",
    description: "5 onglets pour explorer : Cultures, Thèmes, Créatures, sous-famille Créature, Régions,. Cliquez pour filtrer la carte !",
    position: 'center'
  },
  {
    id: 7,
    page: '/galerie',
    title: "La Galerie 🖼️",
    description: "Mode visuel avec filtres. Cliquez sur une carte pour voir le mythe sur la carte !",
    position: 'center'
  },
  {
    id: 8,
    page: '/comparaison',
    title: "Comparaison ⚖️",
    description: "Comparez jusqu'à 4 mythes côte à côte !",
    position: 'center'
  },
  {
    id: 9,
    page: '/sites',
    title: "Sites Touristiques 🏛️",
    description: "Découvrez les lieux qui ont inspiré ou abritent les mythes du monde entier",
    position: 'center'
  },
  {
    id: 10,
    page: '/a-propos',
    title: "À Propos ℹ️",
    description: "En savoir plus sur DATAKATHA",
    position: 'center'
  },

  {
    id: 11,
    page: null,
    title: "Vous êtes prêt ! 🚀",
    description: "Amusez-vous à explorer la mythologie mondiale !",
    position: 'center'
  }
]

function Tutorial({ onClose, onComplete }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState(null)

  const step = TUTORIAL_STEPS[currentStep]

  // Navigation automatique
  useEffect(() => {
    if (step.page && location.pathname !== step.page) {
      navigate(step.page)
    }
  }, [currentStep, step.page, location.pathname, navigate])

  // Attendre que la page soit montée puis chercher l'élément cible (avec retries)
  useEffect(() => {
    if (!step.target || !step.highlight) {
      setTargetRect(null)
      return
    }
    setTargetRect(null)
    let cancelled = false
    const tryFind = (attempt = 0) => {
      if (cancelled) return
      const el = document.querySelector(step.target)
      if (el) {
        setTargetRect(el.getBoundingClientRect())
        return
      }
      if (attempt < 15) {
        setTimeout(() => tryFind(attempt + 1), 100)
      }
    }
    const t = setTimeout(() => tryFind(0), 150)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [currentStep, step.target, step.highlight, location.pathname])

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('tutorialCompleted', 'true')
    onClose()
    navigate('/')
  }

  const handleComplete = () => {
    localStorage.setItem('tutorialCompleted', 'true')
    onComplete?.()
    navigate('/')
  }

  // Highlight avec position FIXED (utilise targetRect mis à jour après montage du DOM)
  const renderHighlight = () => {
    if (!step.target || !step.highlight || !targetRect) return null
    
    const rect = targetRect
    
    return (
      <>
        {/* Overlay sombre */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998
        }} />
        
        {/* Highlight bordure */}
        <div style={{
          position: 'fixed',
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          border: '4px solid #F6AA1C',
          borderRadius: '12px',
          zIndex: 9999,
          pointerEvents: 'none',
          boxShadow: '0 0 30px rgba(246, 170, 28, 0.6)',
          animation: 'pulse 2s infinite'
        }} />
      </>
    )
  }

  // Tooltip avec positions FIXES SIMPLES
  const renderTooltip = () => {
    // Positions fixes simples selon step.position
    let tooltipStyle = {
      position: 'fixed',
      zIndex: 10000,
      maxWidth: '450px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '28px',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
    }

    switch (step.position) {
      case 'center':
        tooltipStyle.top = '50%'
        tooltipStyle.left = '50%'
        tooltipStyle.transform = 'translate(-50%, -50%)'
        break
      case 'top':
        tooltipStyle.top = '15%'
        tooltipStyle.left = '50%'
        tooltipStyle.transform = 'translateX(-50%)'
        break
      case 'bottom':
        tooltipStyle.bottom = '15%'
        tooltipStyle.left = '50%'
        tooltipStyle.transform = 'translateX(-50%)'
        break
      case 'left':
        tooltipStyle.top = '50%'
        tooltipStyle.left = '420px'
        tooltipStyle.transform = 'translateY(-50%)'
        break
      case 'right':
        tooltipStyle.top = '50%'
        tooltipStyle.right = '20px'
        tooltipStyle.transform = 'translateY(-50%)'
        break
    }

    return (
      <div style={tooltipStyle}>
        {/* Progress */}
        <div style={{
          fontSize: '12px',
          opacity: 0.8,
          marginBottom: '12px',
          fontWeight: '600'
        }}>
          Étape {currentStep + 1} / {TUTORIAL_STEPS.length}
        </div>
        
        {/* Title */}
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '12px',
          margin: 0
        }}>
          {step.title}
        </h3>
        
        {/* Description */}
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
          marginTop: '12px',
          opacity: 0.95
        }}>
          {step.description}
        </p>
        
        {/* Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={handleSkip}
            style={{
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Passer
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ← Retour
              </button>
            )}
            
            <button
              onClick={handleNext}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #F6AA1C 0%, #e89f17 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(246, 170, 28, 0.4)'
              }}
            >
              {currentStep === TUTORIAL_STEPS.length - 1 ? 'Terminer ✨' : 'Suivant →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {renderHighlight()}
      {renderTooltip()}
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.02);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </>
  )
}

export default Tutorial