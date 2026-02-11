import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// VERSION ULTRA SAFE - SEULEMENT CE QUI MARCHE À 100%
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

  console.log('📚 Cultures:', cultures)
  console.log('🎨 Themes:', themes)
  console.log('🐉 Creatures:', creatures)

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
      creature: creatureMap[myth.id_typologie] || null
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

// Récupérer diffusions
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
    .select('nom_culture, geom')
  if (error) console.error('Erreur cultures:', error)
  return data || []
}

// Récupérer polygones régions
export const getRegionPolygons = async () => {
  const { data, error } = await supabase
    .from('region')
    .select('nom_region, geom')
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