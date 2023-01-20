import './index.css'

import { createRoot } from 'react-dom/client'

import App from './App'

// eslint-disable-next-line no-undef
const container = document.getElementById('root')
const root = createRoot(container)

root.render(<App />)
