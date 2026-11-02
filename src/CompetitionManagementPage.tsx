import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import CompetitionGroupWorkspace from './CompetitionGroupWorkspace'
import {
  ArrowDown,
  ArrowUp,
  Award,
  Check,
  ChevronRight,
  CircleDollarSign,
  Eye,
  FileText,
  GripVertical,
  Grid2X2,
  History,
  LayoutList,
  LockKeyhole,
  Medal,
  Pencil,
  Plus,
  Search,
  Settings2,
  Trash2,
  Trophy,
  UserRound,
  Users,
  X
} from 'lucide-react'

type CompetitionStatus = 'Published' | 'Draft'
type AwardScope = 'Whole Group' | 'Student'
type DetailTab = 'groups' | 'rewards'

interface Competition {
  id: string
  name: string
  description: string
  status: CompetitionStatus
  cohorts: string[]
  updatedAt: string
}

interface Group {
  id: string
  name: string
  house: string
  members: string[]
  points: number
}

interface AwardEntry {
  id: string
  groupId: string
  groupName: string
  scope: AwardScope
  recipient: string
  topic: string
  points: number
  description: string
  visible: boolean
  status: 'Pending' | 'Posted' | 'Rejected'
  createdAt: string
}

interface RewardTier {
  id: string
  title: string
  reward: string
}

interface RewardConfig {
  overallTabName: string
  fraternityName: string
  sideMenuName: string
  tiers: RewardTier[]
  minAward: number
  maxAward: number
  leaderboard: boolean
  studentHistory: boolean
  approval: boolean
  allowNegative: boolean
}

interface CompetitionData {
  groups: Group[]
  awards: AwardEntry[]
  rewards: RewardConfig
}

interface CompetitionManagementPageProps {
  onActionNotify?: (message: string) => void
}

const COHORTS = [
  'PGP TBM · Cohort 7',
  'PGP TBM · Cohort 8',
  'UG Programme · Cohort 3',
  'Executive PGP · Cohort 5',
  'Tech Leaders · Cohort 2'
]

const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    name: 'The House Cup 2025',
    description: 'A year-long celebration of leadership, collaboration and campus spirit.',
    status: 'Published',
    cohorts: ['PGP TBM · Cohort 7', 'PGP TBM · Cohort 8'],
    updatedAt: 'Updated 2 hours ago'
  },
  {
    id: 'comp-2',
    name: 'Venture Sprint League',
    description: 'Cross-cohort venture challenges with weekly milestones and peer voting.',
    status: 'Published',
    cohorts: ['UG Programme · Cohort 3'],
    updatedAt: 'Updated yesterday'
  },
  {
    id: 'comp-3',
    name: 'Impact Challenge',
    description: 'Teams earn points for measurable community and sustainability outcomes.',
    status: 'Draft',
    cohorts: ['Executive PGP · Cohort 5', 'Tech Leaders · Cohort 2'],
    updatedAt: 'Updated 4 days ago'
  }
]

const INITIAL_GROUPS: Group[] = [
  { id: 'group-1', name: 'House of Mavericks', house: 'Mavericks', members: ['Aarav Mehta', 'Diya Shah', 'Kabir Rao', 'Myra Kapoor'], points: 1280 },
  { id: 'group-2', name: 'House of Visionaries', house: 'Visionaries', members: ['Aanya Bose', 'Arjun Nair', 'Ira Sethi', 'Rohan Jain'], points: 1095 },
  { id: 'group-3', name: 'House of Pioneers', house: 'Pioneers', members: ['Advait Gill', 'Meera Iyer', 'Neil Bhat', 'Sara Khan'], points: 940 },
  { id: 'group-4', name: 'House of Catalysts', house: 'Catalysts', members: ['Anaya Das', 'Dev Malhotra', 'Kiara Sen', 'Vivaan Roy'], points: 875 }
]

const INITIAL_AWARDS: AwardEntry[] = [
  { id: 'award-1', groupId: 'group-1', groupName: 'House of Mavericks', scope: 'Whole Group', recipient: 'House of Mavericks', topic: 'Community Leadership', points: 120, description: 'Led the campus volunteering drive.', visible: true, status: 'Posted', createdAt: 'Today, 10:32 AM' },
  { id: 'award-2', groupId: 'group-2', groupName: 'House of Visionaries', scope: 'Student', recipient: 'Aanya Bose', topic: 'Innovation', points: 75, description: 'Presented the strongest prototype.', visible: true, status: 'Posted', createdAt: 'Yesterday, 4:18 PM' },
  { id: 'award-3', groupId: 'group-1', groupName: 'House of Mavericks', scope: 'Student', recipient: 'Kabir Rao', topic: 'Conduct', points: -20, description: 'Late submission penalty.', visible: false, status: 'Posted', createdAt: '18 Jun, 2:45 PM' }
]

const DEFAULT_REWARDS: RewardConfig = {
  overallTabName: 'Overall standings',
  fraternityName: 'Houses',
  sideMenuName: 'Rewards',
  tiers: [
    { id: 'reward-tier-1', title: 'Winner', reward: '₹10,00,000' },
    { id: 'reward-tier-2', title: 'Runner-up', reward: '₹5,00,000' },
    { id: 'reward-tier-3', title: 'Finalists', reward: 'Certificate + mentorship' }
  ],
  minAward: 5,
  maxAward: 500,
  leaderboard: true,
  studentHistory: true,
  approval: false,
  allowNegative: true
}

const cloneRewardConfig = (config: RewardConfig): RewardConfig => ({
  ...config,
  tiers: config.tiers.map((tier) => ({ ...tier }))
})

const createEmptyCompetitionData = (): CompetitionData => ({
  groups: [],
  awards: [],
  rewards: cloneRewardConfig(DEFAULT_REWARDS)
})

const INITIAL_COMPETITION_DATA: Record<string, CompetitionData> = {
  'comp-1': { groups: INITIAL_GROUPS, awards: INITIAL_AWARDS, rewards: cloneRewardConfig(DEFAULT_REWARDS) },
  'comp-2': createEmptyCompetitionData(),
  'comp-3': createEmptyCompetitionData()
}

const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700'
const primaryButton = 'inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButton = 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:ring-offset-1'

function Modal({ title, description, onClose, children, width = 'max-w-xl' }: { title: string; description?: string; onClose: () => void; children: ReactNode; width?: string }) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(document.activeElement instanceof HTMLElement ? document.activeElement : null)

  useEffect(() => {
    const panel = panelRef.current
    const opener = openerRef.current
    if (!panel) return
    const focusable = panel.querySelector<HTMLElement>('[autofocus]') ?? panel.querySelector<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
    focusable?.focus()

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'))
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (!panel.contains(document.activeElement)) {
        event.preventDefault()
        const destination = event.shiftKey ? last : first
        destination.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', trapFocus)
    return () => {
      document.removeEventListener('keydown', trapFocus)
      opener?.focus()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/45 p-4 backdrop-blur-[1px]" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={panelRef} tabIndex={-1} className={`my-auto w-full ${width} overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl outline-none`}>
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="text-base font-bold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label={`Close ${title}`} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-teal-600' : 'bg-slate-300'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

function StatusBadge({ status }: { status: CompetitionStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status === 'Published' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}><span className={`h-1.5 w-1.5 rounded-full ${status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />{status}</span>
}

export default function CompetitionManagementPage({ onActionNotify = () => {} }: CompetitionManagementPageProps) {
  const [competitions, setCompetitions] = useState(INITIAL_COMPETITIONS)
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null)
  const [workspaceGroupId, setWorkspaceGroupId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'compact' | 'card'>('compact')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<DetailTab>('groups')
  const [competitionData, setCompetitionData] = useState<Record<string, CompetitionData>>(INITIAL_COMPETITION_DATA)
  const [groupSearch, setGroupSearch] = useState('')
  const [modal, setModal] = useState<'create' | 'edit' | 'award' | 'group' | 'awards' | null>(null)
  const [logsOpen, setLogsOpen] = useState(false)
  const [logsSearch, setLogsSearch] = useState('')
  const [logsGroup, setLogsGroup] = useState('All groups')
  const [logsScope, setLogsScope] = useState('All scopes')
  const [viewAwardsGroupId, setViewAwardsGroupId] = useState<string | null>(null)
  const [viewAwardsType, setViewAwardsType] = useState<'all' | 'positive' | 'negative'>('all')
  const [createForm, setCreateForm] = useState({ name: '', description: '', cohorts: [] as string[] })
  const [createError, setCreateError] = useState('')
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [editingCompetitionId, setEditingCompetitionId] = useState<string | null>(null)
  const [awardForm, setAwardForm] = useState({ scope: 'Whole Group' as AwardScope, groupId: '', student: '', topic: '', direction: 'positive' as 'positive' | 'negative', points: '', description: '', visible: true })
  const [awardError, setAwardError] = useState('')
  const [groupForm, setGroupForm] = useState({ name: '', house: '', members: '' })
  const [groupError, setGroupError] = useState('')
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)

  const selectedCompetition = competitions.find((competition) => competition.id === selectedCompetitionId) ?? null
  const editingCompetition = competitions.find((competition) => competition.id === editingCompetitionId) ?? null
  const selectedData = selectedCompetitionId ? competitionData[selectedCompetitionId] ?? createEmptyCompetitionData() : createEmptyCompetitionData()
  const { groups, awards, rewards } = selectedData
  const workspaceGroup = groups.find((group) => group.id === workspaceGroupId) ?? null
  const postedAwards = useMemo(() => awards.filter((award) => award.status === 'Posted'), [awards])
  const updateSelectedData = (update: (current: CompetitionData) => CompetitionData) => {
    if (!selectedCompetitionId) return
    setCompetitionData((current) => ({
      ...current,
      [selectedCompetitionId]: update(current[selectedCompetitionId] ?? createEmptyCompetitionData())
    }))
  }
  const getCompetitionCounts = (competitionId: string) => {
    const scopedGroups = competitionData[competitionId]?.groups ?? []
    return {
      groupCount: scopedGroups.length,
      participantCount: scopedGroups.reduce((total, group) => total + group.members.length, 0)
    }
  }
  const filteredCompetitions = useMemo(() => competitions.filter((competition) => `${competition.name} ${competition.description} ${competition.cohorts.join(' ')}`.toLowerCase().includes(search.trim().toLowerCase())), [competitions, search])
  const filteredGroups = useMemo(() => groups.filter((group) => `${group.name} ${group.house} ${group.members.join(' ')}`.toLowerCase().includes(groupSearch.trim().toLowerCase())), [groups, groupSearch])
  const filteredLogs = useMemo(() => postedAwards.filter((award) => {
    const matchesSearch = `${award.recipient} ${award.topic} ${award.description}`.toLowerCase().includes(logsSearch.trim().toLowerCase())
    const matchesGroup = logsGroup === 'All groups' || award.groupId === logsGroup
    const matchesScope = logsScope === 'All scopes' || award.scope === logsScope
    return matchesSearch && matchesGroup && matchesScope
  }), [postedAwards, logsGroup, logsScope, logsSearch])
  const selectedGroup = groups.find((group) => group.id === awardForm.groupId)
  const viewedGroup = groups.find((group) => group.id === viewAwardsGroupId)
  const viewedAwards = postedAwards.filter((award) => award.groupId === viewAwardsGroupId)
  const filteredViewedAwards = viewedAwards.filter((award) => viewAwardsType === 'all' || (viewAwardsType === 'positive' ? award.points > 0 : award.points < 0))

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (modal) setModal(null)
      else if (logsOpen) setLogsOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [logsOpen, modal])

  const resetCreate = () => {
    setCreateForm({ name: '', description: '', cohorts: [] })
    setCreateError('')
  }

  const handleCreateCompetition = (event: FormEvent) => {
    event.preventDefault()
    if (!createForm.name.trim() || !createForm.description.trim() || createForm.cohorts.length === 0) {
      setCreateError('Add a name, description and at least one cohort.')
      return
    }
    const newCompetition: Competition = { id: `comp-${Date.now()}`, name: createForm.name.trim(), description: createForm.description.trim(), status: 'Draft', cohorts: createForm.cohorts, updatedAt: 'Created just now' }
    setCompetitions((current) => [newCompetition, ...current])
    setCompetitionData((current) => ({ ...current, [newCompetition.id]: createEmptyCompetitionData() }))
    setModal(null)
    resetCreate()
    onActionNotify(`Competition “${newCompetition.name}” created as draft`)
  }

  const openEditCompetition = (competition: Competition) => {
    setEditForm({ name: competition.name, description: competition.description })
    setEditingCompetitionId(competition.id)
    setModal('edit')
  }

  const handleEditCompetition = (event: FormEvent) => {
    event.preventDefault()
    if (!editingCompetition || !editForm.name.trim() || !editForm.description.trim()) return
    setCompetitions((current) => current.map((competition) => competition.id === editingCompetition.id ? { ...competition, name: editForm.name.trim(), description: editForm.description.trim(), updatedAt: 'Updated just now' } : competition))
    setModal(null)
    onActionNotify('Competition details updated successfully')
  }

  const deleteCompetition = (competition: Competition) => {
    if (!window.confirm(`Delete “${competition.name}”? This action cannot be undone.`)) return
    setCompetitions((current) => current.filter((item) => item.id !== competition.id))
    setCompetitionData((current) => {
      const next = { ...current }
      delete next[competition.id]
      return next
    })
    if (selectedCompetitionId === competition.id) {
      setSelectedCompetitionId(null)
      setWorkspaceGroupId(null)
    }
    onActionNotify(`Competition “${competition.name}” deleted`)
  }

  const toggleStatus = () => {
    if (!selectedCompetition) return
    const nextStatus: CompetitionStatus = selectedCompetition.status === 'Published' ? 'Draft' : 'Published'
    setCompetitions((current) => current.map((competition) => competition.id === selectedCompetition.id ? { ...competition, status: nextStatus, updatedAt: 'Updated just now' } : competition))
    onActionNotify(`Competition ${nextStatus === 'Published' ? 'published' : 'moved to draft'}`)
  }

  const openAward = (groupId = '', student = '') => {
    setAwardForm({ scope: student ? 'Student' : 'Whole Group', groupId, student, topic: '', direction: 'positive', points: '', description: '', visible: true })
    setAwardError('')
    setModal('award')
  }

  const handleAward = (event: FormEvent) => {
    event.preventDefault()
    const points = Number(awardForm.points)
    const group = groups.find((item) => item.id === awardForm.groupId)
    if (!group || !awardForm.topic.trim() || !awardForm.description.trim() || !Number.isFinite(points) || points <= 0 || (awardForm.scope === 'Student' && !awardForm.student)) {
      setAwardError('Complete all required fields and enter points greater than zero.')
      return
    }
    if (points < rewards.minAward || points > rewards.maxAward) {
      setAwardError(`Points must be between ${rewards.minAward} and ${rewards.maxAward}.`)
      return
    }
    if (awardForm.direction === 'negative' && !rewards.allowNegative) {
      setAwardError('Negative points are disabled for this competition.')
      return
    }
    const signedPoints = awardForm.direction === 'negative' ? -points : points
    const recipient = awardForm.scope === 'Whole Group' ? group.name : awardForm.student
    const entry: AwardEntry = { id: `award-${Date.now()}`, groupId: group.id, groupName: group.name, scope: awardForm.scope, recipient, topic: awardForm.topic.trim(), points: signedPoints, description: awardForm.description.trim(), visible: awardForm.visible, status: rewards.approval ? 'Pending' : 'Posted', createdAt: 'Just now' }
    updateSelectedData((current) => ({
      ...current,
      awards: [entry, ...current.awards],
      groups: rewards.approval ? current.groups : current.groups.map((item) => item.id === group.id ? { ...item, points: item.points + signedPoints } : item)
    }))
    setModal(null)
    onActionNotify(rewards.approval ? `Award for ${recipient} submitted for approval` : `${signedPoints > 0 ? '+' : ''}${signedPoints} points awarded to ${recipient}`)
  }

  const openGroupDialog = (group?: Group) => {
    setEditingGroupId(group?.id ?? null)
    setGroupForm(group ? { name: group.name, house: group.house, members: group.members.join(', ') } : { name: '', house: '', members: '' })
    setGroupError('')
    setModal('group')
  }

  const handleGroupSubmit = (event: FormEvent) => {
    event.preventDefault()
    const members = groupForm.members.split(',').map((member) => member.trim()).filter(Boolean)
    if (!groupForm.name.trim() || !groupForm.house.trim() || members.length === 0) {
      setGroupError('Add a group name, house and at least one member.')
      return
    }
    if (editingGroupId) {
      updateSelectedData((current) => ({ ...current, groups: current.groups.map((group) => group.id === editingGroupId ? { ...group, name: groupForm.name.trim(), house: groupForm.house.trim(), members } : group) }))
      onActionNotify('PRS group updated')
    } else {
      updateSelectedData((current) => ({ ...current, groups: [...current.groups, { id: `group-${Date.now()}`, name: groupForm.name.trim(), house: groupForm.house.trim(), members, points: 0 }] }))
      onActionNotify('PRS group created')
    }
    setModal(null)
  }

  const deleteGroup = (group: Group) => {
    if (awards.some((award) => award.groupId === group.id)) {
      onActionNotify(`${group.name} cannot be deleted because it has award history. Retain the group to preserve the audit record.`)
      return
    }
    if (!window.confirm(`Delete ${group.name}?`)) return
    updateSelectedData((current) => ({ ...current, groups: current.groups.filter((item) => item.id !== group.id) }))
    if (workspaceGroupId === group.id) setWorkspaceGroupId(null)
    if (logsGroup === group.id) setLogsGroup('All groups')
    onActionNotify(`${group.name} deleted`)
  }

  const saveRewards = (nextConfig: RewardConfig) => {
    updateSelectedData((current) => ({ ...current, rewards: cloneRewardConfig(nextConfig) }))
    onActionNotify('Rewards configuration saved')
  }

  if (!selectedCompetition) {
    return (
      <section className="space-y-5 pb-10 animate-in fade-in duration-200">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-1.5 rounded-full bg-teal-600" />
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Student Experience</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-teal-700">Competitions</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Competitions</h1>
            <p className="mt-1 text-xs text-slate-500">Manage competitions, cohorts and PRS groups.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px] flex-1 sm:w-60 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search competitions" placeholder="Search here..." className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-800 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600" />
            </div>
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-xs" aria-label="Competition view" role="group">
              <button aria-label="Compact view" aria-pressed={viewMode === 'compact'} onClick={() => setViewMode('compact')} className={`rounded-md p-1.5 transition ${viewMode === 'compact' ? 'bg-teal-50 text-teal-700' : 'text-slate-400 hover:text-slate-700'}`}><LayoutList className="h-3.5 w-3.5" /></button>
              <button aria-label="Card view" aria-pressed={viewMode === 'card'} onClick={() => setViewMode('card')} className={`rounded-md p-1.5 transition ${viewMode === 'card' ? 'bg-teal-50 text-teal-700' : 'text-slate-400 hover:text-slate-700'}`}><Grid2X2 className="h-3.5 w-3.5" /></button>
            </div>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-700" onClick={() => { resetCreate(); setModal('create') }}><Plus className="h-3.5 w-3.5" />Create Competition</button>
          </div>
        </div>

        {filteredCompetitions.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center"><Search className="mx-auto h-8 w-8 text-slate-300" /><h2 className="mt-3 text-sm font-bold text-slate-800">No competitions found</h2><p className="mt-1 text-xs text-slate-500">Try another search or create a new competition.</p></div> : viewMode === 'card' ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompetitions.map((competition, index) => <article key={competition.id} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
              <div className={`h-1.5 ${['bg-teal-500', 'bg-indigo-500', 'bg-amber-500'][index % 3]}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"><Trophy className="h-5 w-5" /></div><StatusBadge status={competition.status} /></div>
                <h2 className="mt-4 text-base font-bold text-slate-900 group-hover:text-teal-700">{competition.name}</h2><p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{competition.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">{competition.cohorts.map((cohort) => <span key={cohort} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">{cohort}</span>)}</div>
                <div className="mt-5 grid grid-cols-2 gap-3 border-y border-gray-100 py-3"><div><p className="text-lg font-bold text-slate-900">{getCompetitionCounts(competition.id).groupCount}</p><p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Groups</p></div><div><p className="text-lg font-bold text-slate-900">{getCompetitionCounts(competition.id).participantCount}</p><p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Participants</p></div></div>
                <div className="mt-4 flex items-center justify-between"><span className="text-[10px] text-slate-400">{competition.updatedAt}</span><div className="flex items-center gap-1"><button onClick={() => setSelectedCompetitionId(competition.id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500" aria-label={`View ${competition.name}`}>View <ChevronRight className="h-3.5 w-3.5" /></button><button onClick={() => openEditCompetition(competition)} aria-label={`Edit ${competition.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-700"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => deleteCompetition(competition)} aria-label={`Delete ${competition.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></div>
              </div>
            </article>)}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left text-xs"><thead><tr className="border-b border-gray-100 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="px-5 py-3.5">Competition</th><th className="px-4 py-3.5">Cohorts</th><th className="px-4 py-3.5">Groups</th><th className="px-4 py-3.5">Participants</th><th className="px-4 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredCompetitions.map((competition) => <tr key={competition.id} className="transition-colors hover:bg-teal-50/30"><td className="px-5 py-3.5"><p className="font-semibold text-slate-900">{competition.name}</p><p className="mt-0.5 max-w-xs truncate text-[11px] text-slate-500">{competition.description}</p></td><td className="px-4 py-3.5 text-slate-600">{competition.cohorts.length} cohorts</td><td className="px-4 py-3.5 font-medium text-slate-700">{getCompetitionCounts(competition.id).groupCount}</td><td className="px-4 py-3.5 font-medium text-slate-700">{getCompetitionCounts(competition.id).participantCount}</td><td className="px-4 py-3.5"><StatusBadge status={competition.status} /></td><td className="px-5 py-3.5"><div className="flex justify-end gap-1"><button onClick={() => setSelectedCompetitionId(competition.id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 font-semibold text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-1 focus:ring-teal-600" aria-label={`Open ${competition.name}`}>Open <ChevronRight className="h-3.5 w-3.5" /></button><button onClick={() => openEditCompetition(competition)} aria-label={`Edit ${competition.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-700"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => deleteCompetition(competition)} aria-label={`Delete ${competition.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div></div>
        )}

        {modal === 'create' && <Modal title="Create Competition" description="Set up the experience and choose who can participate." onClose={() => setModal(null)}><form onSubmit={handleCreateCompetition}><div className="max-h-[70vh] space-y-4 overflow-y-auto p-5 sm:p-6"><div><label className={labelClass} htmlFor="competition-name">Competition name *</label><input id="competition-name" autoFocus value={createForm.name} onChange={(event) => setCreateForm((form) => ({ ...form, name: event.target.value }))} className={inputClass} placeholder="e.g. The House Cup 2026" /></div><div><label className={labelClass} htmlFor="competition-description">Description *</label><textarea id="competition-description" rows={4} value={createForm.description} onChange={(event) => setCreateForm((form) => ({ ...form, description: event.target.value }))} className={inputClass} placeholder="What is this competition designed to achieve?" /></div><fieldset><legend className={labelClass}>Participating cohorts *</legend><div className="space-y-2 rounded-lg border border-gray-200 p-3">{COHORTS.map((cohort) => <label key={cohort} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-xs text-slate-700 hover:bg-slate-50"><input type="checkbox" checked={createForm.cohorts.includes(cohort)} onChange={() => setCreateForm((form) => ({ ...form, cohorts: form.cohorts.includes(cohort) ? form.cohorts.filter((item) => item !== cohort) : [...form.cohorts, cohort] }))} className="h-4 w-4 rounded border-slate-300 accent-teal-600" /><span>{cohort}</span></label>)}</div></fieldset>{createError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{createError}</p>}</div><div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4 sm:px-6"><button type="button" onClick={() => setModal(null)} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}><Plus className="h-4 w-4" />Create Competition</button></div></form></Modal>}
        {modal === 'edit' && editingCompetition && <CompetitionEditModal competition={editingCompetition} editForm={editForm} setEditForm={setEditForm} onSubmit={handleEditCompetition} onClose={() => setModal(null)} />}
      </section>
    )
  }

  return (
    <section className="space-y-5 pb-10 animate-in fade-in duration-200">
      {workspaceGroup ? <CompetitionGroupWorkspace
        group={workspaceGroup}
        competitionName={selectedCompetition.name}
        awards={postedAwards.filter((award) => award.groupId === workspaceGroup.id).map(({ id, recipient, topic, points, description, createdAt }) => ({ id, recipient, topic, points, description, createdAt }))}
        onBack={() => setWorkspaceGroupId(null)}
        onMembersChange={(members) => updateSelectedData((current) => ({ ...current, groups: current.groups.map((group) => group.id === workspaceGroup.id ? { ...group, members } : group) }))}
        onAwardGroup={() => openAward(workspaceGroup.id)}
        onAwardParticipant={(student) => openAward(workspaceGroup.id, student)}
        onNotify={onActionNotify}
      /> : <>
      <div className="flex items-center gap-2.5">
        <div className="h-6 w-1.5 rounded-full bg-teal-600" />
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <button onClick={() => { setSelectedCompetitionId(null); setWorkspaceGroupId(null); setActiveTab('groups') }} className="transition-colors hover:text-teal-700">Competitions</button>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-700 font-semibold">{selectedCompetition.name}</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">{activeTab === 'groups' ? 'Groups' : 'Rewards'}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">{selectedCompetition.name}</h1>
            <StatusBadge status={selectedCompetition.status} />
          </div>
          <p className="mt-1 truncate text-xs font-medium text-slate-500">{selectedCompetition.cohorts.length} cohorts · {groups.length} groups · {groups.reduce((total, group) => total + group.members.length, 0)} students · {groups.reduce((total, group) => total + group.points, 0).toLocaleString()} points</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2"><button onClick={() => openEditCompetition(selectedCompetition)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" />Edit</button><button onClick={toggleStatus} className={selectedCompetition.status === 'Draft' ? primaryButton : secondaryButton}>{selectedCompetition.status === 'Draft' ? <><Check className="h-3.5 w-3.5" />Publish</> : <><FileText className="h-3.5 w-3.5" />Move to draft</>}</button></div>
      </div>

      <div className="border-b border-gray-200"><div className="flex items-center gap-6 overflow-x-auto text-xs" role="tablist" aria-label="Competition settings"><button role="tab" aria-selected={activeTab === 'groups'} onClick={() => setActiveTab('groups')} className={`relative whitespace-nowrap pb-3 font-medium transition-colors ${activeTab === 'groups' ? 'border-b-2 border-teal-600 font-semibold text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}><span className="flex items-center gap-2"><Users className="h-4 w-4" />Group</span></button><button role="tab" aria-selected={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} className={`relative whitespace-nowrap pb-3 font-medium transition-colors ${activeTab === 'rewards' ? 'border-b-2 border-teal-600 font-semibold text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}><span className="flex items-center gap-2"><Settings2 className="h-4 w-4" />Rewards Configuration</span></button></div></div>

      {activeTab === 'groups' ? <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full lg:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={groupSearch} onChange={(event) => setGroupSearch(event.target.value)} aria-label="Search groups" placeholder="Search groups, houses or members..." className={`${inputClass} pl-9`} /></div><div className="flex flex-wrap gap-2"><button onClick={() => setLogsOpen(true)} className={secondaryButton}><History className="h-3.5 w-3.5" />Award Logs</button><button onClick={() => openAward()} className={secondaryButton}><Award className="h-3.5 w-3.5" />Award Points</button><button onClick={() => openGroupDialog()} className={primaryButton}><Plus className="h-3.5 w-3.5" />Create PRS Group</button></div></div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"><div className="overflow-x-auto"><table className="w-full min-w-[850px] border-collapse text-left text-xs"><thead><tr className="border-b border-gray-100 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="px-5 py-3.5">Group</th><th className="px-4 py-3.5">House</th><th className="px-4 py-3.5">Members</th><th className="px-4 py-3.5">Points</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredGroups.map((group, index) => <tr key={group.id} className="transition-colors hover:bg-teal-50/30"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${['bg-teal-50 text-teal-700', 'bg-indigo-50 text-indigo-700', 'bg-amber-50 text-amber-700', 'bg-rose-50 text-rose-700'][index % 4]}`}>{group.name.charAt(9)}</span><div><p className="font-semibold text-slate-900">{group.name}</p><p className="mt-0.5 text-[10px] text-slate-400">PRS-{group.id.slice(-1).padStart(2, '0')}</p></div></div></td><td className="px-4 py-3.5 text-slate-600">{group.house}</td><td className="px-4 py-3.5"><p className="font-medium text-slate-700">{group.members.length} students</p><p className="mt-0.5 max-w-[220px] truncate text-[10px] text-slate-400">{group.members.join(', ')}</p></td><td className="px-4 py-3.5"><span className="font-bold text-slate-900">{group.points.toLocaleString()}</span><span className="ml-1 text-[10px] text-slate-400">pts</span></td><td className="px-5 py-3.5"><div className="flex justify-end gap-1"><button onClick={() => setWorkspaceGroupId(group.id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-1 focus:ring-teal-600" aria-label={`Open ${group.name} workspace`}>Open <ChevronRight className="h-3.5 w-3.5" /></button><button onClick={() => { setViewAwardsGroupId(group.id); setViewAwardsType('all'); setModal('awards') }} aria-label={`View awards for ${group.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Eye className="h-3.5 w-3.5" /></button><button onClick={() => openAward(group.id)} aria-label={`Award points to ${group.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-teal-50 hover:text-teal-700"><Award className="h-3.5 w-3.5" /></button><button onClick={() => openGroupDialog(group)} aria-label={`Edit ${group.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => deleteGroup(group)} aria-label={`Delete ${group.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}{filteredGroups.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400">No groups match your search.</td></tr>}</tbody></table></div></div>
      </div> : <RewardsConfiguration key={selectedCompetition.id} competitionName={selectedCompetition.name} rewards={rewards} saveRewards={saveRewards} />}
      </>}

      {modal === 'edit' && editingCompetition && <CompetitionEditModal competition={editingCompetition} editForm={editForm} setEditForm={setEditForm} onSubmit={handleEditCompetition} onClose={() => setModal(null)} />}
      {modal === 'award' && <Modal title="Award Points" description="Recognise a whole group or an individual student." onClose={() => setModal(null)} width="max-w-2xl"><form onSubmit={handleAward}><div className="max-h-[70vh] space-y-4 overflow-y-auto p-5 sm:p-6"><fieldset><legend className={labelClass}>Award scope *</legend><div className="grid grid-cols-2 gap-2">{(['Whole Group', 'Student'] as AwardScope[]).map((scope) => <label key={scope} className={`cursor-pointer rounded-lg border p-3 text-xs font-semibold transition ${awardForm.scope === scope ? 'border-teal-500 bg-teal-50 text-teal-800' : 'border-gray-200 text-slate-600 hover:bg-slate-50'}`}><input type="radio" name="award-scope" value={scope} checked={awardForm.scope === scope} onChange={() => setAwardForm((form) => ({ ...form, scope, student: '' }))} className="sr-only" /><span className="flex items-center gap-2">{scope === 'Whole Group' ? <Users className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}{scope}</span></label>)}</div></fieldset><div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="award-group">House / group *</label><select id="award-group" value={awardForm.groupId} onChange={(event) => setAwardForm((form) => ({ ...form, groupId: event.target.value, student: '' }))} className={inputClass}><option value="">Select group</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></div>{awardForm.scope === 'Student' && <div><label className={labelClass} htmlFor="award-student">Student *</label><select id="award-student" value={awardForm.student} disabled={!selectedGroup} onChange={(event) => setAwardForm((form) => ({ ...form, student: event.target.value }))} className={inputClass}><option value="">Select student</option>{selectedGroup?.members.map((member) => <option key={member}>{member}</option>)}</select></div>}</div><div><label className={labelClass} htmlFor="award-topic">Topic *</label><input id="award-topic" value={awardForm.topic} onChange={(event) => setAwardForm((form) => ({ ...form, topic: event.target.value }))} className={inputClass} placeholder="e.g. Collaboration, Innovation, Conduct" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="award-direction">Point type *</label><select id="award-direction" value={awardForm.direction} onChange={(event) => setAwardForm((form) => ({ ...form, direction: event.target.value as 'positive' | 'negative' }))} className={inputClass}><option value="positive">Positive points</option><option value="negative" disabled={!rewards.allowNegative}>Negative points</option></select></div><div><label className={labelClass} htmlFor="award-points">Points *</label><input id="award-points" type="number" min={rewards.minAward} max={rewards.maxAward} value={awardForm.points} onChange={(event) => setAwardForm((form) => ({ ...form, points: event.target.value }))} className={inputClass} placeholder="Enter points" /></div></div><div><label className={labelClass} htmlFor="award-description">Description *</label><textarea id="award-description" rows={3} value={awardForm.description} onChange={(event) => setAwardForm((form) => ({ ...form, description: event.target.value }))} className={inputClass} placeholder="Explain why these points are being awarded." /></div><div className="flex items-center justify-between rounded-lg border border-gray-200 p-3"><div><p className="text-xs font-semibold text-slate-800">Show on student dashboard</p><p className="mt-0.5 text-[11px] text-slate-500">Make this recognition visible in the activity feed.</p></div><Toggle checked={awardForm.visible} onChange={(visible) => setAwardForm((form) => ({ ...form, visible }))} label="Show award on student dashboard" /></div>{awardError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{awardError}</p>}</div><div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4 sm:px-6"><button type="button" onClick={() => setModal(null)} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}><Award className="h-4 w-4" />Award Points</button></div></form></Modal>}
      {modal === 'group' && <Modal title={editingGroupId ? 'Edit PRS Group' : 'Create PRS Group'} description="Organise students into a named competition house." onClose={() => setModal(null)}><form onSubmit={handleGroupSubmit}><div className="space-y-4 p-5 sm:p-6"><div><label className={labelClass} htmlFor="group-name">Group name *</label><input id="group-name" autoFocus value={groupForm.name} onChange={(event) => setGroupForm((form) => ({ ...form, name: event.target.value }))} className={inputClass} placeholder="e.g. House of Explorers" /></div><div><label className={labelClass} htmlFor="house-name">House *</label><input id="house-name" value={groupForm.house} onChange={(event) => setGroupForm((form) => ({ ...form, house: event.target.value }))} className={inputClass} placeholder="e.g. Explorers" /></div><div><label className={labelClass} htmlFor="group-members">Members *</label><textarea id="group-members" rows={3} value={groupForm.members} onChange={(event) => setGroupForm((form) => ({ ...form, members: event.target.value }))} className={inputClass} placeholder="Enter student names separated by commas" /><p className="mt-1.5 text-[10px] text-slate-500">Separate each student with a comma.</p></div>{groupError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{groupError}</p>}</div><div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4 sm:px-6"><button type="button" onClick={() => setModal(null)} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}>{editingGroupId ? 'Save Changes' : 'Create Group'}</button></div></form></Modal>}
      {modal === 'awards' && viewedGroup && <Modal title={`${viewedGroup.name} Awards`} description="Performance, point movement and recognition history." onClose={() => setModal(null)} width="max-w-3xl"><div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[[viewedGroup.points.toLocaleString(), 'Current points'], [viewedAwards.filter((award) => award.points > 0).reduce((sum, award) => sum + award.points, 0), 'Points earned'], [Math.abs(viewedAwards.filter((award) => award.points < 0).reduce((sum, award) => sum + award.points, 0)), 'Deductions'], [viewedAwards.length, 'Awards']].map(([value, label]) => <div key={String(label)} className="rounded-lg border border-gray-200 bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{value}</p><p className="text-[10px] font-medium text-slate-500">{label}</p></div>)}</div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><h3 className="text-xs font-bold text-slate-800">Award history</h3><select aria-label="Filter group awards by type" value={viewAwardsType} onChange={(event) => setViewAwardsType(event.target.value as 'all' | 'positive' | 'negative')} className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-slate-600"><option value="all">All point types</option><option value="positive">Positive only</option><option value="negative">Negative only</option></select></div><div className="mt-3 space-y-2">{filteredViewedAwards.length === 0 ? <div className="rounded-lg border border-gray-200 py-10 text-center"><Medal className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 text-xs font-semibold text-slate-700">No awards found</p><p className="mt-1 text-[11px] text-slate-500">Award points or choose another point filter.</p></div> : filteredViewedAwards.map((award) => <AwardRow key={award.id} award={award} />)}</div></div></Modal>}

      {logsOpen && <div className="fixed inset-0 z-[65] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="award-logs-title"><button className="absolute inset-0 h-full w-full cursor-default bg-black/45 backdrop-blur-[1px]" onClick={() => setLogsOpen(false)} aria-label="Close award logs" /><aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l border-gray-200 bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6"><div><h2 id="award-logs-title" className="text-base font-bold text-slate-900">Award Logs</h2><p className="mt-1 text-xs text-slate-500">Chronological point activity across all groups.</p></div><button onClick={() => setLogsOpen(false)} aria-label="Close award logs" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button></div><div className="border-b border-gray-100 p-4 sm:px-6"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={logsSearch} onChange={(event) => setLogsSearch(event.target.value)} aria-label="Search award logs" placeholder="Search recipient, topic or note..." className={`${inputClass} pl-9`} /></div><div className="mt-2 grid grid-cols-2 gap-2"><select value={logsGroup} onChange={(event) => setLogsGroup(event.target.value)} aria-label="Filter logs by group" className={inputClass}><option>All groups</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select><select value={logsScope} onChange={(event) => setLogsScope(event.target.value)} aria-label="Filter logs by scope" className={inputClass}><option>All scopes</option><option>Whole Group</option><option>Student</option></select></div></div><div className="flex-1 space-y-2 overflow-y-auto p-4 sm:p-6">{filteredLogs.length === 0 ? <div className="py-16 text-center"><History className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-2 text-xs font-semibold text-slate-700">No award logs found</p><p className="mt-1 text-[11px] text-slate-500">Adjust your search or filters.</p></div> : filteredLogs.map((award) => <AwardRow key={award.id} award={award} />)}</div></aside></div>}
    </section>
  )
}

function AwardRow({ award }: { award: AwardEntry }) {
  const positive = award.points > 0
  return <div className={`rounded-lg border p-4 ${positive ? 'border-emerald-100 bg-emerald-50/50' : 'border-rose-100 bg-rose-50/50'}`}><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-3"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${positive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{positive ? <Award className="h-4 w-4" /> : <CircleDollarSign className="h-4 w-4" />}</div><div className="min-w-0"><p className="truncate text-xs font-bold text-slate-900">{award.recipient}</p><p className="mt-0.5 text-[11px] font-medium text-slate-600">{award.topic} · {award.scope}</p><p className="mt-1 text-[11px] leading-5 text-slate-500">{award.description}</p><p className="mt-1 text-[10px] text-slate-400">{award.groupName} · {award.createdAt}{award.visible ? ' · Visible' : ' · Private'}</p></div></div><span className={`shrink-0 text-sm font-bold ${positive ? 'text-emerald-700' : 'text-rose-700'}`}>{positive ? '+' : ''}{award.points}</span></div></div>
}

function CompetitionEditModal({ competition, editForm, setEditForm, onSubmit, onClose }: { competition: Competition; editForm: { name: string; description: string }; setEditForm: (form: { name: string; description: string }) => void; onSubmit: (event: FormEvent) => void; onClose: () => void }) {
  return <Modal title="Edit Competition" description="Update competition details. Participating cohorts cannot be changed." onClose={onClose}><form onSubmit={onSubmit}><div className="space-y-4 p-5 sm:p-6"><div><label className={labelClass} htmlFor="edit-competition-name">Competition name *</label><input id="edit-competition-name" autoFocus value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} className={inputClass} required /></div><div><label className={labelClass} htmlFor="edit-competition-description">Description *</label><textarea id="edit-competition-description" rows={4} value={editForm.description} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} className={inputClass} required /></div><fieldset disabled><legend className={labelClass}>Participating cohorts</legend><div className="space-y-2 rounded-lg border border-gray-200 bg-slate-50 p-3 opacity-75">{competition.cohorts.map((cohort) => <label key={cohort} className="flex items-center gap-3 px-2 py-1.5 text-xs text-slate-600"><input type="checkbox" checked readOnly className="h-4 w-4 accent-teal-600" />{cohort}</label>)}</div></fieldset><div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] leading-5 text-amber-800"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" /><p>Cohorts are locked after creation to protect group membership and award history. Create a new competition to use a different cohort set.</p></div></div><div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4 sm:px-6"><button type="button" onClick={onClose} className={secondaryButton}>Cancel</button><button type="submit" className={primaryButton}>Save Changes</button></div></form></Modal>
}

function RewardsConfiguration({ competitionName, rewards, saveRewards }: { competitionName: string; rewards: RewardConfig; saveRewards: (nextConfig: RewardConfig) => void }) {
  const [draft, setDraft] = useState<RewardConfig>(() => cloneRewardConfig(rewards))
  const [dirty, setDirty] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  const errors = useMemo(() => {
    const nextErrors: string[] = []
    if (!draft.overallTabName.trim() || !draft.fraternityName.trim() || !draft.sideMenuName.trim()) nextErrors.push('Complete all display and naming fields.')
    if (draft.tiers.some((tier) => !tier.title.trim() || !tier.reward.trim())) nextErrors.push('Every reward row needs a title and reward.')
    return nextErrors
  }, [draft])

  const updateDraft = <K extends keyof RewardConfig>(key: K, value: RewardConfig[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setDirty(true)
  }

  const updateTier = (id: string, field: 'title' | 'reward', value: string) => {
    setDraft((current) => ({ ...current, tiers: current.tiers.map((tier) => tier.id === id ? { ...tier, [field]: value } : tier) }))
    setDirty(true)
  }

  const moveTier = (index: number, direction: -1 | 1) => {
    const destination = index + direction
    if (destination < 0 || destination >= draft.tiers.length) return
    setDraft((current) => {
      const tiers = [...current.tiers]
      const [moved] = tiers.splice(index, 1)
      tiers.splice(destination, 0, moved)
      return { ...current, tiers }
    })
    setDirty(true)
  }

  const resetDraft = () => {
    setDraft(cloneRewardConfig(rewards))
    setDirty(false)
  }

  const handleSave = (event: FormEvent) => {
    event.preventDefault()
    if (errors.length > 0) {
      errorRef.current?.focus()
      return
    }
    saveRewards(draft)
    setDirty(false)
  }

  const compactInput = `${inputClass} px-3 py-2 text-xs`

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-teal-700" /><h2 className="text-sm font-bold text-slate-900">Rewards setup</h2></div>
          <p className={`mt-1 text-[11px] font-medium ${dirty ? 'text-amber-700' : 'text-emerald-700'}`}>{dirty ? 'Unsaved changes' : 'All changes saved'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={resetDraft} disabled={!dirty} className={`${secondaryButton} disabled:cursor-not-allowed disabled:opacity-50`}>Reset</button>
          <button type="submit" disabled={!dirty || errors.length > 0} className={primaryButton}><Check className="h-3.5 w-3.5" />Save Configuration</button>
        </div>
      </div>

      {dirty && errors.length > 0 && <div ref={errorRef} tabIndex={-1} role="alert" aria-live="polite" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 outline-none focus:ring-2 focus:ring-rose-300"><p className="font-semibold">Fix the following before saving:</p><ul className="mt-1 list-disc space-y-0.5 pl-4">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}

      <div className="space-y-3">
          <section aria-labelledby="display-naming-title" className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="border-b border-gray-100 px-5 py-4"><h3 id="display-naming-title" className="text-xs font-bold text-slate-900">Display & naming</h3><p className="mt-0.5 text-[11px] text-slate-500">Choose the labels participants see.</p></div>
            <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
              <div><label htmlFor="reward-competition" className={labelClass}>Competition</label><input id="reward-competition" value={competitionName} readOnly aria-readonly="true" className={`${compactInput} cursor-not-allowed bg-slate-50 text-slate-500`} /></div>
              <div><label htmlFor="overall-tab-name" className={labelClass}>Overall tab name *</label><input id="overall-tab-name" value={draft.overallTabName} onChange={(event) => updateDraft('overallTabName', event.target.value)} className={compactInput} aria-invalid={!draft.overallTabName.trim()} /></div>
              <div><label htmlFor="fraternity-name" className={labelClass}>Fraternity name *</label><input id="fraternity-name" value={draft.fraternityName} onChange={(event) => updateDraft('fraternityName', event.target.value)} className={compactInput} aria-invalid={!draft.fraternityName.trim()} /></div>
              <div><label htmlFor="side-menu-name" className={labelClass}>Side menu name *</label><input id="side-menu-name" value={draft.sideMenuName} onChange={(event) => updateDraft('sideMenuName', event.target.value)} className={compactInput} aria-invalid={!draft.sideMenuName.trim()} /></div>
            </div>
          </section>

          <section aria-labelledby="reward-structure-title" className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3"><div><h3 id="reward-structure-title" className="text-xs font-bold text-slate-900">Reward structure</h3><p className="mt-0.5 text-[11px] text-slate-500">Define ranked outcomes and what each receives.</p></div><button type="button" onClick={() => { updateDraft('tiers', [...draft.tiers, { id: `reward-tier-${Date.now()}`, title: '', reward: '' }]) }} className={`${secondaryButton} shrink-0 px-3 py-2`}><Plus className="h-3.5 w-3.5" />Add reward</button></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[620px] border-collapse text-left text-xs"><thead><tr className="border-b border-gray-100 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="w-10 px-2 py-3.5"><span className="sr-only">Reorder</span></th><th className="w-12 px-2 py-3.5">Rank</th><th className="px-2 py-3.5">Title</th><th className="px-2 py-3.5">Reward</th><th className="w-36 px-3 py-3.5 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{draft.tiers.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No rewards configured. Add a reward to define the first ranked outcome.</td></tr> : draft.tiers.map((tier, index) => <tr key={tier.id} className="transition-colors hover:bg-teal-50/30"><td className="px-2 py-3.5 text-slate-300"><GripVertical className="h-4 w-4" aria-hidden="true" /></td><td className="px-2 py-3.5"><span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-700">{index + 1}</span></td><td className="px-2 py-3.5"><label className="sr-only" htmlFor={`tier-title-${tier.id}`}>Reward {index + 1} title</label><input id={`tier-title-${tier.id}`} value={tier.title} onChange={(event) => updateTier(tier.id, 'title', event.target.value)} className={compactInput} placeholder="e.g. Winner" aria-invalid={!tier.title.trim()} /></td><td className="px-2 py-3.5"><label className="sr-only" htmlFor={`tier-reward-${tier.id}`}>Reward {index + 1} value</label><input id={`tier-reward-${tier.id}`} value={tier.reward} onChange={(event) => updateTier(tier.id, 'reward', event.target.value)} className={compactInput} placeholder="e.g. ₹10,00,000" aria-invalid={!tier.reward.trim()} /></td><td className="px-3 py-3.5"><div className="flex justify-end gap-0.5"><button type="button" onClick={() => moveTier(index, -1)} disabled={index === 0} aria-label={`Move ${tier.title || `reward ${index + 1}`} up`} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" onClick={() => moveTier(index, 1)} disabled={index === draft.tiers.length - 1} aria-label={`Move ${tier.title || `reward ${index + 1}`} down`} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button><button type="button" onClick={() => updateDraft('tiers', draft.tiers.filter((item) => item.id !== tier.id))} aria-label={`Delete ${tier.title || `reward ${index + 1}`}`} className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>)}</tbody></table></div>
          </section>
      </div>
    </form>
  )
}
