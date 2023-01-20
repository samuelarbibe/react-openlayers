import { useEffect } from 'react'
import { useDrawingContext } from 'contexts/Drawing'

const GEOJSON_TYPE_OPTIONS = ['Polygon', 'Point', 'Circle']

const Drawing = () => {
  const { isDrawing, setIsDrawing, type, setType } = useDrawingContext()

  useEffect(() => {
    return () => {
      setIsDrawing(false)
    }
  }, [setIsDrawing])

  const handleOnClickDraw = () => {
    setIsDrawing(true)
    setType(GEOJSON_TYPE_OPTIONS[0])
  }

  return (
    <div className="flex gap-1">
      {isDrawing ? (
        <div className="flex flex-1 items-center">
          <span className="transition-all border-2 rounded-l-md px-2 py-1 bg-slate-100">
            Geomtery:
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 border-2 rounded-r-md border-l-0 bg-transparent border-slate-200 focus:border-slate-200 focus:ring-0 hover:bg-slate-100 hover:text-blue-500 px-2 py-1"
          >
            {GEOJSON_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button
          onClick={handleOnClickDraw}
          className="transition-all border-2 hover:text-blue-500 rounded-md px-2 py-1"
        >
          Draw on Map
        </button>
      )}
    </div>
  )
}

export default Drawing
