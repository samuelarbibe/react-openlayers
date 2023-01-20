import { useEffect, useRef, useState } from 'react'

import 'ol/ol.css'
import * as ol from 'ol'

import { MapProvider } from 'contexts/Map'

const Map = ({ children }) => {
  const mapContainer = useRef()
  const [map, setMap] = useState()

  const [hiddenLayers, setHiddenLayers] = useState({})

  useEffect(() => {
    if (map) return

    const newMap = new ol.Map({
      view: new ol.View({
        center: [30, 35],
        zoom: 4,
      }),
      target: mapContainer.current,
      controls: [],
    })

    setMap(newMap)
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
