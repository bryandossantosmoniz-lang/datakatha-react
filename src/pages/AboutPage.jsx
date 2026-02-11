import React from 'react'
import ShareButton from '../components/ShareButton'
import TeamSection from '../components/TeamSection'

function AboutPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #7889d5 0%, #6c1eba 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '50px'
        }}>
          <div style={{
            fontSize: '80px',
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite'
          }}>
            📚
          </div>
          <h1 style={{
            fontSize: '56px',
            margin: '0 0 20px 0',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            DATAKATHA
          </h1>
          <p style={{
            fontSize: '24px',
            opacity: 0.95,
            fontStyle: 'italic'
          }}>
            L'encyclopédie interactive des mythes et légendes
          </p>

          <div style={{ marginTop: '20px' }}>
            <ShareButton 
              title="DATAKATHA - Mythes et Légendes"
              description="Découvrez l'encyclopédie interactive des mythes du monde entier"
            />
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          marginBottom: '30px'
        }}>
          {/* Mission */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              color: '#F6AA1C',
              fontSize: '32px',
              marginBottom: '20px',
              borderBottom: '3px solid #F6AA1C',
              paddingBottom: '10px'
            }}>
              🎯 Notre Mission
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#2c3e50'
            }}>
              DATAKATHA est une plateforme innovante dédiée à la préservation et à la diffusion 
              du patrimoine mythologique mondial. Notre objectif est de créer un pont entre les 
              cultures en rendant accessibles les mythes, légendes et croyances qui ont façonné 
              l'humanité à travers les âges.
            </p>
          </section>

          {/* Caractéristiques */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              color: '#F6AA1C',
              fontSize: '32px',
              marginBottom: '20px',
              borderBottom: '3px solid #F6AA1C',
              paddingBottom: '10px'
            }}>
              ✨ Fonctionnalités
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {[
                { icon: '🗺️', title: 'Carte Interactive', desc: 'Explorez les mythes géolocalisés sur une carte du monde' },
                { icon: '⏱️', title: 'Timeline', desc: 'Voyagez à travers les époques et les civilisations' },
                { icon: '🔊', title: 'Audio', desc: 'Écoutez les descriptions des mythes avec synthèse vocale' },
                { icon: '🔍', title: 'Filtres Avancés', desc: 'Recherchez par culture, thème, créature et plus' },
                { icon: '📚', title: 'Bibliothèque', desc: 'Consultez une base de données complète' },
                { icon: '⚖️', title: 'Comparaison', desc: 'Comparez plusieurs mythes côte à côte' }
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '10px' }}>{feature.icon}</div>
                  <h3 style={{
                    fontSize: '18px',
                    color: '#2c3e50',
                    marginBottom: '8px'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#7f8c8d',
                    lineHeight: '1.5'
                  }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Technologies */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              color: '#F6AA1C',
              fontSize: '32px',
              marginBottom: '20px',
              borderBottom: '3px solid #F6AA1C',
              paddingBottom: '10px'
            }}>
              🛠️ Outils
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              {[
                'React', 'Supabase', 'Leaflet', 'QGIS', 
                'React Router', 'Web Speech API', 'Vite'
              ].map((tech, i) => (
                <div
                  key={i}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </section>

          {/* Méthodologie */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              color: '#F6AA1C',
              fontSize: '32px',
              marginBottom: '20px',
              borderBottom: '3px solid #F6AA1C',
              paddingBottom: '10px'
            }}>
              📊 Méthodologie
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#2c3e50',
              marginBottom: '15px'
            }}>
              Notre base de données est construite à partir de sources académiques fiables, 
              d'ouvrages de référence et de recherches ethnographiques. Chaque mythe est 
              documenté avec :
            </p>
            <ul style={{
              fontSize: '16px',
              lineHeight: '2',
              color: '#2c3e50',
              paddingLeft: '30px'
            }}>
              <li>Son origine géographique et culturelle</li>
              <li>Sa période historique d'apparition</li>
              <li>Les créatures et entités associées</li>
              <li>Les thèmes mythologiques principaux</li>
              <li>Les sources et références bibliographiques</li>
            </ul>
          </section>

          {/* Équipe */}
          <TeamSection />

          {/* Sources */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              color: '#F6AA1C',
              fontSize: '32px',
              marginBottom: '20px',
              borderBottom: '3px solid #F6AA1C',
              paddingBottom: '10px'
            }}>
              📖 Sources et Références
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#2c3e50'
            }}>
              Les informations présentées sur DATAKATHA proviennent d'une compilation 
              rigoureuse de sources scientifiques, littéraires et historiques. Nous nous 
              efforçons de maintenir un niveau élevé d'exactitude tout en rendant le contenu 
              accessible au grand public.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 style={{
              color: '#F6AA1C',
              fontSize: '32px',
              marginBottom: '20px',
              borderBottom: '3px solid #F6AA1C',
              paddingBottom: '10px'
            }}>
              📧 Contact
            </h2>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#2c3e50',
              marginBottom: '15px'
            }}>
              Vous avez une question, une suggestion ou vous souhaitez contribuer au projet ?
            </p>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              display: 'inline-block'
            }}>
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: '#2c3e50'
              }}>
                📧 Email : <a href="mailto:contact.datakatha@gmail.com" style={{
                  color: '#F6AA1C',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}>contact.datakatha@gmail.com</a>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '14px',
          opacity: 0.8,
          padding: '20px'
        }}>
          <p>
            © 2025 DATAKATHA - Tous droits réservés
          </p>
          <p>
            Fait avec passion pour la préservation du patrimoine mythologique mondial
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </div>
  )
}

export default AboutPage