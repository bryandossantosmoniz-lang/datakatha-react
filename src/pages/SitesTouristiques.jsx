// Remplace tout le contenu de SitesTouristiques.jsx par :

function SitesTouristiques() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Effet de flou de fond */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.3
      }} />

      {/* Carte principale */}
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '60px 80px',
        maxWidth: '700px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Icône construction */}
        <div style={{
          fontSize: '120px',
          marginBottom: '20px',
          animation: 'bounce 2s infinite'
        }}>
          🚧
        </div>

        {/* Titre */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          Coming Soon
        </h1>

        {/* Message */}
        <p style={{
          fontSize: '22px',
          color: '#7f8c8d',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          La page <strong style={{ color: '#667eea' }}>Sites Touristiques</strong> est en cours de développement
        </p>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: '#95a5a6',
          marginBottom: '40px',
          lineHeight: '1.8'
        }}>
          Nous travaillons dur pour vous proposer une expérience exceptionnelle. 
          Cette fonctionnalité sera bientôt disponible !
        </p>

        {/* Features à venir */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏛️</div>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
              Sites mythologiques
            </div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
              Géolocalisation
            </div>
          </div>
          <div style={{
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎫</div>
            <div style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
              Informations pratiques
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <a
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '15px 40px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)'
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          ← Retour à l'accueil
        </a>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

export default SitesTouristiques