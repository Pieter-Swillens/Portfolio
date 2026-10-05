import styles from './TagList.module.css'

type TagListProps = {
  tags: readonly string[]
  label: string
}

export function TagList({ tags, label }: TagListProps) {
  return (
    <ul className={ styles.tags } aria-label={ label }>
      { tags.map((tag) => (
        <li key={ tag } className={ styles.tag }>{ tag }</li>
      )) }
    </ul>
  )
}
