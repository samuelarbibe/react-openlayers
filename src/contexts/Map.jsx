import { createContext, useContext } from 'react'

const MapContext = createContext()

export const MapProvider = ({ children, value }) => {
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export const useMapContext = () => {
  const mapContext = useContext(MapContext)

  if (!mapContext) {
    throw new Error('useMapContext must be used under a MapProvider')
  }

  return mapContext
}
