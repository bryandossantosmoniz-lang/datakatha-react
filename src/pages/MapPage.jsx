import { useState, useEffect, useCallback, useRef, useMemo} from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet'
import { getMythes, getCoords, getDiffusions, getCulturePolygons, getRegionPolygons, supabase } from '../services/supabase'
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
import { useMap } from 'react-leaflet'

function MapRefSetter({ mapRef }) {
  const map = useMap()
  
  useEffect(() => {
    if (map && mapRef) {
      console.log('✅ Carte assignée à mapRef')
      mapRef.current = map
    }
  }, [map, mapRef])
  
  return null
}


// Fixer l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// ==================== PALETTE DE COULEURS POUR LES CULTURES ====================
// Couleurs pour les cultures
const CULTURE_COLORS = {
  'Japonaise': { color: '#e91e63', fillColor: '#e91e63' },
  'Aztèque': { color: '#ff9800', fillColor: '#ff9800' },
  'Coréenne': { color: '#ff5722', fillColor: '#ff5722' },
  'Occitane': { color: '#8e44ad', fillColor: '#8e44ad' },
  'Anglo-normande': { color: '#2ecc71', fillColor: '#2ecc71' },
  'Mongole': { color: '#c0392b', fillColor: '#c0392b' },
  'Islandaise': { color: '#3498db', fillColor: '#3498db' },
  'Ecossaise': { color: '#16a085', fillColor: '#16a085' },
  'Slave': { color: '#d35400', fillColor: '#d35400' },
  'Française': { color: '#2980b9', fillColor: '#2980b9' },
  'Européenne du Nord-Ouest': { color: '#27ae60', fillColor: '#27ae60' },
  'Alpine': { color: '#95a5a6', fillColor: '#95a5a6' },
  'Scandinave': { color: '#34495e', fillColor: '#34495e' },
  'Ashanti': { color: '#f39c12', fillColor: '#f39c12' },
  'Maorie': { color: '#1abc9c', fillColor: '#1abc9c' },
  'Yorouba': { color: '#e74c3c', fillColor: '#e74c3c' },
  'Egypte antique': { color: '#f1c40f', fillColor: '#f1c40f' },
  'Marocaine': { color: '#d35400', fillColor: '#d35400' },
  'Étatsunienne': { color: '#c0392b', fillColor: '#c0392b' },
  'Javanaise-Malaise': { color: '#16a085', fillColor: '#16a085' },
  'Fidjienne': { color: '#2980b9', fillColor: '#2980b9' },
  'Provençale': { color: '#8e44ad', fillColor: '#8e44ad' },
  'Gréco-romaine': { color: '#9b59b6', fillColor: '#9b59b6' },
  'Roumaine': { color: '#e67e22', fillColor: '#e67e22' },
  'Irlandaise': { color: '#27ae60', fillColor: '#27ae60' },
  'Hébraïque': { color: '#3498db', fillColor: '#3498db' },
  'Franco-anglaise': { color: '#34495e', fillColor: '#34495e' },
  'Kanuri': { color: '#f39c12', fillColor: '#f39c12' },
  'Mandingue': { color: '#d35400', fillColor: '#d35400' },
  'San': { color: '#95a5a6', fillColor: '#95a5a6' },
  'Fon': { color: '#e74c3c', fillColor: '#e74c3c' },
  'Grecque': { color: '#3498db', fillColor: '#3498db' },
  'Caucasienne': { color: '#7f8c8d', fillColor: '#7f8c8d' },
  'Aïnoue': { color: '#16a085', fillColor: '#16a085' },
  'Akan': { color: '#f1c40f', fillColor: '#f1c40f' },
  'Nubienne': { color: '#c0392b', fillColor: '#c0392b' },
  'Baganda': { color: '#27ae60', fillColor: '#27ae60' },
  'Dinka': { color: '#8e44ad', fillColor: '#8e44ad' },
  'Maya': { color: '#4caf50', fillColor: '#4caf50' },
  'Franco-belge': { color: '#2c3e50', fillColor: '#2c3e50' },
  'Polonaise': { color: '#e74c3c', fillColor: '#e74c3c' },
  'Canadienne': { color: '#c0392b', fillColor: '#c0392b' },
  'Thailandaise': { color: '#9b59b6', fillColor: '#9b59b6' },
  'Amazigh': { color: '#f39c12', fillColor: '#f39c12' },
  'Malaise/Khmer': { color: '#1abc9c', fillColor: '#1abc9c' },
  'Hindoue': { color: '#ff9800', fillColor: '#ff9800' },
  'Chinoise': { color: '#e91e63', fillColor: '#e91e63' },
  'Tibétano-himalayenne': { color: '#673ab7', fillColor: '#673ab7' },
  'Pakistanaise': { color: '#009688', fillColor: '#009688' },
  'Portugaise': { color: '#4caf50', fillColor: '#4caf50' },
  'Swahilie': { color: '#795548', fillColor: '#795548' }
}

// Couleurs pour les régions
const REGION_COLORS = {
  'Europe Baltique': { color: '#3498db', fillColor: '#3498db' },
  'Asie du Sud': { color: '#ff9800', fillColor: '#ff9800' },
  'Afrique de l\'Ouest': { color: '#f39c12', fillColor: '#f39c12' },
  'Centre-afrique': { color: '#27ae60', fillColor: '#27ae60' },
  'Afrique de l\'Est': { color: '#e74c3c', fillColor: '#e74c3c' },
  'Afrique du Sud': { color: '#9b59b6', fillColor: '#9b59b6' },
  'Europe du Sud': { color: '#1abc9c', fillColor: '#1abc9c' },
  'Europe du Nord': { color: '#34495e', fillColor: '#34495e' },
  'Europe de l\'Est': { color: '#c0392b', fillColor: '#c0392b' },
  'Australie': { color: '#16a085', fillColor: '#16a085' },
  'Europe de l\'Ouest': { color: '#2980b9', fillColor: '#2980b9' },
  'Amérique centrale': { color: '#d35400', fillColor: '#d35400' },
  'Europe Centrale': { color: '#7f8c8d', fillColor: '#7f8c8d' },
  'Asie de l\'Est': { color: '#e91e63', fillColor: '#e91e63' },
  'Asie du nord': { color: '#95a5a6', fillColor: '#95a5a6' },
  'Moyen-Orient': { color: '#f1c40f', fillColor: '#f1c40f' },
  'Mélanésie': { color: '#2ecc71', fillColor: '#2ecc71' },
  'Afrique du Nord': { color: '#e67e22', fillColor: '#e67e22' },
  'Europe Balcanique': { color: '#8e44ad', fillColor: '#8e44ad' },
  'Micronésie': { color: '#1abc9c', fillColor: '#1abc9c' },
  'Asie du Sud Est': { color: '#9c27b0', fillColor: '#9c27b0' },
  'Asie Centrale': { color: '#795548', fillColor: '#795548' },
  'Amérique du Nord': { color: '#2c3e50', fillColor: '#2c3e50' },
  'Amérique du Sud': { color: '#4caf50', fillColor: '#4caf50' },
  'Antilles': { color: '#00bcd4', fillColor: '#00bcd4' },
  'Polynésie': { color: '#009688', fillColor: '#009688' }
}

// Fonction pour obtenir la couleur d'une culture
const getCultureColor = (cultureName) => {
  // Correspondance exacte
  if (CULTURE_COLORS[cultureName]) {
    return CULTURE_COLORS[cultureName]
  }
  
  // Chercher une correspondance partielle
  const cultureKey = Object.keys(CULTURE_COLORS).find(key => 
    cultureName?.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(cultureName?.toLowerCase())
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

// Fonction pour obtenir la couleur d'une région
const getRegionColor = (regionName) => {
  // Correspondance exacte
  if (REGION_COLORS[regionName]) {
    return REGION_COLORS[regionName]
  }
  
  // Chercher une correspondance partielle
  const regionKey = Object.keys(REGION_COLORS).find(key => 
    regionName?.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(regionName?.toLowerCase())
  )
  
  if (regionKey) {
    return REGION_COLORS[regionKey]
  }
  
  // Couleur par défaut basée sur hash du nom
  let hash = 0
  for (let i = 0; i < (regionName || '').length; i++) {
    hash = regionName.charCodeAt(i) + ((hash << 5) - hash)
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
    <div className="layer-control" style={{
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
    culture: false,
    regions: false
  })
  const [activeFilters, setActiveFilters] = useState({
      culture: 'all',
      region: 'all',
      theme: 'all',
      creature: 'all'
  })
  const [activeDiffusionMyth, setActiveDiffusionMyth] = useState(null)
  const [diffusions, setDiffusions] = useState([])
  const [wasDiffusionActiveBeforeToggle, setWasDiffusionActiveBeforeToggle] = useState(false)
  const [regions, setRegions] = useState([])
  const [highlightedMyth, setHighlightedMyth] = useState(null)
  const [culturePolygons, setCulturePolygons] = useState([])
  const [regionPolygons, setRegionPolygons] = useState([])
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const mapRef = useRef(null)
  const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
const handleSidebarClose = () => {
  setSelectedMyth(null)
  setHighlightedMyth(null)
  
  if (activeDiffusionMyth) {
    setActiveDiffusionMyth(null)
    
    if (!wasDiffusionActiveBeforeToggle) {
      setActiveLayers(prev => ({ ...prev, diffusion: false }))
    }
  }
}

const handleToggleDiffusion = (mythId, isActive) => {
  if (isActive) {
    // MÉMORISER l'état LayerControl
    setWasDiffusionActiveBeforeToggle(activeLayers.diffusion)
    
    setActiveDiffusionMyth(mythId)
    
    if (!activeLayers.diffusion) {
      setActiveLayers(prev => ({ ...prev, diffusion: true }))
    }
  } else {
    setActiveDiffusionMyth(null)
    
    // RETOURNER à l'état initial
    if (!wasDiffusionActiveBeforeToggle) {
      setActiveLayers(prev => ({ ...prev, diffusion: false }))
    }
  }
}

const visibleDiffusions = useMemo(() => {
  console.log('🔄 Calcul visibleDiffusions:', {
    layerControl: activeLayers.diffusion,
    mytheSidebarActive: activeDiffusionMyth
  })
  
  // CAS 1: Un mythe a activé ses diffusions via toggle
  // → Priorité absolue, afficher TOUJOURS ses diffusions
  if (activeDiffusionMyth) {
    console.log('   ✅ Diffusions du mythe', activeDiffusionMyth)
    return diffusions.filter(d => d.id_mythe === activeDiffusionMyth)
  }
  
  // CAS 2: LayerControl activé, afficher toutes les diffusions
  if (activeLayers.diffusion) {
    console.log('   ✅ Toutes les diffusions (LayerControl)')
    return diffusions
  }
  
  // CAS 3: Rien activé
  console.log('   ❌ Aucune diffusion')
  return []
}, [activeLayers.diffusion, activeDiffusionMyth, diffusions])

const visibleCultures = useMemo(() => {
  if (!activeLayers.cultures) {
    return []
  }
  
  const cultureIds = new Set(
    filteredMythes.map(m => m.id_culture).filter(Boolean)
  )
  
  return culturePolygons.filter(cultPoly => 
    cultureIds.has(cultPoly.id_culture)
  )
}, [filteredMythes, culturePolygons, activeLayers.cultures])
  
  const visibleRegions = useMemo(() => {
    if (!activeLayers.regions) {
      return []
    }
    
    const regionIds = new Set()
    
    filteredMythes.forEach(myth => {
      myth.regions?.forEach(r => {
        if (r && r.id_region) {
          regionIds.add(r.id_region)
        }
      })
    })
    
    return regionPolygons.filter(regPoly => 
      regionIds.has(regPoly.id_region)
    )
  }, [filteredMythes, regionPolygons, activeLayers.regions])


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
    
    // CULTURE
    if (filter.type === 'culture') {
      filtered = allMythes.filter(m => 
        m.culture?.nom_culture === filter.value ||
        m.id_culture === filter.id
      )
      setActiveLayers(prev => ({ ...prev, cultures: true }))
      
      // ===== AJOUTER ZOOM SUR CULTURE =====
      setTimeout(() => {
        const culturePoly = culturePolygons.find(c => 
          c.id_culture === filter.id || c.nom_culture === filter.value
        )
        if (culturePoly && mapRef.current) {
          // Calculer le centre du polygone
          const bounds = L.geoJSON(culturePoly.geom).getBounds()
          mapRef.current.fitBounds(bounds, { padding: [50, 50] })
        }
      }, 500)
    }

    // THEME
    else if (filter.type === 'theme') {
      filtered = allMythes.filter(m => 
        m.theme?.nom_theme === filter.value ||
        m.id_theme === filter.id
      )
    }

    // CREATURE
    else if (filter.type === 'creature') {
      filtered = allMythes.filter(m => {
        const creatureName = m.creature?.nom_creature || m.creature?.nom || m.creature?.type_creature
        return creatureName === filter.value || m.id_typologie === filter.id
      })
    }

    // FAMILLE DE CRÉATURE
    else if (filter.type === 'famille') {
      filtered = allMythes.filter(m => 
        m.creature?.id_famille_creature === filter.id
      )
    }

    // RÉGION
    else if (filter.type === 'region') {
      filtered = allMythes.filter(m => {
        return m.regions?.some(r => 
          r.nom_region === filter.value || 
          r.id_region === filter.id
        )
      })
      setActiveLayers(prev => ({ ...prev, regions: true }))
      
      // ===== AJOUTER ZOOM SUR RÉGION =====
      setTimeout(() => {
        const regionPoly = regionPolygons.find(r => 
          r.id_region === filter.id || r.nom_region === filter.value
        )
        if (regionPoly && mapRef.current) {
          const bounds = L.geoJSON(regionPoly.geom).getBounds()
          mapRef.current.fitBounds(bounds, { padding: [50, 50] })
        }
      }, 500)
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
  console.log('🎯 Navigation mythe détectée')
  
  const myth = JSON.parse(storedMyth)
  const fullMyth = allMythes.find(m => m.id_mythe === myth.id_mythe)
  
  if (fullMyth) {
    setSelectedMyth(fullMyth)
    setHighlightedMyth(fullMyth.id_mythe)
    
    const coords = getCoords(fullMyth.geom)
    console.log('   coords calculées:', coords)
    
    if (coords) {
        // POLLING: Réessayer jusqu'à ce que mapRef soit prêt
        let attempts = 0
        const maxAttempts = 20  // 4 secondes max (20 × 200ms)
        
        const tryZoom = () => {
          attempts++
          console.log(`🔄 Tentative zoom ${attempts}/${maxAttempts}`)
          
          if (mapRef.current) {
            console.log('✅ Carte prête! Zoom sur:', coords)
            mapRef.current.setView(coords, 10, { animate: true })
          } else if (attempts < maxAttempts) {
            console.log('   Carte pas prête, réessai dans 200ms...')
            setTimeout(tryZoom, 200)  // Réessayer après 200ms
          } else {
            console.error('❌ TIMEOUT: Carte non prête après 4 secondes')
          }
        }
        
        // Commencer les tentatives après 300ms (laisser React finir le render)
        setTimeout(tryZoom, 300)
      } else {
        console.error('❌ Pas de coordonnées pour ce mythe')
      }
    } else {
      console.error('❌ Mythe non trouvé dans allMythes')
    }
  
  sessionStorage.removeItem('selectedMyth')
}
}, [allMythes, loading, culturePolygons, regionPolygons])


  const loadMythes = async () => {
    const data = await getMythes()
    setAllMythes(data)
    setFilteredMythes(data)
    setTimeFilteredMythes(data)
    
    const culturesUniques = [...new Map(
      data.map(m => m.culture).filter(Boolean).map(c => [c.id_culture, c])
    ).values()]

    const themesUniques = [...new Map(
      data.map(m => m.theme).filter(Boolean).map(t => [t.id_theme, t])
    ).values()]

    const creaturesUniques = [...new Map(
      data.map(m => m.creature).filter(Boolean).map(cr => [cr.id_typologie, cr])
    ).values()]

    setCultures(culturesUniques)
    setThemes(themesUniques)
    setCreatures(creaturesUniques)

    const { data: regionsData } = await supabase
    .from('region')
    .select('id_region, nom_region')
    .order('nom_region')

    setRegions(regionsData || [])
    
    setLoading(false)
  }

  const handleFilterChange = useCallback((filtered, filters) => {
    console.log('🎛️ Filtres actifs:', filters)
    
    setFilteredMythes(filtered)
    
    // VÉRIFIER que filters existe
    if (filters) {
      setActiveFilters(filters)
      
      // AUTO-ACTIVER/DÉSACTIVER les couches
      setActiveLayers(prev => ({
        ...prev,
        cultures: filters.culture !== 'all',
        regions: filters.region !== 'all'
      }))
    }
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
        regions={regions}
        externalFilter={externalFilter}
        className="filter-panel"
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <LayerControl 
          className="layer-control"
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
          <MapRefSetter mapRef={mapRef} />
          <TileLayer
            key={currentBasemap.id}
            url={currentBasemap.url}
            attribution={currentBasemap.attribution}
          />
          
          {/* ==================== COUCHE DIFFUSION ==================== */}
          {activeLayers.diffusion && visibleDiffusions.map((diff, diffIndex) => {
            const parsed = parseGeometry(diff.geom, `Diffusion ${diffIndex}`)
            
            if (!parsed) return null
            
            const renderDiffusionLine = (coords, key) => {
              const validCoords = validateCoords(coords)
              if (validCoords.length < 2) return null
              
              // Fonction de clic
              const handleDiffusionClick = () => {
                console.log('🖱️ Clic sur diffusion:', diff)
                console.log('   - diff.id_mythe:', diff.id_mythe)
                console.log('   - diff.mythe:', diff.mythe)
                
                // Essayer plusieurs propriétés possibles
                const mytheId = diff.id_mythe || diff.mythes?.id_mythe || diff.id_myth
                
                console.log('   - mytheId trouvé:', mytheId)
                
                if (mytheId) {
                  // Trouver le mythe complet
                  const fullMyth = allMythes.find(m => m.id_mythe === mytheId)
                  
                  console.log('   - fullMyth trouvé:', fullMyth)
                  
                  if (fullMyth) {
                    console.log('   ✅ Ouverture du mythe:', fullMyth.nom_mythe)
                    setHighlightedMyth(fullMyth.id_mythe)  // ← Rend le marker rouge
                    setSelectedMyth(fullMyth)               // ← Ouvre le sidebar
                    
                    // Centrer sur le mythe
                    const coords = getCoords(fullMyth.geom)
                    if (coords && mapRef.current) {
                      mapRef.current.setView(coords, 10, { animate: true })
                    }
                  } else {
                    console.error('   ❌ Mythe non trouvé dans allMythes')
                  }
                } else {
                  console.error('   ❌ Pas d\'id_mythe sur cette diffusion')
                }
              }

              return (
                  <Polyline
                    key={key}
                    positions={validCoords}
                    color="#3498db"
                    weight={4}
                  opacity={0.8}
                  dashArray="10, 5"
                  className="animated-diffusion-line"
                  eventHandlers={{
                    click: handleDiffusionClick
                  }}
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
          {activeLayers.cultures && visibleCultures.map((cult, cultIndex) => {
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
                  className="culture-polygon"
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
          {activeLayers.regions && visibleRegions.map((reg, regIndex) => {
            const parsed = parseGeometry(reg.geom, `Région: ${reg.nom_region}`)
            
            if (!parsed) return null
            
            const renderRegionPolygon = (coords, key, partInfo = '') => {
              const validCoords = validateCoords(coords)
              
              if (validCoords.length < 3) return null
              
              const colors = getCultureColor(reg.nom_region)
              const mythesInRegion = filteredMythes.filter(m => 
                m.regions?.some(r => r.id_region === reg.id_region)
              ).length
              
              return (
                <Polygon
                  key={key}
                  positions={validCoords}
                  color={colors.color}
                  fillColor={colors.fillColor}
                  fillOpacity={0.2}
                  weight={2}
                >
                  <Popup>
                    <div style={{ minWidth: '220px' }}>
                      <strong style={{ fontSize: '16px', color: colors.color }}>
                        📍 {reg.nom_region}
                      </strong>
                      
                      <div style={{ 
                        marginTop: '10px', 
                        padding: '10px', 
                        background: '#f0fff4', 
                        borderRadius: '6px',
                        borderLeft: `3px solid ${colors.color}`
                      }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.color }}>
                          {mythesInRegion}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          mythe{mythesInRegion > 1 ? 's' : ''} affiché{mythesInRegion > 1 ? 's' : ''}
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
              const isHighlighted = highlightedMyth === myth.id_mythe
              
                return (
                <Marker
                  key={myth.id_mythe}
                  position={coords}
                  icon={isHighlighted ? redIcon : undefined} // <-- ICÔNE ROUGE SI HIGHLIGHTED
                  eventHandlers={{
                  click: () => {
                    setSelectedMyth(myth)
                    setHighlightedMyth(myth.id_mythe)
                  }
                  }}
                >
                  <Popup> 
                  <strong style={{ color: isHighlighted ? '#e74c3c' : '#F6AA1C' }}>
                    {myth.nom_mythe}
                  </strong> 
                  {myth.culture && (
                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                      📍 {myth.culture.nom_culture}
                    </p>
                  )}
                  <div style={{ height: '10px' }} />
                  <button
                    onClick={() => {
                      setSelectedMyth(myth)
                      setHighlightedMyth(myth.id_mythe)
                    }}
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
          className="time-slider"
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
        onClose={handleSidebarClose}
        onToggleDiffusion={handleToggleDiffusion}
      />
    </div>
  )
}

export default MapPage