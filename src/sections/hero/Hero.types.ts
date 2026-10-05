import { Profile } from "@/content/profile.ts";

export type ParticlesConfig = {
  quantity: number;
  connectionDistance: number;
}

export type HeroProps = {
  profile: Profile,
  particlesConfig: ParticlesConfig,
  sectionId: string
}