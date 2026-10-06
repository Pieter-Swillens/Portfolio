import { useInView } from "@/hooks/useInView.ts";
import { useEffect } from "react";
import styles from './PortfolioSection.module.css'
import { PortfolioSectionProps } from "@/components/section/PortfolioSection.types.ts";

export function PortfolioSection({
  anchorId,
  sectionHeaderInfo,
  children,
  onIntroInView,
}: PortfolioSectionProps) {
  const [introRef, isIntroInView] = useInView<HTMLElement>({ rootMargin: '0px 0px -12% 0px' })

  useEffect(() => {
    onIntroInView?.(isIntroInView)
  }, [isIntroInView, onIntroInView])

  const sectionId = `${ anchorId }-header`;

  return (
    <section
      id={ anchorId }
      className={ styles.container }
      aria-labelledby={ sectionId }
    >
      <header
        ref={ introRef }
        className={ styles.header }
        data-revealed={ isIntroInView }
      >
        <h2 id={ sectionId } className={ styles.title }>{ sectionHeaderInfo.title }</h2>
        <p className={ styles.intro }>{ sectionHeaderInfo.intro }</p>
      </header>
      { children }
    </section>
  )
}