import type { Project } from '@/content/projects.ts'
import { ProjectCard } from './ProjectCard.tsx'
import { ProjectRow } from './ProjectRow.tsx'
import styles from './Projects.module.css'
import { PortfolioSection } from "@/components/section/PortfolioSection.tsx";

type ProjectsProps = {
  projects: readonly Project[],
  sectionId: string
}

type ProjectWithCover = Project & { cover: NonNullable<Project['cover']> }

const hasCover = (project: Project): project is ProjectWithCover => Boolean(project.cover)
const toNumber = (index: number) => String(index + 1).padStart(2, '0')

const sectionHeaderInfo = {
  title: "Things I've built",
  intro: "A selection of projects, from the first idea to working software."
}

export function Projects({ projects, sectionId }: ProjectsProps) {
  const featured = projects.filter(hasCover)
  const others = projects.filter((project) => !hasCover(project))

  return (
    <PortfolioSection anchorId={ sectionId } sectionHeaderInfo={ sectionHeaderInfo }>
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
    </PortfolioSection>
  )
}
