export type SkillCategory = 'core' | 'architecture' | 'practice' | 'workflow' | 'tech'

/** `core` is the centre of the web: it opens a card, but you cannot filter on it. */
export type FilterableSkillCategory = Exclude<SkillCategory, 'core'>
export type SkillCategoryFilter = 'all' | FilterableSkillCategory

export type Skill = {
  label: string
  category: SkillCategory
  categoryLabel: string
  description: string
}

export type SkillRelation = {
  from: string
  to: string
}

export const featuredSkill = 'engineering'

/** The one place where category names are written down. */
const categoryLabels: Record<SkillCategory, string> = {
  core: 'Core',
  architecture: 'Architecture',
  practice: 'Practice',
  workflow: 'Way of working',
  tech: 'Technology',
}

type SkillDefinition = Omit<Skill, 'categoryLabel'>

const definitions = {
  engineering: {
    label: 'Software Engineering',
    category: 'core',
    description: 'The craft that ties everything here together: building software that stays easy to change. Architecture shapes it, practices protect it, and ways of working keep the team moving.',
  },
  ddd: {
    label: 'Domain-Driven Design',
    category: 'architecture',
    description: 'Modelling software around the business domain, with bounded contexts, aggregates, entities, value objects and domain events. Keeps the code and the language of the business aligned.',
  },
  clean: {
    label: 'Clean Architecture',
    category: 'architecture',
    description: 'Concentric layers (entities, use cases, interface adapters, frameworks) where every dependency points inward. Business rules stay independent of frameworks, databases and UI.',
  },
  hexagonal: {
    label: 'Hexagonal Architecture',
    category: 'architecture',
    description: 'Ports & Adapters: the application core talks to the outside world only through ports, while databases, UIs and external APIs plug in as interchangeable adapters.',
  },
  'event-sourcing': {
    label: 'Event Sourcing',
    category: 'architecture',
    description: 'Storing state as an append-only log of domain events instead of the current snapshot. Gives a full audit trail, point-in-time queries and the ability to rebuild projections.',
  },
  tdd: {
    label: 'Test-Driven Development',
    category: 'practice',
    description: 'Red, green, refactor: write a failing test, make it pass with the simplest code, then clean up. The tests drive the design and leave a safety net behind.',
  },
  solid: {
    label: 'SOLID Principles',
    category: 'practice',
    description: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Five principles for object-oriented code that is easy to change and extend.',
  },
  testing: {
    label: 'Testing',
    category: 'practice',
    description: 'Unit, integration, end-to-end and contract tests, each used where it gives the fastest and most reliable signal. Catches regressions, documents behaviour and makes refactoring safe.',
  },
  refactoring: {
    label: 'Refactoring',
    category: 'practice',
    description: 'Improving the structure of code without changing its behaviour. Keeps technical debt in check and makes the next change cheaper and safer.',
  },
  xp: {
    label: 'Extreme Programming',
    category: 'workflow',
    description: 'Agile methodology built on technical excellence: continuous integration, small releases, collective ownership, pair programming, test-first development and constant refactoring.',
  },
  ensemble: {
    label: 'Ensemble Programming',
    category: 'workflow',
    description: 'Mob programming: the whole team works on the same task at one keyboard, rotating the driver. Takes pairing a step further, with shared context, shared decisions and shared ownership.',
  },
  'small-steps': {
    label: 'Small Steps',
    category: 'workflow',
    description: 'Tiny, safe increments. Every change is small enough to understand, review and revert, so progress never depends on a big-bang merge.',
  },
  feedback: {
    label: 'Fast Feedback',
    category: 'workflow',
    description: 'Short loops between idea, code and production. Tests, CI, code review and pairing all exist to find out sooner whether we are on the right track.',
  },
  ownership: {
    label: 'Collective Ownership',
    category: 'workflow',
    description: 'Nobody’s code, everybody’s code. Anyone on the team may improve any part of the system, which keeps knowledge shared and quality high.',
  },
  ci: {
    label: 'Continuous Integration',
    category: 'workflow',
    description: 'Integrating into the main branch many times a day, with a green build as the team’s shared heartbeat. Small, frequent merges surface problems within minutes instead of weeks.',
  },
  spring: {
    label: 'Spring Framework',
    category: 'tech',
    description: 'The JVM application framework for dependency injection, web, data access and security. Widely used for backend services in Java and Kotlin.',
  },
  kotlin: {
    label: 'Kotlin',
    category: 'tech',
    description: 'Concise, modern JVM language with null safety in the type system, extension functions, coroutines and seamless Java interop. First-class support in Spring.',
  },
} satisfies Record<string, SkillDefinition>

type SkillKey = keyof typeof definitions

export const skills: Record<string, Skill> = Object.fromEntries(
  Object.entries(definitions).map(([key, definition]) => [
    key,
    { ...definition, categoryLabel: categoryLabels[definition.category] },
  ]),
)

/** Typed on purpose: a typo in a skill key is a compile error instead of a silently missing line. */
const link = (from: SkillKey, to: SkillKey): SkillRelation => ({ from, to })

export const relations: SkillRelation[] = [
  // The core fans out to the main disciplines
  link('engineering', 'ddd'),
  link('engineering', 'clean'),
  link('engineering', 'hexagonal'),
  link('engineering', 'tdd'),
  link('engineering', 'solid'),
  link('engineering', 'xp'),
  link('engineering', 'testing'),
  link('engineering', 'refactoring'),

  // Architecture and design
  link('ddd', 'event-sourcing'),
  link('ddd', 'hexagonal'),
  link('clean', 'hexagonal'),
  link('clean', 'solid'),
  link('solid', 'refactoring'),

  // Testing and refactoring
  link('tdd', 'testing'),
  link('tdd', 'refactoring'),
  link('tdd', 'feedback'),

  // Extreme Programming and the habits around it
  link('xp', 'tdd'),
  link('xp', 'refactoring'),
  link('xp', 'ensemble'),
  link('xp', 'small-steps'),
  link('xp', 'feedback'),
  link('xp', 'ownership'),
  link('xp', 'ci'),
  link('ensemble', 'ownership'),
  link('ensemble', 'feedback'),
  link('small-steps', 'refactoring'),
  link('ci', 'testing'),
  link('ci', 'small-steps'),
  link('ci', 'feedback'),

  // Technology
  link('spring', 'clean'),
  link('spring', 'hexagonal'),
  link('kotlin', 'spring'),
]

export const skillCategories: Record<SkillCategoryFilter, { label: string }> = {
  all: { label: 'All' },
  architecture: { label: categoryLabels.architecture },
  practice: { label: categoryLabels.practice },
  workflow: { label: categoryLabels.workflow },
  tech: { label: categoryLabels.tech },
}
