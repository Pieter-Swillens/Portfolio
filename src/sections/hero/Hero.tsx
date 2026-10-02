import styles from './Hero.module.css'
import { Profile } from "@/content/profile.ts";
import { Particles } from "@/components/particles/Particles.tsx";
import { useIsMobile } from "@/hooks/useIsMobile.ts";

type HeroProps = {
  profile: Profile
}

export function Hero({ profile }: HeroProps) {
  const isMobile = useIsMobile();

  return (
    <section className={ styles.hero }>
      <Particles
        color="var(--color-text)"
        quantity={ isMobile ? 120 : 500 }
        size={ 1 }
        connected={ true }
        connectionDistance={ isMobile ? 40 : 50 }
      />
      <div className={styles.avatar_container}>
        <img
          src={ profile.avatar }
          alt={ profile.name }
          className={ styles.avatar_container__avatar }
        />
      </div>

      <div className={ styles.content_container }>
        <span className={ styles.content_container__eyebrow }>
          PIETER SWILLENS | BACKEND
        </span>
        <h1 className={ styles.content_container__title }>
          <span>SOFTWARE</span> <span className={ styles.content_container__titleAccent }>DEV.</span>
        </h1>
        <div className={ styles.content_container__subtitle }>
          <span/> Building on principles, not shortcuts.
        </div>
      </div>
    </section>
  )
}