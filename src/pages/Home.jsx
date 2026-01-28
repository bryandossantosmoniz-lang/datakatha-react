import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import DailyMyth from '../components/DailyMyth'
import ShareButton from '../components/ShareButton'

function Home() {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const sections = [
    {
      title: 'Carte Interactive',
      icon: '🗺️',
      description: 'Explorez les mythes géolocalisés sur une carte mondiale',
      path: '/carte',
      color: '#667eea'
    },
    {
      title: 'Bibliothèque',
      icon: '📚',
      description: 'Parcourez notre collection complète de mythes',
      path: '/bibliotheque',
      color: '#F6AA1C'
    },
    {
      title: 'Galerie',
      icon: '🖼️',
      description: 'Découvrez les mythes en mode visuel',
      path: '/galerie',
      color: '#e74c3c'
    },
    {
      title: 'Comparaison',
      icon: '⚖️',
      description: 'Comparez plusieurs mythes côte à côte',
      path: '/comparaison',
      color: '#27ae60'
    },
    {
      title: 'À Propos',
      icon: 'ℹ️',
      description: 'En savoir plus sur DATAKATHA',
      path: '/a-propos',
      color: '#764ba2'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: isMobile ? '30px 15px' : '50px 30px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header avec ShareButton */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: isMobile ? '30px' : '50px',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: isMobile ? '32px' : '56px',
            margin: '0 0 15px 0',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            DATAKATHA
          </h1>
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            margin: 0,
            opacity: 0.95,
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            L'application interactive dédiée aux mythes, légendes et croyances qui façonnent les cultures à travers le monde
          </p>
        </div>

        {/* Daily Myth */}
        <div style={{ marginBottom: isMobile ? '30px' : '50px' }}>
          <DailyMyth />
        </div>

        {/* Navigation Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile 
            ? '1fr' 
            : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: isMobile ? '15px' : '25px'
        }}>
          {sections.map((section, index) => (
            <div
              key={index}
              onClick={() => navigate(section.path)}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: isMobile ? '25px' : '35px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '15px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
              {/* Icon */}
              <div style={{
                width: isMobile ? '70px' : '80px',
                height: isMobile ? '70px' : '80px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${section.color}dd 0%, ${section.color} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '35px' : '40px',
                boxShadow: `0 4px 15px ${section.color}44`
              }}>
                {section.icon}
              </div>

              {/* Title */}
              <h3 style={{
                margin: 0,
                color: '#2c3e50',
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '700'
              }}>
                {section.title}
              </h3>

              {/* Description */}
              <p style={{
                margin: 0,
                color: '#7f8c8d',
                fontSize: isMobile ? '14px' : '15px',
                lineHeight: '1.5'
              }}>
                {section.description}
              </p>

              {/* Button */}
              <div style={{
                marginTop: '10px',
                padding: isMobile ? '10px 20px' : '12px 25px',
                borderRadius: '10px',
                background: section.color,
                color: 'white',
                fontWeight: '600',
                fontSize: isMobile ? '13px' : '14px'
              }}>
                Découvrir →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home