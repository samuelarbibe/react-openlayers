import { useEffect, useState, useMemo } from 'react'
import produce from 'immer'
import gjv from 'geojson-validation'
import jsonFormat from 'json-format'
import classNames from 'classnames'

import { useMapContext } from 'contexts/Map'
import { useCustomLayersContext } from 'contexts/CustomLayers'

import LayerListItem from 'components/Controls/MenuControl/LayerListItem'
import { useDrawingContext } from 'contexts/Drawing'
import Drawing from 'components/Drawing'
import GeoJSON from 'ol/format/GeoJSON'

const validateJSON = (geoJSON) => {
  try {
    JSON.parse(geoJSON)
    return true
  } catch (error) {
    return false
  }
}

const menuIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 9h16.5m-16.5 6.75h16.5"
    />
  </svg>
)

const closeMenuIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

const addIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
)

const MenuControl = () => {
  const [isOpen, setIsOpen] = useState(true)

  const { map } = useMapContext()

  const [, setRevision] = useState()
  const { drawing } = useDrawingContext()
  const [tempName, setTempName] = useState('')
  const [tempGeoJSON, setTempGeoJSON] = useState('')

  const {
    setData: setCustomLayersData,
    properties: customLayersProperties,
    setProperties: setCustomLayersProperties,
  } = useCustomLayersContext()

  useEffect(() => {
    if (!drawing) return
    setTempGeoJSON(jsonFormat(drawing))
    setCustomLayersData(
      produce((draft) => {
        draft.temp = drawing
      })
    )
  }, [drawing, setCustomLayersData])

  useEffect(() => {
    setTempName(customLayersProperties?.temp?.name || '')
  }, [customLayersProperties?.temp?.name])

  const handleOnEditLayer = (layer) => () => {
    const id = layer.get('id')
    const name = layer.get('name')

    const geoJSON = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    }).writeFeaturesObject(layer.getSource().getFeatures())

    setCustomLayersData(
      produce((draft) => {
        draft.temp = geoJSON
      })
    )
    setCustomLayersProperties(
      produce((draft) => {
        draft.temp = {
          id: 'temp',
          originalId: id,
          name: name,
          isListed: false,
        }
      })
    )

    setTempName(name)
    setTempGeoJSON(jsonFormat(geoJSON))
  }

  const handleOnDeleteLayer = (layer) => () => {
    setCustomLayersData(
      produce((draft) => {
        delete draft[layer.getProperties().id]
      })
    )
  }

  const handleOnClickAddLayer = () => {
    setCustomLayersData((prev) => ({
      ...prev,
      temp: null,
    }))
    setCustomLayersProperties((prev) => ({
      ...prev,
      temp: {
        id: 'temp',
        isListed: false,
      },
    }))
  }

  const handleOnClickCancelAddLayer = () => {
    setCustomLayersData(
      produce((draft) => {
        delete draft.temp
      })
    )
    setCustomLayersProperties(
      produce((draft) => {
        delete draft.temp
      })
    )

    setTempName('')
    setTempGeoJSON('')
  }

  const handleOnClickSaveLayer = () => {
    const editedLayerId = customLayersProperties.temp?.originalId

    setCustomLayersData(
      produce((draft) => {
        draft[editedLayerId || tempName] = draft.temp
        delete draft.temp
      })
    )
    setCustomLayersProperties(
      produce((draft) => {
        draft[editedLayerId || tempName] = {
          id: editedLayerId || tempName.toLowerCase().split(' ').join('_'),
          name: tempName,
        }
        delete draft.temp
      })
    )

    setTempName('')
    setTempGeoJSON('')
  }

  const handleOnChangeTempLayerName = (e) => setTempName(e.target.value)

  const handleOnChangeTempLayerGeoJSON = (e) => {
    const newGeoJSON = e.target.value
    setTempGeoJSON(newGeoJSON)

    if (!newGeoJSON) {
      setCustomLayersData(
        produce((draft) => {
          draft.temp = null
        })
      )
    } else {
      const validGeoJSON = validateJSON(newGeoJSON)
      const isValid = validGeoJSON && gjv.valid(JSON.parse(newGeoJSON))

      if (!isValid) return

      setCustomLayersData(
        produce((draft) => {
          draft.temp = JSON.parse(newGeoJSON)
        })
      )
    }
  }

  const isTempLayerValid = useMemo(() => {
    return true
  }, [])

  useEffect(() => {
    if (!map) return

    setRevision(map.getRevision())

    const handleOnChange = () => {
      setRevision((prev) => prev + 1)
    }

    map.on('change', handleOnChange)

    return () => {
      map.un('change', handleOnChange)
    }
  }, [map])

  if (!map) return

  return (
    <div className="relative">
      <button
        className={classNames(
          'p-1 transition-all bg-neutral-50 hover:bg-neutral-200 border rounded-md border-slate-300'
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? closeMenuIcon : menuIcon}
      </button>
      {isOpen && (
        <div
          className={
            'absolute left-11 top-0 min-w-max transition-all p-4 bg-neutral-50 border rounded-md border-slate-300 flex flex-col gap-2'
          }
        >
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between items-center">
              <p className="text-base font-semibold mb-1">Default Layers</p>
            </div>
            <div className="flex flex-col">
              {map
                .getLayers()
                .getArray()
                .filter(
                  (layer) => layer.getProperties().group === 'base-layers'
                )
                .map((layer, index) => (
                  <LayerListItem
                    layer={layer}
                    key={index}
                    onEdit={handleOnEditLayer(layer)}
                    onDelete={handleOnDeleteLayer(layer)}
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between items-center">
              <p className="text-base font-semibold mb-1">Custom Layers</p>
            </div>
            <div className="flex flex-col">
              {map
                .getLayers()
                .getArray()
                .filter(
                  (layer) =>
                    layer.getProperties().group === 'custom-layers' &&
                    layer.getProperties().isListed
                )
                .map((layer, index) => (
                  <LayerListItem
                    layer={layer}
                    key={index}
                    onEdit={handleOnEditLayer(layer)}
                    onDelete={handleOnDeleteLayer(layer)}
                  />
                ))}

              {customLayersProperties.temp ? (
                <div className="flex flex-col border rounded-md border-slate-300 p-2 gap-2 mt-2">
                  <p>New Layer</p>
                  <input
                    type="text"
                    className="rounded p-1 border-slate-300"
                    placeholder="Layer name"
                    value={tempName}
                    onChange={handleOnChangeTempLayerName}
                  />
                  <textarea
                    rows="3"
                    placeholder="GeoJSON"
                    value={tempGeoJSON}
                    onChange={handleOnChangeTempLayerGeoJSON}
                    className="form-textarea rounded p-1 border-slate-300"
                  />
                  <Drawing />
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={handleOnClickCancelAddLayer}
                      className="transition-all border-2 hover:text-blue-500 rounded-md px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isTempLayerValid}
                      onClick={handleOnClickSaveLayer}
                      className="transition-all bg-blue-500 hover:bg-blue-400 rounded-md px-2 py-1 text-slate-100 disabled:bg-slate-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="flex flex-1 flex-row items-center hover:bg-slate-100 p-2 rounded-md"
                  onClick={handleOnClickAddLayer}
                >
                  <div className="mx-2">{addIcon}</div>

                  <p className="text-base">Add layer</p>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default MenuControl
