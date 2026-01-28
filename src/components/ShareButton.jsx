import React, { useState } from 'react'

function ShareButton({ url, title, description }) {
  const [showPanel, setShowPanel] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = url || window.location.href
  const shareTitle = title || 'DATAKATHA - Mythes et Légendes'
  const shareDescription = description || 'Découvrez les mythes et légendes du monde entier'

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareOnWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
      '_blank'
    )
  }

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erreur copie:', err)
    }
  }

  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareDescription + '\n\n' + shareUrl)}`
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bouton principal */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          background: 'linear-gradient(135deg, #F6AA1C 0%, #e67e22 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(246, 170, 28, 0.4)',
          transition: 'all 0.3s ease'
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
        <span style={{ fontSize: '18px' }}>🔗</span>
        <span>Partager</span>
      </button>

      {/* Panel de partage */}
      {showPanel && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setShowPanel(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
              background: 'rgba(0,0,0,0.3)'
            }}
          />

          {/* Panel */}
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '0',
            zIndex: 1000,
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            minWidth: '300px',
            animation: 'slideDown 0.3s ease'
          }}>
            <h4 style={{
              margin: '0 0 15px 0',
              fontSize: '16px',
              color: '#2c3e50',
              borderBottom: '2px solid #F6AA1C',
              paddingBottom: '10px'
            }}>
              Partager sur
            </h4>

            {/* Boutons sociaux */}
            <div style={{
              display: 'grid',
              gap: '10px'
            }}>
              {/* Facebook */}
              <button
                onClick={shareOnFacebook}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#1877f2',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '20px' }}>📘</span>
                <span>Facebook</span>
              </button>

              {/* Twitter */}
              <button
                onClick={shareOnTwitter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#1da1f2',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '20px' }}>🐦</span>
                <span>Twitter</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={shareOnWhatsApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#25d366',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '20px' }}>💬</span>
                <span>WhatsApp</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={shareOnLinkedIn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#0077b5',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '20px' }}>💼</span>
                <span>LinkedIn</span>
              </button>

              {/* Email */}
              <button
                onClick={shareByEmail}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#ea4335',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '20px' }}>📧</span>
                <span>Email</span>
              </button>

              {/* Copier le lien */}
              <button
                onClick={copyToClipboard}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  border: '2px solid #ddd',
                  borderRadius: '10px',
                  background: copied ? '#27ae60' : 'white',
                  color: copied ? 'white' : '#2c3e50',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = '#f8f9fa'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'white'
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>{copied ? '✓' : '📋'}</span>
                <span>{copied ? 'Copié !' : 'Copier le lien'}</span>
              </button>
            </div>
          </div>
        </>
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

export default ShareButton
