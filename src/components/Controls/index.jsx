const Controls = ({ children }) => {
  return (
    <div className="absolute top-0 left-0 p-2 flex flex-col justify-start items-stretch gap-2 font-mono pointer-events-auto">
      {children}
    </div>
  )
}

export default Controls
