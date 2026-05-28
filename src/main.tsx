import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* LazyMotion + domAnimation tree-shakes ~20KB gzipped of unused features.
     * Pair with `m.*` instead of `motion.*` in components — the lite renderer
     * only ships transform/opacity/style animations, which is everything we use. */}
    <LazyMotion features={domAnimation} strict>
      {/* reducedMotion="user" respects the OS-level prefers-reduced-motion. */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
)
