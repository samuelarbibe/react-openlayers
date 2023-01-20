import { useEffect, forwardRef } from 'react'

import GeoJSON from 'ol/format/GeoJSON'

import { useMapContext } from 'contexts/Map'

const VectorLayer = ({ geoJSON, properties }, ref) => {
  const { map } = useMapContext()

  useEffect(() => {
    if (!map) return

    const layer = ref.current
    map.addLayer(layer)

    map.changed()

    return () => {
      map.removeLayer(layer)
      map.changed()
    }
  }, [map, ref])

  useEffect(() => {
    if (!properties) return

    ref.current.setProperties(properties)
  }, [properties, ref])

  useEffect(() => {
    ref.current.getSource().clear()
    if (!geoJSON) return

    const features = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    }).readFeatures(geoJSON)

    ref.current.getSource().addFeatures(features)
  }, [geoJSON, ref])

  return null
}

export default forwardRef(VectorLayer)
