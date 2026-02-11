import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet'
import { getMythes, getCoords, getDiffusions, getCulturePolygons, getRegionPolygons } from '../services/supabase'
import MythSidebar from '../components/MythSidebar'
import FilterPanel from '../components/FilterPanel'
import MarkerClusterGroup from '../components/MarkerClusterGroup'
import BasemapSelector, { BASEMAPS } from '../components/BasemapSelector'
import TimeSlider from '../components/TimeSlider'
import LayerControl from '../components/LayerControl'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import L from 'leaflet'

// Fixer l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// ==================== PALETTE DE COULEURS POUR LES CULTURES ====================
const CULTURE_COLORS = {
  'Grecque': { color: '#e74c3c', fillColor: '#e74c3c' },
  'Romaine': { color: '#9b59b6', fillColor: '#9b59b6' },
  'Égyptienne': { color: '#f39c12', fillColor: '#f39c12' },
  'Nordique': { color: '#3498db', fillColor: '#3498db' },
  'Celtique': { color: '#27ae60', fillColor: '#27ae60' },
  'Japonaise': { color: '#e91e63', fillColor: '#e91e63' },
  'Chinoise': { color: '#ff5722', fillColor: '#ff5722' },
  'Indienne': { color: '#9c27b0', fillColor: '#9c27b0' },
  'Aztèque': { color: '#ff9800', fillColor: '#ff9800' },
  'Maya': { color: '#4caf50', fillColor: '#4caf50' },
  'Inca': { color: '#00bcd4', fillColor: '#00bcd4' },
  'Africaine': { color: '#795548', fillColor: '#795548' },
  'Polynésienne': { color: '#009688', fillColor: '#009688' },
  'Mésopotamienne': { color: '#607d8b', fillColor: '#607d8b' },
  'Perse': { color: '#673ab7', fillColor: '#673ab7' }
}

// Fonction pour obtenir la couleur d'une culture
const getCultureColor = (cultureName) => {
  // Chercher une correspondance partielle
  const cultureKey = Object.keys(CULTURE_COLORS).find(key => 
    cultureName?.toLowerCase().includes(key.toLowerCase())
  )
  
  if (cultureKey) {
    return CULTURE_COLORS[cultureKey]
  }
  
  // Couleur par défaut basée sur hash du nom
  let hash = 0
  for (let i = 0; i < (cultureName || '').length; i++) {
    hash = cultureName.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return {
    color: `hsl(${hue}, 65%, 55%)`,
    fillColor: `hsl(${hue}, 65%, 55%)`
  }
}

// ==================== FONCTION PARSING GÉOMÉTRIE UNIVERSELLE ====================
const parseGeometry = (geom, name) => {
  if (!geom) {
    console.warn(`${name}: geom est null`)
    return null
  }
  
  try {
    console.log(`${name} - Type geom:`, typeof geom)
    
    // ==================== GeoJSON ====================
    if (geom.type && geom.coordinates) {
      console.log(`${name} - Format: GeoJSON (${geom.type})`)
      
      // POINT
      if (geom.type === 'Point') {
        return {
          type: 'Point',
          coords: [geom.coordinates[1], geom.coordinates[0]]
        }
      }
      
      // LINESTRING (une seule ligne)
      if (geom.type === 'LineString') {
        const coords = geom.coordinates.map(c => [c[1], c[0]])
        console.log(`${name} - LineString: ${coords.length} points`)
        return {
          type: 'LineString',
          coords: coords
        }
      }
      
      // MULTILINESTRING (plusieurs lignes)
      if (geom.type === 'MultiLineString') {
        const allLines = geom.coordinates.map(line => 
          line.map(c => [c[1], c[0]])
        )
        console.log(`${name} - MultiLineString: ${allLines.length} lignes`)
        return {
          type: 'MultiLineString',
          coords: allLines
        }
      }
      
      // POLYGON (un seul polygone)
      if (geom.type === 'Polygon') {
        const ring = geom.coordinates[0]
        const coords = ring.map(c => [c[1], c[0]])
        console.log(`${name} - Polygon: ${coords.length} points`)
        return {
          type: 'Polygon',
          coords: coords
        }
      }
      
      // MULTIPOLYGON (plusieurs polygones - TOUTES les parties)
      if (geom.type === 'MultiPolygon') {
        const allPolygons = geom.coordinates.map(polygon => {
          const ring = polygon[0]
          return ring.map(c => [c[1], c[0]])
        })
        console.log(`${name} - MultiPolygon: ${allPolygons.length} polygones`)
        return {
          type: 'MultiPolygon',
          coords: allPolygons
        }
      }
    }
    
    // ==================== WKT STRING ====================
    if (typeof geom === 'string') {
      console.log(`${name} - Format: WKT String`)
      
      // LINESTRING WKT
      if (geom.includes('LINESTRING') && !geom.includes('MULTI')) {
        const match = geom.match(/LINESTRING\s*\((.*?)\)/i)
        if (match) {
          const coords = match[1].split(',').map(point => {
            const [lng, lat] = point.trim().split(' ').map(Number)
            return [lat, lng]
          })
          console.log(`${name} - LineString WKT: ${coords.length} points`)
          return {
            type: 'LineString',
            coords: coords
          }
        }
      }
      
      // MULTILINESTRING WKT
      if (geom.includes('MULTILINESTRING')) {
        const lineMatches = geom.matchAll(/\((.*?)\)/g)
        const allLines = []
        for (const match of lineMatches) {
          const coords = match[1].split(',').map(point => {
            const [lng, lat] = point.trim().split(' ').map(Number)
            return [lat, lng]
          })
          allLines.push(coords)
        }
        console.log(`${name} - MultiLineString WKT: ${allLines.length} lignes`)
        return {
          type: 'MultiLineString',
          coords: allLines
        }
      }
      
      // POLYGON WKT
      if (geom.includes('POLYGON') && !geom.includes('MULTI')) {
        const match = geom.match(/POLYGON\s*\(\((.*?)\)\)/i)
        if (match) {
          const coords = match[1].split(',').map(point => {
            const [lng, lat] = point.trim().split(' ').map(Number)
            return [lat, lng]
          })
          console.log(`${name} - Polygon WKT: ${coords.length} points`)
          return {
            type: 'Polygon',
            coords: coords
          }
        }
      }
      
      // MULTIPOLYGON WKT
      if (geom.includes('MULTIPOLYGON')) {
        const polygonMatches = geom.matchAll(/\(\((.*?)\)\)/g)
        const allPolygons = []
        for (const match of polygonMatches) {
          const coords = match[1].split(',').map(point => {
            const [lng, lat] = point.trim().split(' ').map(Number)
            return [lat, lng]
          })
          allPolygons.push(coords)
        }
        console.log(`${name} - MultiPolygon WKT: ${allPolygons.length} polygones`)
        return {
          type: 'MultiPolygon',
          coords: allPolygons
        }
      }
    }
    
    console.warn(`${name} - Format non reconnu`)
    return null
    
  } catch (error) {
    console.error(`${name} - Erreur parsing:`, error)
    return null
  }
}

// ==================== VALIDATION DES COORDONNÉES ====================
const validateCoords = (coords) => {
  return coords.filter(c => 
    Array.isArray(c) && 
    c.length === 2 && 
    !isNaN(c[0]) && !isNaN(c[1]) &&
    c[0] >= -90 && c[0] <= 90 && 
    c[1] >= -180 && c[1] <= 180
  )
}

// ==================== COMPOSANT LÉGENDE CULTURES ====================
function CultureLegend({ cultures, validMythes }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      maxWidth: '250px'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px',
          background: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        🎨 Légende des cultures
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>
      
      {isOpen && (
        <div style={{
          padding: '12px',
          borderTop: '1px solid #eee',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          {cultures.map(cult => {
            const colors = getCultureColor(cult.nom_culture)
            const count = validMythes.filter(m => m.culture?.nom_culture === cult.nom_culture).length
            return (
              <div key={cult.id_culture} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px',
                fontSize: '13px'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: colors.fillColor,
                  border: `2px solid ${colors.color}`,
                  borderRadius: '3px',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>{cult.nom_culture}</div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  background: '#f0f0f0',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {count}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ==================== COMPOSANT PRINCIPAL ====================
function MapPage() {
  // États
  const [allMythes, setAllMythes] = useState([])
  const [filteredMythes, setFilteredMythes] = useState([])
  const [externalFilter, setExternalFilter] = useState(null)
  const [timeFilteredMythes, setTimeFilteredMythes] = useState([])
  const [selectedMyth, setSelectedMyth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cultures, setCultures] = useState([])
  const [themes, setThemes] = useState([])
  const [creatures, setCreatures] = useState([])
  const [currentBasemap, setCurrentBasemap] = useState(BASEMAPS[0])
  const [activeLayers, setActiveLayers] = useState({
    mythes: true,
    diffusion: false,
    cultures: false,
    regions: false
  })
  const [diffusions, setDiffusions] = useState([])
  const [culturePolygons, setCulturePolygons] = useState([])
  const [regionPolygons, setRegionPolygons] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const mapRef = useRef(null)

  // Chargement des mythes
  useEffect(() => {
    loadMythes()
  }, [])

  // Chargement des couches
  useEffect(() => {
    const loadLayers = async () => {
      console.log('=== CHARGEMENT DES COUCHES ===')
      const [diff, cult, reg] = await Promise.all([
        getDiffusions(),
        getCulturePolygons(),
        getRegionPolygons()
      ])
      
      console.log('Diffusions récupérées:', diff.length)
      console.log('Cultures récupérées:', cult.length)
      console.log('Régions récupérées:', reg.length)
      
      setDiffusions(diff)
      setCulturePolygons(cult)
      setRegionPolygons(reg)
    }
    loadLayers()
  }, [])

  // Gestion filtres depuis bibliothèque et galerie
  useEffect(() => {
    // Filtre depuis bibliothèque
    const storedFilter = sessionStorage.getItem('mapFilter')
    if (storedFilter && !loading && allMythes.length > 0) {
    const filter = JSON.parse(storedFilter)
    console.log('📍 Filtre depuis bibliothèque:', filter)
    
    let filtered = [...allMythes]
    
    // Filtrer selon le type
    if (filter.type === 'culture') {
      filtered = allMythes.filter(m => 
        m.culture?.nom_culture === filter.value ||
        m.id_culture === filter.id
      )
      setActiveLayers(prev => ({ ...prev, cultures: true }))
    }
    else if (filter.type === 'theme') {
      filtered = allMythes.filter(m => 
        m.theme?.nom_theme === filter.value ||
        m.id_theme === filter.id
      )
    }
    else if (filter.type === 'creature') {
      filtered = allMythes.filter(m => {
        const creatureName = m.creature?.nom_creature || m.creature?.nom || m.creature?.type_creature
        return creatureName === filter.value || m.id_typologie === filter.id
      })
    }
    else if (filter.type === 'famille') {
      filtered = allMythes.filter(m => 
        m.creature?.id_famille_creature === filter.id
      )
    }
    else if (filter.type === 'region') {
      filtered = allMythes.filter(m => 
        m.region?.nom_region === filter.value ||
        m.region?.id_region === filter.id
      )
      setActiveLayers(prev => ({ ...prev, regions: true }))
    }
    
    console.log(`✅ Filtrage: ${filtered.length} mythes affichés`)
    
    // Appliquer le filtre
    setFilteredMythes(filtered)
    
    // Stocker pour le FilterPanel
    setExternalFilter(filter)
    
    // Nettoyer
    sessionStorage.removeItem('mapFilter')
  }
  
  // Mythe depuis galerie
  const storedMyth = sessionStorage.getItem('selectedMyth')
  if (storedMyth && !loading && allMythes.length > 0) {
    const myth = JSON.parse(storedMyth)
    const fullMyth = allMythes.find(m => m.id_mythe === myth.id_mythe)
    
    if (fullMyth) {
      setSelectedMyth(fullMyth)
      
      const coords = getCoords(fullMyth.geom)
      if (coords && mapRef.current) {
        setTimeout(() => {
          mapRef.current.setView(coords, 8, { animate: true })
        }, 500)
      }
    }
    
    sessionStorage.removeItem('selectedMyth')
  }
}, [allMythes, loading])


  const loadMythes = async () => {
    const data = await getMythes()
    setAllMythes(data)
    setFilteredMythes(data)
    setTimeFilteredMythes(data)
    
    const culturesUniques = [...new Map(
      data.map(m => m.culture).filter(Boolean).map(c => [c.id_culture, c])
    ).values()].sort((a, b) => (a.nom_culture || '').localeCompare(b.nom_culture || ''))

    const themesUniques = [...new Map(
      data.map(m => m.theme).filter(Boolean).map(t => [t.id_theme, t])
    ).values()].sort((a, b) => (a.nom_theme || '').localeCompare(b.nom_theme || ''))

    const creaturesUniques = [...new Map(
      data.map(m => m.creature).filter(Boolean).map(c => [c.id_typologie, c])
    ).values()].sort((a, b) => {
      const nameA = a.nom_creature || a.nom || a.type_creature || ''
      const nameB = b.nom_creature || b.nom || b.type_creature || ''
      return nameA.localeCompare(nameB)
    })

    setCultures(culturesUniques)
    setThemes(themesUniques)
    setCreatures(creaturesUniques)
    
    setLoading(false)
  }

  const handleFilterChange = useCallback((filtered) => {
    setFilteredMythes(filtered)
  }, [])

  const handleTimeFilterChange = useCallback((timeFiltered) => {
    setTimeFilteredMythes(timeFiltered)
  }, [])

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        fontSize: '1.2em',
        color: '#F6AA1C'
      }}>
        Chargement de la carte...
      </div>
    )
  }

  const finalFilteredMythes = filteredMythes.filter(myth => 
    timeFilteredMythes.includes(myth)
  )

  const validMythes = finalFilteredMythes.filter(m => getCoords(m.geom) !== null)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', position: 'relative' }}>
      <FilterPanel 
        mythes={allMythes}
        onFilterChange={handleFilterChange}
        cultures={cultures}
        themes={themes}
        creatures={creatures}
        externalFilter={externalFilter}
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <LayerControl 
          onLayerChange={(layers) => setActiveLayers(layers)}
          isMobile={isMobile}
        />

        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          worldCopyJump={true}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          whenCreated={(map) => { mapRef.current = map }}
        >
          <TileLayer
            key={currentBasemap.id}
            url={currentBasemap.url}
            attribution={currentBasemap.attribution}
          />
          
          {/* ==================== COUCHE DIFFUSION ==================== */}
          {activeLayers.diffusion && diffusions.map((diff, diffIndex) => {
            const parsed = parseGeometry(diff.geom, `Diffusion ${diffIndex}`)
            
            if (!parsed) return null
            
            const renderDiffusionLine = (coords, key) => {
              const validCoords = validateCoords(coords)
              if (validCoords.length < 2) return null
              
              return (
                  <Polyline
                    key={key}
                    positions={validCoords}
                    color="#3498db"
                    weight={4}
                  opacity={0.8}
                  dashArray="10, 5"
                  className="animated-diffusion-line"
                  >
                  <style jsx>{`
                    @keyframes dash {
                      to {
                        stroke-dashoffset: -15;
                      }
                    }
                    .animated-diffusion-line {
                      animation: dash 1s linear infinite;
                    }
                  `}</style>

                  <Popup maxWidth={250} maxHeight={500}>
                    <div style={{ 
                      maxHeight: '300px', 
                      overflowY: 'auto',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontSize: '13px'
                    }}>
                      {/* Header compact */}
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: '6px',
                        padding: '5px',
                        margin: '15px 0px 10px 0px',
                        position: 'relative'
                      }}>
                        {diff.images && diff.images.length > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${diff.images[0].url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.25
                          }} />
                        )}
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                          <div style={{ fontSize: '10px', opacity: 0.9, marginBottom: '4px' }}>
                            🌊 DIFFUSION
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2' }}>
                            {diff.nom_oeuvre || 'Sans titre'}
                          </div>
                        </div>
                      </div>

                      {/* Mythe */}
                      {diff.mythe && (
                        <div style={{ 
                          padding: '10px', 
                          background: '#f0f8ff', 
                          borderRadius: '6px',
                          marginBottom: '10px',
                          borderLeft: '3px solid #667eea'
                        }}>
                          <div style={{ fontSize: '10px', color: '#666', marginBottom: '3px' }}>
                            📖 MYTHE
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2c3e50' }}>
                            {diff.mythe.nom_mythe}
                          </div>
                          {diff.mythe.culture && (
                            <div style={{ fontSize: '11px', color: '#7f8c8d', marginTop: '3px' }}>
                              🌍 {diff.mythe.culture.nom_culture}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Résumé court */}
                      {diff.resume_oeuvre && (
                        <div style={{ 
                          padding: '8px',
                          background: '#f8f9fa',
                          borderRadius: '6px',
                          fontSize: '12px',
                          lineHeight: '1.4',
                          color: '#555',
                          marginBottom: '10px'
                        }}>
                          {diff.resume_oeuvre}
                        </div>
                      )}

                      {/* Info compacte */}
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                        {diff.type_oeuvre && (
                          <div style={{ 
                            flex: 1,
                            background: '#ffeaa7',
                            padding: '8px',
                            borderRadius: '6px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '16px' }}>
                              {diff.type_oeuvre === 'Film' ? '🎬' :
                              diff.type_oeuvre === 'Manga' ? '📚' :
                              diff.type_oeuvre === 'Roman' ? '📖' :
                              diff.type_oeuvre === 'Série' ? '📺' :
                              diff.type_oeuvre === 'Jeu-vidéo' ? '🎮' : '🎭'}
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#856404' }}>
                              {diff.type_oeuvre}
                            </div>
                          </div>
                        )}
                        
                        {diff.annee_oeuvre && (
                          <div style={{ 
                            flex: 1,
                            background: '#a29bfe',
                            padding: '8px',
                            borderRadius: '6px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '16px' }}>📅</div>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                              {diff.annee_oeuvre}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Auteur */}
                      {diff.auteur && (
                        <div style={{ 
                          padding: '8px',
                          background: '#fab1a0',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: 'white',
                          marginBottom: '10px'
                        }}>
                          <strong>✍️</strong> {diff.auteur}
                        </div>
                      )}

                      {/* Images miniatures */}
                      {diff.images && diff.images.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>
                            🖼️ {diff.images.length} photo{diff.images.length > 1 ? 's' : ''}
                          </div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {diff.images.slice(0, 3).map((img, idx) => (
                              <div
                                key={idx}
                                onClick={() => window.open(img.url, '_blank')}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                              >
                                <img
                                  src={img.url}
                                  alt=""
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              </div>
                            ))}
                            {diff.images.length > 3 && (
                              <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '4px',
                                background: '#e0e0e0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                color: '#666'
                              }}>
                                +{diff.images.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Polyline>
              )
            }
            
            if (parsed.type === 'LineString') {
              return renderDiffusionLine(parsed.coords, `diff-${diffIndex}`)
            }
            
            if (parsed.type === 'MultiLineString') {
              return parsed.coords.map((lineCoords, lineIdx) => 
                renderDiffusionLine(lineCoords, `diff-${diffIndex}-${lineIdx}`)
              )
            }
            
            if (parsed.type === 'Polygon') {
              return renderDiffusionLine(parsed.coords, `diff-${diffIndex}`)
            }
            
            if (parsed.type === 'MultiPolygon') {
              return parsed.coords.map((polyCoords, polyIdx) => 
                renderDiffusionLine(polyCoords, `diff-${diffIndex}-${polyIdx}`)
              )
            }
            
            return null
          })}

          {/* ==================== COUCHE CULTURES ==================== */}
          {activeLayers.cultures && culturePolygons.map((cult, cultIndex) => {
            const parsed = parseGeometry(cult.geom, `Culture: ${cult.nom_culture}`)
            
            if (!parsed) return null
            
            const renderCulturePolygon = (coords, key, partInfo = '') => {
              const validCoords = validateCoords(coords)
              
              if (validCoords.length < 3) return null
              
              const colors = getCultureColor(cult.nom_culture)
              const mythesInCulture = validMythes.filter(m => 
                m.culture?.nom_culture === cult.nom_culture
              ).length
              
              return (
                <Polygon
                  key={key}
                  positions={validCoords}
                  color={colors.color}
                  fillColor={colors.fillColor}
                  fillOpacity={0.35}
                  weight={1}
                  opacity={0.7}
                >
                  <Popup>
                    <div style={{ minWidth: '220px' }}>
                      <strong style={{ 
                        fontSize: '16px', 
                        color: colors.color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          background: colors.fillColor,
                          borderRadius: '50%',
                          border: `2px solid ${colors.color}`
                        }} />
                        {cult.nom_culture}
                      </strong>
                      
                      <div style={{ 
                        marginTop: '10px', 
                        padding: '10px', 
                        background: `${colors.fillColor}15`, 
                        borderRadius: '6px',
                        borderLeft: `3px solid ${colors.color}`
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.color }}>
                          {mythesInCulture}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          mythe{mythesInCulture > 1 ? 's' : ''} répertorié{mythesInCulture > 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      {cult.description_culture && (
                        <div style={{ 
                          marginTop: '10px', 
                          fontSize: '12px', 
                          color: '#666',
                          lineHeight: '1.4'
                        }}>
                          {cult.description_culture.substring(0, 120)}
                          {cult.description_culture.length > 120 && '...'}
                        </div>
                      )}
                      
                      {partInfo && (
                        <div style={{ 
                          marginTop: '8px', 
                          fontSize: '11px', 
                          color: '#999',
                          fontStyle: 'italic'
                        }}>
                          {partInfo}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Polygon>
              )
            }
            
            if (parsed.type === 'Polygon') {
              return renderCulturePolygon(parsed.coords, `cult-${cultIndex}`)
            }
            
            if (parsed.type === 'MultiPolygon') {
              return parsed.coords.map((polyCoords, polyIdx) => 
                renderCulturePolygon(
                  polyCoords, 
                  `cult-${cultIndex}-${polyIdx}`
                )
              )
            }
            
            return null
          })}

          {/* ==================== COUCHE RÉGIONS ==================== */}
          {activeLayers.regions && regionPolygons.map((reg, regIndex) => {
            const parsed = parseGeometry(reg.geom, `Région: ${reg.nom_region}`)
            
            if (!parsed) return null
            
            const renderRegionPolygon = (coords, key, partInfo = '') => {
              const validCoords = validateCoords(coords)
              
              if (validCoords.length < 3) return null
              
              const mythesInRegion = validMythes.filter(m => {
                return m.region?.nom_region === reg.nom_region
              }).length
              
              return (
                <Polygon
                  key={key}
                  positions={validCoords}
                  color="#27ae60"
                  fillColor="#27ae60"
                  fillOpacity={0.2}
                  weight={2}
                >
                  <Popup>
                    <div style={{ minWidth: '220px' }}>
                      <strong style={{ fontSize: '16px', color: '#27ae60' }}>
                        📍 {reg.nom_region}
                      </strong>
                      
                      <div style={{ 
                        marginTop: '10px', 
                        padding: '10px', 
                        background: '#f0fff4', 
                        borderRadius: '6px',
                        borderLeft: '3px solid #27ae60'
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                          {mythesInRegion}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          mythe{mythesInRegion > 1 ? 's' : ''} dans cette zone
                        </div>
                      </div>
                      
                      {reg.description_region && (
                        <div style={{ 
                          marginTop: '10px', 
                          fontSize: '12px', 
                          color: '#666',
                          lineHeight: '1.4'
                        }}>
                          {reg.description_region.substring(0, 120)}
                          {reg.description_region.length > 120 && '...'}
                        </div>
                      )}
                      
                      {partInfo && (
                        <div style={{ 
                          marginTop: '8px', 
                          fontSize: '11px', 
                          color: '#999',
                          fontStyle: 'italic'
                        }}>
                          {partInfo}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Polygon>
              )
            }
            
            if (parsed.type === 'Polygon') {
              return renderRegionPolygon(parsed.coords, `reg-${regIndex}`)
            }
            
            if (parsed.type === 'MultiPolygon') {
              return parsed.coords.map((polyCoords, polyIdx) => 
                renderRegionPolygon(
                  polyCoords, 
                  `reg-${regIndex}-${polyIdx}`
                )
              )
            }
            
            return null
          })}

          {/* ==================== MARKERS MYTHES ==================== */}
          <MarkerClusterGroup>
            {validMythes.map((myth) => {
              const coords = getCoords(myth.geom)
              
                return (
                <Marker
                  key={myth.id_mythe}
                  position={coords}
                  eventHandlers={{
                  click: () => setSelectedMyth(myth)
                  }}
                >
                  <Popup>
                  <strong style={{ color: '#F6AA1C' }}>
                    {myth.nom_mythe}
                  </strong> 
                  <div style={{ height: '10px' }} />
                  <button
                    onClick={() => setSelectedMyth(myth)}
                    style={{
                    marginTop: '10px',
                    padding: '5px 12px',
                    background: '#F6AA1C',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                    }}
                  >
                    Voir plus
                  </button>
                  </Popup>
                </Marker>
                )
            })}
          </MarkerClusterGroup>
        </MapContainer>

        <BasemapSelector 
          currentBasemap={currentBasemap}
          onBasemapChange={setCurrentBasemap}
        />

        <TimeSlider 
          mythes={filteredMythes}
          onTimeFilterChange={handleTimeFilterChange}
        />

        <div style={{
          position: 'absolute',
          bottom: '50px',
          left: '20px',
          background: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>📍</span>
          <div>
            <strong style={{ color: '#F6AA1C', fontSize: '18px' }}>
              {validMythes.length}
            </strong>
            <span style={{ fontSize: '14px', color: '#666', marginLeft: '5px' }}>
              mythe{validMythes.length > 1 ? 's' : ''}
            </span>
            {allMythes.length !== finalFilteredMythes.length && (
              <div style={{ fontSize: '11px', color: '#999' }}>
                sur {allMythes.length} au total
              </div>
            )}
          </div>
        </div>
      </div>

      <MythSidebar 
        myth={selectedMyth} 
        onClose={() => setSelectedMyth(null)} 
      />
    </div>
  )
}

export default MapPage