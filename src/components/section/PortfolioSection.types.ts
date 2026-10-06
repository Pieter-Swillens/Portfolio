import { ReactNode } from "react";

export type SectionHeaderInfo = {
  title: string,
  intro: string
}

export type PortfolioSectionProps = {
  anchorId: string,
  sectionHeaderInfo: SectionHeaderInfo,
  children: ReactNode,
  onIntroInView?: (inView: boolean) => void
}