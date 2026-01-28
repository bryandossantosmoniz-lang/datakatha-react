import React from 'react'

function TeamSection() {
  const team = [
    {
      name: 'Bryan',
      role: 'Data-Engineer & Full stack-Developpeur',
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQEv20v6D25yhQ/profile-displayphoto-crop_800_800/B4EZejsEqxG4AM-/0/1750797929832?e=1770854400&v=beta&t=GZHD9xoyZxKZ6f5CN8PwMvpWRecbuNVdcceQDxn0fGY',
      description: 'Passionné par la création, la structuration de données, la conception de data-pipelines et le développement de sites web en React',
      skills: ['QGIS', 'Database', 'REACT'],
      color: '#667eea', 
      linkedin: 'https://www.linkedin.com/in/bryan-dos-santos-moniz/'
    },
    {
      name: 'Adama',
      role: 'Développeur Backend',
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQE6rgxiRE-FJQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1708025656741?e=1770854400&v=beta&t=YlNt5t0uBtJnyJdOZQej_SxTu0lu4_ApPQ3xFRSS1ss',
      description: 'Expert en bases de données et systèmes géospatiaux. Responsable de l\'infrastructure PostGIS et Supabase.',
      skills: ['PostGIS', 'SQL', 'Supabase'],
      color: '#e74c3c',
      linkedin: 'https://www.linkedin.com/in/adama-dior-sow-0a5099224/'
    },
    {
      name: 'Sewedo',
      role: 'Designer & Chercheur',
      image: 'https://media.licdn.com/dms/image/v2/D4D03AQHKEY_xGKqfDA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1728637374542?e=1770854400&v=beta&t=1BGBUBICnb6iQimowzmhSN9_tOhJvKz37lwbm5luVBs',
      description: 'Spécialiste en design d\'interfaces et recherche ethnographique. Création du système visuel et documentation des mythes.',
      skills: ['UI/UX', 'Recherche', 'Design'],
      color: '#F6AA1C',
      linkedin: 'https://www.linkedin.com/in/astyanax-g-aa8578195/'
    },
    {
      name: 'Rafael',
      role: 'Développeur Frontend',
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQERKwJlPWjniQ/profile-displayphoto-scale_400_400/B4EZm9X2GsHIAg-/0/1759818769337?e=1770854400&v=beta&t=0VkQRqJBEuPNCiTitJKbwth82a9fyTb3gEExKUIojSc',
      description: 'Expert en visualisation de données et animations. Développement des composants interactifs et de la timeline.',
      skills: ['JavaScript', 'D3.js', 'Animation'],
      color: '#27ae60', 
      linkedin: 'https://www.linkedin.com/in/rafael-topa-800b35388/'
    }
  ]

  return (
    <section style={{ marginBottom: '50px' }}>
      <h2 style={{
        color: '#F6AA1C',
        fontSize: '32px',
        marginBottom: '30px',
        borderBottom: '3px solid #F6AA1C',
        paddingBottom: '10px',
        textAlign: 'center'
      }}>
        👥 Notre Équipe
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        perspective: '1000px'
      }}>
        {team.map((member, i) => (
          <FlipCard key={i} member={member} index={i} />
        ))}
      </div>
    </section>
  )
}

function FlipCard({ member, index }) {
  const [isFlipped, setIsFlipped] = React.useState(false)
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (isFlipped) return

    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    if (!isFlipped) {
      setRotation({ x: 0, y: 0 })
    }
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setRotation({ x: 0, y: 0 })
    }
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        height: '380px',
        perspective: '1000px',
        animation: `float ${3 + index * 0.5}s ease-in-out infinite`
      }}
    >
      <div
        onClick={toggleFlip}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
          transform: isFlipped 
            ? 'rotateY(180deg)' 
            : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {/* Face avant */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          background: `linear-gradient(135deg, ${member.color}dd 0%, ${member.color} 100%)`,
          transform: 'rotateY(0deg)'
        }}>
          {/* Image de fond avec overlay */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${member.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)'
          }} />

          {/* Overlay gradient */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `linear-gradient(to bottom, transparent 0%, ${member.color}ee 100%)`
          }} />

          {/* Contenu */}
          <div style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '30px',
            color: 'white'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '15px',
              alignSelf: 'flex-start'
            }}>
              {member.role}
            </div>

            <h3 style={{
              fontSize: '32px',
              margin: '0 0 10px 0',
              fontWeight: '700',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {member.name}
            </h3>

            <p style={{
              fontSize: '12px',
              opacity: 0.9,
              margin: 0
            }}>
              👆 Cliquez pour en savoir plus
            </p>
          </div>

          {/* Indicateur de flip */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            🔄
          </div>
        </div>

        {/* Face arrière */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          background: 'white',
          transform: 'rotateY(180deg)',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Header */}
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${member.color}dd 0%, ${member.color} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              marginBottom: '20px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {member.name.charAt(0)}
            </div>

            <h3 style={{
              fontSize: '24px',
              margin: '0 0 8px 0',
              color: '#2c3e50',
              fontWeight: '700'
            }}>
              {member.name}
            </h3>

            <p style={{
              fontSize: '14px',
              color: member.color,
              fontWeight: '600',
              margin: '0 0 20px 0'
            }}>
              {member.role}
            </p>

            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#7f8c8d',
              marginBottom: '20px'
            }}>
              {member.description}
            </p>
          </div>

          {/* Compétences et boutons */}
          <div>
            <h4 style={{
              fontSize: '13px',
              color: '#2c3e50',
              marginBottom: '10px',
              fontWeight: '600'
            }}>
              Compétences clés:
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '15px'
            }}>
              {member.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    background: `${member.color}22`,
                    color: member.color,
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Bouton LinkedIn */}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: '#0077b5',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#006396'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0077b5'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="white"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>Voir mon profil LinkedIn</span>
              </a>
            )}
            
            {/* Bouton retour */}
            <div style={{
              textAlign: 'center',
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#7f8c8d',
              fontWeight: '600'
            }}>
              👆 Cliquez pour revenir
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        `}
      </style>
    </div>
  )
}

export default TeamSection