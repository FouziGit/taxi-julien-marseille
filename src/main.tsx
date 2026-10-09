import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { Root } from './root'

const el = document.getElementById('root')!
// En production, dist/index.html est prérendu par scripts/prerender-home.tsx :
// on hydrate. En dev (index.html source, #root vide), on rend normalement.
if (el.hasChildNodes()) hydrateRoot(el, <Root />)
else createRoot(el).render(<Root />)
