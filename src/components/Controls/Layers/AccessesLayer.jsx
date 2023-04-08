import { useRef } from 'react'

import { Stroke, Style } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Layer from 'components/Controls/Layers/Layer'

import { useMapContext } from 'contexts/Map'

const accessesLayer = new VectorLayer({
  source: new VectorSource(),
  properties: {
    id: 'accesses',
    name: 'Accesses',
    group: 'base-layers',
  },
  style: new Style({
    stroke: new Stroke({
      color: '#FFFF00',
      width: 3
    })
  })
})

const AccessesLayer = ({ accesses }) => {
  const layerRef = useRef(accessesLayer)

  const { hiddenLayers } = useMapContext()

  return (
    <Layer ref={layerRef} geoJSON={accesses} hidden={!!hiddenLayers.accesses} />
  )
}

export default AccessesLayer
