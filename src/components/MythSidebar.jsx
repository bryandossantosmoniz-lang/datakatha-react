import React from 'react'
import TextToSpeech from './TextToSpeech'

function MythSidebar({ myth, onClose }) {
  if (!myth) return null

  return (
    <div style={{
      width: '400px',
      background: 'white',
      height: '100%',
      overflowY: 'auto',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {/* Bouton de fermeture */}
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

      <div style={{ padding: '20px' }}>
        {/* Titre */}
        <h2 style={{ 
          color: '#F6AA1C', 
          marginBottom: '20px',
          paddingRight: '40px'
        }}>
          {myth.nom_mythe}
        </h2>

        {/* Lecteur audio pour la description */}
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
          <div style={{
            background: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.95em',
            lineHeight: '1.6'
          }}>
            {myth.description_mythe}
          </div>
        )}

        {/* Table d'informations */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <tbody>
            {/* Période */}
            {myth.periode_texte && (
              <tr style={{ borderTop: '1px solid #ddd' }}>
                <th style={{
                  padding: '10px',
                  background: '#f5f5f5',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  width: '40%'
                }}>
                  Période
                </th>
                <td colSpan="3" style={{ padding: '10px' }}>
                  {myth.periode_texte}
                  {myth.date_entier && ` (${myth.date_entier})`}
                </td>
              </tr>
            )}

            {/* Créature */}
            {myth.creature && (
              <tr style={{ borderTop: '1px solid #ddd' }}>
                <th style={{
                  padding: '10px',
                  background: '#f5f5f5',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }}>
                  Créature
                </th>
                <td colSpan="3" style={{ padding: '10px' }}>
                  {myth.creature.nom_creature || 
                   myth.creature.nom || 
                   myth.creature.type_creature ||
                   'Créature non définie'}
                </td>
              </tr>
            )}

            {/* Culture */}
            {myth.culture && (
              <tr style={{ borderTop: '1px solid #ddd' }}>
                <th style={{
                  padding: '10px',
                  background: '#f5f5f5',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }}>
                  Culture
                </th>
                <td colSpan="3" style={{ padding: '10px' }}>
                  {myth.culture.nom_culture || 'Culture non définie'}
                </td>
              </tr>
            )}

            {/* Thème */}
            {myth.theme && (
              <tr style={{ borderTop: '1px solid #ddd' }}>
                <th style={{
                  padding: '10px',
                  background: '#f5f5f5',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }}>
                  Thème
                </th>
                <td colSpan="3" style={{ padding: '10px' }}>
                  {myth.theme.nom_theme || 'Thème non défini'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Sources */}
        {myth.liens_sources && (
          <div style={{ 
            marginTop: '20px',
            fontSize: '0.85em',
            color: '#666'
          }}>
            <strong>Sources :</strong>
            <div style={{ marginTop: '5px' }}>
              {myth.liens_sources}
            </div>
          </div>
        )}

        {/* Métadonnées */}
        <div style={{
          marginTop: '20px',
          paddingTop: '15px',
          borderTop: '1px solid #eee',
          fontSize: '0.8em',
          color: '#999'
        }}>
          {myth.contributeur_mythe && (
            <div>Contributeur : {myth.contributeur_mythe}</div>
          )}
          {myth.date_ajout && (
            <div>Ajouté le : {new Date(myth.date_ajout).toLocaleDateString('fr-FR')}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MythSidebar