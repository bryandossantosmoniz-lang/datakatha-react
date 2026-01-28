import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

function DailyMyth() {
  const [todayMyth, setTodayMyth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDailyMyth()
  }, [])

  const loadDailyMyth = async () => {
    try {
      // Récupérer tous les mythes
      const { data: mythes } = await supabase
        .from('mythes')
        .select(`
          id_mythe,
          nom_mythe,
          description_mythe,
          periode_texte,
          culture (nom_culture),
          theme (nom_theme)
        `)

      if (mythes && mythes.length > 0) {
        // Utiliser la date du jour comme seed pour un "random" déterministe
        const today = new Date()
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
        const index = dayOfYear % mythes.length
        
        setTodayMyth(mythes[index])
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Erreur chargement mythe du jour:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        padding: '30px',
        textAlign: 'center',
        color: '#F6AA1C'
      }}>
        Chargement du mythe du jour...
      </div>
    )
  }

  if (!todayMyth) {
    return null
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      padding: '40px',
      color: 'white',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '40px'
    }}>
      {/* Badge "Mythe du jour" */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(246, 170, 28, 0.9)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        boxShadow: '0 4px 15px rgba(246, 170, 28, 0.3)'
      }}>
        ✨ Mythe du jour
      </div>

      {/* Icône décorative */}
      <div style={{
        fontSize: '48px',
        marginBottom: '20px',
        animation: 'float 3s ease-in-out infinite'
      }}>
        📖
      </div>

      {/* Titre */}
      <h2 style={{
        fontSize: '32px',
        margin: '0 0 15px 0',
        fontWeight: '700',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
      }}>
        {todayMyth.nom_mythe}
      </h2>

      {/* Métadonnées */}
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {todayMyth.culture && (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            🌍 {todayMyth.culture.nom_culture}
          </div>
        )}
        {todayMyth.theme && (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            🎭 {todayMyth.theme.nom_theme}
          </div>
        )}
        {todayMyth.periode_texte && (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            ⏱️ {todayMyth.periode_texte}
          </div>
        )}
      </div>

      {/* Description */}
      {todayMyth.description_mythe && (
        <p style={{
          fontSize: '16px',
          lineHeight: '1.8',
          marginBottom: '25px',
          opacity: 0.95,
          maxHeight: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 5,
          WebkitBoxOrient: 'vertical'
        }}>
          {todayMyth.description_mythe}
        </p>
      )}

      {/* Bouton */}
      <button
        onClick={() => window.location.href = '/carte'}
        style={{
          background: '#F6AA1C',
          color: 'white',
          border: 'none',
          padding: '14px 30px',
          borderRadius: '12px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(246, 170, 28, 0.4)',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px'
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
        <span>Découvrir sur la carte</span>
        <span>→</span>
      </button>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>
    </div>
  )
}

export default DailyMyth
