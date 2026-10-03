import { memo, useCallback } from 'react'
import type { SkillCategoryFilter } from '@/content/skills.ts'
import styles from './CategoryFilter.module.css'

type CategoryFilterProps = {
  categories: Readonly<Record<SkillCategoryFilter, { label: string }>>
  activeCategory: SkillCategoryFilter
  isRevealed: boolean
  onChange: (category: SkillCategoryFilter) => void
}

export function CategoryFilter({ categories, activeCategory, isRevealed, onChange }: CategoryFilterProps) {
  return (
    <fieldset className={ styles.filter } data-revealed={ isRevealed } aria-label="Filter skills by category">
      { (Object.keys(categories) as SkillCategoryFilter[]).map(category => (
        <CategoryButton
          key={ category }
          category={ category }
          label={ categories[category].label }
          isActive={ category === activeCategory }
          onClick={ onChange }
        />
      )) }
    </fieldset>
  )
}

type CategoryButtonProps = {
  category: SkillCategoryFilter
  label: string
  isActive: boolean
  onClick: (category: SkillCategoryFilter) => void
}

const CategoryButton = memo(function CategoryButton({ category, label, isActive, onClick }: CategoryButtonProps) {
  const handleClick = useCallback(() => onClick(category), [category, onClick])

  return (
    <button
      type="button"
      className={ styles.button }
      data-category={ category }
      aria-pressed={ isActive }
      onClick={ handleClick }
    >
      { label }
    </button>
  )
})
