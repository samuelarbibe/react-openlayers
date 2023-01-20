import { useEffect, useState } from 'react'

const trashIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
)

const pencilIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
  </svg>
)

const LayerListItem = ({ layer, onDelete, onEdit }) => {
  const [, setRevision] = useState(layer.getRevision())

  useEffect(() => {
    const handleOnChange = () => {
      setRevision((prev) => prev + 1)
    }

    layer.on('propertychange', handleOnChange)

    return () => {
      layer.un('propertychange', handleOnChange)
    }
  }, [layer, setRevision])

  const handleOnToggleLayerVisibility = () => {
    layer.setVisible(!layer.getVisible())
  }

  const handleOnClickEdit = (e) => {
    e.stopPropagation()
    onEdit()
  }

  const handleOnClickDelete = (e) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <div
      onClick={handleOnToggleLayerVisibility}
      className="group flex flex-row items-center hover:bg-slate-100 p-2 rounded-md pointer-events-auto cursor-pointer"
    >
      <input
        type="checkbox"
        id="demands"
        name="demands"
        className="form-checkbox rounded mx-2"
        checked={layer.getVisible()}
        onChange={() => {}}
      />
      <span className="text-base">{layer.get('name') || '-'}</span>
      <div className="flex-1" />
      <div className="flex flex-row gap-1">
        {layer.get('isEditable') && (
          <button
            onClick={handleOnClickEdit}
            className="opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-slate-700"
          >
            {pencilIcon}
          </button>
        )}
        {layer.get('isDeletable') && (
          <button
            onClick={handleOnClickDelete}
            className="opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-slate-700"
          >
            {trashIcon}
          </button>
        )}
      </div>
    </div>
  )
}

export default LayerListItem
