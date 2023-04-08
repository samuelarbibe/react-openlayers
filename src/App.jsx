import { useState, useEffect } from 'react'

import * as turf from '@turf/turf'

import Map from 'components/Map'
import Layers from 'components/Controls/Layers'
import Controls from 'components/Controls'
import OSMLayer from 'components/Controls/Layers/OSMLayer'
import { DrawingProvider } from 'contexts/Drawing'
import DemandsLayer from 'components/Controls/Layers/DemandsLayer'
import MenuControl from 'components/Controls/MenuControl'
import CustomLayers from 'components/Controls/Layers/CustomLayers'
import DrawingLayer from 'components/Controls/Layers/DrawingLayer'
import LanesLayer from 'components/Controls/Layers/LanesLayer'
import AccessesLayer from 'components/Controls/Layers/AccessesLayer'
import calculatePossibleAccesses from 'utils/accsses'

import sensors from './utils/sensors.json'

const LANE_BBOX = [
  34.69236003680426,
  31.93993358523032,
  34.85306033860791,
  32.05682879717419
]


const DEMAND_BBOX = [
  34.77003379878254,
  32.01297519343963,
  34.775582706778614,
  32.01783842602717
]


const MIN_LANE_LENGTH = 20
const MAX_LANE_LENGTH = 40

const MIN_BEARING_ANGLE = -180
const MAX_BEARING_ANGLE = 180

const generateRandomLanes = (count) => {
  const generate = () => {
    const { features: [position1] } = turf.randomPoint(1, { bbox: LANE_BBOX })
    const randomDistance = Math.random() * (MAX_LANE_LENGTH - MIN_LANE_LENGTH) + MIN_LANE_LENGTH
    const randomBearing = Math.random() * (MAX_BEARING_ANGLE - MIN_BEARING_ANGLE) + MIN_BEARING_ANGLE

    const position2 = turf.destination(position1, randomDistance, randomBearing)

    return turf.lineString([turf.getCoord(position1), turf.getCoord(position2)])
  }

  return turf.featureCollection(Array(count).fill(null).map(generate))
}

const generateRandomDemands = (count) => {
  return turf.randomPolygon(count,
    {
      num_vertices: 4,
      bbox: DEMAND_BBOX,
      max_radial_length: 0.007
    })
}

const App = () => {
  const [accesses, setAccesses] = useState(null)

  const [demands] = useState(() => generateRandomDemands(1))
  const [lanes] = useState(() => generateRandomLanes(1))

  useEffect(() => {
    const load = () => {
      const results = lanes.features.reduce(
        (acc, lane) => {
          const laneAccesses = calculatePossibleAccesses(lane, sensors[0], {
            target: demands.features[0],
            gsd: 0.7
          })

          acc.push(...laneAccesses)
          return acc
        }, [])

      setAccesses(turf.featureCollection(results))
    }

    load()
  }, [])

  return (
    // <DrawingProvider>
    <Map>
      <Layers>
        <OSMLayer />
        <DemandsLayer demands={demands} />
        <LanesLayer lanes={lanes} />
        <AccessesLayer accesses={accesses} />
        {/* <DrawingLayer /> */}
      </Layers>
      {/* <CustomLayers> */}
      {/* <Controls> */}
      {/* <MenuControl /> */}
      {/* </Controls> */}
      {/* </CustomLayers> */}
    </Map>
    // </DrawingProvider>
  )
}

export default App
