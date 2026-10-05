import { SectionHeader } from '@/components/section-header/SectionHeader.tsx'
import { useInView } from '@/hooks/useInView.ts'
import type { Project } from '@/content/projects.ts'
import { ProjectCard } from './ProjectCard.tsx'
import { ProjectRow } from './ProjectRow.tsx'
import styles from './Projects.module.css'

type ProjectsProps = {
  projects: readonly Project[],
  sectionId: string
}

type ProjectWithCover = Project & { cover: NonNullable<Project['cover']> }

const hasCover = (project: Project): project is ProjectWithCover => Boolean(project.cover)
const toNumber = (index: number) => String(index + 1).padStart(2, '0')

export function Projects({ projects, sectionId }: ProjectsProps) {
  const [introRef, isIntroInView] = useInView<HTMLElement>({ rootMargin: '0px 0px -12% 0px' })

  const featured = projects.filter(hasCover)
  const others = projects.filter((project) => !hasCover(project))

  return (
    <section id={ sectionId } className={ styles.projects } aria-labelledby="projects-heading">
      <SectionHeader
        ref={ introRef }
        id="projects-heading"
        title="Things I&rsquo;ve built"
        intro="A selection of projects, from the first idea to working software."
        isRevealed={ isIntroInView }
      />

      <ul className={ styles.cards }>
        { featured.map((project) => (
          <li key={ project.id } className={ styles.item }>
            <ProjectCard project={ project } />
          </li>
        )) }
      </ul>

      { others.length > 0 && (
        <div className={ styles.more }>
          <h3 className={ styles.moreTitle }>More projects</h3>
          <ul className={ styles.rows }>
            { others.map((project) => (
              <li key={ project.id }>
                <ProjectRow project={ project } number={ toNumber(projects.indexOf(project)) } />
              </li>
            )) }
          </ul>
        </div>
      ) }
    </section>
  )
}
