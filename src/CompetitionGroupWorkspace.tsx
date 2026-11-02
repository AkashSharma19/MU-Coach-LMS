import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Award,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FolderPlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
  X
} from 'lucide-react'

type WorkspaceTab = 'criteria' | 'participants'
type SortKey = 'score' | 'rank'

interface WorkspaceGroup {
  id: string
  name: string
  house: string
  members: string[]
  points: number
}

interface WorkspaceAward {
  id: string
  recipient: string
  topic: string
  points: number
  description: string
  createdAt: string
}

interface Criterion {
  id: string
  title: string
  description: string
  maxPoints: number
}

interface ScoringCategory {
  id: string
  title: string
  description: string
  maxScore: number
  criteria: Criterion[]
}

interface StudentRecord {
  name: string
  email: string
  cohort: string
  scores: Record<string, number>
}

interface ParticipantRecord extends StudentRecord {
  rawScore: number
  score: number
  rank: number
}

interface CompetitionGroupWorkspaceProps {
  group: WorkspaceGroup
  competitionName: string
  awards?: WorkspaceAward[]
  onBack: () => void
  onMembersChange: (members: string[]) => void
  onAwardGroup: () => void
  onAwardParticipant: (student: string) => void
  onNotify: (message: string) => void
}

const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
const primaryButton = 'inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButton = 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'

const INITIAL_CATEGORIES: ScoringCategory[] = [
  {
    id: 'challenge-performance',
    title: 'Challenge performance',
    description: 'How effectively the participant solves and presents the competition challenge.',
    maxScore: 250,
    criteria: [
      { id: 'delivery-quality', title: 'Delivery quality', description: 'Completeness, execution quality and attention to detail.', maxPoints: 200 },
      { id: 'evidence-insight', title: 'Evidence & insight', description: 'Strength of research, analysis and supporting evidence.', maxPoints: 200 },
      { id: 'presentation', title: 'Presentation', description: 'Clarity, structure and confidence of the final presentation.', maxPoints: 100 }
    ]
  },
  {
    id: 'team-contribution',
    title: 'Team contribution',
    description: 'The participant’s contribution to team outcomes and culture.',
    maxScore: 150,
    criteria: [
      { id: 'collaboration', title: 'Collaboration', description: 'Constructive teamwork, reliability and shared ownership.', maxPoints: 80 },
      { id: 'leadership', title: 'Leadership', description: 'Initiative, decision-making and support for the team.', maxPoints: 70 },
      { id: 'peer-support', title: 'Peer support', description: 'Contribution to peer learning and team development.', maxPoints: 50 }
    ]
  }
]

const CRITERION_TEMPLATES = [
  { title: 'Innovation', description: 'Originality and practical value of the proposed solution.', maxPoints: 100 },
  { title: 'Audience impact', description: 'Ability to communicate a memorable and persuasive story.', maxPoints: 75 },
  { title: 'Milestone delivery', description: 'Consistency and timeliness across competition milestones.', maxPoints: 100 },
  { title: 'Community contribution', description: 'Positive contribution to the wider competition community.', maxPoints: 50 }
]

const STUDENT_CATALOG: StudentRecord[] = [
  { name: 'Aarav Mehta', email: 'aarav.mehta@mastersunion.org', cohort: 'PGP TBM · Cohort 7', scores: { 'delivery-quality': 200, 'evidence-insight': 200, presentation: 100, collaboration: 72, leadership: 65, 'peer-support': 44 } },
  { name: 'Diya Shah', email: 'diya.shah@mastersunion.org', cohort: 'PGP TBM · Cohort 7', scores: { 'delivery-quality': 148, 'evidence-insight': 136, presentation: 76, collaboration: 70, leadership: 58, 'peer-support': 42 } },
  { name: 'Kabir Rao', email: 'kabir.rao@mastersunion.org', cohort: 'PGP TBM · Cohort 8', scores: { 'delivery-quality': 112, 'evidence-insight': 124, presentation: 64, collaboration: 61, leadership: 55, 'peer-support': 38 } },
  { name: 'Myra Kapoor', email: 'myra.kapoor@mastersunion.org', cohort: 'PGP TBM · Cohort 8', scores: { 'delivery-quality': 96, 'evidence-insight': 88, presentation: 58, collaboration: 54, leadership: 49, 'peer-support': 41 } },
  { name: 'Aanya Bose', email: 'aanya.bose@mastersunion.org', cohort: 'PGP TBM · Cohort 7', scores: { 'delivery-quality': 132, 'evidence-insight': 150, presentation: 70, collaboration: 62, leadership: 60, 'peer-support': 45 } },
  { name: 'Arjun Nair', email: 'arjun.nair@mastersunion.org', cohort: 'PGP TBM · Cohort 8', scores: {} },
  { name: 'Ira Sethi', email: 'ira.sethi@mastersunion.org', cohort: 'PGP TBM · Cohort 7', scores: {} },
  { name: 'Rohan Jain', email: 'rohan.jain@mastersunion.org', cohort: 'PGP TBM · Cohort 8', scores: {} },
  { name: 'Riya Chawla', email: 'riya.chawla@mastersunion.org', cohort: 'PGP TBM · Cohort 7', scores: {} },
  { name: 'Dhruv Arora', email: 'dhruv.arora@mastersunion.org', cohort: 'PGP TBM · Cohort 7', scores: {} },
  { name: 'Naina Verma', email: 'naina.verma@mastersunion.org', cohort: 'PGP TBM · Cohort 8', scores: {} },
  { name: 'Atharv Joshi', email: 'atharv.joshi@mastersunion.org', cohort: 'PGP TBM · Cohort 8', scores: {} }
]

const studentFromName = (name: string): StudentRecord => STUDENT_CATALOG.find((student) => student.name === name) ?? {
  name,
  email: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')}@mastersunion.org`,
  cohort: 'PGP TBM · Cohort 7',
  scores: {}
}

function Overlay({ title, description, onClose, children, side = false }: { title: string; description: string; onClose: () => void; children: ReactNode; side?: boolean }) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(document.activeElement instanceof HTMLElement ? document.activeElement : null)

  useEffect(() => {
    const panel = panelRef.current
    const opener = openerRef.current
    if (!panel) return
    const selector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    panel.querySelector<HTMLElement>(selector)?.focus()
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(selector))
      if (!items.length) { event.preventDefault(); panel.focus(); return }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', trapFocus)
    return () => { document.removeEventListener('keydown', trapFocus); opener?.focus() }
  }, [])

  return (
    <div className={`fixed inset-0 z-[80] ${side ? 'overflow-hidden' : 'flex items-center justify-center overflow-y-auto p-4'}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="absolute inset-0 h-full w-full cursor-default bg-black/45 backdrop-blur-[1px]" aria-label={`Close ${title}`} onClick={onClose} />
      <div ref={panelRef} tabIndex={-1} className={side ? 'absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-gray-200 bg-white shadow-2xl outline-none' : 'relative my-auto w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl outline-none'}>
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
          <div><h2 id={titleId} className="text-base font-bold text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>
          <button type="button" onClick={onClose} aria-label={`Close ${title}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function CompetitionGroupWorkspace({ group, competitionName, awards = [], onBack, onMembersChange, onAwardGroup, onAwardParticipant, onNotify }: CompetitionGroupWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('criteria')
  const [categories, setCategories] = useState<ScoringCategory[]>(INITIAL_CATEGORIES)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(INITIAL_CATEGORIES.map((category) => category.id))
  const [search, setSearch] = useState('')
  const [participantSearch, setParticipantSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('rank')
  const [sortAscending, setSortAscending] = useState(true)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [criterionDialog, setCriterionDialog] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null)
  const [criterionMode, setCriterionMode] = useState<'templates' | 'custom'>('templates')
  const [categoryForm, setCategoryForm] = useState({ title: '', description: '', maxScore: '' })
  const [criterionForm, setCriterionForm] = useState({ categoryId: '', title: '', description: '', maxPoints: '' })
  const [formError, setFormError] = useState('')
  const [manageOpen, setManageOpen] = useState(false)
  const [manageTab, setManageTab] = useState<'assigned' | 'available'>('assigned')
  const [manageSearch, setManageSearch] = useState('')
  const [selectedNames, setSelectedNames] = useState<string[]>([])
  const [scoreName, setScoreName] = useState<string | null>(null)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (categoryDialog) setCategoryDialog(false)
      else if (criterionDialog) setCriterionDialog(false)
      else if (scoreName) setScoreName(null)
      else if (manageOpen) setManageOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [categoryDialog, criterionDialog, manageOpen, scoreName])

  const scoreParticipant = useCallback((student: StudentRecord) => {
    const categoryScores = categories.map((category) => {
      const raw = category.criteria.reduce((sum, criterion) => sum + (student.scores[criterion.id] ?? 0), 0)
      return { category, raw, contribution: Math.min(raw, category.maxScore) }
    })
    return { categoryScores, rawScore: categoryScores.reduce((sum, item) => sum + item.raw, 0), score: categoryScores.reduce((sum, item) => sum + item.contribution, 0) }
  }, [categories])

  const participants = useMemo<ParticipantRecord[]>(() => {
    const scored = group.members.map(studentFromName).map((student) => ({ ...student, ...scoreParticipant(student) }))
    const ranked = [...scored].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    const ranks = new Map(ranked.map((participant, index) => [participant.name, index + 1]))
    return scored.map((participant) => ({ ...participant, rank: ranks.get(participant.name) ?? scored.length }))
  }, [group.members, scoreParticipant])

  const visibleParticipants = useMemo(() => participants
    .filter((participant) => `${participant.name} ${participant.email} ${participant.cohort}`.toLowerCase().includes(participantSearch.trim().toLowerCase()))
    .sort((a, b) => {
      const comparison = sort === 'rank' ? a.rank - b.rank : a.score - b.score
      return sortAscending ? comparison : -comparison
    }), [participantSearch, participants, sort, sortAscending])

  const currentParticipant = participants.find((participant) => participant.name === scoreName)
  const filteredCategories = categories.filter((category) => `${category.title} ${category.description} ${category.criteria.map((criterion) => `${criterion.title} ${criterion.description}`).join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()))

  const openCategory = (category?: ScoringCategory) => {
    setEditingCategoryId(category?.id ?? null)
    setCategoryForm(category ? { title: category.title, description: category.description, maxScore: String(category.maxScore) } : { title: '', description: '', maxScore: '' })
    setFormError('')
    setCategoryDialog(true)
  }

  const saveCategory = (event: FormEvent) => {
    event.preventDefault()
    const maxScore = Number(categoryForm.maxScore)
    if (!categoryForm.title.trim() || !categoryForm.description.trim() || !Number.isFinite(maxScore) || maxScore <= 0) { setFormError('Add a title, description and maximum score greater than zero.'); return }
    if (editingCategoryId) {
      setCategories((current) => current.map((category) => category.id === editingCategoryId ? { ...category, title: categoryForm.title.trim(), description: categoryForm.description.trim(), maxScore } : category))
      onNotify('Scoring category updated')
    } else {
      const category: ScoringCategory = { id: `category-${Date.now()}`, title: categoryForm.title.trim(), description: categoryForm.description.trim(), maxScore, criteria: [] }
      setCategories((current) => [...current, category])
      setExpandedCategories((current) => [...current, category.id])
      onNotify('Scoring category added')
    }
    setCategoryDialog(false)
  }

  const deleteCategory = (category: ScoringCategory) => {
    if (category.criteria.length) { onNotify('Remove the criteria in this category before deleting it.'); return }
    if (!window.confirm(`Delete “${category.title}”?`)) return
    setCategories((current) => current.filter((item) => item.id !== category.id))
    onNotify('Scoring category deleted')
  }

  const openCriterion = (categoryId = '', criterion?: Criterion) => {
    setEditingCategoryId(categoryId)
    setEditingCriterionId(criterion?.id ?? null)
    setCriterionMode(criterion ? 'custom' : 'templates')
    setCriterionForm(criterion ? { categoryId, title: criterion.title, description: criterion.description, maxPoints: String(criterion.maxPoints) } : { categoryId: categoryId || categories[0]?.id || '', title: '', description: '', maxPoints: '' })
    setFormError('')
    setCriterionDialog(true)
  }

  const saveCriterion = (event: FormEvent) => {
    event.preventDefault()
    const maxPoints = Number(criterionForm.maxPoints)
    if (!criterionForm.categoryId || !criterionForm.title.trim() || !criterionForm.description.trim() || !Number.isFinite(maxPoints) || maxPoints <= 0) { setFormError('Choose a category and add a title, description and points greater than zero.'); return }
    setCategories((current) => current.map((category) => {
      if (editingCriterionId) {
        const withoutEdited = category.criteria.filter((criterion) => criterion.id !== editingCriterionId)
        return category.id === criterionForm.categoryId ? { ...category, criteria: [...withoutEdited, { id: editingCriterionId, title: criterionForm.title.trim(), description: criterionForm.description.trim(), maxPoints }] } : { ...category, criteria: withoutEdited }
      }
      return category.id === criterionForm.categoryId ? { ...category, criteria: [...category.criteria, { id: `criterion-${Date.now()}`, title: criterionForm.title.trim(), description: criterionForm.description.trim(), maxPoints }] } : category
    }))
    setExpandedCategories((current) => current.includes(criterionForm.categoryId) ? current : [...current, criterionForm.categoryId])
    setCriterionDialog(false)
    onNotify(editingCriterionId ? 'Criterion updated' : 'Criterion added')
  }

  const deleteCriterion = (categoryId: string, criterion: Criterion) => {
    if (!window.confirm(`Delete “${criterion.title}”? Submitted evaluations for this criterion will no longer contribute to competition scores.`)) return
    setCategories((current) => current.map((category) => category.id === categoryId ? { ...category, criteria: category.criteria.filter((item) => item.id !== criterion.id) } : category))
    onNotify('Criterion deleted')
  }

  const exportCsv = () => {
    const quote = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
    const rows = visibleParticipants.map((participant) => [participant.name, participant.cohort, participant.score, participant.rank].map(quote).join(','))
    const csv = [['Participant', 'Cohort', 'Competition score', 'Rank'].join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${group.name.replace(/[^a-z0-9]+/gi, '_')}_scores.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    onNotify('Participant score report downloaded')
  }

  const assignedStudents = group.members.map(studentFromName)
  const availableStudents = STUDENT_CATALOG.filter((student) => !group.members.includes(student.name))
  const manageRows = (manageTab === 'assigned' ? assignedStudents : availableStudents).filter((student) => `${student.name} ${student.email} ${student.cohort}`.toLowerCase().includes(manageSearch.toLowerCase()))

  const applyRosterSelection = () => {
    if (!selectedNames.length) return
    if (manageTab === 'assigned') {
      const protectedNames = selectedNames.filter((name) => awards.some((award) => award.recipient === name))
      if (protectedNames.length) { onNotify(`${protectedNames.join(', ')} cannot be removed because award history exists.`); return }
      onMembersChange(group.members.filter((name) => !selectedNames.includes(name)))
      onNotify(`${selectedNames.length} participant${selectedNames.length === 1 ? '' : 's'} removed from the group`)
    } else {
      onMembersChange([...group.members, ...selectedNames.filter((name) => !group.members.includes(name))])
      onNotify(`${selectedNames.length} participant${selectedNames.length === 1 ? '' : 's'} added to the group`)
    }
    setSelectedNames([])
  }

  return (
    <section className="space-y-4 pb-10">
      <div className="flex items-center gap-2.5">
        <div className="h-6 w-1.5 rounded-full bg-teal-600" />
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <button type="button" onClick={onBack} className="transition-colors hover:text-teal-700">Competitions</button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <button type="button" onClick={onBack} className="transition-colors hover:text-teal-700">{competitionName}</button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">{group.name}</span>
        </div>
      </div>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">Group workspace</p><h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900">{group.name}</h1><p className="mt-1 text-xs font-medium text-slate-500">{group.house} house · {group.members.length} participants · {group.points.toLocaleString()} competition points</p></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { setManageTab('assigned'); setSelectedNames([]); setManageOpen(true) }} className={secondaryButton}><UserPlus className="h-3.5 w-3.5" />Manage participants</button><button type="button" onClick={onAwardGroup} className={primaryButton}><Award className="h-3.5 w-3.5" />Award group points</button></div>
      </header>

      <div className="border-b border-gray-200" role="tablist" aria-label="Group workspace sections">
        <div className="flex items-center gap-6 overflow-x-auto text-xs">{([['criteria', 'Scoring criteria'], ['participants', 'Participants']] as [WorkspaceTab, string][]).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)} className={`relative whitespace-nowrap pb-3 font-medium transition-colors ${activeTab === id ? 'border-b-2 border-teal-600 font-semibold text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}>{label}</button>)}</div>
      </div>

      {activeTab === 'criteria' && <div className="space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search scoring criteria" placeholder="Search categories or criteria..." className={`${inputClass} pl-9`} /></div>
          <div className="flex gap-2"><button type="button" onClick={() => openCategory()} className={secondaryButton}><FolderPlus className="h-3.5 w-3.5" />Add category</button><button type="button" onClick={() => openCriterion()} disabled={!categories.length} className={primaryButton}><Plus className="h-3.5 w-3.5" />Add criterion</button></div>
        </div>
        <div className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-[11px] text-teal-800">Category totals cannot exceed their configured maximum score. Any points above the cap are excluded from the competition score.</div>
        <div className="space-y-3">
          {filteredCategories.map((category) => {
            const expanded = expandedCategories.includes(category.id)
            const availablePoints = category.criteria.reduce((sum, criterion) => sum + criterion.maxPoints, 0)
            return <section key={category.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
              <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => setExpandedCategories((current) => expanded ? current.filter((id) => id !== category.id) : [...current, category.id])} className="flex min-w-0 flex-1 items-start gap-2 text-left"><ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${expanded ? '' : '-rotate-90'}`} /><span><span className="block text-xs font-bold text-slate-900">{category.title}</span><span className="mt-0.5 block text-[11px] text-slate-500">{category.description}</span><span className="mt-1.5 flex flex-wrap gap-3 text-[10px] font-medium text-slate-600"><span>{category.criteria.length} criteria</span><span>{availablePoints} points available</span><span className="text-teal-700">Score capped at {category.maxScore}</span></span></span></button>
                <div className="flex shrink-0 gap-1"><button type="button" onClick={() => openCriterion(category.id)} className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-teal-700 hover:bg-teal-50">Add criterion</button><button type="button" onClick={() => openCategory(category)} aria-label={`Edit ${category.title}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => deleteCategory(category)} aria-label={`Delete ${category.title}`} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div>
              </div>
              {expanded && <div className="border-t border-gray-100"><div className="overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left text-xs"><thead><tr className="border-b border-gray-100 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="px-4 py-3.5">Criterion</th><th className="px-4 py-3.5">Scoring guidance</th><th className="px-4 py-3.5">Max points</th><th className="px-4 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{category.criteria.length === 0 ? <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">No criteria in this category. Add one to begin scoring.</td></tr> : category.criteria.map((criterion) => <tr key={criterion.id} className="transition-colors hover:bg-teal-50/30"><td className="px-4 py-3.5 font-semibold text-slate-900">{criterion.title}</td><td className="px-4 py-3.5 text-slate-500">{criterion.description}</td><td className="px-4 py-3.5 font-semibold text-slate-700">{criterion.maxPoints}</td><td className="px-4 py-3.5"><div className="flex justify-end gap-1"><button type="button" onClick={() => openCriterion(category.id, criterion)} aria-label={`Edit ${criterion.title}`} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"><Pencil className="h-3.5 w-3.5" /></button><button type="button" onClick={() => deleteCriterion(category.id, criterion)} aria-label={`Delete ${criterion.title}`} className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div></div>}
            </section>
          })}
          {!filteredCategories.length && <div className="rounded-lg border border-gray-200 bg-white py-10 text-center"><FolderPlus className="mx-auto h-6 w-6 text-slate-300" /><p className="mt-2 text-xs font-semibold text-slate-700">No scoring categories found</p><button type="button" onClick={() => openCategory()} className="mt-2 text-xs font-semibold text-teal-700">Add a category</button></div>}
        </div>
      </div>}

      {activeTab === 'participants' && <div className="space-y-3">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full lg:max-w-sm"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input value={participantSearch} onChange={(event) => setParticipantSearch(event.target.value)} aria-label="Search participants" placeholder="Search participants..." className={`${inputClass} pl-9`} /></div><div className="flex gap-2"><button type="button" onClick={exportCsv} className={secondaryButton}><Download className="h-3.5 w-3.5" />Export CSV</button><button type="button" onClick={() => { setManageTab('assigned'); setSelectedNames([]); setManageOpen(true) }} className={primaryButton}><UserPlus className="h-3.5 w-3.5" />Manage participants</button></div></div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-xs"><thead><tr className="border-b border-gray-100 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="px-4 py-3.5">Participant</th><th className="px-4 py-3.5">Cohort</th><th className="px-4 py-3.5"><button type="button" onClick={() => { if (sort === 'score') setSortAscending((value) => !value); else { setSort('score'); setSortAscending(false) } }} className="inline-flex items-center gap-1">Competition score {sort === 'score' && (sortAscending ? <ArrowUpAZ className="h-3 w-3" /> : <ArrowDownAZ className="h-3 w-3" />)}</button></th><th className="px-4 py-3.5"><button type="button" onClick={() => { if (sort === 'rank') setSortAscending((value) => !value); else { setSort('rank'); setSortAscending(true) } }} className="inline-flex items-center gap-1">Rank {sort === 'rank' && (sortAscending ? <ArrowUpAZ className="h-3 w-3" /> : <ArrowDownAZ className="h-3 w-3" />)}</button></th><th className="px-4 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleParticipants.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400">No participants found. Try another name, email or cohort.</td></tr> : visibleParticipants.map((participant) => <tr key={participant.name} className="transition-colors hover:bg-teal-50/30"><td className="px-4 py-3.5"><p className="font-semibold text-slate-900">{participant.name}</p><p className="mt-0.5 text-[10px] text-slate-400">{participant.email}</p></td><td className="px-4 py-3.5 text-slate-600">{participant.cohort}</td><td className="px-4 py-3.5"><span className="font-bold text-slate-900">{participant.score}</span>{participant.rawScore > participant.score && <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">capped</span>}</td><td className="px-4 py-3.5 text-slate-700">#{participant.rank}</td><td className="px-4 py-3.5"><div className="flex justify-end gap-1"><button type="button" onClick={() => setScoreName(participant.name)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"><Eye className="h-3 w-3" />View score</button><button type="button" onClick={() => onAwardParticipant(participant.name)} className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-teal-700 hover:bg-teal-50">Award points</button></div></td></tr>)}</tbody></table></div></div>
      </div>}

      {categoryDialog && <Overlay title={editingCategoryId ? 'Edit scoring category' : 'Add scoring category'} description="Group related criteria and set the maximum score that can contribute." onClose={() => setCategoryDialog(false)}><form onSubmit={saveCategory}><div className="space-y-4 p-5"><div><label htmlFor="category-title" className="mb-1.5 block text-xs font-semibold text-slate-700">Category name *</label><input id="category-title" value={categoryForm.title} onChange={(event) => setCategoryForm((form) => ({ ...form, title: event.target.value }))} className={inputClass} placeholder="e.g. Challenge performance" /></div><div><label htmlFor="category-description" className="mb-1.5 block text-xs font-semibold text-slate-700">Description *</label><textarea id="category-description" rows={3} value={categoryForm.description} onChange={(event) => setCategoryForm((form) => ({ ...form, description: event.target.value }))} className={inputClass} placeholder="Explain what this category measures." /></div><div><label htmlFor="category-max" className="mb-1.5 block text-xs font-semibold text-slate-700">Maximum category score *</label><input id="category-max" type="number" min="1" value={categoryForm.maxScore} onChange={(event) => setCategoryForm((form) => ({ ...form, maxScore: event.target.value }))} className={inputClass} /><p className="mt-1 text-[10px] text-slate-500">Participant points above this value are capped.</p></div>{formError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</p>}</div><div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4"><button type="button" onClick={() => setCategoryDialog(false)} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}>{editingCategoryId ? 'Save changes' : 'Add category'}</button></div></form></Overlay>}

      {criterionDialog && <Overlay title={editingCriterionId ? 'Edit criterion' : 'Add criterion'} description="Define one measurable part of a scoring category." onClose={() => setCriterionDialog(false)}><form onSubmit={saveCriterion}><div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">{!editingCriterionId && <div className="grid grid-cols-2 gap-2" role="group" aria-label="Criterion source"><button type="button" onClick={() => setCriterionMode('templates')} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${criterionMode === 'templates' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-slate-600'}`}>Predefined templates</button><button type="button" onClick={() => { setCriterionMode('custom'); setCriterionForm((form) => ({ ...form, title: '', description: '', maxPoints: '' })) }} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${criterionMode === 'custom' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 text-slate-600'}`}>Custom criterion</button></div>}{!editingCriterionId && criterionMode === 'templates' && <div className="grid gap-2 sm:grid-cols-2">{CRITERION_TEMPLATES.map((template) => <button key={template.title} type="button" onClick={() => setCriterionForm((form) => ({ ...form, title: template.title, description: template.description, maxPoints: String(template.maxPoints) }))} className={`rounded-lg border p-3 text-left hover:border-teal-300 ${criterionForm.title === template.title ? 'border-teal-500 bg-teal-50' : 'border-gray-200'}`}><span className="text-xs font-bold text-slate-900">{template.title}</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">{template.description}</span><span className="mt-2 block text-[10px] font-semibold text-teal-700">Suggested maximum: {template.maxPoints}</span></button>)}</div>}<div><label htmlFor="criterion-category" className="mb-1.5 block text-xs font-semibold text-slate-700">Category *</label><select id="criterion-category" value={criterionForm.categoryId} onChange={(event) => setCriterionForm((form) => ({ ...form, categoryId: event.target.value }))} className={inputClass}>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></div><div><label htmlFor="criterion-title" className="mb-1.5 block text-xs font-semibold text-slate-700">Criterion name *</label><input id="criterion-title" value={criterionForm.title} onChange={(event) => setCriterionForm((form) => ({ ...form, title: event.target.value }))} className={inputClass} placeholder="e.g. Innovation" /></div><div><label htmlFor="criterion-description" className="mb-1.5 block text-xs font-semibold text-slate-700">Scoring guidance *</label><textarea id="criterion-description" rows={3} value={criterionForm.description} onChange={(event) => setCriterionForm((form) => ({ ...form, description: event.target.value }))} className={inputClass} /></div><div><label htmlFor="criterion-max" className="mb-1.5 block text-xs font-semibold text-slate-700">Maximum points *</label><input id="criterion-max" type="number" min="1" value={criterionForm.maxPoints} onChange={(event) => setCriterionForm((form) => ({ ...form, maxPoints: event.target.value }))} className={inputClass} /></div>{formError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</p>}</div><div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4"><button type="button" onClick={() => setCriterionDialog(false)} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}>{editingCriterionId ? 'Save changes' : 'Add criterion'}</button></div></form></Overlay>}

      {manageOpen && <Overlay side title="Manage participants" description="Add eligible students or remove current group members." onClose={() => setManageOpen(false)}><div className="flex items-center gap-1 border-b border-gray-100 px-5 pt-3">{([['assigned', `Assigned (${assignedStudents.length})`], ['available', `Available (${availableStudents.length})`]] as const).map(([id, label]) => <button key={id} type="button" onClick={() => { setManageTab(id); setSelectedNames([]) }} className={`border-b-2 px-3 py-2 text-xs font-semibold ${manageTab === id ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500'}`}>{label}</button>)}</div><div className="border-b border-gray-100 p-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input value={manageSearch} onChange={(event) => setManageSearch(event.target.value)} className={`${inputClass} pl-9`} placeholder="Search students..." aria-label="Search students" /></div></div><div className="flex-1 overflow-y-auto p-4"><div className="overflow-hidden rounded-lg border border-gray-200"><table className="w-full border-collapse text-left text-xs"><thead><tr className="border-b border-gray-100 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="w-10 px-3 py-3.5"><span className="sr-only">Select</span></th><th className="px-3 py-3.5">Student</th><th className="px-3 py-3.5">Cohort</th></tr></thead><tbody className="divide-y divide-gray-100">{manageRows.length === 0 ? <tr><td colSpan={3} className="p-8 text-center text-slate-400">No students match your search.</td></tr> : manageRows.map((student) => <tr key={student.name} className="transition-colors hover:bg-teal-50/30"><td className="px-3 py-3.5"><input type="checkbox" checked={selectedNames.includes(student.name)} onChange={() => setSelectedNames((current) => current.includes(student.name) ? current.filter((name) => name !== student.name) : [...current, student.name])} className="h-4 w-4 accent-teal-600" aria-label={`Select ${student.name}`} /></td><td className="px-3 py-3.5"><p className="font-semibold text-slate-900">{student.name}</p><p className="mt-0.5 text-[10px] text-slate-400">{student.email}</p></td><td className="px-3 py-3.5 text-slate-600">{student.cohort}</td></tr>)}</tbody></table></div></div><div className="flex items-center justify-between border-t border-gray-100 px-5 py-4"><p className="text-xs text-slate-500">{selectedNames.length} selected</p><button type="button" disabled={!selectedNames.length} onClick={applyRosterSelection} className={manageTab === 'assigned' ? secondaryButton : primaryButton}>{manageTab === 'assigned' ? 'Remove selected' : 'Add selected'}</button></div></Overlay>}

      {currentParticipant && <Overlay title="Score breakdown" description="Category totals cannot exceed their configured maximum score." onClose={() => setScoreName(null)}><div className="max-h-[75vh] overflow-y-auto p-5"><div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-bold text-slate-900">{currentParticipant.name}</h3><p className="mt-1 text-[11px] text-slate-500">{currentParticipant.cohort} · Rank #{currentParticipant.rank}</p></div><div className="text-left sm:text-right"><p className="text-xl font-bold text-slate-900">{currentParticipant.score}</p><p className="text-[10px] text-slate-500">Competition score</p></div></div><div className="mt-4 space-y-3">{scoreParticipant(currentParticipant).categoryScores.map(({ category, raw, contribution }) => <section key={category.id} className="overflow-hidden rounded-lg border border-gray-200"><div className="flex items-start justify-between gap-3 bg-slate-50 px-4 py-3"><div><h4 className="text-xs font-bold text-slate-900">{category.title}</h4><p className="mt-0.5 text-[10px] text-slate-500">Raw {raw} · Maximum {category.maxScore}</p>{raw > category.maxScore && <p className="mt-1 text-[10px] font-semibold text-amber-700">Capped from {raw} to {contribution}</p>}</div><span className="text-sm font-bold text-teal-700">{contribution} pts</span></div><div className="divide-y divide-gray-100">{category.criteria.map((criterion) => <div key={criterion.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs"><div><p className="font-medium text-slate-800">{criterion.title}</p><p className="mt-0.5 text-[10px] text-slate-400">Maximum {criterion.maxPoints}</p></div><span className="font-semibold text-slate-700">{currentParticipant.scores[criterion.id] ?? 0} / {criterion.maxPoints}</span></div>)}</div></section>)}</div><div className="mt-4 flex justify-end"><button type="button" onClick={() => { setScoreName(null); onAwardParticipant(currentParticipant.name) }} className={primaryButton}><Award className="h-3.5 w-3.5" />Award points</button></div></div></Overlay>}
    </section>
  )
}
