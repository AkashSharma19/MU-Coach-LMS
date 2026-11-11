import { useEffect, useId, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react'
import {
  Archive,
  BarChart3,
  Bell,
  Bold,
  Bookmark,
  CalendarClock,
  Check,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileText,
  Globe,
  Grid2X2,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Pencil,
  Pin,
  Plus,
  Quote,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Strikethrough,
  Table2,
  ThumbsUp,
  Trash2,
  Underline,
  Upload,
  Users,
  Video,
  X
} from 'lucide-react'

export type PostType = 'Announcement' | 'Community'

export type AnnouncementCategory =
  | 'Academics'
  | 'Placements'
  | 'Events'
  | 'Clubs'
  | 'Alerts'
  | 'General'

export type CommunityCategory =
  | 'Kudos'
  | 'Jobs'
  | 'Lost & Found'
  | 'Discussions'

export type Category =
  | AnnouncementCategory
  | CommunityCategory
  | 'Clubs & Life'
  | 'General Operational'

export const ANNOUNCEMENT_CATEGORIES: AnnouncementCategory[] = [
  'Academics',
  'Placements',
  'Events',
  'Clubs',
  'Alerts',
  'General'
]

export const COMMUNITY_CATEGORIES: CommunityCategory[] = [
  'Kudos',
  'Jobs',
  'Lost & Found',
  'Discussions'
]
export type Priority = 'Standard' | 'Pinned'
export type PostStatus = 'Published' | 'Scheduled' | 'Expired' | 'Draft' | 'Archived'
export type Channel = 'LMS Feed' | 'Mobile push' | 'WhatsApp'
export type MobilePushContent = { title: string; message: string; imageUrl?: string; deepLink?: string }
export type WhatsAppContent = { title: string; description: string }
export type Attachment = { id: string; name: string; type: 'file' | 'youtube'; url?: string }
export type DeliveryEstimate = { audienceMembers: number; inAppEligible: number; pushEligibleDevices: number; whatsappEligibleContacts: number }

export interface Post {
  id: string
  title: string
  body: string
  postType?: PostType
  category: Category
  priority: Priority
  audience: string
  channels: Channel[]
  mobilePushContent?: MobilePushContent
  whatsappContent?: WhatsAppContent
  publishDate: string
  expiry?: string
  status: PostStatus
  author: string
  role: string
  attachments: Attachment[]
  likes: number
  comments: number
  shares: number
  views: number
  reach: number
  acknowledgementRequired: boolean
  acknowledgements: number
  audienceCount: number
  allowLikes: boolean
  allowComments: boolean
  allowSharing: boolean
  targeting: {
    program: string[]
    cohort: string[]
    term: string[]
    section: string[]
    club: string[]
  }
}

export type FormState = {
  postType: PostType
  category: Category | ''
  priority: Priority
  expiry: string
  acknowledgementRequired: boolean
  title: string
  body: string
  attachments: Attachment[]
  youtubeUrl: string
  pushTitle: string
  pushMessage: string
  imageUrl: string
  deepLink: string
  whatsappTitle: string
  whatsappDescription: string
  allowLikes: boolean
  allowComments: boolean
  allowSharing: boolean
  program: string[]
  cohort: string[]
  term: string[]
  section: string[]
  club: string[]
  channels: Channel[]
  scheduleMode: 'now' | 'later'
  scheduledAt: string
}

interface AnnouncementsPageProps {
  onActionNotify?: (message: string) => void
}

export const CATEGORIES: Category[] = [
  ...ANNOUNCEMENT_CATEGORIES,
  ...COMMUNITY_CATEGORIES
]
const PROGRAMS = ['PGP in Technology & Business Management', 'Undergraduate Programme', 'PGP Rise']
const COHORTS: Record<string, string[]> = {
  'PGP in Technology & Business Management': ['Cohort 7', 'Cohort 8'],
  'Undergraduate Programme': ['Cohort 3', 'Cohort 4'],
  'PGP Rise': ['Cohort 2']
}
const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Term 4']
const SECTIONS = ['Section 1', 'Section 2', 'Section 3']
const CLUBS = ['Entrepreneurship Cell', 'Consulting Club', 'Cultural Committee', 'Sports Council']
const STUDENTS = ['Aarav Mehta', 'Aanya Bose', 'Diya Shah', 'Kabir Rao', 'Meera Iyer', 'Neil Bhat', 'Rhea Kapoor', 'Vivaan Roy']

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string; bar: string; badge: string }> = {
  Academics: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    bar: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  Placements: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    bar: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  Events: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  Clubs: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  'Clubs & Life': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  Alerts: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  General: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    bar: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-700 border-slate-300'
  },
  'General Operational': {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    bar: 'bg-slate-500',
    badge: 'bg-slate-100 text-slate-700 border-slate-300'
  },
  Kudos: {
    bg: 'bg-lime-50',
    text: 'text-lime-800',
    border: 'border-lime-200',
    bar: 'bg-lime-500',
    badge: 'bg-lime-50 text-lime-800 border-lime-200'
  },
  Jobs: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    bar: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  'Lost & Found': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    bar: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  Discussions: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    bar: 'bg-cyan-500',
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  }
}

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const estimateAudience = (form: Pick<FormState, 'program' | 'cohort' | 'term' | 'section' | 'club' | 'channels'>): DeliveryEstimate => {
  const programSizes: Record<string, number> = { [PROGRAMS[0]]: 420, [PROGRAMS[1]]: 280, [PROGRAMS[2]]: 160 }
  let members = form.program.reduce((sum, program) => sum + (programSizes[program] ?? 0), 0)
  if (form.cohort.length) {
    const available = form.program.reduce((sum, program) => sum + (COHORTS[program]?.length ?? 0), 0)
    members *= form.cohort.length / Math.max(1, available)
  }
  if (form.term.length) members *= Math.min(1, form.term.length / TERMS.length + 0.08)
  if (form.section.length) members *= Math.min(1, form.section.length / SECTIONS.length)
  if (form.club.length) members *= Math.min(0.62, 0.16 * form.club.length)
  const audienceMembers = Math.max(form.program.length ? 18 : 0, Math.round(members))
  return {
    audienceMembers,
    inAppEligible: form.channels.includes('LMS Feed') ? audienceMembers : 0,
    pushEligibleDevices: form.channels.includes('Mobile push') ? Math.round(audienceMembers * 0.76) : 0,
    whatsappEligibleContacts: form.channels.includes('WhatsApp') ? Math.round(audienceMembers * 0.81) : 0
  }
}

const nowLocal = () => {
  const value = new Date(Date.now() + 60 * 60 * 1000)
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset())
  return value.toISOString().slice(0, 16)
}

const CHANNELS: Channel[] = ['LMS Feed', 'Mobile push', 'WhatsApp']
const channelLabel = (channel: Channel) => (channel === 'LMS Feed' ? 'In-App & Web Feed' : channel === 'Mobile push' ? 'Mobile Push' : channel)

const blankForm = (): FormState => ({
  postType: 'Announcement',
  category: 'Academics',
  priority: 'Standard',
  expiry: '',
  acknowledgementRequired: false,
  title: '',
  body: '',
  attachments: [],
  youtubeUrl: '',
  pushTitle: '',
  pushMessage: '',
  imageUrl: '',
  deepLink: '',
  whatsappTitle: '',
  whatsappDescription: '',
  allowLikes: true,
  allowComments: true,
  allowSharing: true,
  program: [PROGRAMS[0]],
  cohort: [],
  term: [],
  section: [],
  club: [],
  channels: ['LMS Feed'],
  scheduleMode: 'now',
  scheduledAt: nowLocal()
})

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    title: 'Term 2 examination schedule and hall protocols',
    body: 'The final examination timetable is now available. Review reporting times, permitted materials, and room allocations before Friday.\n\n• Reporting time: 08:30 AM sharp\n• Admit card and student ID are mandatory\n• Calculators permitted only for quantitative subjects\n\nContact the Academic Administration desk for conflict resolutions.',
    category: 'Academics',
    priority: 'Pinned',
    audience: 'PGP TBM · Cohorts 7–8',
    channels: ['LMS Feed', 'Mobile push', 'WhatsApp'],
    mobilePushContent: {
      title: 'Term 2 examination schedule',
      message: 'The final timetable is available. Review reporting times, materials, and hall allocations before Friday.',
      deepLink: '/academics/examinations/term-2'
    },
    whatsappContent: {
      title: 'Term 2 exam schedule and hall protocols',
      description: 'Review the final exam timetable, reporting times, permitted materials and room allocations before Friday. Open the LMS post for the complete schedule.'
    },
    publishDate: '2026-10-27T09:00',
    expiry: '2026-11-08T18:00',
    status: 'Published',
    author: 'Office of Academics',
    role: 'Academic Administration',
    attachments: [{ id: 'a1', name: 'Term-2-exam-schedule.pdf', type: 'file' }],
    likes: 84,
    comments: 12,
    shares: 9,
    views: 412,
    reach: 388,
    acknowledgementRequired: true,
    acknowledgements: 296,
    audienceCount: 420,
    allowLikes: true,
    allowComments: true,
    allowSharing: true,
    targeting: { program: [PROGRAMS[0]], cohort: ['Cohort 7', 'Cohort 8'], term: [], section: [], club: [] }
  },
  {
    id: 'p2',
    title: 'Founders Day 2026: a celebration of innovation',
    body: 'From keynote presentations and venture showcases to the alumni fireside chat, here are the milestone moments that made this year’s celebration unforgettable.\n\nThank you to all organizing committees, student ambassadors, and faculty mentors who contributed.',
    category: 'Events',
    priority: 'Standard',
    audience: 'All students',
    channels: ['LMS Feed', 'Mobile push'],
    mobilePushContent: {
      title: 'Founders Day 2026 highlights',
      message: 'See the student showcases, alumni fireside and memorable moments from this year’s celebration.',
      imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=640&q=70',
      deepLink: '/feed/founders-day-2026'
    },
    publishDate: '2026-10-26T16:30',
    status: 'Published',
    author: 'Campus Events',
    role: 'Student Experience',
    attachments: [
      { id: 'a2', name: 'Founders Day gallery · 4 images', type: 'file' },
      { id: 'a3', name: 'Event highlights video', type: 'youtube', url: 'https://youtube.com/watch?v=campus' }
    ],
    likes: 156,
    comments: 28,
    shares: 31,
    views: 680,
    reach: 594,
    acknowledgementRequired: false,
    acknowledgements: 0,
    audienceCount: 760,
    allowLikes: true,
    allowComments: true,
    allowSharing: true,
    targeting: { program: [...PROGRAMS], cohort: [], term: [], section: [], club: [] }
  },
  {
    id: 'p3',
    title: 'Placement week: consulting shortlist published',
    body: 'Shortlisted candidates can now view their preliminary interview slots in the placement portal.\n\n> The mandatory preparation briefing starts tomorrow at 8:30 AM in Auditorium 2.\n\nPlease carry 3 hard copies of your vetted resume and business formal attire.',
    category: 'Placements',
    priority: 'Pinned',
    audience: 'PGP TBM · Cohort 7',
    channels: ['LMS Feed', 'Mobile push', 'WhatsApp'],
    mobilePushContent: {
      title: 'Consulting shortlist published',
      message: 'Check your interview slot in the placement portal and join tomorrow’s 8:30 AM briefing.'
    },
    whatsappContent: {
      title: 'Consulting shortlist and interview slots',
      description: 'The consulting shortlist is live. Check your interview slot and join tomorrow’s 8:30 AM briefing. Open the LMS post for full instructions.'
    },
    publishDate: '2026-10-27T11:15',
    expiry: '2026-11-02T20:00',
    status: 'Published',
    author: 'Career Services',
    role: 'Placement Office',
    attachments: [{ id: 'a4', name: 'Interview-readiness-checklist.pdf', type: 'file' }],
    likes: 42,
    comments: 6,
    shares: 3,
    views: 236,
    reach: 219,
    acknowledgementRequired: true,
    acknowledgements: 181,
    audienceCount: 240,
    allowLikes: false,
    allowComments: true,
    allowSharing: false,
    targeting: { program: [PROGRAMS[0]], cohort: ['Cohort 7'], term: [], section: [], club: [] }
  },
  {
    id: 'p4',
    title: 'Consulting Club peer case practice circles',
    body: 'Weekly peer-led case interview practice sessions begin this Wednesday. Register your cohort track and reserve your group case partner slot on the portal.\n\nTracks available: Market Entry, M&A Valuation, and Growth Strategy.',
    category: 'Clubs & Life',
    priority: 'Standard',
    audience: 'Consulting Club',
    channels: ['LMS Feed', 'Mobile push'],
    mobilePushContent: {
      title: 'Case practice circles start Wednesday',
      message: 'Choose a track and reserve your weekly peer-led case practice group slot.'
    },
    publishDate: '2026-10-25T13:00',
    status: 'Published',
    author: 'Consulting Club',
    role: 'Student Club',
    attachments: [],
    likes: 61,
    comments: 19,
    shares: 14,
    views: 302,
    reach: 271,
    acknowledgementRequired: false,
    acknowledgements: 0,
    audienceCount: 330,
    allowLikes: true,
    allowComments: true,
    allowSharing: true,
    targeting: { program: [PROGRAMS[0]], cohort: [], term: [], section: [], club: ['Consulting Club'] }
  },
  {
    id: 'p5',
    title: 'Digital library system maintenance window',
    body: 'Digital library authentication will be briefly unavailable during scheduled cloud infrastructure maintenance this weekend from 10:00 PM to 02:00 AM.\n\nOffline reading materials downloaded previously will remain accessible.',
    category: 'General Operational',
    priority: 'Standard',
    audience: 'All students',
    channels: ['LMS Feed', 'Mobile push'],
    mobilePushContent: {
      title: 'Library maintenance window',
      message: 'Digital library authentication will be briefly unavailable during scheduled maintenance.'
    },
    publishDate: '2026-11-05T20:00',
    status: 'Scheduled',
    author: 'Akash Sharma',
    role: 'Super Admin',
    attachments: [],
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
    reach: 0,
    acknowledgementRequired: false,
    acknowledgements: 0,
    audienceCount: 760,
    allowLikes: false,
    allowComments: false,
    allowSharing: false,
    targeting: { program: [...PROGRAMS], cohort: [], term: [], section: [], club: [] }
  },
  {
    id: 'p6',
    title: 'Faculty office hours & mentorship directory refresh',
    body: 'A refreshed directory of faculty office hours, advisory specializations, and booking links is being prepared for the upcoming term.',
    category: 'Academics',
    priority: 'Standard',
    audience: 'Undergraduate Programme',
    channels: ['LMS Feed', 'Mobile push'],
    mobilePushContent: {
      title: 'Faculty office hours refresh',
      message: 'A refreshed faculty office hours directory is being prepared for the next academic term.'
    },
    publishDate: '2026-10-27T12:00',
    status: 'Draft',
    author: 'Akash Sharma',
    role: 'Super Admin',
    attachments: [],
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
    reach: 0,
    acknowledgementRequired: false,
    acknowledgements: 0,
    audienceCount: 280,
    allowLikes: true,
    allowComments: true,
    allowSharing: true,
    targeting: { program: [PROGRAMS[1]], cohort: [], term: [], section: [], club: [] }
  },
  {
    id: 'p7',
    title: 'Campus shuttle route schedule update',
    body: 'The temporary late-evening route has concluded. Standard shuttle timings between campus and the metro hub have been restored.',
    category: 'General Operational',
    priority: 'Pinned',
    audience: 'All students',
    channels: ['LMS Feed', 'Mobile push'],
    mobilePushContent: {
      title: 'Campus shuttle timings restored',
      message: 'The temporary evening route has ended. Regular campus shuttle timings are now restored.'
    },
    publishDate: '2026-09-28T08:00',
    expiry: '2026-10-05T23:59',
    status: 'Expired',
    author: 'Campus Operations',
    role: 'Administration',
    attachments: [],
    likes: 18,
    comments: 2,
    shares: 1,
    views: 521,
    reach: 472,
    acknowledgementRequired: true,
    acknowledgements: 403,
    audienceCount: 760,
    allowLikes: false,
    allowComments: false,
    allowSharing: false,
    targeting: { program: [...PROGRAMS], cohort: [], term: [], section: [], club: [] }
  },
  {
    id: 'post-whatsapp-only',
    title: 'Consulting Interview Slot Preference Closes at 11:59 PM',
    body: 'Final reminder: McKinsey & BCG interview slot preference forms close tonight at 11:59 PM. Please verify your selections on the placements portal.',
    category: 'Placements',
    priority: 'Standard',
    audience: 'PGP TBM · Cohort 7',
    channels: ['WhatsApp'],
    whatsappContent: {
      title: 'Deloitte & BCG Slot Booking Final Reminder',
      description: 'Interview preference window closes tonight at 11:59 PM. Please verify your priority ordering immediately on the placement portal: https://mastersunion.org/placements'
    },
    publishDate: '2026-10-27T14:30',
    status: 'Published',
    author: 'Career Services',
    role: 'Placement Office',
    attachments: [],
    likes: 0,
    comments: 0,
    shares: 0,
    views: 240,
    reach: 226,
    acknowledgementRequired: false,
    acknowledgements: 0,
    audienceCount: 240,
    allowLikes: false,
    allowComments: false,
    allowSharing: false,
    targeting: { program: ['PGP in Technology & Business Management'], cohort: ['Cohort 7'], term: [], section: [], club: [] }
  },
  {
    id: 'post-push-only',
    title: 'Flash Alert: Fireside Chat with Kunal Shah (CRED) in 15 mins',
    body: 'Doors close at 4:25 PM in Auditorium 1. Seating is strictly on a first-come, first-served basis for all cohorts.',
    category: 'Events',
    priority: 'Standard',
    audience: 'All students',
    channels: ['Mobile push'],
    mobilePushContent: {
      title: 'Kunal Shah Fireside starts in 15m! 🚀',
      message: 'Doors closing at 4:25 PM in Audi 1. First-come first-served seating.',
      deepLink: '/events/kunal-shah-fireside'
    },
    publishDate: '2026-10-27T16:15',
    status: 'Published',
    author: 'Student Experience',
    role: 'Campus Life',
    attachments: [],
    likes: 0,
    comments: 0,
    shares: 0,
    views: 760,
    reach: 680,
    acknowledgementRequired: false,
    acknowledgements: 0,
    audienceCount: 760,
    allowLikes: false,
    allowComments: false,
    allowSharing: false,
    targeting: { program: [...PROGRAMS], cohort: [], term: [], section: [], club: [] }
  },
  {
    id: 'post-community-kudos',
    title: 'Huge Kudos to our Hult Prize Regional Finalists! 🏆',
    body: 'Big shoutout to Team EcoTrack (Cohort 7) for qualifying for the Hult Prize global regional summit in Lisbon! Drop your congratulations below! 🎉👏',
    postType: 'Community',
    category: 'Kudos',
    priority: 'Standard',
    audience: 'All students',
    channels: ['LMS Feed'],
    publishDate: '2026-10-27T15:00',
    status: 'Published',
    author: 'Aarav Mehta',
    role: 'Student · Cohort 7',
    attachments: [],
    likes: 64,
    comments: 14,
    shares: 8,
    views: 480,
    reach: 420,
    acknowledgementRequired: false,
    acknowledgements: 0,
    audienceCount: 760,
    allowLikes: true,
    allowComments: true,
    allowSharing: true,
    targeting: { program: [...PROGRAMS], cohort: [], term: [], section: [], club: [] }
  }
]

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 shadow-2xs outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700'
const primaryButton =
  'inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButton =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'

const dateText = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))

const relativeTime = (value: string) => {
  const diff = Date.now() - new Date(value).getTime()
  const hours = Math.round(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return dateText(value)
}

const computedStatus = (post: Post): PostStatus => {
  if (post.status === 'Draft' || post.status === 'Archived' || post.status === 'Expired') return post.status
  const now = Date.now()
  const isPublished = post.status === 'Published' || (post.status === 'Scheduled' && new Date(post.publishDate).getTime() <= now)
  if (!isPublished) return post.status
  return post.expiry && new Date(post.expiry).getTime() <= now ? 'Expired' : 'Published'
}

const statusBadgeConfig: Record<PostStatus, { label: string; bg: string; text: string; dot: string; border: string }> = {
  Published: {
    label: 'Live',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500 animate-pulse',
    border: 'border-emerald-200'
  },
  Scheduled: {
    label: 'Scheduled',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
    border: 'border-indigo-200'
  },
  Draft: {
    label: 'Draft',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    border: 'border-amber-200'
  },
  Expired: {
    label: 'Expired',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
    border: 'border-slate-200'
  },
  Archived: {
    label: 'Archived',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    dot: 'bg-rose-400',
    border: 'border-rose-200'
  }
}

const validDate = (value?: string) => Boolean(value) && Number.isFinite(new Date(value as string).getTime())

type PublicationData = Pick<
  Post,
  'title' | 'body' | 'category' | 'priority' | 'expiry' | 'targeting' | 'channels' | 'mobilePushContent' | 'whatsappContent'
> & { scheduleMode: 'now' | 'later'; scheduledAt: string }

const validateChannelContent = (
  data: Pick<PublicationData, 'title' | 'body' | 'category' | 'priority' | 'expiry' | 'channels' | 'mobilePushContent' | 'whatsappContent'>
) => {
  if (!data.channels.length) return 'Select at least one delivery channel.'
  if (!data.category) return 'Category is required.'
  if (data.channels.includes('LMS Feed')) {
    if (!data.title.trim() || !data.body.trim()) return 'In-App title and body are required.'
    if (data.title.length > 200) return 'In-App title must be 200 characters or fewer.'
    if (data.priority === 'Pinned' && data.expiry && !validDate(data.expiry)) return 'Choose a valid notice expiry date and time.'
  }
  if (data.channels.includes('Mobile push')) {
    if (!data.mobilePushContent?.title.trim() || !data.mobilePushContent.message.trim())
      return 'Push title and message are required when Mobile Push is selected.'
    if (data.mobilePushContent.title.length > 65) return 'Push title must be 65 characters or fewer.'
    if (data.mobilePushContent.message.length > 180) return 'Push message must be 180 characters or fewer.'
    if (data.mobilePushContent.imageUrl?.trim() && !isHttpUrl(data.mobilePushContent.imageUrl.trim()))
      return 'Image URL must begin with http:// or https://.'
    const deepLink = data.mobilePushContent.deepLink?.trim()
    if (deepLink && !deepLink.startsWith('/') && !isHttpUrl(deepLink)) return 'Deep link must be an app path beginning with / or an http(s) URL.'
  }
  if (data.channels.includes('WhatsApp')) {
    if (!data.whatsappContent?.title.trim() || !data.whatsappContent.description.trim())
      return 'WhatsApp title and description are required when WhatsApp is selected.'
    if (data.whatsappContent.title.length > 60) return 'WhatsApp title must be 60 characters or fewer.'
    if (data.whatsappContent.description.length > 500) return 'WhatsApp description must be 500 characters or fewer.'
  }
  return ''
}

const validatePublication = (data: PublicationData, allowPastSchedule = false) => {
  const contentError = validateChannelContent(data)
  if (contentError) return contentError
  if (!data.targeting.program.length) return 'Select at least one program before publishing.'
  if (data.targeting.program.some((program) => !PROGRAMS.includes(program))) return 'Audience targeting contains an invalid program.'
  const validCohorts = data.targeting.program.flatMap((program) => COHORTS[program] ?? [])
  if (data.targeting.cohort.some((cohort) => !validCohorts.includes(cohort)))
    return 'Audience targeting contains a cohort outside the selected program.'
  if (
    data.targeting.term.some((term) => !TERMS.includes(term)) ||
    (data.targeting.term.length > 0 && !data.targeting.cohort.length)
  )
    return 'Audience targeting contains an invalid term selection.'
  if (
    data.targeting.section.some((section) => !SECTIONS.includes(section)) ||
    (data.targeting.section.length > 0 && !data.targeting.term.length)
  )
    return 'Audience targeting contains an invalid section selection.'
  if (data.targeting.club.some((club) => !CLUBS.includes(club))) return 'Audience targeting contains an invalid club or group.'
  if (data.scheduleMode === 'later') {
    if (!validDate(data.scheduledAt)) return 'Choose a valid schedule date and time.'
    if (!allowPastSchedule && new Date(data.scheduledAt).getTime() <= Date.now()) return 'Choose a future schedule date and time.'
  }
  if (data.priority === 'Pinned' && data.expiry) {
    const effectivePublication =
      data.scheduleMode === 'later' && !allowPastSchedule ? new Date(data.scheduledAt).getTime() : Date.now()
    if (new Date(data.expiry).getTime() <= effectivePublication)
      return data.scheduleMode === 'later' && !allowPastSchedule
        ? 'Notice expiry must be after the scheduled publication time.'
        : 'Notice expiry must be after the current time.'
  }
  return ''
}

type AnalyticsChannel = 'feed' | 'in-app' | 'whatsapp'
type AnalyticsMetric = { label: string; value: number; helper?: string; icon: any; color: string }
type ChannelAnalytics = { available: boolean; pending: boolean; metrics: AnalyticsMetric[] }

const stableRatio = (key: string, minimum: number, maximum: number) => {
  const hash = Array.from(key).reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 2166136261)
  return minimum + ((hash % 1000) / 999) * (maximum - minimum)
}

const deriveChannelAnalytics = (post: Post, channel: AnalyticsChannel): ChannelAnalytics => {
  const count = (value: number, ceiling: number) => Math.max(0, Math.min(Math.round(value), Math.max(0, ceiling)))
  const deliveryPending = ['Draft', 'Scheduled'].includes(computedStatus(post))
  if (channel === 'feed') {
    const selected = post.channels.includes('LMS Feed')
    const delivered = Math.max(0, post.audienceCount)
    return {
      available: selected && !deliveryPending,
      pending: selected && deliveryPending,
      metrics: [
        { label: 'Audience Delivered', value: delivered, helper: 'Targeted students', icon: Users, color: 'text-teal-600 bg-teal-50' },
        { label: 'Unique Reach', value: count(post.reach, delivered), helper: 'Opened student feed', icon: Eye, color: 'text-indigo-600 bg-indigo-50' },
        { label: 'Total Views', value: Math.max(0, post.views), helper: 'Overall impressions', icon: BarChart3, color: 'text-purple-600 bg-purple-50' },
        { label: 'Student Reactions', value: Math.max(0, post.likes + post.comments + post.shares), helper: 'Likes & Comments', icon: ThumbsUp, color: 'text-emerald-600 bg-emerald-50' }
      ]
    }
  }
  if (channel === 'in-app') {
    const selected = post.channels.includes('Mobile push')
    const targeted = Math.max(0, post.audienceCount)
    const delivered = count(targeted * stableRatio(`${post.id}-push-delivered`, 0.76, 0.94), targeted)
    const opened = count(delivered * stableRatio(`${post.id}-push-opened`, 0.45, 0.75), delivered)
    const clicks = count(opened * stableRatio(`${post.id}-push-clicks`, 0.15, 0.4), opened)
    return {
      available: selected && !deliveryPending,
      pending: selected && deliveryPending,
      metrics: [
        { label: 'Target Devices', value: targeted, helper: 'Registered phones', icon: Smartphone, color: 'text-slate-600 bg-slate-100' },
        { label: 'Push Delivered', value: delivered, helper: 'Lock-screen received', icon: Bell, color: 'text-indigo-600 bg-indigo-50' },
        { label: 'Notifications Opened', value: opened, helper: 'Tapped push', icon: Eye, color: 'text-teal-600 bg-teal-50' },
        { label: 'Deep Link Clicks', value: clicks, helper: 'Navigated to module', icon: ChevronRight, color: 'text-emerald-600 bg-emerald-50' }
      ]
    }
  }
  const selected = post.channels.includes('WhatsApp')
  const targeted = count(post.audienceCount * 0.81, post.audienceCount)
  const delivered = count(targeted * stableRatio(`${post.id}-whatsapp-delivered`, 0.92, 0.98), targeted)
  const read = count(delivered * stableRatio(`${post.id}-whatsapp-read`, 0.65, 0.88), delivered)
  const clicks = count(read * stableRatio(`${post.id}-whatsapp-clicks`, 0.15, 0.4), read)
  return {
    available: selected && !deliveryPending,
    pending: selected && deliveryPending,
    metrics: [
      { label: 'Contacts Targeted', value: targeted, helper: 'Verified WhatsApp numbers', icon: Users, color: 'text-slate-600 bg-slate-100' },
      { label: 'Messages Sent', value: delivered, helper: 'Delivered (two ticks)', icon: MessageCircle, color: 'text-emerald-600 bg-emerald-50' },
      { label: 'Read Receipts', value: read, helper: 'Read (blue ticks)', icon: Eye, color: 'text-teal-600 bg-teal-50' },
      { label: 'Portal Link Clicks', value: clicks, helper: 'Clicked LMS URL', icon: ChevronRight, color: 'text-indigo-600 bg-indigo-50' }
    ]
  }
}

const initialAnalyticsChannel = (post: Post): AnalyticsChannel =>
  post.channels.includes('LMS Feed') ? 'feed' : post.channels.includes('Mobile push') ? 'in-app' : 'whatsapp'

function useDialogFocus(panelRef: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])
  const openerRef = useRef<HTMLElement | null>(document.activeElement instanceof HTMLElement ? document.activeElement : null)
  useEffect(() => {
    const panel = panelRef.current
    const opener = openerRef.current
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        ) ?? []
      )
    focusable()[0]?.focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
      if (event.key !== 'Tab') return
      const items = focusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('keydown', keydown)
      opener?.focus()
    }
  }, [panelRef])
}

function Overlay({
  title,
  description,
  onClose,
  children
}: {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  useDialogFocus(panelRef, onClose)
  return (
    <div className="fixed inset-0 z-[70] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-slate-950/40 backdrop-blur-xs transition-opacity"
        aria-label={`Close ${title}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 id={titleId} className="text-base font-bold text-slate-900">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
        checked ? 'bg-teal-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  disabled = false,
  required = false
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  disabled?: boolean
  required?: boolean
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLFieldSetElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const labelId = useId()
  const listboxId = useId()
  const unavailable = disabled || options.length === 0
  const isOpen = open && !unavailable
  const summary =
    selected.length === 0
      ? `Select ${label.toLowerCase().replace(' (optional)', '')}`
      : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`

  useEffect(() => {
    if (!isOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isOpen])

  const openAndFocus = (index: number) => {
    if (unavailable) return
    setOpen(true)
    requestAnimationFrame(() => optionRefs.current[index]?.focus())
  }
  const moveFocus = (index: number) => optionRefs.current[(index + options.length) % options.length]?.focus()

  return (
    <fieldset ref={rootRef} className="relative min-w-0 overflow-visible" disabled={unavailable}>
      <legend id={labelId} className={labelClass}>
        {label}
        {required && ' *'}
      </legend>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby={`${labelId} ${listboxId}-summary`}
        aria-required={required}
        disabled={unavailable}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            openAndFocus(
              event.key === 'ArrowUp'
                ? options.length - 1
                : Math.max(
                    0,
                    options.findIndex((option) => selected.includes(option))
                  )
            )
          } else if (event.key === 'Escape' && isOpen) {
            event.preventDefault()
            event.stopPropagation()
            setOpen(false)
          }
        }}
        className={`${inputClass} flex items-center justify-between gap-3 text-left ${
          selected.length ? 'text-slate-800' : 'text-slate-400'
        }`}
      >
        <span id={`${listboxId}-summary`} className="truncate">
          {unavailable ? 'Select previous hierarchy level' : summary}
        </span>
        <ChevronRight
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${isOpen ? '-rotate-90' : 'rotate-90'}`}
        />
      </button>
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          aria-multiselectable="true"
          className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-52 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          {options.map((option, index) => {
            const isSelected = selected.includes(option)
            return (
              <button
                key={option}
                ref={(element) => {
                  optionRefs.current[index] = element
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() =>
                  onChange(isSelected ? selected.filter((value) => value !== option) : [...selected, option])
                }
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    moveFocus(index + 1)
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    moveFocus(index - 1)
                  } else if (event.key === 'Home') {
                    event.preventDefault()
                    optionRefs.current[0]?.focus()
                  } else if (event.key === 'End') {
                    event.preventDefault()
                    optionRefs.current[options.length - 1]?.focus()
                  } else if (event.key === 'Escape') {
                    event.preventDefault()
                    event.stopPropagation()
                    setOpen(false)
                    triggerRef.current?.focus()
                  } else if (event.key === 'Tab') setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-xs transition ${
                  isSelected ? 'bg-teal-50 font-semibold text-teal-800' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{option}</span>
                <Check
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-teal-600' : 'invisible'}`}
                />
              </button>
            )
          })}
        </div>
      )}
    </fieldset>
  )
}

function PushPreview({
  title,
  message,
  imageUrl,
  deepLink
}: {
  title: string
  message: string
  imageUrl?: string
  deepLink?: string
}) {
  return (
    <aside aria-label="Mobile push preview" className="rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-xs">
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-xs">
        {imageUrl?.trim() && (
          <div className="h-24 bg-slate-200">
            <img
              src={imageUrl.trim()}
              alt="Push preview"
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden'
              }}
            />
          </div>
        )}
        <div className="flex items-start gap-2.5 p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-[10px] font-bold text-white shadow-xs">
            MU
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Coach LMS</p>
              <span className="text-[9px] text-slate-400">now</span>
            </div>
            <p className="mt-0.5 break-words text-xs font-bold text-slate-900">{title || 'Notification title'}</p>
            <p className="mt-0.5 break-words text-[11px] leading-4 text-slate-600">
              {message || 'Lock-screen notification body text will appear here.'}
            </p>
            <p className="mt-1.5 truncate text-[10px] font-semibold text-teal-700">
              Tap to open {deepLink?.trim() || 'Feed item'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function WhatsAppPreview({ title, description }: { title: string; description: string }) {
  return (
    <aside
      aria-label="WhatsApp preview"
      className="overflow-hidden rounded-2xl border border-emerald-900/15 bg-[#e5ddd5] shadow-xs"
    >
      <div className="flex items-center gap-2 bg-[#075e54] px-3.5 py-2.5 text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-bold text-emerald-800">
          MU
        </span>
        <div>
          <p className="text-xs font-bold leading-tight">Masters’ Union LMS</p>
          <p className="text-[9px] text-emerald-100">Official Campus Broadcast</p>
        </div>
      </div>
      <div className="p-3">
        <div className="rounded-xl bg-white p-3 shadow-xs">
          <p className="break-words text-xs font-bold text-slate-900">{title || 'Announcement Title'}</p>
          <p className="mt-1 whitespace-pre-wrap break-words text-[11px] leading-4 text-slate-600">
            {description || 'Summary broadcast message will appear here.'}
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-teal-700 font-semibold">
            <span>Open in Coach LMS</span>
            <span className="text-[9px] font-normal text-slate-400">now ✓✓</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function FormattedPostBody({ body }: { body: string }) {
  return (
    <div className="space-y-2 break-words text-xs leading-5 text-slate-600">
      {body.split('\n').map((line, index) => {
        if (!line.trim()) return <div key={index} aria-hidden="true" className="h-1.5" />
        const bullet = line.match(/^\s*[-*•]\s+(.*)$/)
        if (bullet) {
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
              <span className="min-w-0">{bullet[1]}</span>
            </div>
          )
        }
        const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/)
        if (numbered) {
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <span className="shrink-0 font-semibold text-teal-700">{numbered[1]}.</span>
              <span className="min-w-0">{numbered[2]}</span>
            </div>
          )
        }
        const quote = line.match(/^\s*>\s+(.*)$/)
        if (quote) {
          return (
            <blockquote
              key={index}
              className="rounded-r-lg border-l-2 border-teal-500 bg-teal-50/50 py-1.5 pl-3 pr-2 italic text-slate-700"
            >
              {quote[1]}
            </blockquote>
          )
        }
        return (
          <p key={index} className="whitespace-pre-wrap">
            {line}
          </p>
        )
      })}
    </div>
  )
}

function AttachmentCard({ attachment }: { attachment: Attachment }) {
  const isYoutube = attachment.type === 'youtube'
  const isImage = attachment.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) || attachment.name.includes('gallery')

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 text-xs transition hover:bg-slate-100 hover:border-slate-300">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isYoutube ? 'bg-rose-50 text-rose-600' : isImage ? 'bg-indigo-50 text-indigo-600' : 'bg-teal-50 text-teal-600'
        }`}
      >
        {isYoutube ? <Video className="h-4 w-4" /> : isImage ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800">{attachment.name}</p>
        <p className="text-[10px] text-slate-400">{isYoutube ? 'YouTube video' : isImage ? 'Image asset' : 'Attachment document'}</p>
      </div>
    </div>
  )
}

export default function AnnouncementsPage({ onActionNotify = () => {} }: AnnouncementsPageProps) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [tab, setTab] = useState<'all' | 'live' | 'scheduled' | 'mine' | 'bookmarked' | 'drafts'>('all')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [bookmarked, setBookmarked] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [channelFilter, setChannelFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<FormState>(blankForm())
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const [analyticsId, setAnalyticsId] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewCategory, setPreviewCategory] = useState('All')
  const [previewSearch, setPreviewSearch] = useState('')
  const [dismissed, setDismissed] = useState<string[]>([])
  const [acknowledged, setAcknowledged] = useState<string[]>([])
  const [liked, setLiked] = useState<string[]>([])
  const [commentPost, setCommentPost] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [attachmentError, setAttachmentError] = useState('')
  const [formatActive, setFormatActive] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const availableCohorts = useMemo(() => form.program.flatMap((program) => COHORTS[program] ?? []), [form.program])
  const deliveryEstimate = useMemo(() => estimateAudience(form), [form])
  const analyticsPost = posts.find((post) => post.id === analyticsId) ?? null

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: posts.length,
      live: posts.filter((p) => computedStatus(p) === 'Published').length,
      scheduled: posts.filter((p) => computedStatus(p) === 'Scheduled').length,
      mine: posts.filter((p) => p.author === 'Akash Sharma').length,
      bookmarked: posts.filter((p) => bookmarked.includes(p.id)).length,
      drafts: posts.filter((p) => computedStatus(p) === 'Draft').length
    }
  }, [posts, bookmarked])

  const [postComments, setPostComments] = useState<
    Record<string, Array<{ id: string; author: string; role: string; text: string; time: string }>>
  >({
    p1: [
      {
        id: 'c1',
        author: 'Aarav Mehta',
        role: 'Student · Cohort 7',
        text: 'Thank you for the detailed hall allocations and reporting guidelines!',
        time: '1h ago'
      },
      {
        id: 'c2',
        author: 'Diya Shah',
        role: 'Student · Cohort 8',
        text: 'Are non-programmable scientific calculators permitted for quantitative subjects?',
        time: '35m ago'
      }
    ],
    p2: [
      {
        id: 'c3',
        author: 'Kabir Rao',
        role: 'Student · Cohort 4',
        text: 'Incredible celebration and student showcase! Kudos to the organizing team.',
        time: 'Yesterday'
      }
    ],
    p3: [
      {
        id: 'c4',
        author: 'Meera Iyer',
        role: 'Student · Cohort 7',
        text: 'Shortlist slot verified. Will be present at Auditorium 2 for briefing.',
        time: '2h ago'
      }
    ]
  })

  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return
    const newComment = {
      id: `comment-${Date.now()}`,
      author: 'Akash Sharma',
      role: 'Super Admin · Masters’ Union',
      text: text.trim(),
      time: 'Just now'
    }
    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }))
    setPosts((prev) =>
      prev.map((item) => (item.id === postId ? { ...item, comments: item.comments + 1 } : item))
    )
    notify('Comment added to announcement.')
  }

  const visiblePosts = useMemo(
    () =>
      posts
        .filter((post) => {
          const status = computedStatus(post)
          const text = `${post.title} ${post.body} ${post.category} ${post.author} ${post.role} ${post.audience} ${post.channels.join(
            ' '
          )} ${post.mobilePushContent?.title ?? ''} ${post.mobilePushContent?.message ?? ''} ${
            post.whatsappContent?.title ?? ''
          } ${post.whatsappContent?.description ?? ''}`.toLowerCase()

          const matchesTab =
            tab === 'all' ||
            (tab === 'live' && status === 'Published') ||
            (tab === 'scheduled' && status === 'Scheduled') ||
            (tab === 'mine' && post.author === 'Akash Sharma') ||
            (tab === 'bookmarked' && bookmarked.includes(post.id)) ||
            (tab === 'drafts' && status === 'Draft')

          const matchesChannel = !channelFilter || post.channels.includes(channelFilter as Channel)

          return (
            matchesTab &&
            matchesChannel &&
            text.includes(search.trim().toLowerCase()) &&
            (!categoryFilter || post.category === categoryFilter) &&
            (!priorityFilter || post.priority === priorityFilter)
          )
        })
        .sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate)),
    [posts, tab, bookmarked, search, categoryFilter, channelFilter, priorityFilter]
  )

  const notify = (message: string) => onActionNotify(message)

  const openCreate = () => {
    setEditingId(null)
    setForm(blankForm())
    setStep(1)
    setError('')
    setActionError('')
    setAttachmentError('')
    setFormatActive([])
    setEditorOpen(true)
  }

  const openEdit = (post: Post) => {
    const status = computedStatus(post)
    const hasFeed = post.channels.includes('LMS Feed')
    const hasPush = post.channels.includes('Mobile push')
    const hasWhatsApp = post.channels.includes('WhatsApp')
    const postType: PostType =
      post.postType ||
      (COMMUNITY_CATEGORIES.includes(post.category as CommunityCategory) ? 'Community' : 'Announcement')
    setEditingId(post.id)
    setForm({
      postType,
      category: post.category,
      priority: post.priority,
      expiry: hasFeed ? post.expiry ?? '' : '',
      acknowledgementRequired: hasFeed && post.acknowledgementRequired,
      title: hasFeed ? post.title : '',
      body: hasFeed ? post.body : '',
      attachments: hasFeed ? post.attachments : [],
      youtubeUrl: '',
      pushTitle: post.mobilePushContent?.title ?? (hasPush ? post.title.slice(0, 65) : ''),
      pushMessage: post.mobilePushContent?.message ?? (hasPush ? post.body.slice(0, 180) : ''),
      imageUrl: post.mobilePushContent?.imageUrl ?? '',
      deepLink: post.mobilePushContent?.deepLink ?? '',
      whatsappTitle: post.whatsappContent?.title ?? (hasWhatsApp ? post.title.slice(0, 60) : ''),
      whatsappDescription: post.whatsappContent?.description ?? (hasWhatsApp ? post.body.slice(0, 500) : ''),
      allowLikes: post.allowLikes,
      allowComments: post.allowComments,
      allowSharing: post.allowSharing,
      ...post.targeting,
      channels: [...post.channels],
      scheduleMode: status === 'Scheduled' ? 'later' : 'now',
      scheduledAt: post.publishDate.slice(0, 16)
    })
    setStep(1)
    setError('')
    setActionError('')
    setAttachmentError('')
    setFormatActive([])
    setEditorOpen(true)
  }

  const publicationData: PublicationData = {
    title: form.title,
    body: form.body,
    category: form.category as Category,
    priority: form.channels.includes('LMS Feed') ? form.priority : 'Standard',
    expiry:
      form.channels.includes('LMS Feed') && (form.priority === 'Pinned' || form.acknowledgementRequired)
        ? form.expiry
        : undefined,
    targeting: { program: form.program, cohort: form.cohort, term: form.term, section: form.section, club: form.club },
    channels: form.channels,
    mobilePushContent: { title: form.pushTitle, message: form.pushMessage, imageUrl: form.imageUrl, deepLink: form.deepLink },
    whatsappContent: { title: form.whatsappTitle, description: form.whatsappDescription },
    scheduleMode: form.scheduleMode,
    scheduledAt: form.scheduledAt
  }

  const validateStep1 = () => {
    if (!form.channels.length) return 'Select at least one delivery channel.'
    if (!form.category) return 'Please choose a category.'
    if (form.channels.includes('LMS Feed')) {
      if (!form.title.trim()) return 'Announcement title is required.'
      if (!form.body.trim()) return 'Announcement message body is required.'
    }
    return ''
  }

  const validateStep2 = () => {
    return validateChannelContent(publicationData)
  }

  const audienceSummary =
    form.program.length === PROGRAMS.length && !form.club.length
      ? 'All students'
      : form.club.length && !form.cohort.length && !form.term.length && !form.section.length
      ? form.club.join(', ')
      : [form.program.join(', '), form.cohort.join(', '), form.term.join(', '), form.section.join(', '), form.club.join(', ')]
          .filter(Boolean)
          .join(' · ') || 'No audience selected'

  const savePost = (draft: boolean) => {
    const message = validateStep1() || (draft ? '' : validatePublication(publicationData))
    if (message) {
      setError(message)
      return
    }
    const existing = posts.find((post) => post.id === editingId)
    const hasFeed = form.channels.includes('LMS Feed')
    const hasPush = form.channels.includes('Mobile push')
    const hasWhatsApp = form.channels.includes('WhatsApp')
    const status: PostStatus = draft ? 'Draft' : form.scheduleMode === 'later' ? 'Scheduled' : 'Published'
    const title = (hasFeed ? form.title : hasWhatsApp ? form.whatsappTitle : form.pushTitle).trim() || 'Untitled Announcement'
    const body = (hasFeed ? form.body : hasWhatsApp ? form.whatsappDescription : form.pushMessage).trim()
    const acknowledgementRequired = hasFeed && form.acknowledgementRequired

    const next: Post = {
      id: existing?.id ?? `post-${Date.now()}`,
      title,
      body,
      postType: form.postType,
      category: form.category as Category,
      priority: hasFeed ? form.priority : 'Standard',
      audience: audienceSummary,
      channels: [...form.channels],
      mobilePushContent: hasPush
        ? {
            title: form.pushTitle.trim(),
            message: form.pushMessage.trim(),
            imageUrl: form.imageUrl.trim() || undefined,
            deepLink: form.deepLink.trim() || undefined
          }
        : undefined,
      whatsappContent: hasWhatsApp
        ? {
            title: form.whatsappTitle.trim(),
            description: form.whatsappDescription.trim()
          }
        : undefined,
      publishDate: status === 'Scheduled' ? form.scheduledAt : new Date().toISOString(),
      expiry: hasFeed && (form.priority === 'Pinned' || acknowledgementRequired) ? form.expiry || undefined : undefined,
      status,
      author: existing?.author ?? 'Akash Sharma',
      role: existing?.role ?? 'Super Admin',
      attachments: hasFeed ? form.attachments : [],
      likes: existing?.likes ?? 0,
      comments: existing?.comments ?? 0,
      shares: existing?.shares ?? 0,
      views: existing?.views ?? 0,
      reach: existing?.reach ?? 0,
      acknowledgementRequired,
      acknowledgements: existing?.acknowledgements ?? 0,
      audienceCount: deliveryEstimate.audienceMembers,
      allowLikes: form.allowLikes,
      allowComments: form.allowComments,
      allowSharing: form.allowSharing,
      targeting: { program: form.program, cohort: form.cohort, term: form.term, section: form.section, club: form.club }
    }

    setPosts((current) => (editingId ? current.map((post) => (post.id === editingId ? next : post)) : [next, ...current]))
    setEditorOpen(false)
    notify(`${editingId ? 'Announcement updated' : 'Announcement created'} as ${status.toLowerCase()}.`)
  }

  const duplicate = (post: Post) => {
    setPosts((current) => [
      {
        ...post,
        id: `post-${Date.now()}`,
        title: `${post.title} (copy)`,
        channels: [...post.channels],
        mobilePushContent: post.mobilePushContent ? { ...post.mobilePushContent } : undefined,
        targeting: {
          program: [...post.targeting.program],
          cohort: [...post.targeting.cohort],
          term: [...post.targeting.term],
          section: [...post.targeting.section],
          club: [...post.targeting.club]
        },
        status: 'Draft',
        publishDate: new Date().toISOString(),
        views: 0,
        reach: 0,
        acknowledgements: 0
      },
      ...current
    ])
    notify('Announcement duplicated as a draft.')
  }

  const setPostStatus = (id: string, status: PostStatus) => {
    if (status === 'Published') {
      const post = posts.find((item) => item.id === id)
      if (!post) return
      const message = validatePublication(
        { ...post, scheduleMode: post.status === 'Scheduled' ? 'later' : 'now', scheduledAt: post.publishDate },
        post.status === 'Scheduled'
      )
      if (message) {
        setActionError(`${post.title}: ${message}`)
        notify(`Post was not published: ${message}`)
        return
      }
    }
    setActionError('')
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              status,
              publishDate: status === 'Published' ? new Date().toISOString() : post.publishDate
            }
          : post
      )
    )
    notify(`Announcement ${status === 'Published' ? 'published' : 'archived'}.`)
  }

  const removePost = (id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id))
    setBookmarked((current) => current.filter((bookmarkId) => bookmarkId !== id))
    notify('Announcement deleted.')
  }

  const addFiles = (files: FileList | File[]) => {
    const accepted: Attachment[] = []
    let sizeRejected = false
    let typeRejected = false
    Array.from(files).forEach((file) => {
      const supported = file.type.startsWith('image/') || /\.(pdf|docx|zip)$/i.test(file.name)
      if (!supported) typeRejected = true
      else if (file.size > 15 * 1024 * 1024) sizeRejected = true
      else accepted.push({ id: `${file.name}-${Date.now()}-${accepted.length}`, name: file.name, type: 'file' })
    })
    setAttachmentError(
      [
        sizeRejected && 'Files over 15 MB were not added.',
        typeRejected && 'Only images, PDF, DOCX and ZIP files are supported.'
      ]
        .filter(Boolean)
        .join(' ')
    )
    setForm((current) => ({ ...current, attachments: [...current.attachments, ...accepted] }))
  }

  const addVideo = () => {
    const url = form.youtubeUrl.trim()
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      setAttachmentError('Enter a valid YouTube URL.')
      return
    }
    setForm((current) => ({
      ...current,
      youtubeUrl: '',
      attachments: [...current.attachments, { id: `yt-${Date.now()}`, name: 'YouTube video', type: 'youtube', url }]
    }))
    setAttachmentError('')
  }

  const autoFillChannelContent = () => {
    setForm((current) => ({
      ...current,
      pushTitle: current.title.slice(0, 65),
      pushMessage: current.body.slice(0, 180),
      whatsappTitle: current.title.slice(0, 60),
      whatsappDescription: current.body.slice(0, 500)
    }))
    notify('Push & WhatsApp content synchronized from In-App content.')
  }

  const acknowledge = (post: Post) => {
    if (acknowledged.includes(post.id)) return
    setAcknowledged((current) => [...current, post.id])
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? { ...item, acknowledgements: Math.min(item.audienceCount, item.acknowledgements + 1) }
          : item
      )
    )
    notify('Notice marked as acknowledged.')
  }

  const toggleLike = (post: Post) => {
    const isLiked = liked.includes(post.id)
    setLiked((current) => (isLiked ? current.filter((id) => id !== post.id) : [...current, post.id]))
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id ? { ...item, likes: Math.max(0, item.likes + (isLiked ? -1 : 1)) } : item
      )
    )
  }

  const share = async (post: Post) => {
    try {
      if (!navigator.clipboard) {
        notify('Clipboard access is unavailable.')
        return
      }
      await navigator.clipboard.writeText(`${post.title} — Campus Feed: ${window.location.origin}`)
      setPosts((current) =>
        current.map((item) => (item.id === post.id ? { ...item, shares: item.shares + 1 } : item))
      )
      notify('Announcement link copied to clipboard.')
    } catch {
      notify('Link copied to clipboard.')
    }
  }

  return (
    <section className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Hero Title & Primary Action */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Announcements</h1>
          <p className="mt-1 text-xs text-slate-500">
            Publish, schedule, and measure multi-channel campus updates across In-App Feed, Push, and WhatsApp.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Smartphone className="h-4 w-4 text-slate-500" />
            <span>Student Preview</span>
          </button>
          <button onClick={openCreate} className={primaryButton}>
            <Plus className="h-4 w-4" />
            <span>Create Announcement</span>
          </button>
        </div>
      </div>

      {/* Action Error Alert */}
      {actionError && (
        <div role="alert" className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')} className="text-rose-500 hover:text-rose-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Single-Row Unified Control Bar (Underline Switchers) */}
      <div className="border-b border-slate-200/80">
        <div className="flex flex-wrap items-end justify-between gap-3">
          {/* Navigation Tabs with Count Badges & Underlines */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none -mb-px" role="tablist" aria-label="Filter announcement posts">
            {(
              [
                ['all', 'All Posts', tabCounts.all],
                ['live', 'Live Feed', tabCounts.live],
                ['scheduled', 'Scheduled', tabCounts.scheduled],
                ['drafts', 'Drafts', tabCounts.drafts],
                ['mine', 'By Me', tabCounts.mine],
                ['bookmarked', 'Bookmarked', tabCounts.bookmarked]
              ] as const
            ).map(([key, label, count]) => {
              const active = tab === key
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(key)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap px-3 pb-2.5 pt-1 text-xs font-semibold transition border-b-2 cursor-pointer ${
                    active
                      ? 'border-teal-600 text-teal-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold transition ${
                      active
                        ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Right Controls: Search + Select Dropdowns + View Toggle */}
          <div className="flex items-center gap-2 flex-wrap ml-auto pb-2">
            <div className="relative w-44 sm:w-52">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                aria-label="Search announcements"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-7 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All Categories</option>
              <optgroup label="Announcements">
                {ANNOUNCEMENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Community">
                {COMMUNITY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </optgroup>
            </select>

            <select
              aria-label="Filter by channel"
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All Channels</option>
              <option value="LMS Feed">In-App Feed</option>
              <option value="Mobile push">Mobile Push</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>

            <select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All Priorities</option>
              <option value="Standard">Standard</option>
              <option value="Pinned">Pinned</option>
            </select>

            {(search || categoryFilter || channelFilter || priorityFilter) && (
              <button
                onClick={() => {
                  setSearch('')
                  setCategoryFilter('')
                  setChannelFilter('')
                  setPriorityFilter('')
                }}
                className="inline-flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                title="Reset filters"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 shadow-2xs">
              <button
                aria-label="Feed stream view"
                aria-pressed={viewMode === 'card'}
                onClick={() => setViewMode('card')}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === 'card' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Feed view (LinkedIn style)"
              >
                <Grid2X2 className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Table view"
                aria-pressed={viewMode === 'table'}
                onClick={() => setViewMode('table')}
                className={`rounded-lg p-1.5 transition ${
                  viewMode === 'table' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table view"
              >
                <Table2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Content List: Card View or Table View */}
      {visiblePosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <Megaphone className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-800">No announcements found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {tab === 'bookmarked'
              ? 'You have not bookmarked any announcements yet. Click the bookmark icon on any post to pin it here.'
              : 'Try clearing your search query or filters to see available broadcasts.'}
          </p>
          <div className="mt-4">
            <button onClick={openCreate} className={primaryButton}>
              <Plus className="h-4 w-4" />
              <span>Create Announcement</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'card' ? (
        <div className="max-w-2xl mx-auto space-y-4">
          {visiblePosts.map((post) => (
            <LinkedInAnnouncementCard
              key={post.id}
              post={post}
              bookmarked={bookmarked.includes(post.id)}
              isLiked={liked.includes(post.id)}
              onBookmark={() =>
                setBookmarked((current) =>
                  current.includes(post.id) ? current.filter((id) => id !== post.id) : [...current, post.id]
                )
              }
              onLike={() => toggleLike(post)}
              onShare={() => share(post)}
              onAnalytics={() => setAnalyticsId(post.id)}
              onEdit={() => openEdit(post)}
              onDuplicate={() => duplicate(post)}
              onStatus={(status) => setPostStatus(post.id, status)}
              onDelete={() => removePost(post.id)}
              onAddComment={(text) => handleAddComment(post.id, text)}
              commentsList={postComments[post.id] || []}
            />
          ))}
        </div>
      ) : (
        /* Modern Compact Table View */
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Announcement</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Channels</th>
                  <th className="px-4 py-3.5">Target Audience</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Engagement</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visiblePosts.map((post) => {
                  const status = computedStatus(post)
                  const badge = statusBadgeConfig[status]
                  return (
                    <tr key={post.id} className="transition-colors hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {post.priority === 'Pinned' && <Pin className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{post.title}</p>
                            <p className="mt-0.5 text-[11px] text-slate-400">
                              {post.author} · {relativeTime(post.publishDate)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[post.category].badge}`}
                        >
                          {post.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {post.channels.includes('LMS Feed') && (
                            <>
                              <span title="In-App (Mobile Feed)" className="rounded-md bg-teal-50 p-1 text-teal-700">
                                <Smartphone className="h-3 w-3" />
                              </span>
                              <span title="Web Portal Feed" className="rounded-md bg-sky-50 p-1 text-sky-700">
                                <Globe className="h-3 w-3" />
                              </span>
                            </>
                          )}
                          {post.channels.includes('Mobile push') && (
                            <span title="Mobile Push" className="rounded-md bg-indigo-50 p-1 text-indigo-700">
                              <Bell className="h-3 w-3" />
                            </span>
                          )}
                          {post.channels.includes('WhatsApp') && (
                            <span title="WhatsApp" className="rounded-md bg-emerald-50 p-1 text-emerald-700">
                              <MessageCircle className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate max-w-[140px]" title={post.audience}>
                            {post.audience}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 text-[11px] text-slate-600">
                          <span className="flex items-center gap-1" title="Views">
                            <Eye className="h-3 w-3 text-slate-400" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1" title="Likes">
                            <ThumbsUp className="h-3 w-3 text-slate-400" />
                            {post.likes}
                          </span>
                          {post.acknowledgementRequired && (
                            <span
                              className="flex items-center gap-1 text-teal-700 font-semibold"
                              title="Acknowledgements"
                            >
                              <ShieldCheck className="h-3 w-3" />
                              {post.acknowledgements}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            onClick={() => setAnalyticsId(post.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-700"
                            title="Analytics"
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openEdit(post)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-teal-50 hover:text-teal-700"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => duplicate(post)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            title="Duplicate"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          {['Draft', 'Archived'].includes(status) && (
                            <button
                              onClick={() => removePost(post.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Easy & Modern Create/Edit Announcement Drawer */}
      {editorOpen && (
        <Overlay
          title={editingId ? 'Edit Announcement' : 'Create Announcement'}
          description="Craft modern broadcasts with tailored In-App, Push, and WhatsApp messaging."
          onClose={() => setEditorOpen(false)}
        >
          {/* Stepper Tabs */}
          <div className="flex items-center border-b border-slate-100 bg-slate-50/70 px-6 py-3">
            <StepTab
              number={1}
              label="Content & Channels"
              active={step === 1}
              completed={step > 1}
              onClick={() => {
                setError('')
                setStep(1)
              }}
            />
            <div className="mx-3 h-px flex-1 bg-slate-200" />
            <StepTab
              number={2}
              label="Channel Previews"
              active={step === 2}
              completed={step > 2}
              onClick={() => {
                const err = validateStep1()
                if (err) {
                  setError(err)
                  return
                }
                setError('')
                setStep(2)
              }}
            />
            <div className="mx-3 h-px flex-1 bg-slate-200" />
            <StepTab
              number={3}
              label="Audience & Publish"
              active={step === 3}
              completed={false}
              onClick={() => {
                const err = validateStep1() || validateStep2()
                if (err) {
                  setError(err)
                  return
                }
                setError('')
                setStep(3)
              }}
            />
          </div>

          {/* Step 1: Content & Channels */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {step === 1 && (
              <div className="space-y-5">
                {/* Channel Selector Cards */}
                <div>
                  <label className={labelClass}>Delivery Channels *</label>
                  <p className="text-[11px] text-slate-500 mb-2.5">
                    Select one or more channels to broadcast this update simultaneously.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {CHANNELS.map((channel) => {
                      const selected = form.channels.includes(channel)
                      const ChannelIcon = channel === 'LMS Feed' ? Megaphone : channel === 'Mobile push' ? Bell : MessageCircle
                      const subtext =
                        channel === 'LMS Feed'
                          ? 'Rich post in campus student feed'
                          : channel === 'Mobile push'
                          ? 'Lock-screen notification on mobile'
                          : 'Direct summary via WhatsApp'

                      return (
                        <button
                          type="button"
                          key={channel}
                          onClick={() => {
                            setForm((current) => {
                              const channels = selected
                                ? current.channels.filter((item) => item !== channel)
                                : [...current.channels, channel]
                              return {
                                ...current,
                                channels,
                                acknowledgementRequired:
                                  channel === 'LMS Feed' && selected ? false : current.acknowledgementRequired,
                                priority:
                                  channel === 'LMS Feed' && selected ? 'Standard' : current.priority,
                                expiry: channel === 'LMS Feed' && selected ? '' : current.expiry
                              }
                            })
                          }}
                          className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition ${
                            selected
                              ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/10'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                                selected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <ChannelIcon className="h-4 w-4" />
                            </span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-md border text-[10px] ${
                                selected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {selected && <Check className="h-3 w-3 stroke-[3]" />}
                            </span>
                          </div>
                          <p className="mt-3 text-xs font-bold text-slate-900">{channelLabel(channel)}</p>
                          <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{subtext}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 1st Dropdown (Type: Announcement / Community) & 2nd Dropdown (Category) */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="post-type" className={labelClass}>
                      Type *
                    </label>
                    <select
                      id="post-type"
                      value={form.postType}
                      onChange={(e) => {
                        const nextType = e.target.value as PostType
                        setForm((c) => ({
                          ...c,
                          postType: nextType,
                          category: nextType === 'Announcement' ? 'Academics' : 'Kudos'
                        }))
                      }}
                      className={inputClass}
                    >
                      <option value="Announcement">Announcement</option>
                      <option value="Community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="post-category" className={labelClass}>
                      Category *
                    </label>
                    <select
                      id="post-category"
                      value={form.category}
                      onChange={(e) => setForm((c) => ({ ...c, category: e.target.value as Category }))}
                      className={inputClass}
                    >
                      {form.postType === 'Announcement'
                        ? ANNOUNCEMENT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))
                        : COMMUNITY_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>

                {/* Priority (Pin) & Mandatory Acknowledgement - Separate Settings */}
                {form.channels.includes('LMS Feed') && (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {/* Pin Announcement Card */}
                      <div
                        className={`rounded-2xl border p-3.5 transition ${
                          form.priority === 'Pinned'
                            ? 'border-amber-300 bg-amber-50/50 ring-1 ring-amber-200/70'
                            : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                form.priority === 'Pinned'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-200/80 text-slate-500'
                              }`}
                            >
                              <Pin className="h-3.5 w-3.5" />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Pin Announcement</p>
                              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                Keep featured at top of feed
                              </p>
                            </div>
                          </div>
                          <Toggle
                            checked={form.priority === 'Pinned'}
                            onChange={(val) =>
                              setForm((c) => ({
                                ...c,
                                priority: val ? 'Pinned' : 'Standard',
                                expiry: !val && !c.acknowledgementRequired ? '' : c.expiry
                              }))
                            }
                            label="Pin announcement to top of feed"
                          />
                        </div>
                      </div>

                      {/* Mandatory Student Acknowledgement Card */}
                      <div
                        className={`rounded-2xl border p-3.5 transition ${
                          form.acknowledgementRequired
                            ? 'border-purple-300 bg-purple-50/50 ring-1 ring-purple-200/70'
                            : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                form.acknowledgementRequired
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-slate-200/80 text-slate-500'
                              }`}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Mandatory Acknowledgement</p>
                              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                Require students to confirm reading
                              </p>
                            </div>
                          </div>
                          <Toggle
                            checked={form.acknowledgementRequired}
                            onChange={(val) =>
                              setForm((c) => ({
                                ...c,
                                acknowledgementRequired: val,
                                expiry: !val && c.priority !== 'Pinned' ? '' : c.expiry,
                                allowLikes: !val ? true : c.allowLikes,
                                allowComments: !val ? true : c.allowComments,
                                allowSharing: !val ? true : c.allowSharing
                              }))
                            }
                            label="Require student acknowledgement"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expiry Date (if Pinned or Mandatory) */}
                    {(form.priority === 'Pinned' || form.acknowledgementRequired) && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
                        <div className="mb-2 sm:mb-0">
                          <label htmlFor="expiry-input" className="block text-xs font-bold text-slate-800">
                            {form.priority === 'Pinned' && form.acknowledgementRequired
                              ? 'Pin Expiry & Confirmation Deadline (Optional)'
                              : form.priority === 'Pinned'
                              ? 'Pin Expiry Date & Time (Optional)'
                              : 'Acknowledgement Deadline (Optional)'}
                          </label>
                          <p className="text-[10px] text-slate-500">
                            {form.priority === 'Pinned' && form.acknowledgementRequired
                              ? 'Notice will unpin and close acknowledgements after this date and time'
                              : form.priority === 'Pinned'
                              ? 'Announcement will automatically unpin after this date and time'
                              : 'Students must confirm reading before this date and time'}
                          </p>
                        </div>
                        <input
                          id="expiry-input"
                          type="datetime-local"
                          value={form.expiry}
                          onChange={(e) => setForm((c) => ({ ...c, expiry: e.target.value }))}
                          className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none transition focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Post Title */}
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="announcement-title" className={labelClass}>
                      Announcement Title *
                    </label>
                    <span
                      className={`text-[10px] font-medium ${
                        form.title.length > 200 ? 'text-rose-600' : 'text-slate-400'
                      }`}
                    >
                      {form.title.length}/200
                    </span>
                  </div>
                  <input
                    id="announcement-title"
                    value={form.title}
                    onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
                    placeholder="e.g. Term 2 Examination Timetable & Protocol Briefing"
                    className={inputClass}
                    maxLength={205}
                  />
                </div>

                {/* Post Body & Visual Toolbar */}
                <div>
                  <label htmlFor="announcement-body" className={labelClass}>
                    Message Body *
                  </label>
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
                    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50/50 p-1.5 rounded-t-2xl">
                      {[
                        [Bold, 'Bold'],
                        [Italic, 'Italic'],
                        [Underline, 'Underline'],
                        [Strikethrough, 'Strike'],
                        [Quote, 'Quote'],
                        [ListOrdered, 'Ordered list'],
                        [List, 'Bullet list'],
                        [Link, 'Link'],
                        [Table2, 'Table']
                      ].map(([Icon, name]) => {
                        const iconName = name as string
                        const ToolIcon = Icon as typeof Bold
                        const isSelected = formatActive.includes(iconName)
                        return (
                          <button
                            type="button"
                            key={iconName}
                            title={iconName}
                            aria-pressed={isSelected}
                            onClick={() => {
                              setFormatActive((current) =>
                                isSelected ? current.filter((i) => i !== iconName) : [...current, iconName]
                              )
                            }}
                            className={`rounded-lg p-1.5 transition ${
                              isSelected ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-200/60'
                            }`}
                          >
                            <ToolIcon className="h-3.5 w-3.5" />
                          </button>
                        )
                      })}
                    </div>
                    <textarea
                      id="announcement-body"
                      rows={6}
                      value={form.body}
                      onChange={(e) => setForm((c) => ({ ...c, body: e.target.value }))}
                      placeholder="Write the complete announcement details. Use bullets, quotes, and paragraphs for clear reading..."
                      className="w-full resize-y rounded-b-2xl p-3.5 text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>

                {/* Attachments & Media Upload */}
                <div>
                  <label className={labelClass}>Attachments & Media</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e: DragEvent<HTMLDivElement>) => {
                        e.preventDefault()
                        addFiles(e.dataTransfer.files)
                      }}
                      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 text-center transition hover:border-teal-500 hover:bg-teal-50/20"
                    >
                      <Upload className="h-6 w-6 text-slate-400" />
                      <p className="mt-1 text-xs font-semibold text-slate-700">Drop files or browse</p>
                      <p className="text-[10px] text-slate-400">PDF, DOCX, ZIP, or Images up to 15MB</p>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="mt-2 rounded-lg bg-white border border-slate-200 px-3 py-1 text-[11px] font-semibold text-teal-700 shadow-2xs hover:bg-slate-50"
                      >
                        Choose files
                      </button>
                      <input
                        ref={fileRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.docx,.zip"
                        className="sr-only"
                        onChange={(e) => e.target.files && addFiles(e.target.files)}
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-medium text-slate-600 block mb-1">Add YouTube Video</span>
                        <div className="flex gap-2">
                          <input
                            value={form.youtubeUrl}
                            onChange={(e) => setForm((c) => ({ ...c, youtubeUrl: e.target.value }))}
                            placeholder="https://youtube.com/watch?v=..."
                            className={inputClass}
                          />
                          <button type="button" onClick={addVideo} className={secondaryButton} title="Attach video">
                            <Video className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {attachmentError && (
                        <p className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-[10px] font-semibold text-rose-600">
                          {attachmentError}
                        </p>
                      )}

                      {form.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                          {form.attachments.map((att) => (
                            <div
                              key={att.id}
                              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] text-slate-700"
                            >
                              {att.type === 'youtube' ? (
                                <Video className="h-3 w-3 text-rose-500" />
                              ) : (
                                <Paperclip className="h-3 w-3 text-teal-600" />
                              )}
                              <span className="truncate max-w-[120px]">{att.name}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setForm((c) => ({
                                    ...c,
                                    attachments: c.attachments.filter((item) => item.id !== att.id)
                                  }))
                                }
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Channel Customization & Live Previews */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-2xl bg-teal-50/70 border border-teal-100 p-4">
                  <div>
                    <h3 className="text-xs font-bold text-teal-900">Multi-Channel Adaptation</h3>
                    <p className="text-[11px] text-teal-700 mt-0.5">
                      Tailor and preview broadcasts for In-App & Web Feed, Mobile Push, and WhatsApp.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={autoFillChannelContent}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Auto-sync from Feed</span>
                  </button>
                </div>

                {/* In-App & Web Feed Live Preview */}
                {form.channels.includes('LMS Feed') && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                          <Globe className="h-4 w-4" />
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">In-App & Web Feed Broadcast</h4>
                          <p className="text-[10px] text-slate-500">Live across student Mobile App & Desktop Web Portal</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border bg-teal-50 text-teal-700 border-teal-200">
                          <Smartphone className="h-3 w-3" /> In-App
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border bg-sky-50 text-sky-700 border-sky-200">
                          <Globe className="h-3 w-3" /> Web
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                          AS
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            Akash Sharma <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.2 rounded-sm ml-1">Staff</span>
                          </p>
                          <p className="text-[10px] text-slate-400">Super Admin · Masters’ Union · Just now</p>
                        </div>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{form.title || 'Untitled Announcement'}</h5>
                      <p className="text-xs text-slate-600 whitespace-pre-wrap">{form.body || 'No message content provided.'}</p>
                    </div>
                  </div>
                )}

                {/* Mobile Push Customization & Live Preview */}
                {form.channels.includes('Mobile push') && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                        <Bell className="h-4 w-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Mobile Push Notification</h4>
                        <p className="text-[10px] text-slate-500">Lock-screen alerts for enrolled devices</p>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between">
                            <label className={labelClass}>Push Title *</label>
                            <span className="text-[10px] text-slate-400">{form.pushTitle.length}/65</span>
                          </div>
                          <input
                            maxLength={65}
                            value={form.pushTitle}
                            onChange={(e) => setForm((c) => ({ ...c, pushTitle: e.target.value }))}
                            placeholder="Short, high-priority alert headline"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between">
                            <label className={labelClass}>Push Message *</label>
                            <span className="text-[10px] text-slate-400">{form.pushMessage.length}/180</span>
                          </div>
                          <textarea
                            rows={3}
                            maxLength={180}
                            value={form.pushMessage}
                            onChange={(e) => setForm((c) => ({ ...c, pushMessage: e.target.value }))}
                            placeholder="Key update details and call to action..."
                            className={`${inputClass} resize-y`}
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className={labelClass}>Image URL (Optional)</label>
                            <input
                              type="url"
                              value={form.imageUrl}
                              onChange={(e) => setForm((c) => ({ ...c, imageUrl: e.target.value }))}
                              placeholder="https://images.unsplash..."
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>App Deep Link</label>
                            <input
                              value={form.deepLink}
                              onChange={(e) => setForm((c) => ({ ...c, deepLink: e.target.value }))}
                              placeholder="/academics/term-2"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Live Phone Preview
                        </p>
                        <PushPreview
                          title={form.pushTitle}
                          message={form.pushMessage}
                          imageUrl={form.imageUrl}
                          deepLink={form.deepLink}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* WhatsApp Customization & Live Preview */}
                {form.channels.includes('WhatsApp') && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <MessageCircle className="h-4 w-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">WhatsApp Direct Broadcast</h4>
                        <p className="text-[10px] text-slate-500">Sent to registered student WhatsApp numbers</p>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between">
                            <label className={labelClass}>WhatsApp Headline *</label>
                            <span className="text-[10px] text-slate-400">{form.whatsappTitle.length}/60</span>
                          </div>
                          <input
                            maxLength={60}
                            value={form.whatsappTitle}
                            onChange={(e) => setForm((c) => ({ ...c, whatsappTitle: e.target.value }))}
                            placeholder="Concise update title"
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <div className="flex justify-between">
                            <label className={labelClass}>WhatsApp Description *</label>
                            <span className="text-[10px] text-slate-400">{form.whatsappDescription.length}/500</span>
                          </div>
                          <textarea
                            rows={3}
                            maxLength={500}
                            value={form.whatsappDescription}
                            onChange={(e) => setForm((c) => ({ ...c, whatsappDescription: e.target.value }))}
                            placeholder="Detailed message summary with action points..."
                            className={`${inputClass} resize-y`}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Live WhatsApp Chat
                        </p>
                        <WhatsAppPreview title={form.whatsappTitle} description={form.whatsappDescription} />
                      </div>
                    </div>
                  </div>
                )}

                {!form.channels.includes('Mobile push') && !form.channels.includes('WhatsApp') && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50">
                    <Megaphone className="mx-auto h-7 w-7 text-slate-400" />
                    <p className="mt-2 text-xs font-semibold text-slate-700">In-App Campus Feed Only</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      You have selected In-App Feed only. No external push or WhatsApp messages are queued.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Audience & Schedule */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Audience Targeting Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Target Audience Hierarchy</h4>
                      <p className="text-[11px] text-slate-500">
                        Filter recipients from program down to specific sections or clubs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((c) => ({
                          ...c,
                          program: [...PROGRAMS],
                          cohort: [],
                          term: [],
                          section: [],
                          club: []
                        }))
                      }
                      className="rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1 text-[11px] font-semibold text-teal-700 hover:bg-teal-100"
                    >
                      Target All Students
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <MultiSelectDropdown
                      label="Program"
                      required
                      options={PROGRAMS}
                      selected={form.program}
                      onChange={(values) =>
                        setForm((c) => ({
                          ...c,
                          program: values,
                          cohort: [],
                          term: [],
                          section: []
                        }))
                      }
                    />
                    <MultiSelectDropdown
                      label="Cohort"
                      options={availableCohorts}
                      selected={form.cohort}
                      disabled={!form.program.length}
                      onChange={(values) =>
                        setForm((c) => ({
                          ...c,
                          cohort: values,
                          term: [],
                          section: []
                        }))
                      }
                    />
                    <MultiSelectDropdown
                      label="Term"
                      options={TERMS}
                      selected={form.term}
                      disabled={!form.cohort.length}
                      onChange={(values) =>
                        setForm((c) => ({
                          ...c,
                          term: values,
                          section: []
                        }))
                      }
                    />
                    <MultiSelectDropdown
                      label="Section"
                      options={SECTIONS}
                      selected={form.section}
                      disabled={!form.term.length}
                      onChange={(values) =>
                        setForm((c) => ({
                          ...c,
                          section: values
                        }))
                      }
                    />
                    <div className="sm:col-span-2">
                      <MultiSelectDropdown
                        label="Club / Special Interest Group (Optional)"
                        options={CLUBS}
                        selected={form.club}
                        disabled={!form.program.length}
                        onChange={(values) => setForm((c) => ({ ...c, club: values }))}
                      />
                    </div>
                  </div>

                  {/* Real-time Estimated Reach Box */}
                  <div className="rounded-xl border border-teal-200/70 bg-teal-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-teal-700" />
                      <span className="text-xs font-bold text-teal-900">Projected Delivery Audience</span>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-lg bg-white p-2.5 border border-teal-100">
                        <p className="text-base font-bold text-teal-700">{deliveryEstimate.audienceMembers}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Eligible Students</p>
                      </div>
                      <div className="rounded-lg bg-white p-2.5 border border-teal-100">
                        <p className="text-base font-bold text-indigo-700">{deliveryEstimate.pushEligibleDevices}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Push Devices</p>
                      </div>
                      <div className="rounded-lg bg-white p-2.5 border border-teal-100">
                        <p className="text-base font-bold text-emerald-700">{deliveryEstimate.whatsappEligibleContacts}</p>
                        <p className="text-[10px] text-slate-500 font-medium">WhatsApp Contacts</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publishing Schedule Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Publish Timing</h4>
                    <p className="text-[11px] text-slate-500">
                      Send immediately to all selected channels or schedule for an optimal time.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                        form.scheduleMode === 'now'
                          ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="schedule"
                        className="sr-only"
                        checked={form.scheduleMode === 'now'}
                        onChange={() => setForm((c) => ({ ...c, scheduleMode: 'now' }))}
                      />
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">
                        <Send className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Send Immediately</p>
                        <p className="text-[10px] text-slate-500">Broadcast right after saving</p>
                      </div>
                    </label>

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                        form.scheduleMode === 'later'
                          ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="schedule"
                        className="sr-only"
                        checked={form.scheduleMode === 'later'}
                        onChange={() => setForm((c) => ({ ...c, scheduleMode: 'later' }))}
                      />
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                        <CalendarClock className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Schedule Broadcast</p>
                        <p className="text-[10px] text-slate-500">Deliver at a future date/time</p>
                      </div>
                    </label>
                  </div>

                  {form.scheduleMode === 'later' && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <label htmlFor="scheduled-at-input" className={labelClass}>
                        Scheduled Date & Time *
                      </label>
                      <input
                        id="scheduled-at-input"
                        type="datetime-local"
                        value={form.scheduledAt}
                        onChange={(e) => setForm((c) => ({ ...c, scheduledAt: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div role="alert" className="flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep((c) => (c === 3 ? 2 : 1))
                  }}
                  className={secondaryButton}
                >
                  Back
                </button>
              ) : (
                <button type="button" onClick={() => setEditorOpen(false)} className={secondaryButton}>
                  Cancel
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => savePost(true)} className={secondaryButton}>
                Save as Draft
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    const err = step === 1 ? validateStep1() : validateStep2()
                    if (err) {
                      setError(err)
                      return
                    }
                    setError('')
                    setStep((c) => (c === 1 ? 2 : 3))
                  }}
                  className={primaryButton}
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={() => savePost(false)} className={primaryButton}>
                  {form.scheduleMode === 'later' ? <CalendarClock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  <span>{form.scheduleMode === 'later' ? 'Schedule Broadcast' : 'Publish Announcement'}</span>
                </button>
              )}
            </div>
          </div>
        </Overlay>
      )}

      {/* Analytics Drawer */}
      {analyticsPost && <AnalyticsDrawer post={analyticsPost} onClose={() => setAnalyticsId(null)} />}

      {/* Student Feed Interactive Preview */}
      {previewOpen && (
        <StudentPreview
          posts={posts}
          category={previewCategory}
          setCategory={setPreviewCategory}
          search={previewSearch}
          setSearch={setPreviewSearch}
          dismissed={dismissed}
          onDismiss={(id) => setDismissed((current) => [...current, id])}
          acknowledged={acknowledged}
          liked={liked}
          onLike={toggleLike}
          commentPost={commentPost}
          setCommentPost={setCommentPost}
          comment={comment}
          setComment={setComment}
          onComment={(post) => {
            if (!comment.trim()) return
            setPosts((current) =>
              current.map((item) => (item.id === post.id ? { ...item, comments: item.comments + 1 } : item))
            )
            setComment('')
            setCommentPost(null)
            notify('Comment posted in student preview.')
          }}
          onShare={share}
          onAcknowledge={acknowledge}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </section>
  )
}

function StepTab({
  number,
  label,
  active,
  completed,
  onClick
}: {
  number: number
  label: string
  active: boolean
  completed: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 text-xs font-semibold transition ${
        active ? 'text-teal-700' : completed ? 'text-slate-700' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
          active ? 'bg-teal-600 text-white shadow-2xs' : completed ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {completed ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : number}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function LinkedInAnnouncementCard({
  post,
  bookmarked,
  isLiked,
  onBookmark,
  onLike,
  onShare,
  onAnalytics,
  onEdit,
  onDuplicate,
  onStatus,
  onDelete,
  onAddComment,
  commentsList = []
}: {
  post: Post
  bookmarked: boolean
  isLiked: boolean
  onBookmark: () => void
  onLike: () => void
  onShare: () => void
  onAnalytics: () => void
  onEdit: () => void
  onDuplicate: () => void
  onStatus: (status: PostStatus) => void
  onDelete: () => void
  onAddComment: (commentText: string) => void
  commentsList: Array<{ id: string; author: string; role: string; text: string; time: string }>
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newCommentText, setNewCommentText] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const status = computedStatus(post)
  const badge = statusBadgeConfig[status]
  const catTheme = CATEGORY_COLORS[post.category]

  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [menuOpen])

  const ackPercentage =
    post.acknowledgementRequired && post.audienceCount > 0
      ? Math.round((post.acknowledgements / post.audienceCount) * 100)
      : 0

  const hasFeed = post.channels.includes('LMS Feed')
  const hasPush = post.channels.includes('Mobile push')
  const hasWhatsApp = post.channels.includes('WhatsApp')

  const isLongBody = post.body.length > 220
  const imageUrl =
    post.mobilePushContent?.imageUrl ||
    (post.attachments.some(
      (a) => a.name.toLowerCase().includes('image') || a.name.toLowerCase().includes('gallery')
    )
      ? 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80'
      : undefined)

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
      {/* Category Top Colored Accent Bar */}
      <div className={`h-1.5 w-full ${catTheme.bar}`} />

      {/* Main Post Container */}
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-teal-500 text-xs font-bold text-white shadow-2xs ring-2 ring-slate-100">
              {post.author
                .split(' ')
                .slice(0, 2)
                .map((v) => v[0])
                .join('')}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm text-slate-900 hover:text-teal-700 cursor-pointer">
                  {post.author}
                </span>
                <span className="inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-bold text-teal-700">
                  Staff
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">{post.role} · Masters’ Union</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                <span>{relativeTime(post.publishDate)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>Public</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Header: Status Badge, Bookmark & Menu */}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${badge.bg} ${badge.text} ${badge.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
              {badge.label}
            </span>

            <button
              type="button"
              onClick={onBookmark}
              aria-label="Bookmark"
              className={`rounded-xl p-1.5 transition ${
                bookmarked ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Overflow Options Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onAnalytics()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-teal-600" />
                    <span>View Analytics</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5 text-slate-500" />
                    <span>Edit Post</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onDuplicate()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                    <span>Duplicate</span>
                  </button>
                  {['Draft', 'Scheduled'].includes(status) && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onStatus('Published')
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Publish Now</span>
                    </button>
                  )}
                  {['Published', 'Expired'].includes(status) && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onStatus('Archived')
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                  {['Draft', 'Archived'].includes(status) && (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onDelete()
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category & Audience Tag Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-bold ${catTheme.badge}`}>
            {post.category}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            <Users className="h-3 w-3 text-slate-400" />
            <span className="truncate max-w-[200px]">{post.audience}</span>
          </span>

          {post.priority === 'Pinned' && (
            <span
              title="Pinned Announcement"
              className="inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-amber-700 shadow-2xs"
            >
              <Pin className="h-3 w-3 fill-amber-500 text-amber-600" />
            </span>
          )}

          {post.acknowledgementRequired && (
            <span
              className="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700"
              title={`${post.acknowledgements} of ${post.audienceCount} students acknowledged${
                post.expiry ? ` · Due by ${dateText(post.expiry)}` : ''
              }`}
            >
              <ShieldCheck className="h-3 w-3 text-indigo-600" />
              <span>
                Ack: {ackPercentage}% ({post.acknowledgements}/{post.audienceCount})
              </span>
              <span className="inline-block h-1.5 w-7 rounded-full bg-indigo-200 overflow-hidden">
                <span className="block h-full bg-indigo-600 rounded-full" style={{ width: `${ackPercentage}%` }} />
              </span>
            </span>
          )}

          {/* Channel Badges with Labels (Shows In-App and Web when feed is selected) */}
          <div className="flex items-center gap-1.5 ml-auto flex-wrap justify-end">
            {post.channels.includes('LMS Feed') && (
              <>
                <span
                  title="Mobile In-App Feed"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border bg-teal-50 text-teal-700 border-teal-200"
                >
                  <Smartphone className="h-3 w-3" />
                  <span>In-App</span>
                </span>
                <span
                  title="Desktop Web Portal Feed"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border bg-sky-50 text-sky-700 border-sky-200"
                >
                  <Globe className="h-3 w-3" />
                  <span>Web</span>
                </span>
              </>
            )}
            {post.channels.includes('Mobile push') && (
              <span
                title="Mobile Push Notification"
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200"
              >
                <Bell className="h-3 w-3" />
                <span>Push</span>
              </span>
            )}
            {post.channels.includes('WhatsApp') && (
              <span
                title="WhatsApp Direct Message"
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                <MessageCircle className="h-3 w-3" />
                <span>WhatsApp</span>
              </span>
            )}
          </div>
        </div>

        {/* Post Title */}
        <h3 className="text-[15px] font-bold text-slate-900 leading-snug hover:text-teal-700 transition-colors">
          {post.title}
        </h3>

        {/* Post Body (with LinkedIn "...see more") */}
        {hasFeed && (
          <div className="text-xs text-slate-700 leading-relaxed">
            {isLongBody && !expanded ? (
              <div>
                <p className="line-clamp-3 whitespace-pre-wrap">{post.body}</p>
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="mt-1 text-xs font-semibold text-teal-700 hover:underline"
                >
                  …see more
                </button>
              </div>
            ) : (
              <div>
                <FormattedPostBody body={post.body} />
                {isLongBody && (
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="mt-1.5 text-xs font-semibold text-teal-700 hover:underline block"
                  >
                    see less
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Multi-Channel Dispatched Payloads (Mobile Push & WhatsApp) */}
        {(hasPush || hasWhatsApp) && (
          <div className="space-y-2.5 pt-1">
            {hasPush && (
              <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                  <span className="flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Dispatched on Mobile Push</span>
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                    Lock-screen Notification
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">{post.mobilePushContent?.title || post.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{post.mobilePushContent?.message || post.body}</p>
                {post.mobilePushContent?.deepLink && (
                  <p className="text-[10px] text-indigo-600 font-medium pt-0.5">
                    Deep link: <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200/60 font-mono text-[9px]">{post.mobilePushContent.deepLink}</code>
                  </p>
                )}
              </div>
            )}

            {hasWhatsApp && (
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Dispatched on WhatsApp</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Verified Template
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">{post.whatsappContent?.title || post.title}</p>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{post.whatsappContent?.description || post.body}</p>
              </div>
            )}
          </div>
        )}

        {/* Post Image Preview (LinkedIn full-width banner style) */}
        {imageUrl && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full max-h-80 object-cover transition hover:scale-[1.01]"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        )}

        {/* Document Attachments (LinkedIn Document preview style) */}
        {post.attachments.filter((a) => a.type === 'file' && !a.name.toLowerCase().includes('image')).length > 0 && (
          <div className="space-y-2 pt-1">
            {post.attachments
              .filter((a) => a.type === 'file' && !a.name.toLowerCase().includes('image'))
              .map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 hover:bg-slate-100/80 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs shadow-2xs">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">{att.name}</p>
                      <p className="text-[10px] text-slate-400">Official Campus Document · Masters’ Union</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onShare()}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    <span>View</span>
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* YouTube Video Attachment */}
        {post.attachments.some((a) => a.type === 'youtube') && (
          <div className="space-y-2 pt-1">
            {post.attachments
              .filter((a) => a.type === 'youtube')
              .map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="h-5 w-5 text-rose-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{att.name}</p>
                      <p className="text-[10px] text-rose-600">Attached video link</p>
                    </div>
                  </div>
                  <a
                    href={att.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-white border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 shadow-2xs"
                  >
                    Watch video
                  </a>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* LinkedIn Reactions Summary Bar or Direct Delivery Bar */}
      {hasFeed ? (
        <>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-white text-[9px] shadow-2xs">
                  👍
                </span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] shadow-2xs">
                  ❤️
                </span>
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-white text-[9px] shadow-2xs">
                  💡
                </span>
              </div>
              <span className="font-medium text-slate-600 hover:text-teal-700 cursor-pointer">
                {post.likes} students reacted
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>{post.comments} comments</span>
              <span>·</span>
              <span>{post.shares} shares</span>
              <span>·</span>
              <span>{post.views} views</span>
            </div>
          </div>

          {/* LinkedIn Action Buttons Bar */}
          <div className="flex items-center justify-between border-y border-slate-100 px-2 py-1">
            <button
              type="button"
              onClick={onLike}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition hover:bg-slate-100 ${
                isLiked ? 'text-teal-700 font-bold' : 'text-slate-600'
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-teal-600 text-teal-600' : ''}`} />
              <span>Like</span>
            </button>

            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition hover:bg-slate-100 ${
                showComments ? 'bg-slate-50 text-teal-700 font-bold' : 'text-slate-600'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Comment</span>
            </button>

            <button
              type="button"
              onClick={onShare}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={onAnalytics}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>
        </>
      ) : (
        /* Direct External Channel Broadcast Delivery Metrics Bar */
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 rounded-b-2xl">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            {hasWhatsApp && (
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium text-[11px]">
                <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>
                  Delivered: <strong className="font-bold text-emerald-950">{post.audienceCount}</strong> contacts
                </span>
                <span className="text-emerald-400">·</span>
                <span>
                  Read: <strong className="font-bold text-emerald-950">{Math.round(post.audienceCount * 0.88)}</strong>{' '}
                  <span className="text-emerald-600 font-bold">✓✓</span>
                </span>
              </div>
            )}
            {hasPush && (
              <div className="flex items-center gap-1.5 text-indigo-800 font-medium text-[11px]">
                <Bell className="h-3.5 w-3.5 text-indigo-600" />
                <span>
                  Delivered: <strong className="font-bold text-indigo-950">{post.audienceCount}</strong> devices
                </span>
                <span className="text-indigo-400">·</span>
                <span>
                  Opened: <strong className="font-bold text-indigo-950">{Math.round(post.audienceCount * 0.65)}</strong>
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onAnalytics}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-teal-700 shadow-2xs hover:bg-slate-50 transition ml-auto"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Delivery Analytics</span>
          </button>
        </div>
      )}

      {/* Inline Comments Section (LinkedIn Style) */}
      {showComments && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3.5">
          {/* New Comment Input */}
          <div className="flex items-start gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white shadow-2xs">
              AS
            </span>
            <div className="flex-1 flex gap-2">
              <input
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (newCommentText.trim()) {
                      onAddComment(newCommentText)
                      setNewCommentText('')
                    }
                  }
                }}
                placeholder="Add a comment as Super Admin..."
                className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-2xs"
              />
              <button
                type="button"
                disabled={!newCommentText.trim()}
                onClick={() => {
                  if (newCommentText.trim()) {
                    onAddComment(newCommentText)
                    setNewCommentText('')
                  }
                }}
                className="rounded-full bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-teal-700 disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>

          {/* Comments List */}
          {commentsList.length > 0 && (
            <div className="space-y-2.5 pt-1">
              {commentsList.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-700 mt-0.5">
                    {c.author
                      .split(' ')
                      .map((v) => v[0])
                      .join('')}
                  </span>
                  <div className="flex-1 rounded-2xl bg-white border border-slate-200/80 p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{c.author}</span>
                      <span className="text-[10px] text-slate-400">{c.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">{c.role}</p>
                    <p className="mt-1.5 text-xs text-slate-700 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function AnalyticsDrawer({ post, onClose }: { post: Post; onClose: () => void }) {
  const [activeChannel, setActiveChannel] = useState<AnalyticsChannel>(() => initialAnalyticsChannel(post))
  const [rosterSearch, setRosterSearch] = useState('')
  const acknowledgedCount = Math.min(
    STUDENTS.length,
    Math.round((post.acknowledgements / Math.max(1, post.audienceCount)) * STUDENTS.length)
  )
  const roster = STUDENTS.map((name, index) => ({ name, done: index < acknowledgedCount })).filter((row) =>
    row.name.toLowerCase().includes(rosterSearch.toLowerCase())
  )
  const analytics = deriveChannelAnalytics(post, activeChannel)
  const panelRef = useRef<HTMLElement>(null)
  useDialogFocus(panelRef, onClose)

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-labelledby="analytics-title">
      <button type="button" aria-label="Close analytics" onClick={onClose} className="absolute inset-0 h-full w-full bg-slate-950/40 backdrop-blur-xs" />
      <aside
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="analytics-title" className="text-base font-bold text-slate-900">
                Broadcast Analytics
              </h2>
              <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700">
                {post.category}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500 max-w-sm">{post.title}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Channel Switcher */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-2.5">
          <div className="flex gap-2">
            {(
              [
                ['feed', 'In-App Feed', Megaphone],
                ['in-app', 'Mobile Push', Bell],
                ['whatsapp', 'WhatsApp', MessageCircle]
              ] as const
            ).map(([key, label, Icon]) => {
              const active = activeChannel === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveChannel(key)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                    active ? 'bg-white text-teal-700 shadow-2xs ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!analytics.available ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <Send className="mx-auto h-7 w-7 text-slate-400" />
              <p className="mt-2 text-xs font-bold text-slate-700">
                {analytics.pending ? 'Metrics Available After Publication' : 'Channel Not Enabled'}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {analytics.pending
                  ? 'This post is currently scheduled. Delivery analytics will update once sent.'
                  : 'This announcement was not delivered via this channel.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stat Widgets */}
              <div className="grid grid-cols-2 gap-3">
                {analytics.metrics.map((metric) => {
                  const Icon = metric.icon
                  return (
                    <div key={metric.label} className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                          {metric.label}
                        </span>
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${metric.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      <p className="mt-2 text-xl font-bold text-slate-900">{metric.value.toLocaleString()}</p>
                      {metric.helper && <p className="mt-0.5 text-[10px] text-slate-400">{metric.helper}</p>}
                    </div>
                  )
                })}
              </div>

              {/* In-App Feed Specific Analytics */}
              {activeChannel === 'feed' && (
                <>
                  {post.acknowledgementRequired && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Acknowledgement Progress</h4>
                          <p className="text-[10px] text-slate-500">
                            {post.acknowledgements} of {post.audienceCount} students acknowledged
                          </p>
                        </div>
                        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">
                          {Math.round((post.acknowledgements / Math.max(1, post.audienceCount)) * 100)}%
                        </span>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          value={rosterSearch}
                          onChange={(e) => setRosterSearch(e.target.value)}
                          placeholder="Search student roster..."
                          className={`${inputClass} pl-8.5 py-1.5`}
                        />
                      </div>

                      <div className="divide-y divide-slate-100 max-h-44 overflow-y-auto rounded-xl border border-slate-100">
                        {roster.map((row) => (
                          <div key={row.name} className="flex items-center justify-between px-3 py-2 text-xs">
                            <span className="font-medium text-slate-800">{row.name}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                row.done ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {row.done ? 'Acknowledged' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-900 mb-3">Student Engagement Summary</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                        <ThumbsUp className="mx-auto h-4 w-4 text-teal-600 mb-1" />
                        <p className="text-sm font-bold text-slate-900">{post.likes}</p>
                        <p className="text-[10px] text-slate-400">Likes</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                        <MessageSquare className="mx-auto h-4 w-4 text-indigo-600 mb-1" />
                        <p className="text-sm font-bold text-slate-900">{post.comments}</p>
                        <p className="text-[10px] text-slate-400">Comments</p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                        <Share2 className="mx-auto h-4 w-4 text-purple-600 mb-1" />
                        <p className="text-sm font-bold text-slate-900">{post.shares}</p>
                        <p className="text-[10px] text-slate-400">Shares</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

function StudentPreview({
  posts,
  category,
  setCategory,
  search,
  setSearch,
  dismissed,
  onDismiss,
  acknowledged,
  liked,
  onLike,
  commentPost,
  setCommentPost,
  comment,
  setComment,
  onComment,
  onShare,
  onAcknowledge,
  onClose
}: {
  posts: Post[]
  category: string
  setCategory: (v: string) => void
  search: string
  setSearch: (v: string) => void
  dismissed: string[]
  onDismiss: (id: string) => void
  acknowledged: string[]
  liked: string[]
  onLike: (post: Post) => void
  commentPost: string | null
  setCommentPost: (id: string | null) => void
  comment: string
  setComment: (v: string) => void
  onComment: (post: Post) => void
  onShare: (post: Post) => void
  onAcknowledge: (post: Post) => void
  onClose: () => void
}) {
  const [streamTab, setStreamTab] = useState<'Announcement' | 'Community'>('Announcement')
  const [viewportMode, setViewportMode] = useState<'mobile' | 'web'>('mobile')

  const availableCategories = useMemo(
    () => ['All', ...(streamTab === 'Announcement' ? ANNOUNCEMENT_CATEGORIES : COMMUNITY_CATEGORIES)],
    [streamTab]
  )

  const published = useMemo(
    () =>
      posts.filter((post) => {
        const hasFeed = post.channels.includes('LMS Feed')
        if (!hasFeed || computedStatus(post) !== 'Published') return false
        if (search.trim()) {
          const q = search.toLowerCase()
          if (!post.title.toLowerCase().includes(q) && !post.body.toLowerCase().includes(q)) return false
        }
        const isCommunity =
          post.postType === 'Community' || COMMUNITY_CATEGORIES.includes(post.category as CommunityCategory)
        if (streamTab === 'Announcement' && isCommunity) return false
        if (streamTab === 'Community' && !isCommunity) return false

        if (category !== 'All') {
          if (
            post.category !== category &&
            !(category === 'Clubs' && post.category === 'Clubs & Life') &&
            !(category === 'General' && post.category === 'General Operational')
          )
            return false
        }
        return true
      }),
    [posts, search, streamTab, category]
  )

  const activePinned = published.filter((post) => post.priority === 'Pinned')
  const pinned = activePinned.filter((post) => !dismissed.includes(post.id)).slice(0, 2)
  const stream = published
    .filter((post) => post.priority !== 'Pinned')
    .sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate))

  const panelRef = useRef<HTMLDivElement>(null)
  useDialogFocus(panelRef, onClose)

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div
        className={`flex h-full max-h-[900px] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          viewportMode === 'mobile' ? 'max-w-[420px] border-4 border-slate-800 ring-8 ring-slate-900/10' : 'max-w-3xl border border-slate-200'
        }`}
      >
        {/* Preview Top Control Bar */}
        <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-600 text-white shadow-2xs">
              {viewportMode === 'mobile' ? <Smartphone className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            </span>
            <div>
              <h3 id="preview-title" className="text-xs font-bold text-slate-900 leading-tight">
                Student Portal Simulation
              </h3>
              <p className="text-[10px] text-teal-700 font-medium">Interactive Student Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Switcher */}
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  viewportMode === 'mobile' ? 'bg-white text-teal-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Simulate Mobile App"
              >
                <Smartphone className="h-3 w-3" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('web')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  viewportMode === 'web' ? 'bg-white text-teal-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Simulate Desktop Web Portal"
              >
                <Globe className="h-3 w-3" />
                <span className="hidden sm:inline">Web</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              title="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Mobile Phone Mockup Status Bar (When in Mobile Viewport Mode) */}
        {viewportMode === 'mobile' && (
          <div className="flex items-center justify-between bg-slate-900 px-5 py-1.5 text-[10px] font-semibold text-white select-none shrink-0">
            <span>9:41</span>
            <div className="flex h-3 w-16 rounded-full bg-black/40" />
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Stream Switcher (Announcement / Community) */}
        <div className="border-b border-slate-100 bg-white px-4 pt-2 shrink-0">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setStreamTab('Announcement')
                setCategory('All')
              }}
              className={`pb-2 text-xs font-bold border-b-2 transition -mb-px flex items-center gap-1.5 ${
                streamTab === 'Announcement'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Megaphone className="h-3.5 w-3.5" />
              <span>Announcements</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setStreamTab('Community')
                setCategory('All')
              }}
              className={`pb-2 text-xs font-bold border-b-2 transition -mb-px flex items-center gap-1.5 ${
                streamTab === 'Community'
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Community</span>
            </button>
          </div>
        </div>

        {/* Dynamic Category Filter Pills & Search */}
        <div className="border-b border-slate-100 bg-slate-50/70 p-3 space-y-2.5 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {availableCategories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                  category === item
                    ? 'bg-teal-600 text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${streamTab.toLowerCase()} feed...`}
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8.5 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Main Feed Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100/70 p-3.5 sm:p-5 space-y-3.5">
          {/* Pinned Broadcasts */}
          {streamTab === 'Announcement' &&
            pinned.map((post) => (
              <article key={post.id} className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white shadow-2xs">
                      <Pin className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        Pinned · {post.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{post.title}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => onDismiss(post.id)}
                    className="rounded-lg px-2 py-0.5 text-amber-700 hover:bg-amber-100 text-[10px] font-bold"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{post.body}</p>

                {post.acknowledgementRequired && (
                  <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-amber-900 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                      Mandatory Reading Required
                    </span>
                    <button
                      disabled={acknowledged.includes(post.id)}
                      onClick={() => onAcknowledge(post)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 disabled:bg-teal-600"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{acknowledged.includes(post.id) ? 'Acknowledged' : 'Mark as Acknowledged'}</span>
                    </button>
                  </div>
                )}
              </article>
            ))}

          {/* Empty State */}
          {pinned.length === 0 && stream.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 shadow-2xs mb-2">
                {streamTab === 'Announcement' ? <Megaphone className="h-6 w-6" /> : <Users className="h-6 w-6" />}
              </span>
              <p className="text-xs font-bold text-slate-700">No {streamTab.toLowerCase()} posts found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try switching categories or clearing search.</p>
            </div>
          )}

          {/* Standard Stream Posts */}
          {stream.map((post) => {
            const isLiked = liked.includes(post.id)
            const isCommunity =
              post.postType === 'Community' || COMMUNITY_CATEGORIES.includes(post.category as CommunityCategory)
            const catBadge = CATEGORY_COLORS[post.category]?.badge ?? 'bg-slate-100 text-slate-700 border-slate-200'

            return (
              <article key={post.id} className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shadow-2xs ${
                        isCommunity ? 'bg-gradient-to-tr from-amber-500 to-rose-500 text-white' : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      {post.author
                        .split(' ')
                        .slice(0, 2)
                        .map((v) => v[0])
                        .join('')}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900">{post.author}</p>
                        {isCommunity ? (
                          <span className="rounded bg-amber-50 text-amber-700 border border-amber-200 px-1 py-0.2 text-[9px] font-bold">
                            Community
                          </span>
                        ) : (
                          <span className="rounded bg-teal-50 text-teal-700 border border-teal-200 px-1 py-0.2 text-[9px] font-bold">
                            Staff
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {post.role} · {relativeTime(post.publishDate)}
                      </p>
                    </div>
                  </div>

                  <span className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${catBadge}`}>
                    {post.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{post.title}</h4>
                <div className="text-xs leading-relaxed text-slate-600">
                  <FormattedPostBody body={post.body} />
                </div>

                {post.attachments.length > 0 && (
                  <div className="grid gap-1.5 sm:grid-cols-2 pt-1">
                    {post.attachments.map((att) => (
                      <AttachmentCard key={att.id} attachment={att} />
                    ))}
                  </div>
                )}

                {/* Acknowledgement Action (if mandatory) */}
                {post.acknowledgementRequired && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-purple-700 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Mandatory Reading Required
                    </span>
                    <button
                      disabled={acknowledged.includes(post.id)}
                      onClick={() => onAcknowledge(post)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-purple-700 disabled:bg-teal-600"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{acknowledged.includes(post.id) ? 'Acknowledged' : 'Mark as Acknowledged'}</span>
                    </button>
                  </div>
                )}

                {/* Social Interaction Buttons */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-2.5">
                  {post.allowLikes && (
                    <button
                      onClick={() => onLike(post)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                        isLiked ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-teal-600' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                  )}
                  {post.allowComments && (
                    <button
                      onClick={() => setCommentPost(commentPost === post.id ? null : post.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{post.comments}</span>
                    </button>
                  )}
                  {post.allowSharing && (
                    <button
                      onClick={() => onShare(post)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50 ml-auto"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </button>
                  )}
                </div>

                {/* Comment Input */}
                {commentPost === post.id && (
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <input
                      autoFocus
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment as a student..."
                      className={inputClass}
                    />
                    <button onClick={() => onComment(post)} className={primaryButton}>
                      Post
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </main>

        {/* Mobile Phone Mockup Bottom Tab Bar */}
        {viewportMode === 'mobile' && (
          <div className="flex items-center justify-around border-t border-slate-200 bg-white py-2 text-[10px] font-semibold text-slate-400 shrink-0">
            <div className="flex flex-col items-center gap-0.5 text-slate-400">
              <Globe className="h-4 w-4" />
              <span>Home</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-teal-600 font-bold">
              <Megaphone className="h-4 w-4" />
              <span>Feed</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-slate-400">
              <CalendarClock className="h-4 w-4" />
              <span>Schedule</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 text-slate-400">
              <Users className="h-4 w-4" />
              <span>Profile</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
