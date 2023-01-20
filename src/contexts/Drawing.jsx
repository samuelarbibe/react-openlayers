import { createContext, useContext, useState } from 'react'

const DrawingLayersContext = createContext()

export const DrawingProvider = ({ children }) => {
  const [type, setType] = useState()
  const [drawing, setDrawing] = useState()
  const [isDrawing, setIsDrawing] = useState(false)

  return (
    <DrawingLayersContext.Provider
      value={{ drawing, setDrawing, isDrawing, setIsDrawing, type, setType }}
    >
      {children}
    </DrawingLayersContext.Provider>
  )
}

export const useDrawingContext = () => {
  const drawingLayersContext = useContext(DrawingLayersContext)

  if (!drawingLayersContext) {
    throw new Error('useDrawingContext must be used under a DrawingProvider')
  }

  return drawingLayersContext
}
