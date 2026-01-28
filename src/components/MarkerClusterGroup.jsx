import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'

function MarkerClusterGroup({ children }) {
  const map = useMap()

  useEffect(() => {
    // Créer le cluster group
    const markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount()
        let size = 'small'
        let color = '#F6AA1C'
        
        if (count > 50) {
          size = 'large'
          color = '#e74c3c'
        } else if (count > 20) {
          size = 'medium'
          color = '#e67e22'
        }
        
        const sizeMap = {
          small: 30,
          medium: 40,
          large: 50
        }
        
        const fontSize = {
          small: 12,
          medium: 14,
          large: 16
        }
        
        return L.divIcon({
          html: `<div style="
            background: ${color};
            color: white;
            border-radius: 50%;
            width: ${sizeMap[size]}px;
            height: ${sizeMap[size]}px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${fontSize[size]}px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(sizeMap[size], sizeMap[size], true)
        })
      }
    })

    // Ajouter à la carte
    map.addLayer(markerClusterGroup)

    // Ajouter les markers au cluster
    if (children) {
      const markers = Array.isArray(children) ? children : [children]
      
      markers.forEach(child => {
        if (child && child.props) {
          const marker = L.marker(child.props.position, {
            icon: child.props.icon || L.Icon.Default.prototype
          })
          
          // Ajouter le popup si présent
          if (child.props.children) {
            const popupContent = document.createElement('div')
            
            // Extraction des données du popup
            const popupChild = Array.isArray(child.props.children) 
              ? child.props.children[0] 
              : child.props.children
            
            if (popupChild && popupChild.props && popupChild.props.children) {
              popupContent.innerHTML = renderPopupContent(popupChild.props.children)
            }
            
            marker.bindPopup(popupContent)
          }
          
          // Ajouter l'événement click
          if (child.props.eventHandlers && child.props.eventHandlers.click) {
            marker.on('click', child.props.eventHandlers.click)
          }
          
          markerClusterGroup.addLayer(marker)
        }
      })
    }

    // Cleanup
    return () => {
      map.removeLayer(markerClusterGroup)
    }
  }, [map, children])

  return null
}

// Fonction helper pour rendre le contenu du popup
function renderPopupContent(content) {
  if (typeof content === 'string') {
    return content
  }
  
  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === 'string') {
        return item
      }
      if (item && item.props) {
        if (item.type === 'strong') {
          return `<strong style="color: #F6AA1C">${item.props.children}</strong>`
        }
        if (item.type === 'p') {
          return `<p style="margin: 5px 0; font-size: 0.9em">${item.props.children}</p>`
        }
        if (item.type === 'button') {
          return `<button style="margin-top: 8px; padding: 5px 12px; background: #F6AA1C; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px">${item.props.children}</button>`
        }
      }
      return ''
    }).join('')
  }
  
  return ''
}

export default MarkerClusterGroup
