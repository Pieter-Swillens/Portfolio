import { useMemo } from 'react'
import './styles/global.css'
import './styles/tokens.css'

import { profile } from '@/content/profile'
import { featuredSkill, relations, skillCategories, skills } from '@/content/skills'
import { Hero } from '@/sections/hero/Hero'
import { Skills } from '@/sections/skills/Skills'
import { useIsMobile } from "@/hooks/useIsMobile.ts";

export default function App() {
  const isMobile = useIsMobile();

  const particlesConfig = useMemo(() => isMobile
    ? { quantity: 120, connectionDistance: 40 }
    : { quantity: 500, connectionDistance: 50 }, [isMobile])

  return (
    <main>
      <Hero profile={ profile } particlesConfig={ particlesConfig } />
      <Skills
        skills={ skills }
        relations={ relations }
        categories={ skillCategories }
        featuredSkillKey={ featuredSkill }
      />
    </main>
  )
}
