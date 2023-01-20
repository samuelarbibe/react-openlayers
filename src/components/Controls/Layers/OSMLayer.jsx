import { useEffect, useRef } from 'react'

import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'

import { useMapContext } from 'contexts/Map'

const OSMSource = new XYZ({
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileSize: 256,
})

const layer = new TileLayer({
  source: OSMSource,
  properties: {
    id: 'osm',
    name: 'Open Street Map',
    group: 'base-layers',
  },
})

const OSMLayer = () => {
  const layerRef = useRef(layer)
  const { map } = useMapContext()

  useEffect(() => {
    if (!map) return

    const layer = layerRef.current

    map.addLayer(layer)

    return () => {
      map.removeLayer(layer)
    }
  }, [map])

  return null
}

export default OSMLayer
