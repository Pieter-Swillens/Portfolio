import avatarImg from '@/assets/avatar.webp'

export type Profile = {
  name: string
  role: string
  avatar: string
}

export const profile: Profile = {
  name: 'Pieter Swillens',
  role: 'Backend Developer',
  avatar: avatarImg,
}
