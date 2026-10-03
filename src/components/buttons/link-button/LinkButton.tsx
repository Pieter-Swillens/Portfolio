import styles from "./LinkButton.module.css"
import { memo } from "react";
import { Link } from "@/types/Link.ts";

type LinkButtonProps = {
  link: Link
  onSelect: (key: string) => void
}

export const LinkButton = memo(function LinkButton({ link, onSelect }: LinkButtonProps) {
  const handleClick = () => onSelect(link.key)

  return (
    <button
      className={ styles.link }
      onClick={ handleClick }
    >
      { link.label }
    </button>
  )
})
