import { useInView } from '@/hooks/useInView.ts'
import type { Project } from '@/content/projects.ts'
import { ArrowUpRightIcon } from '@/components/icons/ArrowUpRightIcon.tsx'
import { GithubIcon } from '@/components/icons/GithubIcon.tsx'
import { TagList } from '@/components/tags/TagList.tsx'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: Project & { cover: NonNullable<Project['cover']> }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [ref, isInView] = useInView<HTMLElement>({ rootMargin: '0px 0px -15% 0px' })
  const hasLinks = Boolean(project.liveUrl || project.repoUrl)

  return (
    <article ref={ ref } className={ styles.card } data-revealed={ isInView } aria-labelledby={ `project-${project.id}` }>
      <div className={ styles.frame }>
        <div className={ styles.chrome } aria-hidden="true">
          <span /><span /><span />
        </div>
        <img
          className={ styles.cover }
          src={ project.cover.src }
          alt={ project.cover.alt }
          width={ 1600 }
          height={ 863 }
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={ styles.body }>
        <h3 id={ `project-${project.id}` } className={ styles.title }>{ project.title }</h3>
        <p className={ styles.kind }>{ project.kind }</p>
        <p className={ styles.summary }>{ project.summary }</p>
        <TagList tags={ project.features } label="Features" />

        { hasLinks && (
          <div className={ styles.links }>
            { project.liveUrl && (
              <a className={ `${styles.link} ${styles.linkPrimary}` } href={ project.liveUrl }
                target="_blank" rel="noopener noreferrer">
                View live <ArrowUpRightIcon className={ styles.icon } />
              </a>
            ) }
            { project.repoUrl && (
              <a className={ styles.link } href={ project.repoUrl } target="_blank" rel="noopener noreferrer">
                <GithubIcon className={ styles.icon } /> Source
              </a>
            ) }
          </div>
        ) }
      </div>
    </article>
  )
}
