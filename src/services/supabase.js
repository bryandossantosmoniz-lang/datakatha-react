import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Récupération des mythes : sélection type SQL
export const getMythes = async () => {
  const { data, error } = await supabase
    .from('mythes')
    .select(`
      id_mythe,
      nom_mythe,
      description_mythe,
      periode_texte,
      date_entier,
      geom,
      id_culture,
      id_theme,
      id_typologie
    `)

  if (error) {
    console.error('Erreur Supabase:', error)
    return []
  }

  console.log('✅ Données BRUTES reçues:', data)

  // Récupérer les infos des tables liées MANUELLEMENT
  // (parce que les relations automatiques font chier)
  
  // Récupérer toutes les cultures
  const { data: cultures } = await supabase
    .from('culture')
    .select('*')
  
  // Récupérer tous les thèmes
  const { data: themes } = await supabase
    .from('theme')
    .select('*')
  
  // Récupérer toutes les créatures
  const { data: creatures } = await supabase
    .from('creature')
    .select('*')

  // Récupérer table pivot culture_region
  const { data: cultureRegions } = await supabase
    .from('culture_region')
    .select('id_culture, id_region')

  // Récupérer régions
  const { data: regions } = await supabase
    .from('region')
    .select('*')

  console.log('📚 Cultures:', cultures)
  console.log('🎨 Themes:', themes)
  console.log('🐉 Creatures:', creatures)
  console.log('🌍 Culture-Region:', cultureRegions)
  console.log('📍 Regions:', regions)

  // Créer des maps pour lookup rapide
  const cultureMap = {}
  cultures?.forEach(c => {
    cultureMap[c.id_culture] = c
  })

  const themeMap = {}
  themes?.forEach(t => {
    themeMap[t.id_theme] = t
  })

  const creatureMap = {}
  creatures?.forEach(cr => {
    creatureMap[cr.id_typologie] = cr
  })

  const regionMap = {}
  regions?.forEach(r => { regionMap[r.id_region] = r })

  // Map culture → regions
  const cultureToRegionsMap = {}
  cultureRegions?.forEach(cr => {
    if (!cultureToRegionsMap[cr.id_culture]) {
      cultureToRegionsMap[cr.id_culture] = []
    }
    cultureToRegionsMap[cr.id_culture].push(regionMap[cr.id_region])
  })

  // Convertir les géométries ET ajouter les données liées
  const mythesAvecTout = data.map(myth => {
    let geomParsed = null
    
    if (typeof myth.geom === 'object' && myth.geom?.type === 'Point') {
      geomParsed = myth.geom
    }
    else if (typeof myth.geom === 'string' && myth.geom.startsWith('{')) {
      try {
        geomParsed = JSON.parse(myth.geom)
      } catch (e) {
        console.error('Erreur parse JSON:', e)
      }
    }
    else if (typeof myth.geom === 'string' && myth.geom.includes('POINT')) {
      const match = myth.geom.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i)
      if (match) {
        geomParsed = {
          type: 'Point',
          coordinates: [parseFloat(match[1]), parseFloat(match[2])]
        }
      }
    }

    return {
      ...myth,
      geom: geomParsed,
      culture: cultureMap[myth.id_culture] || null,
      theme: themeMap[myth.id_theme] || null,
      creature: creatureMap[myth.id_typologie] || null,
      regions: cultureToRegionsMap[myth.id_culture] || []
    }
  })

  console.log('✅ Mythes enrichis:', mythesAvecTout)

  return mythesAvecTout
}

// Extraire coordonnées pour Leaflet [lat, lng]
export function getCoords(geom) {
  if (!geom || !geom.coordinates) return null
  
  const [lng, lat] = geom.coordinates
  return [lat, lng]
}

// Récupérer diffusions et jointure avec mythes 
export const getDiffusions = async () => {
  const { data, error } = await supabase
    .from('diffusion')
    .select(`
      *,
      mythes:id_mythe (
        id_mythe,
        nom_mythe,
        culture:id_culture (
          nom_culture
        )
      )
    `)
  
  if (error) {
    console.error('Erreur diffusion:', error)
    return []
  }
  return data || []

  const { data: mediaDiffusions } = await supabase
    .from('media')
    .select('*')
    .not('id_diffusion', 'is', null)

  const mytheMap = {}
  mythes?.forEach(m => { mytheMap[m.id_mythe] = m })

  const mediaDiffusionMap = {}
  mediaDiffusions?.forEach(media => {
    if (!mediaDiffusionMap[media.id_diffusion]) {
      mediaDiffusionMap[media.id_diffusion] = []
    }
    mediaDiffusionMap[media.id_diffusion].push(media)
  })

  return (data || []).map(diff => ({
    ...diff,
    mythe: mytheMap[diff.id_mythe] || null,
    images: mediaDiffusionMap[diff.id_diffusion] || []
  }))
}

// Récupérer polygones cultures
export const getCulturePolygons = async () => {
  const { data, error } = await supabase
    .from('culture')
    .select('id_culture, nom_culture, geom') 
  if (error) console.error('Erreur cultures:', error)
  return data || []
}

// Récupérer polygones régions
export const getRegionPolygons = async () => {
  const { data, error } = await supabase
    .from('region')
    .select('id_region, nom_region, geom') 
  if (error) console.error('Erreur régions:', error)
  return data || []
}

export const getMythImages = async (idMythe) => {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('id_mythe', idMythe)
  
  if (error) {
    console.error('Erreur images mythe:', error)
    return []
  }
  
  return data || []
}

// FONCTION : Compter mythes par région
export const countMythesByRegion = async () => {
  // 1. Récupérer tous les mythes avec cultures
  const { data: mythes } = await supabase
    .from('mythes')
    .select('id_mythe, id_culture')

  // 2. Récupérer table pivot
  const { data: cultureRegions } = await supabase
    .from('culture_region')
    .select('id_culture, id_region')

  // 3. Récupérer régions
  const { data: regions } = await supabase
    .from('region')
    .select('*')

  // 4. Construire map région → count
  const regionCounts = {}
  regions?.forEach(r => {
    regionCounts[r.id_region] = {
      ...r,
      count: 0
    }
  })

  // 5. Compter
  mythes?.forEach(myth => {
    // Trouver les régions de cette culture
    const regionsOfCulture = cultureRegions?.filter(cr => 
      cr.id_culture === myth.id_culture
    )
    
    // Incrémenter chaque région
    regionsOfCulture?.forEach(cr => {
      if (regionCounts[cr.id_region]) {
        regionCounts[cr.id_region].count++
      }
    })
  })

  return Object.values(regionCounts)
}

// FONCTION : Filtrer mythes par région
export const filterMythesByRegion = (mythes, regionId) => {
  return mythes.filter(myth => {
    // Vérifier si une des régions du mythe correspond
    return myth.regions?.some(r => r.id_region === regionId)
  })
}