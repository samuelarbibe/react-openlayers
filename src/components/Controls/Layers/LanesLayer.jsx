import { useRef } from 'react'

import { Stroke, Style } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Layer from 'components/Controls/Layers/Layer'

import { useMapContext } from 'contexts/Map'

const lanesLayer = new VectorLayer({
  source: new VectorSource(),
  properties: {
    id: 'lanes',
    name: 'Lanes',
    group: 'base-layers',
  },
  style: new Style({
    stroke: new Stroke({
      color: '#FF0000',
      width: 3
    })
  })
})

const LanesLayer = ({ lanes }) => {
  const layerRef = useRef(lanesLayer)

  const { hiddenLayers } = useMapContext()

  return (
    <Layer ref={layerRef} geoJSON={lanes} hidden={!!hiddenLayers.lanes} />
  )
}

export default LanesLayer
