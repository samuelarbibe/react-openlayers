import { createContext, useContext } from 'react'

const CustomLayersContext = createContext()

export const CustomLayersProvider = ({ children, value }) => {
  return (
    <CustomLayersContext.Provider value={value}>
      {children}
    </CustomLayersContext.Provider>
  )
}

export const useCustomLayersContext = () => {
  const customLayersContext = useContext(CustomLayersContext)

  if (!customLayersContext) {
    throw new Error(
      'useCustomLayersContext must be used under a CustomLayersProvider'
    )
  }

  return customLayersContext
}
