import darkThemeLogo from '@/assets/logo/ps-logo-dark-theme-1024.webp'
import lightThemeLogo from '@/assets/logo/ps-logo-light-theme-1024.webp'
import styles from './Navigation.module.css'
import { useActiveSection } from '@/hooks/useActiveSection.ts'
import { useScrolled } from '@/hooks/useScrolled.ts'
import { useMemo } from 'react'
import { NavLink, sectionIds } from "@/content/navigation.ts";

interface NavigationProps {
  links: readonly NavLink[]
}

export function Navigation({ links }: NavigationProps) {
  const isScrolled = useScrolled()
  const anchors = useMemo(() => links.map(it => it.anchor), [links])
  const activeAnchor = useActiveSection(anchors)

  return (
    <header className={ styles.nav_container } data-scrolled={ isScrolled }>
      <a className={ styles.logo_container } href={ `#${ sectionIds.top }` } aria-label="Back to top">
        <picture>
          <source srcSet={ lightThemeLogo } media="(prefers-color-scheme: light)"/>
          <img src={ darkThemeLogo } alt="" className={ styles.logo }/>
        </picture>
      </a>

      <nav className={ styles.links_container } aria-label="Primary">
        <ul className={ styles.links }>
          { links.map(({ anchor, label }) => (
            <li key={ anchor }>
              <a
                href={ `#${ anchor }` }
                className={ styles.link }
                aria-current={ anchor === activeAnchor ? 'location' : undefined }
              >
                { label }
              </a>
            </li>
          )) }
        </ul>
      </nav>
    </header>
  )
}
