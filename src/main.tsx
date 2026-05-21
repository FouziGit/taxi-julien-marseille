import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* MotionConfig — `reducedMotion="user"` honors the OS-level
        prefers-reduced-motion media query for every motion.* component
        in the tree (skips transforms, opacity stays). a11y win. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
