import { useEffect, useRef } from 'react'

import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import Layer from 'components/Controls/Layers/Layer'
import { useDrawingContext } from 'contexts/Drawing'
import { useMapContext } from 'contexts/Map'
import GeoJSON from 'ol/format/GeoJSON'
import { fromCircle } from 'ol/geom/Polygon'

const drawingLayer = new VectorLayer({
  source: new VectorSource(),
  properties: {
    id: 'drawing',
    name: 'Drawing',
    altitudeMode: 'clampToGround',
  },
})

const DrawingLayer = () => {
  const layerRef = useRef(drawingLayer)

  const { drawing, setDrawing, isDrawing, setIsDrawing, type } =
    useDrawingContext()

  const { map } = useMapContext()

  useEffect(() => {
    if (!map || !isDrawing) return

    const interaction = new Draw({
      source: layerRef.current.getSource(),
      type,
    })

    const handleOnDrawEnd = (e) => {
      const feature = e.feature
      const featureGeometry = feature.getGeometry()

      if (featureGeometry.getType() === 'Circle') {
        const polygonizedCircle = fromCircle(featureGeometry)
        feature.setGeometry(polygonizedCircle)
      }

      const drawing = new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      }).writeFeatureObject(feature)

      setDrawing(drawing)

      setIsDrawing(false)
    }

    interaction.on('drawend', handleOnDrawEnd)
    map.addInteraction(interaction)

    return () => {
      interaction.un('drawend', handleOnDrawEnd)
      map.removeInteraction(interaction)
    }
  }, [drawing, isDrawing, map, setDrawing, setIsDrawing, type])

  useEffect(() => {
    if (isDrawing) {
      layerRef.current.getSource().clear()
    }
    layerRef.current.setVisible(isDrawing)
  }, [isDrawing])

  return <Layer ref={layerRef} />
}

export default DrawingLayer
