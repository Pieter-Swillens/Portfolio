export const sectionIds = {
  top: 'top',
  skills: 'skills',
  projects: 'projects',
} as const

export type NavLink = {
  anchor: string
  label: string
}

export const navLinks: readonly NavLink[] = [
  { anchor: sectionIds.skills, label: 'Skills' },
  { anchor: sectionIds.projects, label: 'Projects' },
]
