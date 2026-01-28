import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Header() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (path) => location.pathname === path

  const closeMenu = () => setMenuOpen(false)

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: isMobile ? '15px 20px' : '20px 40px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Logo */}
        <Link 
          to="/"
          onClick={closeMenu}
          style={{
            fontSize: isMobile ? '20px' : '28px',
            fontWeight: '700',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '15px',
            zIndex: 1001
          }}
        >
          <img 
            src="/Datakatha_logo.png" 
            alt="DATAKATHA Logo"
            style={{
              height: isMobile ? '35px' : '60px',
              width: 'auto',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
            }}
          />
          {!isMobile && <span>DATAKATHA</span>}
        </Link>

        {/* Hamburger Button (Mobile only) */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '28px',
              cursor: 'pointer',
              padding: '5px 10px',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}

        {/* Navigation */}
        <nav style={{
          display: isMobile ? (menuOpen ? 'flex' : 'none') : 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '0' : '10px',
          alignItems: isMobile ? 'stretch' : 'center',
          position: isMobile ? 'absolute' : 'relative',
          top: isMobile ? '60px' : 'auto',
          right: isMobile ? '0' : 'auto',
          background: isMobile ? '#667eea' : 'transparent',
          width: isMobile ? '250px' : 'auto',
          boxShadow: isMobile ? '-2px 5px 15px rgba(0,0,0,0.2)' : 'none',
          borderRadius: isMobile ? '0 0 0 15px' : '0',
          overflow: 'hidden',
          zIndex: 1000
        }}>
          <Link
            to="/"
            onClick={closeMenu}
            style={{
              padding: isMobile ? '15px 20px' : '10px 20px',
              borderRadius: isMobile ? '0' : '8px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              background: isActive('/') ? 'rgba(255,255,255,0.25)' : 'transparent',
              borderBottom: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/')) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            🏠 Accueil
          </Link>

          <Link
            to="/carte"
            onClick={closeMenu}
            style={{
              padding: isMobile ? '15px 20px' : '10px 20px',
              borderRadius: isMobile ? '0' : '8px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              background: isActive('/carte') ? 'rgba(255,255,255,0.25)' : 'transparent',
              borderBottom: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/carte')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/carte')) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            🗺️ Carte
          </Link>

          <Link
            to="/bibliotheque"
            onClick={closeMenu}
            style={{
              padding: isMobile ? '15px 20px' : '10px 20px',
              borderRadius: isMobile ? '0' : '8px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              background: isActive('/bibliotheque') ? 'rgba(255,255,255,0.25)' : 'transparent',
              borderBottom: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/bibliotheque')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/bibliotheque')) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            📚 Bibliothèque
          </Link>

          <Link
            to="/galerie"
            onClick={closeMenu}
            style={{
              padding: isMobile ? '15px 20px' : '10px 20px',
              borderRadius: isMobile ? '0' : '8px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              background: isActive('/galerie') ? 'rgba(255,255,255,0.25)' : 'transparent',
              borderBottom: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/galerie')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/galerie')) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            🖼️ Galerie
          </Link>

          <Link
            to="/comparaison"
            onClick={closeMenu}
            style={{
              padding: isMobile ? '15px 20px' : '10px 20px',
              borderRadius: isMobile ? '0' : '8px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              background: isActive('/comparaison') ? 'rgba(255,255,255,0.25)' : 'transparent',
              borderBottom: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/comparaison')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/comparaison')) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            ⚖️ Comparer
          </Link>

          <Link
            to="/a-propos"
            onClick={closeMenu}
            style={{
              padding: isMobile ? '15px 20px' : '10px 20px',
              borderRadius: isMobile ? '0' : '8px',
              color: 'white',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '15px',
              background: isActive('/a-propos') ? 'rgba(255,255,255,0.25)' : 'transparent',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isActive('/a-propos')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive('/a-propos')) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            ℹ️ À Propos
          </Link>
        </nav>
      </div>

      {/* Overlay pour fermer le menu en cliquant à côté */}
      {isMobile && menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }}
        />
      )}
    </header>
  )
}

export default Header