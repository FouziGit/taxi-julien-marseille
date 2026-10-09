import { StrictMode } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import App from './App'

/**
 * Arbre React racine, partagé par le client (src/main.tsx) et le prérendu
 * (scripts/prerender-home.tsx) pour garantir un HTML serveur identique à
 * l'arbre hydraté.
 *
 * LazyMotion + domAnimation retire ~20 KB gzip de fonctionnalités inutilisées ;
 * les composants utilisent `m.*` (pas `motion.*`). reducedMotion="user"
 * respecte prefers-reduced-motion.
 */
export function Root() {
  return (
    <StrictMode>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </LazyMotion>
    </StrictMode>
  )
}
