// MODIFICATION DANS FilterPanel.jsx

import React, { useState, useEffect } from 'react'

function FilterPanel({ 
  mythes, 
  onFilterChange,
  cultures = [],
  themes = [],
  creatures = [],
  externalFilter = null  // <-- AJOUTER CE PROP
}) {
  const [filters, setFilters] = useState({
    culture: 'all',
    theme: 'all',
    creature: 'all',
    search: ''
  })

  const [isOpen, setIsOpen] = useState(true)

  // NOUVEAU: Synchroniser avec le filtre externe
  useEffect(() => {
    if (externalFilter) {
      console.log('🔄 Synchronisation filtre externe:', externalFilter)
      
      if (externalFilter.type === 'culture') {
        setFilters(prev => ({ ...prev, culture: String(externalFilter.id) }))
      }
      else if (externalFilter.type === 'theme') {
        setFilters(prev => ({ ...prev, theme: String(externalFilter.id) }))
      }
      else if (externalFilter.type === 'creature' || externalFilter.type === 'famille') {
        setFilters(prev => ({ ...prev, creature: String(externalFilter.id) }))
      }
      
      // Ouvrir le panel pour montrer le filtre actif
      setIsOpen(true)
    }
  }, [externalFilter])

  // Appliquer les filtres
  useEffect(() => {
    const filtered = mythes.filter(myth => {
      // Filtre culture
      if (filters.culture !== 'all' && myth.id_culture !== parseInt(filters.culture)) {
        return false
      }

      // Filtre thème
      if (filters.theme !== 'all' && myth.id_theme !== parseInt(filters.theme)) {
        return false
      }

      // Filtre créature
      if (filters.creature !== 'all' && myth.id_typologie !== parseInt(filters.creature)) {
        return false
      }

      // Filtre recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const nomMatch = myth.nom_mythe?.toLowerCase().includes(searchLower)
        const descMatch = myth.description_mythe?.toLowerCase().includes(searchLower)
        if (!nomMatch && !descMatch) {
          return false
        }
      }

      return true
    })

    onFilterChange(filtered)
  }, [filters, mythes, onFilterChange])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      culture: 'all',
      theme: 'all',
      creature: 'all',
      search: ''
    })
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          left: isOpen ? '320px' : '20px',
          top: '20px',
          zIndex: 1000,
          background: '#F6AA1C',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 16px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {isOpen ? '◀' : '☰'} Filtres
        {activeFilterCount > 0 && (
          <span style={{
            background: 'white',
            color: '#F6AA1C',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Panel */}
      <div style={{
        position: 'absolute',
        left: isOpen ? '0' : '-320px',
        top: '0',
        width: '300px',
        height: '100%',
        background: 'linear-gradient(to bottom, #2c3e50, #34495e)',
        boxShadow: '4px 0 15px rgba(0,0,0,0.3)',
        zIndex: 999,
        transition: 'left 0.3s ease',
        overflowY: 'auto',
        padding: '20px',
        color: 'white',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <h3 style={{
          marginTop: '60px',
          marginBottom: '25px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#F6AA1C',
          borderBottom: '2px solid rgba(246, 170, 28, 0.3)',
          paddingBottom: '10px'
        }}>
          🔍 Filtres
        </h3>

        {/* Message si filtre externe actif */}
        {externalFilter && (
          <div style={{
            background: 'rgba(246, 170, 28, 0.2)',
            border: '1px solid #F6AA1C',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '13px'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>
              📌 Filtre actif depuis la bibliothèque
            </div>
            <div style={{ opacity: 0.9 }}>
              {externalFilter.type} : {externalFilter.value}
            </div>
          </div>
        )}

        {/* Recherche */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#F6AA1C'
          }}>
            Recherche
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Nom ou mot-clé..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          />
        </div>

        {/* Culture */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#F6AA1C'
          }}>
            Culture
          </label>
          <select
            value={filters.culture}
            onChange={(e) => handleFilterChange('culture', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: filters.culture !== 'all' ? '2px solid #F6AA1C' : '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all" style={{ background: '#34495e' }}>Toutes les cultures</option>
            {cultures.map(c => (
              <option key={c.id_culture} value={c.id_culture} style={{ background: '#34495e' }}>
                {c.nom_culture}
              </option>
            ))}
          </select>
        </div>

        {/* Thème */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#F6AA1C'
          }}>
            Thème
          </label>
          <select
            value={filters.theme}
            onChange={(e) => handleFilterChange('theme', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: filters.theme !== 'all' ? '2px solid #F6AA1C' : '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all" style={{ background: '#34495e' }}>Tous les thèmes</option>
            {themes.map(t => (
              <option key={t.id_theme} value={t.id_theme} style={{ background: '#34495e' }}>
                {t.nom_theme}
              </option>
            ))}
          </select>
        </div>

        {/* Créature */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#F6AA1C'
          }}>
            Créature
          </label>
          <select
            value={filters.creature}
            onChange={(e) => handleFilterChange('creature', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: filters.creature !== 'all' ? '2px solid #F6AA1C' : '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all" style={{ background: '#34495e' }}>Toutes les créatures</option>
            {creatures.map(cr => (
              <option key={cr.id_typologie} value={cr.id_typologie} style={{ background: '#34495e' }}>
                {cr.nom_creature || cr.nom || cr.type_creature || `ID ${cr.id_typologie}`}
              </option>
            ))}
          </select>
        </div>

        {/* Bouton reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              background: 'rgba(231, 76, 60, 0.8)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'all 0.2s'
            }}
          >
            🔄 Réinitialiser les filtres
          </button>
        )}

        {/* Stats */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          borderLeft: '3px solid #F6AA1C'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
            Mythes affichés
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#F6AA1C' }}>
            {mythes.filter(myth => {
              if (filters.culture !== 'all' && myth.id_culture !== parseInt(filters.culture)) return false
              if (filters.theme !== 'all' && myth.id_theme !== parseInt(filters.theme)) return false
              if (filters.creature !== 'all' && myth.id_typologie !== parseInt(filters.creature)) return false
              if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const nomMatch = myth.nom_mythe?.toLowerCase().includes(searchLower)
                const descMatch = myth.description_mythe?.toLowerCase().includes(searchLower)
                if (!nomMatch && !descMatch) return false
              }
              return true
            }).length}
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterPanel