import { useState, useEffect, useCallback } from 'react'
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

function MapPage() {
  const [allMythes, setAllMythes] = useState([])
  const [filteredMythes, setFilteredMythes] = useState([])
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

  useEffect(() => {
    loadMythes()
  }, [])

  useEffect(() => {
    const loadLayers = async () => {
      const [diff, cult, reg] = await Promise.all([
        getDiffusions(),
        getCulturePolygons(),
        getRegionPolygons()
      ])
      setDiffusions(diff)
      setCulturePolygons(cult)
      setRegionPolygons(reg)
    }
    loadLayers()
  }, [])

  const loadMythes = async () => {
    const data = await getMythes()
    setAllMythes(data)
    setFilteredMythes(data)
    setTimeFilteredMythes(data)
    
    // Extraire les listes uniques pour les filtres
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

// Fonction pour parser les géométries
const parsePolygonCoords = (geom, name) => {
  if (!geom) {
    console.warn(`${name}: geom est null`)
    return null
  }
  
  try {
    console.log(`${name} - Type geom:`, typeof geom)
    
    // Cas 1: GeoJSON standard
    if (geom.type && geom.coordinates) {
      console.log(`${name} - Format: GeoJSON (${geom.type})`)
      
      let coords = geom.coordinates
      
      // Si Polygon, prendre le premier ring
      if (geom.type === 'Polygon') {
        coords = coords[0]
      }
      
      // Si MultiPolygon, prendre le premier polygon
      if (geom.type === 'MultiPolygon') {
        coords = coords[0][0]
      }
      
      console.log(`${name} - ${coords?.length} points`)
      
      if (coords && coords.length > 0) {
        // Inverser pour Leaflet: [lat, lng]
        return coords.map(c => [c[1], c[0]])
      }
    }
    
    // Cas 2: WKT String
    if (typeof geom === 'string' && geom.includes('POLYGON')) {
      console.log(`${name} - Format: WKT`)
      const match = geom.match(/\(\((.*?)\)\)/)
      if (match) {
        const coords = match[1].split(',').map(point => {
          const [lng, lat] = point.trim().split(' ').map(Number)
          return [lat, lng]
        })
        console.log(`${name} - ${coords.length} points`)
        return coords
      }
    }
    
    console.warn(`${name} - Format non reconnu`)
    return null
    
  } catch (error) {
    console.error(`${name} - Erreur:`, error)
    return null
  }
}

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', position: 'relative' }}>
      {/* Filtres géographiques */}
      <FilterPanel 
        mythes={allMythes}
        onFilterChange={handleFilterChange}
        cultures={cultures}
        themes={themes}
        creatures={creatures}
      />

      {/* Carte */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* LayerControl - HORS du MapContainer */}
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
        >
          <TileLayer
            key={currentBasemap.id}
            url={currentBasemap.url}
            attribution={currentBasemap.attribution}
          />
          
          {/* Couche Diffusion - DANS le MapContainer */}
          {activeLayers.diffusion && diffusions.map((diff, i) => {
          const coords = parsePolygonCoords(diff.geom, `Diffusion ${i}`)
          if (!coords || coords.length === 0) return null
  
          return (
            <Polyline
              key={`diff-${i}`}
              positions={coords}
              color="#3498db"
              weight={3}
              opacity={0.7}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <strong style={{ color: '#3498db', fontSize: '16px' }}>
                    🌊 Diffusion du mythe
                  </strong>
                  
                  {diff.mythe && (
                    <>
                      <div style={{ 
                        marginTop: '10px', 
                        padding: '8px', 
                        background: '#f0f0f0', 
                        borderRadius: '6px' 
                      }}>
                        <strong>📖 Mythe :</strong><br />
                        {diff.mythe.nom_mythe}
                      </div>
                      
                      {diff.mythe.culture && (
                        <div style={{ 
                          marginTop: '8px', 
                          fontSize: '13px', 
                          color: '#666' 
                        }}>
                          🌍 {diff.mythe.culture.nom_culture}
                        </div>
                      )}
                    </>
                  )}
                  
                  {diff.periode && (
                    <div style={{ 
                      marginTop: '8px', 
                      fontSize: '12px', 
                      color: '#888' 
                    }}>
                      📅 {diff.periode}
                    </div>
                  )}
                  
                  {diff.ordre && (
                    <div style={{ 
                      marginTop: '5px', 
                      fontSize: '12px', 
                      color: '#888' 
                    }}>
                      ↗️ Étape {diff.ordre}
                    </div>
                    )}
                  </div>
              </Popup>
            </Polyline>
          )
        })}
            // Remplace le rendu CULTURES par :
            {activeLayers.cultures && culturePolygons.map((cult, i) => {
              const coords = parsePolygonCoords(cult.geom, `Culture: ${cult.nom_culture}`)
              
              if (!coords || coords.length < 3) {
                console.warn(`Culture ${cult.nom_culture}: Insuffisant (${coords?.length || 0} points)`)
                return null
              }
              
              // Vérifier validité
              const validCoords = coords.filter(c => 
                Array.isArray(c) && c.length === 2 && 
                !isNaN(c[0]) && !isNaN(c[1]) &&
                c[0] >= -90 && c[0] <= 90 && 
                c[1] >= -180 && c[1] <= 180
              )
              
              if (validCoords.length < 3) {
                console.warn(`Culture ${cult.nom_culture}: Points invalides`)
                return null
              }
              
              console.log(`✅ Culture ${cult.nom_culture}: ${validCoords.length} points OK`)
              
              return (
                <Polygon
                  key={`cult-${i}`}
                  positions={validCoords}
                  color="#9b59b6"
                  fillColor="#9b59b6"
                  fillOpacity={0.2}
                  weight={2}
                >
                  <Popup>
                    <strong>{cult.nom_culture}</strong>
                    <br />
                    <small>{validCoords.length} points</small>
                  </Popup>
                </Polygon>
              )
            })}

            // Remplace le rendu RÉGIONS par :
            {activeLayers.regions && regionPolygons.map((reg, i) => {
              const coords = parsePolygonCoords(reg.geom, `Région: ${reg.nom_region}`)
              
              if (!coords || coords.length < 3) return null
              
              const validCoords = coords.filter(c => 
                Array.isArray(c) && c.length === 2 && 
                !isNaN(c[0]) && !isNaN(c[1]) &&
                c[0] >= -90 && c[0] <= 90 && 
                c[1] >= -180 && c[1] <= 180
              )
              
              if (validCoords.length < 3) return null
              
              console.log(`✅ Région ${reg.nom_region}: ${validCoords.length} points OK`)
              
              return (
                <Polygon
                  key={`reg-${i}`}
                  positions={validCoords}
                  color="#27ae60"
                  fillColor="#27ae60"
                  fillOpacity={0.2}
                  weight={2}
                >
                  <Popup>
                    <strong>{reg.nom_region}</strong>
                    <br />
                    <small>{validCoords.length} points</small>
                  </Popup>
                </Polygon>
              )
            })}




          {/* Markers mythes - DANS le MapContainer */}
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
                    <strong style={{ color: '#F6AA1C' }}>{myth.nom_mythe}</strong>
                    {myth.culture && <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                      📍 {myth.culture.nom_culture}
                    </p>}
                    <button
                      onClick={() => setSelectedMyth(myth)}
                      style={{
                        marginTop: '8px',
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

        {/* Sélecteur de fond de carte - HORS du MapContainer */}
        <BasemapSelector 
          currentBasemap={currentBasemap}
          onBasemapChange={setCurrentBasemap}
        />

        {/* TimeSlider - HORS du MapContainer */}
        <TimeSlider 
          mythes={filteredMythes}
          onTimeFilterChange={handleTimeFilterChange}
        />

        {/* Compteur de mythes - HORS du MapContainer */}
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

      {/* Sidebar - HORS de tout */}
      <MythSidebar 
        myth={selectedMyth} 
        onClose={() => setSelectedMyth(null)} 
      />
    </div>
  )
}

export default MapPage