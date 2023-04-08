import { useRef } from 'react'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Layer from 'components/Controls/Layers/Layer'

import { useMapContext } from 'contexts/Map'

const demandsLayer = new VectorLayer({
  source: new VectorSource(),
  properties: {
    id: 'demands',
    name: 'Demands',
    group: 'base-layers',
  },
})

const DemandsLayer = ({ demands }) => {
  const layerRef = useRef(demandsLayer)

  const { hiddenLayers } = useMapContext()

  return (
    <Layer ref={layerRef} geoJSON={demands} hidden={!!hiddenLayers.demands} />
  )
}

export default DemandsLayer
