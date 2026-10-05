import { useInView } from '@/hooks/useInView.ts'
import type { Project } from '@/content/projects.ts'
import { ArrowUpRightIcon } from '@/components/icons/ArrowUpRightIcon.tsx'
import { GithubIcon } from '@/components/icons/GithubIcon.tsx'
import { TagList } from '@/components/tags/TagList.tsx'
import styles from './ProjectRow.module.css'

type ProjectRowProps = {
  project: Project
  number: string
}

export function ProjectRow({ project, number }: ProjectRowProps) {
  const [ref, isInView] = useInView<HTMLElement>({ rootMargin: '0px 0px -10% 0px' })
  const href = project.repoUrl ?? project.liveUrl
  const label = project.repoUrl ? 'Source' : 'View live'

  return (
    <article ref={ ref } className={ styles.row } data-revealed={ isInView } aria-labelledby={ `project-${project.id}` }>
      <span className={ styles.number } aria-hidden="true">{ number }</span>

      <div className={ styles.main }>
        <h3 id={ `project-${project.id}` } className={ styles.title }>{ project.title }</h3>
        <p className={ styles.kind }>{ project.kind }</p>
      </div>

      <div className={ styles.text }>
        <p className={ styles.summary }>{ project.summary }</p>
        <TagList tags={ project.features } label="Features" />
      </div>

      { href && (
        <a className={ styles.link } href={ href } target="_blank" rel="noopener noreferrer">
          { project.repoUrl ? <GithubIcon className={ styles.icon } /> : null }
          { label }
          <ArrowUpRightIcon className={ styles.icon } />
        </a>
      ) }
    </article>
  )
}
