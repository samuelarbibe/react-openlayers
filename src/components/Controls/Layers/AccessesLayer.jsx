import { useRef } from 'react'
import chroma from 'chroma-js'

import { Stroke, Style } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Layer from 'components/Controls/Layers/Layer'

import { useMapContext } from 'contexts/Map'

const MAX_VALUE = 1.5
const MIN_VALUE = 0

const colorScale = chroma.scale(['blue', 'red']).domain([MIN_VALUE, MAX_VALUE])

const getColorByGSD = (gsd) => {
  return colorScale(gsd)
}

const accessesLayer = new VectorLayer({
  source: new VectorSource(),
  properties: {
    id: 'accesses',
    name: 'Accesses',
    group: 'base-layers',
  },
  style: (feature) => {
    return new Style({
      stroke: new Stroke({
        color: getColorByGSD(feature.getProperties().gsd),
        width: feature.get('hovered') ? 6 : 3
      })
    })
  }
})

const AccessesLayer = ({ accesses }) => {
  const layerRef = useRef(accessesLayer)

  const { hiddenLayers } = useMapContext()

  return (
    <Layer ref={layerRef} geoJSON={accesses} hidden={!!hiddenLayers.accesses} />
  )
}

export default AccessesLayer
