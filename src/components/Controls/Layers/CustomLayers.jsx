import { useState } from 'react'

import CustomLayer from 'components/Controls/Layers/CustomLayer'

import { CustomLayersProvider } from 'contexts/CustomLayers'

const CustomLayers = ({ children }) => {
  const [data, setData] = useState({})
  const [properties, setProperties] = useState({})

  return (
    <CustomLayersProvider value={{ data, setData, properties, setProperties }}>
      {Object.keys(data).map((layerId) => (
        <CustomLayer
          key={layerId}
          properties={{
            id: layerId,
            name: layerId.slice(0, 1).toUpperCase() + layerId.slice(1),
            ...properties[layerId],
          }}
          geoJSON={data[layerId]}
        />
      ))}
      {children}
    </CustomLayersProvider>
  )
}

export default CustomLayers
