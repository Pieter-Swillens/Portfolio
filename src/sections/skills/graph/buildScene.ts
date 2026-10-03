import { CENTRE_CATEGORY, EDGE, ENTRANCE } from './graph.config.ts'
import { randomBetween, TAU } from './canvasMath.ts'
import type { GraphEdge, GraphNode, GraphScene, SkillGraphData } from './graph.types.ts'

type Neighbours = Map<string, Set<string>>
type Random = () => number

/** Turns the skill content into the nodes and edges the graph simulates. */
export function buildScene({ skills, relations }: SkillGraphData, animated: boolean, random: Random = Math.random): GraphScene {
  const skillKeys = Object.keys(skills)
  const neighbours = buildNeighbours(skillKeys, relations)
  const hubKey = findHub(skills, skillKeys, neighbours)
  const levels = measureLevelsFromHub(hubKey, neighbours)

  const nodes = skillKeys.map((key, index): GraphNode => ({
    id: key,
    label: skills[key].label,
    category: skills[key].category,
    isHub: key === hubKey,
    degree: neighbours.get(key)?.size ?? 0,
    drift: createDrift(random),
    spawnDelay: key === hubKey ? ENTRANCE.hubDelay : spawnDelayFor(levels.get(key) ?? 1, index),

    width: 0, height: 0, textWidth: 0,
    x: 0, y: 0, vx: 0, vy: 0,
    appear: animated ? 0 : 1,
    dim: 0,
    highlight: 0,
  }))

  const nodesById = new Map(nodes.map(node => [node.id, node]))
  const hub = nodesById.get(hubKey)
  if (!hub) throw new Error('SkillGraph needs at least one skill')

  return { nodes, edges: buildEdges(relations, nodesById, random), hub, neighbours }
}

function buildNeighbours(skillKeys: string[], relations: SkillGraphData['relations']): Neighbours {
  const neighbours: Neighbours = new Map(skillKeys.map(key => [key, new Set()]))
  relations.forEach(({ from, to }) => {
    neighbours.get(from)?.add(to)
    neighbours.get(to)?.add(from)
  })
  return neighbours
}

/** The hub the web grows out of: the core skill, or the most connected one if there is none. */
function findHub(skills: SkillGraphData['skills'], skillKeys: string[], neighbours: Neighbours): string {
  const core = skillKeys.find(key => skills[key].category === CENTRE_CATEGORY)
  if (core) return core

  const degreeOf = (key: string) => neighbours.get(key)?.size ?? 0
  return skillKeys.reduce((best, key) => (degreeOf(key) > degreeOf(best) ? key : best), skillKeys[0] ?? '')
}

/** Breadth-first search: how many relations away from the hub is each skill? */
function measureLevelsFromHub(hubKey: string, neighbours: Neighbours): Map<string, number> {
  const levels = new Map([[hubKey, 0]])
  const queue = [hubKey]
  for (let key = queue.shift(); key !== undefined; key = queue.shift()) {
    const level = levels.get(key) ?? 0
    neighbours.get(key)?.forEach(neighbour => {
      if (levels.has(neighbour)) return
      levels.set(neighbour, level + 1)
      queue.push(neighbour)
    })
  }
  return levels
}

const spawnDelayFor = (level: number, index: number) =>
  ENTRANCE.firstLevelDelay + level * ENTRANCE.delayPerLevel + (index % 3) * ENTRANCE.jitterStep

const createDrift = (random: Random) => ({
  frequencyX: randomBetween(0.25, 0.6, random),
  frequencyY: randomBetween(0.2, 0.55, random),
  phaseX: random() * TAU,
  phaseY: random() * TAU,
})

function buildEdges(relations: SkillGraphData['relations'], nodesById: Map<string, GraphNode>, random: Random): GraphEdge[] {
  return relations.flatMap(({ from, to }, index) => {
    const fromNode = nodesById.get(from)
    const toNode = nodesById.get(to)
    if (!fromNode || !toNode) return []
    return [{
      from: fromNode,
      to: toNode,
      bend: (index % 2 ? 1 : -1) * EDGE.bend,
      seed: random(),
      highlight: 0,
    }]
  })
}
