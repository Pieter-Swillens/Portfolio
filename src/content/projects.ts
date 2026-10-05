import spendiCover from '@/assets/thumbnail_spendi.webp'
import courseCraftCover from '@/assets/thumbnail_courseCraft.webp'

export type Project = {
  id: string
  title: string
  kind: string
  summary: string
  features: readonly string[]
  stack?: readonly string[]
  cover?: { src: string; alt: string }
  liveUrl?: string
  repoUrl?: string
}

export const projects: readonly Project[] = [
  {
    id: 'spendi',
    title: 'Spendi',
    kind: 'Personal finance',
    summary:
      'One monthly overview of income, expenses and savings. Budgets keep spending in check, reports let you look back.',
    features: ['Monthly overview', 'Budgets', 'Savings goals', 'Reports'],
    cover: {
      src: spendiCover,
      alt: 'Spendi dashboard with income, expenses, savings and a budget focus panel',
    },
    liveUrl: 'https://spendi-three.vercel.app/',
  },
  {
    id: 'coursecraft',
    title: 'CourseCraft',
    kind: 'Course authoring',
    summary:
      'Write course material in Markdown with custom blocks, watch the paginated result update live, and export separate student and teacher PDFs.',
    features: ['Markdown editor', 'Live preview', 'Custom blocks', 'PDF export'],
    cover: {
      src: courseCraftCover,
      alt: 'CourseCraft editor with Markdown on the left and a paginated preview on the right',
    },
    liveUrl: 'https://course-craft-dun.vercel.app/',
  },
  {
    id: 'gilded-rose',
    title: 'Gilded Rose',
    kind: 'Refactoring kata',
    summary:
      'The classic refactoring kata, tackled at the start of my career: put a tangled legacy codebase under test, then restructure it safely.',
    features: ['Legacy code', 'Characterisation tests', 'Refactoring'],
    repoUrl: 'https://github.com/PieterSwillens/Gilded-Rose-Kata',
  },
  {
    id: 'portfolio',
    title: 'This portfolio',
    kind: 'Personal website',
    summary:
      'The site you are looking at: a React and TypeScript single page with CSS Modules, a canvas skills graph and a documented architecture.',
    features: ['React', 'TypeScript', 'CSS Modules', 'Canvas'],
    repoUrl: 'https://github.com/Pieter-Swillens/portfolio',
  },
]
