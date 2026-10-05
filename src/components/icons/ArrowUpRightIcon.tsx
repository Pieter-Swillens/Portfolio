import { IconProps } from "@/components/icons/types.ts";

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg
      className={ className }
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}
