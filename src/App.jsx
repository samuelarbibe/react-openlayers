import Map from 'components/Map'
import Layers from 'components/Controls/Layers'
import Controls from 'components/Controls'
import OSMLayer from 'components/Controls/Layers/OSMLayer'
import { DrawingProvider } from 'contexts/Drawing'
import DemandsLayer from 'components/Controls/Layers/DemandsLayer'
import MenuControl from 'components/Controls/MenuControl'
import CustomLayers from 'components/Controls/Layers/CustomLayers'
import DrawingLayer from 'components/Controls/Layers/DrawingLayer'

const App = () => {
  return (
    <DrawingProvider>
      <Map>
        <Layers>
          <OSMLayer />
          <DemandsLayer />
          <DrawingLayer />
        </Layers>
        <CustomLayers>
          <Controls>
            <MenuControl />
          </Controls>
        </CustomLayers>
      </Map>
    </DrawingProvider>
  )
}

export default App
