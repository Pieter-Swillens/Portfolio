import styles from './Hero.module.css'
import { Profile } from "@/content/profile.ts";
import { Particles } from "@/components/particles/Particles.tsx";

type HeroProps = {
  profile: Profile
}

export function Hero({ profile }: HeroProps) {
  return (
    <section className={ styles.hero }>
      <Particles
        color="var(--color-text)"
        quantity={ 500 }
        size={ 1 }
        connected={ true }
        connectionDistance={ 50 }
      />
      <img src={ profile.avatar } alt={ profile.name } className={ styles.avatar }/>
      <h1 className={ styles.title }>{ profile.name }</h1>
      <p className={ styles.role }>{ profile.role }</p>
    </section>
  )
}