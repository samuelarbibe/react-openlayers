import { useEffect, useRef, useState } from 'react'

import 'ol/ol.css'
import { fromLonLat } from 'ol/proj'
import * as ol from 'ol'

import { MapProvider } from 'contexts/Map'

const center = fromLonLat([34.8068, 32.0773]);

const Map = ({ children }) => {
  const hoveredFeatureRef = useRef()

  const mapContainer = useRef()
  const [map, setMap] = useState()

  const [hiddenLayers, setHiddenLayers] = useState({})

  useEffect(() => {
    if (map) return

    const newMap = new ol.Map({
      view: new ol.View({
        center,
        zoom: 10,
      }),
      target: mapContainer.current,
      controls: [],
    })

    setMap(newMap)
  }, [map])

  useEffect(() => {
    if (!map) return

    const handler = (e) => {
      if (hoveredFeatureRef.current) {
        hoveredFeatureRef.current.set('hovered', false)
        hoveredFeatureRef.current = null
      }

      map.forEachFeatureAtPixel(e.pixel, function (feature) {
        feature.set('hovered', true)
        hoveredFeatureRef.current = feature
        return true
      });
    }

    map.on('pointermove', handler)

    return () => {
      map.un('pointermove', handler)
    }
  }, [map])

  return (
    <MapProvider
      value={{
        map,
        hiddenLayers,
        setHiddenLayers,
      }}
    >
      <div className={'map'} ref={mapContainer} />
      {children}
    </MapProvider>
  )
}

export default Map
