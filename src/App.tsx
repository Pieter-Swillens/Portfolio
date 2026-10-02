import './styles/global.css'
import './styles/tokens.css'

import { profile } from '@/content/profile'
import { Hero } from '@/sections/hero/Hero'
import { useIsMobile } from "@/hooks/useIsMobile.ts";

export default function App() {
  const isMobile = useIsMobile();

  const particlesConfig = isMobile
    ? { quantity: 120, connectionDistance: 40 }
    : { quantity: 500, connectionDistance: 50 }

  return (
    <main>
      <Hero profile={ profile } particlesConfig={ particlesConfig } />
    </main>
  )
}
