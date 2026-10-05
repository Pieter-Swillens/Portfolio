import styles from './Hero.module.css'
import { Particles } from "@/components/particles/Particles.tsx";
import { HeroProps } from "@/sections/hero/Hero.types.ts";


export function Hero({ profile, particlesConfig, sectionId }: HeroProps) {
  return (
    <section id={ sectionId } className={ styles.hero }>
      <Particles
        color="var(--color-text)"
        quantity={ particlesConfig.quantity }
        size={ 1 }
        connected={ true }
        connectionDistance={ particlesConfig.connectionDistance }
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