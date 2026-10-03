import { useCallback, useEffect, useRef, useState } from 'react'
import type { SkillCategoryFilter } from '@/content/skills.ts'
import { SkillGraph } from '../graph/SkillGraph.ts'
import type { SkillGraphData } from '../graph/graph.types.ts'

/**
 * Connects the canvas graph to React: creates and destroys it with the component,
 * and mirrors the state React needs to render around it (selection, filter, hint).
 */
export function useSkillGraph({ skills, relations }: SkillGraphData, isRevealed: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const graphRef = useRef<SkillGraph | null>(null)

  const [category, setCategory] = useState<SkillCategoryFilter>('all')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [isHintVisible, setHintVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const graph = SkillGraph.create(canvas, { skills, relations }, {
      onSelect: setSelectedKey,
      onInteract: () => setHintVisible(false),
    })
    if (!graph) return

    graphRef.current = graph
    graph.start()
    return () => {
      graph.destroy()
      graphRef.current = null
    }
  }, [skills, relations])

  // The entrance plays once, as soon as the graph is revealed
  useEffect(() => {
    if (isRevealed) graphRef.current?.enter()
  }, [isRevealed, skills, relations])

  // Escape clears the selection
  useEffect(() => {
    if (!selectedKey) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') graphRef.current?.selectNode(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedKey])

  const filterByCategory = useCallback((next: SkillCategoryFilter) => {
    setCategory(next)
    graphRef.current?.setCategory(next)
  }, [])

  const selectSkill = useCallback((skillKey: string) => {
    graphRef.current?.selectNode(skillKey)
    setHintVisible(false)
  }, [])

  const clearSelection = useCallback(() => graphRef.current?.selectNode(null), [])
  const hoverSkill = useCallback((skillKey: string | null) => graphRef.current?.hoverNode(skillKey), [])

  return { canvasRef, category, selectedKey, isHintVisible, filterByCategory, selectSkill, clearSelection, hoverSkill }
}
