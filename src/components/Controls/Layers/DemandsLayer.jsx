import { useState, useRef } from 'react'
import * as turf from '@turf/turf'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Layer from 'components/Controls/Layers/Layer'

import { useMapContext } from 'contexts/Map'

const generateRandomPolygons = (count) =>
  turf.randomPolygon(count, { num_vertices: 8 })

const demandsLayer = new VectorLayer({
  source: new VectorSource(),
  properties: {
    id: 'demands',
    name: 'Demands',
    group: 'base-layers',
  },
})

const DemandsLayer = () => {
  const layerRef = useRef(demandsLayer)

  const { hiddenLayers } = useMapContext()

  const [demands] = useState(() => generateRandomPolygons(100))

  return (
    <Layer ref={layerRef} geoJSON={demands} hidden={!!hiddenLayers.demands} />
  )
}

export default DemandsLayer
