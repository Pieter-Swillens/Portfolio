import { ReactNode } from "react";

export type SectionId = {
  anchor: string;
  displayName: string;
}

export type Section = {
  id: SectionId;
  component: ReactNode;
}