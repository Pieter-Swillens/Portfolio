import './styles/global.css'
import './styles/tokens.css'

import { profile } from '@/content/profile'
import { Hero } from '@/sections/hero/Hero'

export default function App() {
  return (
    <main>
      <Hero profile={ profile }/>
    </main>
  )
}
