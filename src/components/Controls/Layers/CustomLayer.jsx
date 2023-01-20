import { useRef } from 'react'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Layer from 'components/Controls/Layers/Layer'

const CustomLayer = ({ geoJSON, properties }) => {
  const layerRef = useRef(
    new VectorLayer({
      source: new VectorSource(),
      properties: {
        group: 'custom-layers',
        isListed: true,
        isEditable: true,
        isDeletable: true,
      },
    })
  )

  return <Layer ref={layerRef} geoJSON={geoJSON} properties={properties} />
}

export default CustomLayer
