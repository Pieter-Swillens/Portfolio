import styles from './styles/DetailCard.module.css'
import defaultStyles from './styles/DefaultDetailCard.module.css'

type DefaultDetailCardProps = {
  startLabel: string,
  onStart: () => void
}

export function DefaultDetailCard({
  startLabel,
  onStart
}: DefaultDetailCardProps) {
  return (
    <>
      <div className={ defaultStyles.spacer }></div>
      <h3 className={ styles.title }>Explore the web</h3>
      <p className={ styles.description }>
        Select a node to see what it means and how it connects to the rest of my work.
      </p>
      <button className={ defaultStyles.start } onClick={ onStart }>Start with { startLabel }</button>
    </>
  )
}