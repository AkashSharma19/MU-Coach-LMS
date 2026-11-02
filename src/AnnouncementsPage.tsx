import { useEffect, useId, useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react'
import {
  Archive, BarChart3, Bell, Bold, Bookmark, CalendarClock, Check, CheckCircle2, ChevronRight,
  Copy, File, Image, Italic, Link, List, ListOrdered, Megaphone, MessageCircle,
  MoreHorizontal, Paperclip, Pencil, Pin, Plus, Quote, Search, Send, Share2, Smartphone,
  Strikethrough, Table2, ThumbsUp, Trash2, Underline, Upload, Video, X
} from 'lucide-react'

type Category = 'Academics' | 'Placements' | 'Events' | 'Clubs & Life' | 'General Operational'
type Priority = 'Standard' | 'Pinned'
type PostStatus = 'Published' | 'Scheduled' | 'Expired' | 'Draft' | 'Archived'
type Channel = 'LMS Feed' | 'Mobile push' | 'WhatsApp'
type MobilePushContent = { title: string; message: string; imageUrl?: string; deepLink?: string }
type WhatsAppContent = { title: string; description: string }
type Attachment = { id: string; name: string; type: 'file' | 'youtube'; url?: string }
type DeliveryEstimate = { audienceMembers: number; inAppEligible: number; pushEligibleDevices: number; whatsappEligibleContacts: number }
type Post = {
  id: string; title: string; body: string; category: Category; priority: Priority; audience: string
  channels: Channel[]; mobilePushContent?: MobilePushContent; whatsappContent?: WhatsAppContent; publishDate: string; expiry?: string; status: PostStatus; author: string; role: string
  attachments: Attachment[]; likes: number; comments: number; shares: number; views: number; reach: number
  acknowledgementRequired: boolean; acknowledgements: number; audienceCount: number
  allowLikes: boolean; allowComments: boolean; allowSharing: boolean
  targeting: Pick<FormState, 'program' | 'cohort' | 'term' | 'section' | 'club'>
}
type FormState = {
  category: Category | ''; expiry: string; acknowledgementRequired: boolean
  title: string; body: string; attachments: Attachment[]; youtubeUrl: string
  pushTitle: string; pushMessage: string; imageUrl: string; deepLink: string; whatsappTitle: string; whatsappDescription: string
  allowLikes: boolean; allowComments: boolean; allowSharing: boolean
  program: string[]; cohort: string[]; term: string[]; section: string[]; club: string[]
  channels: Channel[]; scheduleMode: 'now' | 'later'; scheduledAt: string
}

interface AnnouncementsPageProps { onActionNotify?: (message: string) => void }

const CATEGORIES: Category[] = ['Academics', 'Placements', 'Events', 'Clubs & Life', 'General Operational']
const PROGRAMS = ['PGP in Technology & Business Management', 'Undergraduate Programme', 'PGP Rise']
const COHORTS: Record<string, string[]> = {
  'PGP in Technology & Business Management': ['Cohort 7', 'Cohort 8'],
  'Undergraduate Programme': ['Cohort 3', 'Cohort 4'], 'PGP Rise': ['Cohort 2']
}
const TERMS = ['Term 1', 'Term 2', 'Term 3', 'Term 4']
const SECTIONS = ['Section 1', 'Section 2', 'Section 3']
const CLUBS = ['Entrepreneurship Cell', 'Consulting Club', 'Cultural Committee', 'Sports Council']
const STUDENTS = ['Aarav Mehta', 'Aanya Bose', 'Diya Shah', 'Kabir Rao', 'Meera Iyer', 'Neil Bhat', 'Rhea Kapoor', 'Vivaan Roy']
const isHttpUrl = (value: string) => { try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:' } catch { return false } }
const estimateAudience = (form: Pick<FormState, 'program' | 'cohort' | 'term' | 'section' | 'club' | 'channels'>): DeliveryEstimate => {
  const programSizes: Record<string, number> = { [PROGRAMS[0]]: 420, [PROGRAMS[1]]: 280, [PROGRAMS[2]]: 160 }
  let members = form.program.reduce((sum, program) => sum + (programSizes[program] ?? 0), 0)
  if (form.cohort.length) { const available = form.program.reduce((sum, program) => sum + (COHORTS[program]?.length ?? 0), 0); members *= form.cohort.length / Math.max(1, available) }
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
const channelLabel = (channel: Channel) => channel === 'LMS Feed' ? 'In-App Feed' : channel === 'Mobile push' ? 'Mobile Push' : channel
const blankForm = (): FormState => ({
  category: '', expiry: '', acknowledgementRequired: false, title: '', body: '', attachments: [], youtubeUrl: '',
  pushTitle: '', pushMessage: '', imageUrl: '', deepLink: '', whatsappTitle: '', whatsappDescription: '',
  allowLikes: true, allowComments: true, allowSharing: true, program: [], cohort: [], term: [], section: [], club: [],
  channels: ['LMS Feed'], scheduleMode: 'now', scheduledAt: nowLocal()
})

const INITIAL_POSTS: Post[] = [
  { id: 'p1', title: 'Term 2 examination schedule and hall protocols', body: 'The final examination timetable is now available. Review reporting times, permitted materials and room allocations before Friday.', category: 'Academics', priority: 'Pinned', audience: 'PGP TBM · Cohorts 7–8', channels: ['LMS Feed', 'Mobile push', 'WhatsApp'], mobilePushContent: { title: 'Term 2 examination schedule', message: 'The final timetable is available. Review reporting times, materials and room allocations before Friday.', deepLink: '/academics/examinations/term-2' }, whatsappContent: { title: 'Term 2 exam schedule and hall protocols', description: 'Review the final exam timetable, reporting times, permitted materials and room allocations before Friday. Open the LMS post for the complete schedule.' }, publishDate: '2026-10-27T09:00', expiry: '2026-11-08T18:00', status: 'Published', author: 'Office of Academics', role: 'Academic Administration', attachments: [{ id: 'a1', name: 'Term-2-exam-schedule.pdf', type: 'file' }], likes: 84, comments: 12, shares: 9, views: 412, reach: 388, acknowledgementRequired: true, acknowledgements: 296, audienceCount: 420, allowLikes: true, allowComments: true, allowSharing: true, targeting: { program: [PROGRAMS[0]], cohort: ['Cohort 7', 'Cohort 8'], term: [], section: [], club: [] } },
  { id: 'p2', title: 'Founders Day 2026: a look back', body: 'From student showcases to the alumni fireside, here are the moments that made this year’s celebration memorable.', category: 'Events', priority: 'Standard', audience: 'All students', channels: ['LMS Feed', 'Mobile push'], mobilePushContent: { title: 'Founders Day 2026 highlights', message: 'See the student showcases, alumni fireside and memorable moments from this year’s celebration.', imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=640&q=70', deepLink: '/feed/founders-day-2026' }, publishDate: '2026-10-26T16:30', status: 'Published', author: 'Campus Events', role: 'Student Experience', attachments: [{ id: 'a2', name: 'Founders Day gallery · 4 images', type: 'file' }, { id: 'a3', name: 'Event highlights', type: 'youtube', url: 'https://youtube.com/watch?v=campus' }], likes: 156, comments: 28, shares: 31, views: 680, reach: 594, acknowledgementRequired: false, acknowledgements: 0, audienceCount: 760, allowLikes: true, allowComments: true, allowSharing: true, targeting: { program: [...PROGRAMS], cohort: [], term: [], section: [], club: [] } },
  { id: 'p3', title: 'Placement week: consulting shortlist published', body: 'Shortlisted candidates can view interview slots in the placement portal. The briefing starts tomorrow at 8:30 AM.', category: 'Placements', priority: 'Pinned', audience: 'PGP TBM · Cohort 7', channels: ['LMS Feed', 'Mobile push', 'WhatsApp'], mobilePushContent: { title: 'Consulting shortlist published', message: 'Check your interview slot in the placement portal and join tomorrow’s 8:30 AM briefing.' }, whatsappContent: { title: 'Consulting shortlist and interview slots', description: 'The consulting shortlist is live. Check your interview slot and join tomorrow’s 8:30 AM briefing. Open the LMS post for full instructions.' }, publishDate: '2026-10-27T11:15', expiry: '2026-11-02T20:00', status: 'Published', author: 'Career Services', role: 'Placement Office', attachments: [{ id: 'a4', name: 'Interview-readiness-checklist.pdf', type: 'file' }], likes: 42, comments: 6, shares: 3, views: 236, reach: 219, acknowledgementRequired: true, acknowledgements: 181, audienceCount: 240, allowLikes: false, allowComments: true, allowSharing: false, targeting: { program: [PROGRAMS[0]], cohort: ['Cohort 7'], term: [], section: [], club: [] } },
  { id: 'p4', title: 'Consulting Club case practice circles', body: 'Weekly peer-led case practice begins this Wednesday. Choose a track and reserve your group slot.', category: 'Clubs & Life', priority: 'Standard', audience: 'Consulting Club', channels: ['LMS Feed', 'Mobile push'], mobilePushContent: { title: 'Case practice circles start Wednesday', message: 'Choose a track and reserve your weekly peer-led case practice group slot.' }, publishDate: '2026-10-25T13:00', status: 'Published', author: 'Consulting Club', role: 'Student Club', attachments: [], likes: 61, comments: 19, shares: 14, views: 302, reach: 271, acknowledgementRequired: false, acknowledgements: 0, audienceCount: 330, allowLikes: true, allowComments: true, allowSharing: true, targeting: { program: [PROGRAMS[0]], cohort: [], term: [], section: [], club: ['Consulting Club'] } },
  { id: 'p5', title: 'Library access maintenance window', body: 'Digital library authentication will be briefly unavailable during scheduled maintenance.', category: 'General Operational', priority: 'Standard', audience: 'All students', channels: ['LMS Feed', 'Mobile push'], mobilePushContent: { title: 'Library maintenance window', message: 'Digital library authentication will be briefly unavailable during scheduled maintenance.' }, publishDate: '2026-11-05T20:00', status: 'Scheduled', author: 'Akash Sharma', role: 'Super Admin', attachments: [], likes: 0, comments: 0, shares: 0, views: 0, reach: 0, acknowledgementRequired: false, acknowledgements: 0, audienceCount: 760, allowLikes: false, allowComments: false, allowSharing: false, targeting: { program: [...PROGRAMS], cohort: [], term: [], section: [], club: [] } },
  { id: 'p6', title: 'Faculty office hours directory refresh', body: 'A refreshed directory is being prepared for the next academic term.', category: 'Academics', priority: 'Standard', audience: 'Undergraduate Programme', channels: ['LMS Feed', 'Mobile push'], mobilePushContent: { title: 'Faculty office hours refresh', message: 'A refreshed faculty office hours directory is being prepared for the next academic term.' }, publishDate: '2026-10-27T12:00', status: 'Draft', author: 'Akash Sharma', role: 'Super Admin', attachments: [], likes: 0, comments: 0, shares: 0, views: 0, reach: 0, acknowledgementRequired: false, acknowledgements: 0, audienceCount: 280, allowLikes: true, allowComments: true, allowSharing: true, targeting: { program: [PROGRAMS[1]], cohort: [], term: [], section: [], club: [] } },
  { id: 'p7', title: 'Campus shuttle route update', body: 'The temporary evening route has concluded. Regular shuttle timings are now restored.', category: 'General Operational', priority: 'Pinned', audience: 'All students', channels: ['LMS Feed', 'Mobile push'], mobilePushContent: { title: 'Campus shuttle timings restored', message: 'The temporary evening route has ended. Regular campus shuttle timings are now restored.' }, publishDate: '2026-09-28T08:00', expiry: '2026-10-05T23:59', status: 'Expired', author: 'Campus Operations', role: 'Administration', attachments: [], likes: 18, comments: 2, shares: 1, views: 521, reach: 472, acknowledgementRequired: true, acknowledgements: 403, audienceCount: 760, allowLikes: false, allowComments: false, allowSharing: false, targeting: { program: [...PROGRAMS], cohort: [], term: [], section: [], club: [] } }
]

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'
const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-700'
const primaryButton = 'inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButton = 'inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
const dateText = (value: string) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
const computedStatus = (post: Post): PostStatus => {
  if (post.status === 'Draft' || post.status === 'Archived' || post.status === 'Expired') return post.status
  const now = Date.now()
  const isPublished = post.status === 'Published' || (post.status === 'Scheduled' && new Date(post.publishDate).getTime() <= now)
  if (!isPublished) return post.status
  return post.expiry && new Date(post.expiry).getTime() <= now ? 'Expired' : 'Published'
}
const validDate = (value?: string) => Boolean(value) && Number.isFinite(new Date(value as string).getTime())
type PublicationData = Pick<Post, 'title' | 'body' | 'category' | 'priority' | 'expiry' | 'targeting' | 'channels' | 'mobilePushContent' | 'whatsappContent'> & { scheduleMode: 'now' | 'later'; scheduledAt: string }
const validateChannelContent = (data: Pick<PublicationData, 'title' | 'body' | 'category' | 'priority' | 'expiry' | 'channels' | 'mobilePushContent' | 'whatsappContent'>) => {
  if (!data.channels.length) return 'Select at least one delivery channel.'
  if (!data.category) return 'Category is required.'
  if (data.channels.includes('LMS Feed')) {
    if (!data.title.trim() || !data.body.trim()) return 'In-App title and body are required.'
    if (data.title.length > 200) return 'In-App title must be 200 characters or fewer.'
    if (data.priority === 'Pinned' && data.expiry && !validDate(data.expiry)) return 'Choose a valid notice expiry date and time.'
  }
  if (data.channels.includes('Mobile push')) {
    if (!data.mobilePushContent?.title.trim() || !data.mobilePushContent.message.trim()) return 'Push title and message are required when Mobile Push is selected.'
    if (data.mobilePushContent.title.length > 65) return 'Push title must be 65 characters or fewer.'
    if (data.mobilePushContent.message.length > 180) return 'Push message must be 180 characters or fewer.'
    if (data.mobilePushContent.imageUrl?.trim() && !isHttpUrl(data.mobilePushContent.imageUrl.trim())) return 'Image URL must begin with http:// or https://.'
    const deepLink = data.mobilePushContent.deepLink?.trim()
    if (deepLink && !deepLink.startsWith('/') && !isHttpUrl(deepLink)) return 'Deep link must be an app path beginning with / or an http(s) URL.'
  }
  if (data.channels.includes('WhatsApp')) {
    if (!data.whatsappContent?.title.trim() || !data.whatsappContent.description.trim()) return 'WhatsApp title and description are required when WhatsApp is selected.'
    if (data.whatsappContent.title.length > 60) return 'WhatsApp title must be 60 characters or fewer.'
    if (data.whatsappContent.description.length > 500) return 'WhatsApp description must be 500 characters or fewer.'
  }
  return ''
}
const validatePublication = (data: PublicationData, allowPastSchedule = false) => {
  const contentError = validateChannelContent(data)
  if (contentError) return contentError
  if (!data.targeting.program.length) return 'Select at least one program before publishing.'
  if (data.targeting.program.some(program => !PROGRAMS.includes(program))) return 'Audience targeting contains an invalid program.'
  const validCohorts = data.targeting.program.flatMap(program => COHORTS[program] ?? [])
  if (data.targeting.cohort.some(cohort => !validCohorts.includes(cohort))) return 'Audience targeting contains a cohort outside the selected program.'
  if (data.targeting.term.some(term => !TERMS.includes(term)) || (data.targeting.term.length > 0 && !data.targeting.cohort.length)) return 'Audience targeting contains an invalid term selection.'
  if (data.targeting.section.some(section => !SECTIONS.includes(section)) || (data.targeting.section.length > 0 && !data.targeting.term.length)) return 'Audience targeting contains an invalid section selection.'
  if (data.targeting.club.some(club => !CLUBS.includes(club))) return 'Audience targeting contains an invalid club or group.'
  if (data.scheduleMode === 'later') {
    if (!validDate(data.scheduledAt)) return 'Choose a valid schedule date and time.'
    if (!allowPastSchedule && new Date(data.scheduledAt).getTime() <= Date.now()) return 'Choose a future schedule date and time.'
  }
  if (data.priority === 'Pinned' && data.expiry) {
    const effectivePublication = data.scheduleMode === 'later' && !allowPastSchedule ? new Date(data.scheduledAt).getTime() : Date.now()
    if (new Date(data.expiry).getTime() <= effectivePublication) return data.scheduleMode === 'later' && !allowPastSchedule
      ? 'Notice expiry must be after the scheduled publication time.'
      : 'Notice expiry must be after the current time.'
  }
  return ''
}
const statusClass: Record<PostStatus, string> = { Published: 'bg-teal-50 text-teal-700 border-teal-200', Scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200', Expired: 'bg-slate-100 text-slate-600 border-slate-200', Draft: 'bg-amber-50 text-amber-700 border-amber-200', Archived: 'bg-rose-50 text-rose-700 border-rose-200' }
type AnalyticsChannel = 'feed' | 'in-app' | 'whatsapp'
type AnalyticsMetric = { label: string; value: number; helper?: string }
type ChannelAnalytics = { available: boolean; pending: boolean; metrics: AnalyticsMetric[] }
const stableRatio = (key: string, minimum: number, maximum: number) => {
  const hash = Array.from(key).reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 2166136261)
  return minimum + (hash % 1000) / 999 * (maximum - minimum)
}
const deriveChannelAnalytics = (post: Post, channel: AnalyticsChannel): ChannelAnalytics => {
  const count = (value: number, ceiling: number) => Math.max(0, Math.min(Math.round(value), Math.max(0, ceiling)))
  const deliveryPending = ['Draft', 'Scheduled'].includes(computedStatus(post))
  if (channel === 'feed') {
    const selected = post.channels.includes('LMS Feed')
    const delivered = Math.max(0, post.audienceCount)
    return { available: selected && !deliveryPending, pending: selected && deliveryPending, metrics: [
      { label: 'Delivered', value: delivered, helper: 'Feed audience' },
      { label: 'Reached', value: count(post.reach, delivered), helper: 'Unique students' },
      { label: 'Views', value: Math.max(0, post.views), helper: 'Total opens' },
      { label: 'Engagement', value: Math.max(0, post.likes + post.comments + post.shares), helper: 'Likes, comments, shares' }
    ] }
  }
  if (channel === 'in-app') {
    const selected = post.channels.includes('Mobile push')
    const targeted = Math.max(0, post.audienceCount)
    const delivered = count(targeted * stableRatio(`${post.id}-push-delivered`, .76, .94), targeted)
    const opened = count(delivered * stableRatio(`${post.id}-push-opened`, .45, .75), delivered)
    const clicks = count(opened * stableRatio(`${post.id}-push-clicks`, .15, .40), opened)
    return { available: selected && !deliveryPending, pending: selected && deliveryPending, metrics: [
      { label: 'Targeted', value: targeted }, { label: 'Delivered', value: delivered },
      { label: 'Opened', value: opened }, { label: 'Action clicks', value: clicks }
    ] }
  }
  const selected = post.channels.includes('WhatsApp')
  const targeted = count(post.audienceCount * .81, post.audienceCount)
  const delivered = count(targeted * stableRatio(`${post.id}-whatsapp-delivered`, .92, .98), targeted)
  const read = count(delivered * stableRatio(`${post.id}-whatsapp-read`, .65, .88), delivered)
  const clicks = count(read * stableRatio(`${post.id}-whatsapp-clicks`, .15, .40), read)
  return { available: selected && !deliveryPending, pending: selected && deliveryPending, metrics: [
    { label: 'Targeted', value: targeted }, { label: 'Delivered', value: delivered },
    { label: 'Read', value: read }, { label: 'LMS link clicks', value: clicks }
  ] }
}
const initialAnalyticsChannel = (post: Post): AnalyticsChannel => post.channels.includes('LMS Feed') ? 'feed' : post.channels.includes('Mobile push') ? 'in-app' : 'whatsapp'

function useDialogFocus(panelRef: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])
  const openerRef = useRef<HTMLElement | null>(document.activeElement instanceof HTMLElement ? document.activeElement : null)
  useEffect(() => {
    const panel = panelRef.current; const opener = openerRef.current
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])') ?? [])
    focusable()[0]?.focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
      if (event.key !== 'Tab') return
      const items = focusable(); if (!items.length) return
      const first = items[0]; const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.removeEventListener('keydown', keydown); opener?.focus() }
  }, [panelRef])
}

function Overlay({ title, description, onClose, children }: { title: string; description?: string; onClose: () => void; children: ReactNode }) {
  const titleId = useId(); const panelRef = useRef<HTMLDivElement>(null)
  useDialogFocus(panelRef, onClose)
  return <div className="fixed inset-0 z-[70] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby={titleId}>
    <button type="button" className="absolute inset-0 h-full w-full cursor-default bg-slate-950/50 backdrop-blur-[1px]" aria-label={`Close ${title}`} onClick={onClose} />
    <div ref={panelRef} tabIndex={-1} className="absolute inset-y-0 right-0 flex w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl outline-none">
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4"><div><h2 id={titleId} className="text-base font-bold text-slate-900">{title}</h2>{description && <p className="mt-1 text-xs text-slate-500">{description}</p>}</div><button type="button" onClick={onClose} aria-label={`Close ${title}`} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button></div>
      {children}
    </div>
  </div>
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? 'bg-teal-600' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${checked ? 'left-[18px]' : 'left-0.5'}`} /></button>
}

function MultiSelectDropdown({ label, options, selected, onChange, disabled = false, required = false }: { label: string; options: string[]; selected: string[]; onChange: (values: string[]) => void; disabled?: boolean; required?: boolean }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLFieldSetElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const labelId = useId()
  const listboxId = useId()
  const unavailable = disabled || options.length === 0
  const isOpen = open && !unavailable
  const summary = selected.length === 0 ? `Select ${label.toLowerCase().replace(' (optional)', '')}` : selected.length === 1 ? selected[0] : `${selected.length} selected`

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

  return <fieldset ref={rootRef} className="relative min-w-0 overflow-visible" disabled={unavailable}>
    <legend id={labelId} className={labelClass}>{label}{required && ' *'}</legend>
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-labelledby={`${labelId} ${listboxId}-summary`}
      aria-required={required}
      disabled={unavailable}
      onClick={() => setOpen(current => !current)}
      onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          openAndFocus(event.key === 'ArrowUp' ? options.length - 1 : Math.max(0, options.findIndex(option => selected.includes(option))))
        } else if (event.key === 'Escape' && isOpen) {
          event.preventDefault(); event.stopPropagation(); setOpen(false)
        }
      }}
      className={`${inputClass} flex items-center justify-between gap-3 text-left ${selected.length ? 'text-slate-800' : 'text-slate-400'}`}
    >
      <span id={`${listboxId}-summary`} className="truncate">{unavailable ? 'Choose the previous level first' : summary}</span>
      <ChevronRight aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
    </button>
    {isOpen && <div id={listboxId} role="listbox" aria-labelledby={labelId} aria-multiselectable="true" className="absolute inset-x-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl">
      {options.map((option, index) => {
        const isSelected = selected.includes(option)
        return <button
          key={option}
          ref={element => { optionRefs.current[index] = element }}
          type="button"
          role="option"
          aria-selected={isSelected}
          onClick={() => onChange(isSelected ? selected.filter(value => value !== option) : [...selected, option])}
          onKeyDown={event => {
            if (event.key === 'ArrowDown') { event.preventDefault(); moveFocus(index + 1) }
            else if (event.key === 'ArrowUp') { event.preventDefault(); moveFocus(index - 1) }
            else if (event.key === 'Home') { event.preventDefault(); optionRefs.current[0]?.focus() }
            else if (event.key === 'End') { event.preventDefault(); optionRefs.current[options.length - 1]?.focus() }
            else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false); triggerRef.current?.focus() }
            else if (event.key === 'Tab') setOpen(false)
          }}
          className={`flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-[11px] transition ${isSelected ? 'bg-teal-50 font-semibold text-teal-800' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <span>{option}</span><Check aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-teal-600' : 'invisible'}`} />
        </button>
      })}
    </div>}
  </fieldset>
}

function PushPreview({ title, message, imageUrl, deepLink }: { title: string; message: string; imageUrl?: string; deepLink?: string }) {
  return <aside aria-label="Read-only mobile notification preview" className="rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-sm"><div className="overflow-hidden rounded-xl bg-white shadow-sm">{imageUrl?.trim() && <div className="h-20 bg-slate-200"><img src={imageUrl.trim()} alt="Push notification media preview" className="h-full w-full object-cover" onError={event => { event.currentTarget.style.visibility = 'hidden' }} /></div>}<div className="flex items-start gap-2 p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-[10px] font-bold text-white">MU</span><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="text-[10px] font-semibold text-slate-500">Coach LMS</p><span className="text-[9px] text-slate-400">now</span></div><p className="mt-1 break-words text-[11px] font-bold text-slate-900">{title || 'Your push title'}</p><p className="mt-0.5 break-words text-[10px] leading-4 text-slate-600">{message || 'Your lock-screen message will appear here.'}</p><p className="mt-1.5 truncate text-[9px] font-semibold text-indigo-600">Tap to open {deepLink?.trim() || 'Feed item'}</p></div></div></div></aside>
}

function WhatsAppPreview({ title, description }: { title: string; description: string }) {
  return <aside aria-label="Read-only WhatsApp message preview" className="overflow-hidden rounded-xl border border-emerald-900/15 bg-[#d9eee6] shadow-sm"><div className="flex items-center gap-2 bg-[#075e54] px-3 py-2 text-white"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[9px] font-bold text-emerald-800">MU</span><div><p className="text-[10px] font-bold">Masters’ Union Updates</p><p className="text-[8px]">Official account</p></div></div><div className="m-3 rounded-lg bg-white p-3 shadow-sm"><p className="break-words [overflow-wrap:anywhere] text-[11px] font-bold text-slate-900">{title || 'Your WhatsApp title'}</p><p className="mt-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[10px] leading-4 text-slate-600">{description || 'Your message summary will appear here.'}</p><div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[9px] text-teal-700"><span>Open in Coach LMS</span><span>now ✓✓</span></div></div></aside>
}

function FormattedPostBody({ body }: { body: string }) {
  return <div className="space-y-1.5 break-words text-[11px] leading-5 text-slate-600 [overflow-wrap:anywhere]">{body.split('\n').map((line, index) => {
    if (!line.trim()) return <div key={index} aria-hidden="true" className="h-2" />
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/)
    if (bullet) return <div key={index} className="flex items-start gap-2 pl-1"><span aria-hidden="true" className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-teal-600" /><span className="min-w-0">{bullet[1]}</span></div>
    const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)$/)
    if (numbered) return <div key={index} className="flex items-start gap-2 pl-1"><span className="shrink-0 font-semibold text-teal-700">{numbered[1]}.</span><span className="min-w-0">{numbered[2]}</span></div>
    const quote = line.match(/^\s*>\s+(.*)$/)
    if (quote) return <blockquote key={index} className="border-l-2 border-teal-300 bg-teal-50/50 py-1 pl-3 pr-2 italic text-slate-600">{quote[1]}</blockquote>
    return <p key={index} className="whitespace-pre-wrap">{line}</p>
  })}</div>
}

export default function AnnouncementsPage({ onActionNotify = () => {} }: AnnouncementsPageProps) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [tab, setTab] = useState<'all' | 'live' | 'scheduled' | 'mine' | 'bookmarked'>('all')
  const [bookmarked, setBookmarked] = useState<string[]>([])
  const [search, setSearch] = useState(''); const [categoryFilter, setCategoryFilter] = useState(''); const [priorityFilter, setPriorityFilter] = useState('')
  const [editorOpen, setEditorOpen] = useState(false); const [editingId, setEditingId] = useState<string | null>(null); const [step, setStep] = useState<1 | 2 | 3 | 4>(1); const [form, setForm] = useState<FormState>(blankForm()); const [error, setError] = useState(''); const [actionError, setActionError] = useState('')
  const [analyticsId, setAnalyticsId] = useState<string | null>(null); const [previewOpen, setPreviewOpen] = useState(false)
  const [previewCategory, setPreviewCategory] = useState('All'); const [previewSearch, setPreviewSearch] = useState(''); const [dismissed, setDismissed] = useState<string[]>([]); const [acknowledged, setAcknowledged] = useState<string[]>([]); const [liked, setLiked] = useState<string[]>([]); const [commentPost, setCommentPost] = useState<string | null>(null); const [comment, setComment] = useState(''); const [attachmentError, setAttachmentError] = useState(''); const [formatActive, setFormatActive] = useState<string[]>([]); const fileRef = useRef<HTMLInputElement>(null)
  const availableCohorts = useMemo(() => form.program.flatMap(program => COHORTS[program] ?? []), [form.program])
  const deliveryEstimate = useMemo(() => estimateAudience(form), [form])
  const analyticsPost = posts.find(post => post.id === analyticsId) ?? null
  const visiblePosts = useMemo(() => posts.filter(post => {
    const status = computedStatus(post)
    const text = `${post.title} ${post.body} ${post.category} ${post.author} ${post.role} ${post.audience} ${post.channels.join(' ')} ${post.mobilePushContent?.title ?? ''} ${post.mobilePushContent?.message ?? ''} ${post.whatsappContent?.title ?? ''} ${post.whatsappContent?.description ?? ''}`.toLowerCase()
    const matchesTab = tab === 'all' || (tab === 'live' && status === 'Published') || (tab === 'scheduled' && status === 'Scheduled') || (tab === 'mine' && post.author === 'Akash Sharma') || (tab === 'bookmarked' && bookmarked.includes(post.id))
    return matchesTab && text.includes(search.trim().toLowerCase()) && (!categoryFilter || post.category === categoryFilter) && (!priorityFilter || post.priority === priorityFilter)
  }).sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate)), [posts, tab, bookmarked, search, categoryFilter, priorityFilter])

  const notify = (message: string) => onActionNotify(message)
  const openCreate = () => { setEditingId(null); setForm(blankForm()); setStep(1); setError(''); setActionError(''); setAttachmentError(''); setFormatActive([]); setEditorOpen(true) }
  const openEdit = (post: Post) => {
    const status = computedStatus(post); const hasFeed = post.channels.includes('LMS Feed'); const hasPush = post.channels.includes('Mobile push'); const hasWhatsApp = post.channels.includes('WhatsApp')
    setEditingId(post.id); setForm({ category: post.category, expiry: hasFeed ? post.expiry ?? '' : '', acknowledgementRequired: hasFeed && post.acknowledgementRequired, title: hasFeed ? post.title : '', body: hasFeed ? post.body : '', attachments: hasFeed ? post.attachments : [], youtubeUrl: '', pushTitle: post.mobilePushContent?.title ?? (hasPush ? post.title.slice(0, 65) : ''), pushMessage: post.mobilePushContent?.message ?? (hasPush ? post.body.slice(0, 180) : ''), imageUrl: post.mobilePushContent?.imageUrl ?? '', deepLink: post.mobilePushContent?.deepLink ?? '', whatsappTitle: post.whatsappContent?.title ?? (hasWhatsApp ? post.title.slice(0, 60) : ''), whatsappDescription: post.whatsappContent?.description ?? (hasWhatsApp ? post.body.slice(0, 500) : ''), allowLikes: post.allowLikes, allowComments: post.allowComments, allowSharing: post.allowSharing, ...post.targeting, channels: [...post.channels], scheduleMode: status === 'Scheduled' ? 'later' : 'now', scheduledAt: post.publishDate.slice(0, 16) }); setStep(1); setError(''); setActionError(''); setAttachmentError(''); setFormatActive([]); setEditorOpen(true)
  }
  const publicationData: PublicationData = { title: form.title, body: form.body, category: form.category as Category, priority: form.channels.includes('LMS Feed') && form.acknowledgementRequired ? 'Pinned' : 'Standard', expiry: form.channels.includes('LMS Feed') && form.acknowledgementRequired ? form.expiry : undefined, targeting: { program: form.program, cohort: form.cohort, term: form.term, section: form.section, club: form.club }, channels: form.channels, mobilePushContent: { title: form.pushTitle, message: form.pushMessage, imageUrl: form.imageUrl, deepLink: form.deepLink }, whatsappContent: { title: form.whatsappTitle, description: form.whatsappDescription }, scheduleMode: form.scheduleMode, scheduledAt: form.scheduledAt }
  const validateStep1 = () => form.channels.length ? '' : 'Select at least one delivery channel.'
  const validateStep2 = () => validateChannelContent(publicationData)
  const validateStep3 = () => validatePublication(publicationData)
  const goNext = () => { const message = step === 1 ? validateStep1() : step === 2 ? validateStep2() : validateStep3(); setError(message); if (!message) setStep(current => current === 1 ? 2 : current === 2 ? 3 : 4) }
  const audienceSummary = form.program.length === PROGRAMS.length && !form.club.length ? 'All students' : form.club.length && !form.cohort.length && !form.term.length && !form.section.length ? form.club.join(', ') : [form.program.join(', '), form.cohort.join(', '), form.term.join(', '), form.section.join(', '), form.club.join(', ')].filter(Boolean).join(' · ') || 'No audience selected'
  const savePost = (draft: boolean) => {
    const message = validateStep1() || (draft ? (!form.category ? 'Category is required.' : '') : validateStep3())
    if (message) { setError(message); if (validateStep1()) setStep(1); else if (!draft && validateStep2()) setStep(2); else if (!draft) setStep(3); return }
    const existing = posts.find(post => post.id === editingId); const hasFeed = form.channels.includes('LMS Feed'); const hasPush = form.channels.includes('Mobile push'); const hasWhatsApp = form.channels.includes('WhatsApp')
    const status: PostStatus = draft ? 'Draft' : form.scheduleMode === 'later' ? 'Scheduled' : 'Published'
    const title = (hasFeed ? form.title : hasWhatsApp ? form.whatsappTitle : form.pushTitle).trim() || 'Untitled draft'
    const body = (hasFeed ? form.body : hasWhatsApp ? form.whatsappDescription : form.pushMessage).trim()
    const acknowledgementRequired = hasFeed && form.acknowledgementRequired
    const next: Post = { id: existing?.id ?? `post-${Date.now()}`, title, body, category: form.category as Category, priority: acknowledgementRequired ? 'Pinned' : 'Standard', audience: audienceSummary, channels: [...form.channels], mobilePushContent: hasPush ? { title: form.pushTitle.trim(), message: form.pushMessage.trim(), imageUrl: form.imageUrl.trim() || undefined, deepLink: form.deepLink.trim() || undefined } : undefined, whatsappContent: hasWhatsApp ? { title: form.whatsappTitle.trim(), description: form.whatsappDescription.trim() } : undefined, publishDate: status === 'Scheduled' ? form.scheduledAt : new Date().toISOString(), expiry: acknowledgementRequired ? form.expiry || undefined : undefined, status, author: existing?.author ?? 'Akash Sharma', role: existing?.role ?? 'Super Admin', attachments: hasFeed ? form.attachments : [], likes: existing?.likes ?? 0, comments: existing?.comments ?? 0, shares: existing?.shares ?? 0, views: existing?.views ?? 0, reach: existing?.reach ?? 0, acknowledgementRequired, acknowledgements: existing?.acknowledgements ?? 0, audienceCount: deliveryEstimate.audienceMembers, allowLikes: form.allowLikes, allowComments: form.allowComments, allowSharing: form.allowSharing, targeting: { program: form.program, cohort: form.cohort, term: form.term, section: form.section, club: form.club } }
    setPosts(current => editingId ? current.map(post => post.id === editingId ? next : post) : [next, ...current]); setEditorOpen(false); notify(`${editingId ? 'Post updated' : 'Post created'} as ${status.toLowerCase()}.`)
  }
  const duplicate = (post: Post) => { setPosts(current => [{ ...post, id: `post-${Date.now()}`, title: `${post.title} (copy)`, channels: [...post.channels], mobilePushContent: post.mobilePushContent ? { ...post.mobilePushContent } : undefined, targeting: { program: [...post.targeting.program], cohort: [...post.targeting.cohort], term: [...post.targeting.term], section: [...post.targeting.section], club: [...post.targeting.club] }, status: 'Draft', publishDate: new Date().toISOString(), views: 0, reach: 0, acknowledgements: 0 }, ...current]); notify('Post duplicated as a draft.') }
  const setPostStatus = (id: string, status: PostStatus) => {
    if (status === 'Published') {
      const post = posts.find(item => item.id === id)
      if (!post) return
      const message = validatePublication({ ...post, scheduleMode: post.status === 'Scheduled' ? 'later' : 'now', scheduledAt: post.publishDate }, post.status === 'Scheduled')
      if (message) { setActionError(`${post.title}: ${message}`); notify(`Post was not published. ${message}`); return }
    }
    setActionError(''); setPosts(current => current.map(post => post.id === id ? { ...post, status, publishDate: status === 'Published' ? new Date().toISOString() : post.publishDate } : post)); notify(`Post ${status === 'Published' ? 'published' : 'archived'}.`)
  }
  const removePost = (id: string) => { setPosts(current => current.filter(post => post.id !== id)); setBookmarked(current => current.filter(bookmarkId => bookmarkId !== id)); notify('Post deleted.') }
  const addFiles = (files: FileList | File[]) => {
    const accepted: Attachment[] = []; let sizeRejected = false; let typeRejected = false
    Array.from(files).forEach(file => {
      const supported = file.type.startsWith('image/') || /\.(pdf|docx|zip)$/i.test(file.name)
      if (!supported) typeRejected = true
      else if (file.size > 15 * 1024 * 1024) sizeRejected = true
      else accepted.push({ id: `${file.name}-${Date.now()}-${accepted.length}`, name: file.name, type: 'file' })
    })
    setAttachmentError([sizeRejected && 'Files over 15 MB were not added.', typeRejected && 'Only images, PDF, DOCX and ZIP files are supported.'].filter(Boolean).join(' '))
    setForm(current => ({ ...current, attachments: [...current.attachments, ...accepted] }))
  }
  const addVideo = () => { const url = form.youtubeUrl.trim(); if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) { setAttachmentError('Enter a valid YouTube URL.'); return } setForm(current => ({ ...current, youtubeUrl: '', attachments: [...current.attachments, { id: `yt-${Date.now()}`, name: 'YouTube video', type: 'youtube', url }] })); setAttachmentError('') }
  const acknowledge = (post: Post) => { if (acknowledged.includes(post.id)) return; setAcknowledged(current => [...current, post.id]); setPosts(current => current.map(item => item.id === post.id ? { ...item, acknowledgements: Math.min(item.audienceCount, item.acknowledgements + 1) } : item)); notify('Notice marked as acknowledged.') }
  const toggleLike = (post: Post) => { const isLiked = liked.includes(post.id); setLiked(current => isLiked ? current.filter(id => id !== post.id) : [...current, post.id]); setPosts(current => current.map(item => item.id === post.id ? { ...item, likes: Math.max(0, item.likes + (isLiked ? -1 : 1)) } : item)) }
  const share = async (post: Post) => { try { if (!navigator.clipboard) { notify('Clipboard access is unavailable. Copy the post title to share it.'); return } await navigator.clipboard.writeText(`${post.title} — Campus Feed`); setPosts(current => current.map(item => item.id === post.id ? { ...item, shares: item.shares + 1 } : item)); notify('Post link copied to clipboard.') } catch { notify('Clipboard access was blocked. Copy the post title to share it.') } }

  return <section className="space-y-4 pb-10 animate-in fade-in duration-200">
    <div className="flex items-center gap-2.5"><div className="h-6 w-1.5 rounded-full bg-teal-600" /><div className="flex items-center gap-2 text-xs font-medium text-slate-500"><span>Communication</span><ChevronRight className="h-3 w-3" /><span className="font-semibold text-teal-700">Announcements</span></div></div>
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Feed</h1><p className="mt-1 text-xs text-slate-500">Communicate announcements and updates at scale.</p></div><div className="flex flex-wrap items-center justify-end gap-2"><div className="relative min-w-[220px] flex-1 sm:flex-none"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input aria-label="Search posts and channel content" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className={`${inputClass} pl-9 sm:w-64`} /></div><button onClick={() => setPreviewOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-white hover:text-teal-700"><Smartphone className="h-3.5 w-3.5" />Student preview</button><button onClick={openCreate} className={primaryButton}><Plus className="h-3.5 w-3.5" />Create Post</button></div></div>
    <div className="mx-auto w-full max-w-5xl border-b border-slate-200"><div className="flex gap-5 overflow-x-auto" role="tablist" aria-label="Filter feed posts">{([['all', 'All Posts'], ['live', 'Live'], ['scheduled', 'Scheduled'], ['mine', 'Posted by Me'], ['bookmarked', 'Bookmarked']] as const).map(([key, label]) => <button id={`feed-tab-${key}`} key={key} role="tab" aria-selected={tab === key} aria-controls="feed-tabpanel" tabIndex={tab === key ? 0 : -1} onClick={() => setTab(key)} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-xs font-semibold ${tab === key ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{label}</button>)}</div></div>
    {actionError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{actionError}</p>}

    <div id="feed-tabpanel" role="tabpanel" aria-labelledby={`feed-tab-${tab}`} className="mx-auto w-full max-w-5xl space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-2">{[['Category', categoryFilter, setCategoryFilter, CATEGORIES], ['Priority', priorityFilter, setPriorityFilter, ['Standard', 'Pinned']]].map(([label, value, setter, options]) => <select key={label as string} aria-label={`Filter by ${label}`} value={value as string} onChange={e => (setter as (v: string) => void)(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option value="">All {String(label).toLowerCase()}</option>{(options as string[]).map(option => <option key={option}>{option}</option>)}</select>)}</div>
      <div className="space-y-3">{visiblePosts.map(post => <ManagementPostCard key={post.id} post={post} bookmarked={bookmarked.includes(post.id)} onBookmark={() => setBookmarked(current => current.includes(post.id) ? current.filter(id => id !== post.id) : [...current, post.id])} onAnalytics={() => setAnalyticsId(post.id)} onEdit={() => openEdit(post)} onDuplicate={() => duplicate(post)} onStatus={status => setPostStatus(post.id, status)} onDelete={() => removePost(post.id)} />)}{!visiblePosts.length && <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center"><Search className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-2 text-xs font-semibold text-slate-700">{tab === 'bookmarked' && !search.trim() ? 'No bookmarked posts yet' : tab === 'live' && !search.trim() ? 'No live posts' : tab === 'scheduled' && !search.trim() ? 'No scheduled posts' : tab === 'mine' && !search.trim() ? 'No posts by you' : 'No posts match your search and filters'}</p><p className="mt-1 text-[10px] text-slate-400">{tab === 'bookmarked' && !search.trim() ? 'Bookmark a post to keep it close at hand.' : 'Try adjusting the selected tab, search, or filters.'}</p></div>}</div><div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-400"><span>{visiblePosts.length} {visiblePosts.length === 1 ? 'post' : 'posts'}</span><span>Activity and analytics are stored locally in this prototype.</span></div>
    </div>

    {editorOpen && <Overlay title={editingId ? 'Edit post' : 'Create post'} description="Choose channels first, then tailor content and publishing." onClose={() => setEditorOpen(false)}><div className="flex items-center border-b border-slate-100 px-5 py-3"><StepMarker number={1} label="Choose channels" active={step === 1} done={step > 1} /><div className="mx-2 h-px flex-1 bg-slate-200" /><StepMarker number={2} label="Create content" active={step === 2} done={step > 2} /><div className="mx-2 h-px flex-1 bg-slate-200" /><StepMarker number={3} label="Audience & schedule" active={step === 3} done={step > 3} /><div className="mx-2 h-px flex-1 bg-slate-200" /><StepMarker number={4} label="Review & send" active={step === 4} done={false} /></div><div className="flex-1 overflow-y-auto p-5 sm:p-6">{step === 1 ? <div className="space-y-4"><div><h3 className="text-sm font-bold text-slate-900">Choose delivery channels</h3><p className="mt-1 text-[11px] text-slate-500">Select any channel combination. You can tailor the content for each one next.</p></div><div className="grid gap-3 sm:grid-cols-3">{CHANNELS.map(channel => { const selected = form.channels.includes(channel); const ChannelIcon = channel === 'LMS Feed' ? Megaphone : channel === 'Mobile push' ? Bell : MessageCircle; const value = channel === 'LMS Feed' ? 'Rich campus feed post' : channel === 'Mobile push' ? 'Lock-screen notification' : 'Direct message summary'; return <label key={channel} className={`cursor-pointer rounded-xl border p-3 transition ${selected ? 'border-teal-500 bg-teal-50/60 ring-1 ring-teal-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}><input type="checkbox" className="sr-only" checked={selected} onChange={() => setForm(current => { const channels = selected ? current.channels.filter(item => item !== channel) : [...current.channels, channel]; return { ...current, channels, acknowledgementRequired: channel === 'LMS Feed' && selected ? false : current.acknowledgementRequired, expiry: channel === 'LMS Feed' && selected ? '' : current.expiry } })} /><div className="flex items-start justify-between gap-3"><span className={`rounded-lg p-2 ${selected ? 'bg-white text-teal-700' : 'bg-slate-100 text-slate-500'}`}><ChannelIcon className="h-4 w-4" /></span><span className={`flex h-4 w-4 items-center justify-center rounded border ${selected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 bg-white'}`}>{selected && <Check className="h-3 w-3" />}</span></div><p className="mt-3 text-xs font-bold text-slate-800">{channelLabel(channel)}</p><p className="mt-1 text-[10px] leading-4 text-slate-500">{value}</p></label> })}</div><div className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-600"><span className="font-semibold text-slate-700">Selected:</span> {form.channels.length ? form.channels.map(channelLabel).join(', ') : 'No channels selected'}</div></div> : step === 2 ? <div className="space-y-4">
              {!form.channels.includes('LMS Feed') && <div className="rounded-xl border border-slate-200 p-3"><label htmlFor="post-category" className={labelClass}>Category * <span className="font-normal text-slate-400">Post classification</span></label><select id="post-category" autoFocus value={form.category} onChange={e => setForm(current => ({ ...current, category: e.target.value as Category }))} className={inputClass}><option value="">Select category</option>{CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></div>}
              {form.channels.includes('LMS Feed') && <section aria-labelledby="in-app-heading" className="space-y-4 rounded-xl border border-slate-200 p-4"><div><h3 id="in-app-heading" className="text-xs font-bold text-slate-800">In-App Feed content</h3><p className="mt-1 text-[10px] text-slate-500">Create the full post students will see in the campus feed.</p><div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600" title="Estimate based on the selected audience."><BarChart3 className="h-3.5 w-3.5 text-teal-600" /><span className="font-semibold text-slate-700">Estimated reach</span><span>{form.program.length ? `${deliveryEstimate.inAppEligible.toLocaleString()} students` : 'Select an audience in the next step'}</span></div></div>
              <div><label htmlFor="post-category" className={labelClass}>Category *</label><select id="post-category" autoFocus value={form.category} onChange={e => setForm(current => ({ ...current, category: e.target.value as Category }))} className={inputClass}><option value="">Select category</option>{CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3"><label className="flex items-center justify-between gap-3"><span><span className="block text-xs font-semibold text-slate-700">Require student acknowledgement</span><span className="mt-0.5 block text-[10px] leading-4 text-slate-500">Pin this post until expiry and track who has confirmed reading it.</span></span><Toggle checked={form.acknowledgementRequired} onChange={value => setForm(current => ({ ...current, acknowledgementRequired: value, expiry: value ? current.expiry : '', allowLikes: !value, allowComments: !value, allowSharing: !value }))} label="Require student acknowledgement" /></label>{form.acknowledgementRequired && <div className="mt-3"><label className={labelClass} htmlFor="expiry">Expiry date & time <span className="font-normal text-slate-400">(optional)</span></label><input id="expiry" type="datetime-local" value={form.expiry} onChange={e => setForm(current => ({ ...current, expiry: e.target.value }))} className={inputClass} /></div>}</div>
              <div><div className="flex justify-between"><label className={labelClass} htmlFor="post-title">Title *</label><span className={`text-[10px] ${form.title.length > 200 ? 'text-rose-600' : 'text-slate-400'}`}>{form.title.length}/200</span></div><input id="post-title" maxLength={205} value={form.title} onChange={e => setForm(current => ({ ...current, title: e.target.value }))} className={inputClass} placeholder="Write a clear, specific post title" /></div>
              <div><label className={labelClass} htmlFor="post-body">Body *</label><div className="rounded-lg border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100"><div className="flex flex-wrap gap-0.5 border-b border-slate-100 p-1.5">{[[Bold,'Bold'],[Italic,'Italic'],[Underline,'Underline'],[Strikethrough,'Strike'],[Quote,'Quote'],[ListOrdered,'Ordered list'],[List,'Unordered list'],[Link,'Link'],[Table2,'Table']].map(([Icon, name]) => { const iconName = name as string; const ToolIcon = Icon as typeof Bold; return <button type="button" key={iconName} title={`${iconName} (visual editor control)`} aria-pressed={formatActive.includes(iconName)} onClick={() => { setFormatActive(current => current.includes(iconName) ? current.filter(item => item !== iconName) : [...current, iconName]); notify(`${iconName} editor control toggled; rich-text transformation is simulated.`) }} className={`rounded p-1.5 ${formatActive.includes(iconName) ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-100'}`}><ToolIcon className="h-3.5 w-3.5" /></button>})}</div><textarea id="post-body" rows={7} value={form.body} onChange={e => setForm(current => ({ ...current, body: e.target.value }))} className="w-full resize-y px-3 py-2 text-xs text-slate-800 outline-none" placeholder="Share the details students need to know..." /></div><p className="mt-1 text-[10px] text-slate-400">Toolbar states are simulated in this prototype; body text remains plain text.</p></div>
              <section aria-labelledby="attachments-heading" className="rounded-xl border border-slate-200 bg-slate-50/40 p-3">
                <h3 id="attachments-heading" className={labelClass}>Attachments</h3>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                  <div onDragOver={e => e.preventDefault()} onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); addFiles(e.dataTransfer.files) }} className="flex min-h-24 items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-3"><Upload className="h-5 w-5 shrink-0 text-slate-400" /><div><p className="text-xs font-semibold text-slate-700">Drop files here</p><p className="mt-0.5 text-[10px] text-slate-500">Images, PDF, DOCX or ZIP · max 15 MB each</p><button type="button" onClick={() => fileRef.current?.click()} className="mt-1.5 text-xs font-semibold text-teal-700 hover:underline">Browse files</button><input ref={fileRef} className="sr-only" type="file" multiple accept="image/*,.pdf,.docx,.zip" onChange={e => e.target.files && addFiles(e.target.files)} /></div></div>
                  <div className="min-w-0"><div className="flex gap-2"><input aria-label="YouTube URL" value={form.youtubeUrl} onChange={e => setForm(current => ({ ...current, youtubeUrl: e.target.value }))} className={inputClass} placeholder="YouTube URL" /><button type="button" onClick={addVideo} aria-label="Add YouTube video" className={secondaryButton}><Video className="h-4 w-4" /></button></div>{attachmentError && <p role="alert" className="mt-2 text-[10px] font-medium text-rose-600">{attachmentError}</p>}<div className="mt-2 flex flex-wrap gap-1.5">{form.attachments.map(attachment => <div key={attachment.id} className="flex min-w-0 max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] text-slate-600">{attachment.type === 'youtube' ? <Video className="h-3.5 w-3.5 shrink-0 text-rose-500" /> : <Paperclip className="h-3.5 w-3.5 shrink-0 text-teal-600" />}<span className="truncate">{attachment.name}</span><button type="button" aria-label={`Remove ${attachment.name}`} onClick={() => setForm(current => ({ ...current, attachments: current.attachments.filter(item => item.id !== attachment.id) }))} className="shrink-0 text-slate-400 hover:text-slate-700"><X className="h-3.5 w-3.5" /></button></div>)}</div></div>
                </div>
              </section>
              </section>}
              {form.channels.includes('Mobile push') && <section aria-labelledby="push-heading" className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 id="push-heading" className="text-xs font-bold text-slate-800">Mobile Push content</h3><p className="mt-1 text-[10px] text-slate-500">Optimized for lock-screen limits.</p><div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600" title="Estimate based on current enrollment and registered devices."><BarChart3 className="h-3.5 w-3.5 text-teal-600" /><span className="font-semibold text-slate-700">Estimated reach</span><span>{form.program.length ? `${deliveryEstimate.pushEligibleDevices.toLocaleString()} devices` : 'Select an audience in the next step'}</span></div></div>{form.channels.includes('LMS Feed') && <button type="button" onClick={() => setForm(current => ({ ...current, pushTitle: current.title.slice(0, 65), pushMessage: current.body.slice(0, 180) }))} className={secondaryButton}>Use In-App content</button>}</div><div className="mt-3 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="space-y-3"><div><div className="flex justify-between"><label className={labelClass} htmlFor="push-title">Push title *</label><span className="text-[10px] text-slate-400">{form.pushTitle.length}/65</span></div><input id="push-title" maxLength={65} value={form.pushTitle} onChange={e => setForm(current => ({ ...current, pushTitle: e.target.value }))} className={inputClass} placeholder="Short notification title" /></div><div><div className="flex justify-between"><label className={labelClass} htmlFor="push-message">Push message *</label><span className="text-[10px] text-slate-400">{form.pushMessage.length}/180</span></div><textarea id="push-message" rows={3} maxLength={180} value={form.pushMessage} onChange={e => setForm(current => ({ ...current, pushMessage: e.target.value }))} className={`${inputClass} resize-y`} placeholder="Essential update and action" /></div><div className="grid gap-3 sm:grid-cols-2"><div><label className={labelClass} htmlFor="push-image">Image URL <span className="font-normal text-slate-400">(optional)</span></label><input id="push-image" type="url" value={form.imageUrl} onChange={e => setForm(current => ({ ...current, imageUrl: e.target.value }))} className={inputClass} placeholder="https://…" /></div><div><label className={labelClass} htmlFor="push-link">Deep link / action <span className="font-normal text-slate-400">(optional)</span></label><input id="push-link" value={form.deepLink} onChange={e => setForm(current => ({ ...current, deepLink: e.target.value }))} className={inputClass} placeholder="/feed/post or https://…" /></div></div></div><PushPreview title={form.pushTitle} message={form.pushMessage} imageUrl={form.imageUrl} deepLink={form.deepLink} /></div></section>}
              {form.channels.includes('WhatsApp') && <section aria-labelledby="whatsapp-content-heading" className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 id="whatsapp-content-heading" className="text-xs font-bold text-slate-800">WhatsApp content</h3><p className="mt-1 text-[10px] text-slate-500">A concise message summary for WhatsApp.</p><div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600" title="Estimate based on current enrollment and available WhatsApp contacts."><BarChart3 className="h-3.5 w-3.5 text-emerald-600" /><span className="font-semibold text-slate-700">Estimated reach</span><span>{form.program.length ? `${deliveryEstimate.whatsappEligibleContacts.toLocaleString()} contacts` : 'Select an audience in the next step'}</span></div></div>{form.channels.includes('LMS Feed') && <button type="button" onClick={() => setForm(current => ({ ...current, whatsappTitle: current.title.slice(0, 60), whatsappDescription: current.body.slice(0, 500) }))} className={secondaryButton}>Use In-App content</button>}</div><div className="mt-3 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]"><div className="space-y-3"><div><div className="flex justify-between"><label className={labelClass} htmlFor="whatsapp-title">WhatsApp title *</label><span className="text-[10px] text-slate-400">{form.whatsappTitle.length}/60</span></div><input id="whatsapp-title" maxLength={60} value={form.whatsappTitle} onChange={e => setForm(current => ({ ...current, whatsappTitle: e.target.value }))} className={inputClass} placeholder="Short message title" /></div><div><div className="flex justify-between"><label className={labelClass} htmlFor="whatsapp-description">WhatsApp description *</label><span className="text-[10px] text-slate-400">{form.whatsappDescription.length}/500</span></div><textarea id="whatsapp-description" rows={3} maxLength={500} value={form.whatsappDescription} onChange={e => setForm(current => ({ ...current, whatsappDescription: e.target.value }))} className={`${inputClass} resize-y`} placeholder="Summarize the key update and action" /></div></div><WhatsAppPreview title={form.whatsappTitle} description={form.whatsappDescription} /></div></section>}
            </div> : step === 3 ? <div className="space-y-5 overflow-visible">
              <section aria-labelledby="audience-heading" className="overflow-visible">
                <h3 id="audience-heading" className="text-sm font-bold text-slate-900">Choose audience</h3>
                <p className="mt-1 text-[11px] text-slate-500">Selections narrow from program to section. Club or group remains optional.</p>
                <div className="mt-4 grid gap-3 overflow-visible sm:grid-cols-2">
                  <MultiSelectDropdown label="Program" required options={PROGRAMS} selected={form.program} onChange={values => setForm(current => ({ ...current, program: values, cohort: [], term: [], section: [] }))} />
                  <MultiSelectDropdown label="Cohort" options={availableCohorts} selected={form.cohort} disabled={!form.program.length} onChange={values => setForm(current => ({ ...current, cohort: values, term: [], section: [] }))} />
                  <MultiSelectDropdown label="Term" options={TERMS} selected={form.term} disabled={!form.cohort.length} onChange={values => setForm(current => ({ ...current, term: values, section: [] }))} />
                  <MultiSelectDropdown label="Section" options={SECTIONS} selected={form.section} disabled={!form.term.length} onChange={values => setForm(current => ({ ...current, section: values }))} />
                  <MultiSelectDropdown label="Club / group (optional)" options={CLUBS} selected={form.club} disabled={!form.program.length} onChange={values => setForm(current => ({ ...current, club: values }))} />
                </div>
              </section>
              <fieldset className="rounded-xl border border-slate-200 px-3 py-3">
                <legend className="px-1 text-xs font-bold text-slate-800">Publishing</legend>
                <div className="flex flex-wrap gap-2">{([['now', 'Immediately'], ['later', 'Schedule']] as const).map(([mode, label]) => <label key={mode} className={`min-w-32 cursor-pointer rounded-lg border px-3 py-2 text-center text-[11px] font-semibold ${form.scheduleMode === mode ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600'}`}><input type="radio" name="schedule" className="sr-only" checked={form.scheduleMode === mode} onChange={() => setForm(current => ({ ...current, scheduleMode: mode }))} />{label}</label>)}</div>
                {form.scheduleMode === 'later' && <div className="mt-3 max-w-sm"><label className={labelClass} htmlFor="scheduled-at">Date & time *</label><input id="scheduled-at" type="datetime-local" value={form.scheduledAt} onChange={e => setForm(current => ({ ...current, scheduledAt: e.target.value }))} className={inputClass} /></div>}
                <p className="mt-2 text-[10px] text-slate-400">Scheduled posts publish automatically at the selected date and time.</p>
              </fieldset>
            </div> : <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><h3 className="text-sm font-bold text-slate-900">Review & send</h3><p className="mt-1 text-[11px] text-slate-500">Confirm each channel’s content, audience, and timing before delivery.</p></div>
                <div className="flex shrink-0 flex-wrap gap-3"><button type="button" onClick={() => { setStep(1); setError('') }} className="text-[10px] font-semibold text-teal-700 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">Edit channels</button><button type="button" onClick={() => { setStep(2); setError('') }} className="text-[10px] font-semibold text-teal-700 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">Edit content</button></div>
              </div>
              <section aria-labelledby="review-channels-heading">
                <div className="flex flex-wrap items-center gap-2"><h4 id="review-channels-heading" className="mr-1 text-xs font-bold text-slate-800">Channels & content</h4>{form.channels.map(channel => <span key={channel} className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[10px] font-semibold text-teal-700">{channelLabel(channel)}</span>)}</div>
                <div className="mt-3 space-y-4">
                  {form.channels.includes('LMS Feed') && <section aria-labelledby="review-feed-heading" className="overflow-hidden rounded-xl border border-teal-200 bg-white shadow-xs">
                    <div className="flex items-center gap-2 border-b border-teal-100 bg-teal-50/70 px-4 py-3"><span className="rounded-lg bg-white p-2 text-teal-700 shadow-xs"><Megaphone className="h-4 w-4" /></span><div><h5 id="review-feed-heading" className="text-xs font-bold text-slate-900">In-App Feed</h5><p className="text-[10px] text-slate-500">Full campus feed post</p></div></div>
                    <article className="p-4 sm:p-5"><div className="flex flex-wrap items-center gap-1.5"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-[9px] font-bold text-teal-700">{form.category}</span>{form.acknowledgementRequired && <><span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700"><Pin className="h-3 w-3" />Pinned</span><span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-bold text-indigo-700"><CheckCircle2 className="h-3 w-3" />Acknowledgement required</span></>}</div><h6 className="mt-3 break-words text-base font-bold leading-6 text-slate-900 [overflow-wrap:anywhere]">{form.title}</h6><div className="mt-3"><FormattedPostBody body={form.body} /></div>{form.attachments.length > 0 && <div className="mt-4 border-t border-slate-100 pt-4"><p className="mb-2 text-[9px] font-bold uppercase tracking-wide text-slate-400">Attachments</p><div className="flex flex-wrap gap-2">{form.attachments.map(attachment => <div key={attachment.id} className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] text-slate-600">{attachment.type === 'youtube' ? <Video className="h-3.5 w-3.5 shrink-0 text-rose-500" /> : <Paperclip className="h-3.5 w-3.5 shrink-0 text-teal-600" />}<span className="break-words [overflow-wrap:anywhere]">{attachment.name}</span></div>)}</div></div>}</article>
                  </section>}
                  {form.channels.includes('Mobile push') && <section aria-labelledby="review-push-heading" className="rounded-xl border border-indigo-200 bg-white p-4 shadow-xs sm:p-5"><div className="mb-4 flex items-center gap-2"><span className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Bell className="h-4 w-4" /></span><div><h5 id="review-push-heading" className="text-xs font-bold text-slate-900">Mobile Push</h5><p className="text-[10px] text-slate-500">Lock-screen notification</p></div></div><div className="max-w-md"><PushPreview title={form.pushTitle} message={form.pushMessage} imageUrl={form.imageUrl} deepLink={form.deepLink} />{(form.imageUrl.trim() || form.deepLink.trim()) && <div className="mt-2 space-y-1 px-1 text-[9px] text-slate-500">{form.imageUrl.trim() && <p className="break-all"><span className="font-semibold text-slate-600">Image:</span> {form.imageUrl.trim()}</p>}{form.deepLink.trim() && <p className="break-all"><span className="font-semibold text-slate-600">Opens:</span> {form.deepLink.trim()}</p>}</div>}</div></section>}
                  {form.channels.includes('WhatsApp') && <section aria-labelledby="review-whatsapp-heading" className="rounded-xl border border-emerald-200 bg-white p-4 shadow-xs sm:p-5"><div className="mb-4 flex items-center gap-2"><span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><MessageCircle className="h-4 w-4" /></span><div><h5 id="review-whatsapp-heading" className="text-xs font-bold text-slate-900">WhatsApp</h5><p className="text-[10px] text-slate-500">Direct message summary</p></div></div><div className="max-w-md"><WhatsAppPreview title={form.whatsappTitle} description={form.whatsappDescription} /></div></section>}
                </div>
              </section>
              <section className="rounded-xl border border-slate-200 p-3"><h4 className="text-xs font-bold text-slate-800">Schedule</h4><p className="mt-1 text-[11px] text-slate-600">{form.scheduleMode === 'later' ? `Scheduled for ${dateText(form.scheduledAt)}` : 'Send immediately'}</p></section>
            </div>}{error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">{error}</p>}</div><div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-4"><div>{step > 1 && <button type="button" onClick={() => { setStep(current => current === 4 ? 3 : current === 3 ? 2 : 1); setError('') }} className={secondaryButton}>Back</button>}</div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setEditorOpen(false)} className={secondaryButton}>Cancel</button>{step >= 2 && <button type="button" onClick={() => savePost(true)} className={secondaryButton}>Save draft</button>}{step < 4 ? <button type="button" onClick={goNext} className={primaryButton}>Continue <ChevronRight className="h-3.5 w-3.5" /></button> : <button type="button" onClick={() => savePost(false)} className={primaryButton}>{form.scheduleMode === 'later' ? <CalendarClock className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}{form.scheduleMode === 'later' ? 'Schedule' : 'Send now'}</button>}</div></div></Overlay>}
    {analyticsPost && <AnalyticsDrawer post={analyticsPost} onClose={() => setAnalyticsId(null)} />}
    {previewOpen && <StudentPreview posts={posts} category={previewCategory} setCategory={setPreviewCategory} search={previewSearch} setSearch={setPreviewSearch} dismissed={dismissed} onDismiss={id => setDismissed(current => [...current, id])} acknowledged={acknowledged} liked={liked} onLike={toggleLike} commentPost={commentPost} setCommentPost={setCommentPost} comment={comment} setComment={setComment} onComment={post => { if (!comment.trim()) return; setPosts(current => current.map(item => item.id === post.id ? { ...item, comments: item.comments + 1 } : item)); setComment(''); setCommentPost(null); notify('Comment added in the student preview.') }} onShare={share} onAcknowledge={acknowledge} onClose={() => setPreviewOpen(false)} />}
  </section>
}

function StepMarker({ number, label, active, done }: { number: number; label: string; active: boolean; done: boolean }) { return <div className={`flex items-center gap-2 text-xs font-semibold ${active || done ? 'text-teal-700' : 'text-slate-400'}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${active || done ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{done ? <Check className="h-3.5 w-3.5" /> : number}</span><span className="hidden sm:inline">{label}</span></div> }

function ManagementPostCard({ post, bookmarked, onBookmark, onAnalytics, onEdit, onDuplicate, onStatus, onDelete }: { post: Post; bookmarked: boolean; onBookmark: () => void; onAnalytics: () => void; onEdit: () => void; onDuplicate: () => void; onStatus: (status: PostStatus) => void; onDelete: () => void }) {
  const status = computedStatus(post)
  const actionClass = 'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500'
  return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
    <div className="p-4 sm:p-5">
      <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[11px] font-bold text-teal-700">{post.author.split(' ').slice(0, 2).map(value => value[0]).join('')}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-bold text-slate-900">{post.author}</p><span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold ${statusClass[status]}`}>{status}</span></div><p className="mt-0.5 text-[10px] text-slate-400">{post.role} · {dateText(post.publishDate)}</p></div><div className="flex items-center gap-1"><button type="button" aria-label={`${bookmarked ? 'Remove bookmark from' : 'Bookmark'} ${post.title}`} aria-pressed={bookmarked} onClick={onBookmark} className={`rounded-lg p-2 transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${bookmarked ? 'bg-teal-50 text-teal-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}><Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} /></button><span aria-hidden="true" className="rounded-lg p-2 text-slate-300"><MoreHorizontal className="h-4 w-4" /></span></div></div>
        <div className="mt-3 flex flex-wrap gap-1.5">{post.priority === 'Pinned' && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700"><Pin className="h-3 w-3" />Pinned</span>}<span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">{post.category}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{post.audience} · {post.audienceCount.toLocaleString()}</span>{post.channels.map(channel => <span key={channel} className="rounded-full border border-slate-200 px-2 py-1 text-[10px] text-slate-500">{channelLabel(channel)}</span>)}</div>
        <h2 className="mt-3 text-base font-bold leading-6 text-slate-900">{post.title}</h2><div className="mt-1.5"><FormattedPostBody body={post.body} /></div><AttachmentList attachments={post.attachments} />
      </div></div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[10px] text-slate-500 sm:grid-cols-4"><span><strong className="text-slate-700">{post.views.toLocaleString()}</strong> views</span><span><strong className="text-slate-700">{post.reach.toLocaleString()}</strong> reached</span><span><strong className="text-slate-700">{post.comments.toLocaleString()}</strong> comments</span><span><strong className="text-slate-700">{post.shares.toLocaleString()}</strong> shares</span></div>
    </div>
    <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 bg-slate-50/60 px-3 py-2"><button type="button" onClick={onAnalytics} className={actionClass}><BarChart3 className="h-3.5 w-3.5" />View analytics</button><button type="button" onClick={onEdit} className={actionClass}><Pencil className="h-3.5 w-3.5" />Edit</button><button type="button" onClick={onDuplicate} className={actionClass}><Copy className="h-3.5 w-3.5" />Duplicate</button>{['Draft', 'Scheduled'].includes(status) ? <button type="button" onClick={() => onStatus('Published')} className={`${actionClass} text-teal-700`}><Send className="h-3.5 w-3.5" />Publish now</button> : ['Published', 'Expired'].includes(status) && <button type="button" onClick={() => onStatus('Archived')} className={actionClass}><Archive className="h-3.5 w-3.5" />Archive</button>}{['Draft', 'Archived'].includes(status) && <button type="button" onClick={onDelete} className={`${actionClass} text-rose-600 hover:bg-rose-50 hover:text-rose-700`}><Trash2 className="h-3.5 w-3.5" />Delete</button>}</div>
  </article>
}

function AnalyticsDrawer({ post, onClose }: { post: Post; onClose: () => void }) {
  const [activeChannel, setActiveChannel] = useState<AnalyticsChannel>(() => initialAnalyticsChannel(post))
  const [rosterSearch, setRosterSearch] = useState('')
  const acknowledgedCount = Math.min(STUDENTS.length, Math.round(post.acknowledgements / Math.max(1, post.audienceCount) * STUDENTS.length))
  const roster = STUDENTS.map((name, index) => ({ name, done: index < acknowledgedCount })).filter(row => row.name.toLowerCase().includes(rosterSearch.toLowerCase()))
  const analytics = deriveChannelAnalytics(post, activeChannel)
  const panelRef = useRef<HTMLElement>(null); useDialogFocus(panelRef, onClose)
  const tabLabels: Array<[AnalyticsChannel, string]> = [['feed', 'Feed'], ['in-app', 'In-App'], ['whatsapp', 'WhatsApp']]
  const channelName = activeChannel === 'feed' ? 'Feed' : activeChannel === 'in-app' ? 'In-App notification' : 'WhatsApp'
  const delivered = analytics.metrics.find(metric => metric.label === 'Delivered')?.value ?? 0
  const targeted = analytics.metrics.find(metric => metric.label === 'Targeted')?.value ?? post.audienceCount
  return <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-labelledby="analytics-title"><button type="button" aria-label="Close analytics" onClick={onClose} className="absolute inset-0 h-full w-full bg-slate-950/40" /><aside ref={panelRef} tabIndex={-1} className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-white shadow-2xl outline-none"><div className="flex items-start justify-between border-b border-slate-200 px-5 py-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 id="analytics-title" className="text-base font-bold text-slate-900">Post analytics</h2><span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold ${statusClass[computedStatus(post)]}`}>{computedStatus(post)}</span></div><p className="mt-1 max-w-lg truncate text-xs text-slate-500">{post.title}</p><p className="mt-1 text-[9px] text-slate-400">Prototype metrics generated locally for this post.</p></div><button type="button" autoFocus onClick={onClose} aria-label="Close analytics drawer" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div>
    <div className="border-b border-slate-200 px-5"><div role="tablist" aria-label="Analytics channel" className="flex gap-5 overflow-x-auto">{tabLabels.map(([key, label]) => <button id={`analytics-tab-${key}`} type="button" key={key} role="tab" aria-selected={activeChannel === key} aria-controls={`analytics-panel-${key}`} tabIndex={activeChannel === key ? 0 : -1} onClick={() => setActiveChannel(key)} className={`whitespace-nowrap border-b-2 py-3 text-xs font-semibold ${activeChannel === key ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{label}</button>)}</div></div>
    <div id={`analytics-panel-${activeChannel}`} role="tabpanel" aria-labelledby={`analytics-tab-${activeChannel}`} className="flex-1 overflow-y-auto p-5">{!analytics.available ? <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center"><Send className="mx-auto h-6 w-6 text-slate-300" /><p className="mt-2 text-xs font-bold text-slate-700">{analytics.pending ? 'Analytics available after delivery' : 'Not sent through this channel'}</p><p className="mt-1 text-[10px] text-slate-500">{analytics.pending ? `${channelName} is configured, but this post has not been delivered yet.` : `This post did not include ${channelName}, so no delivery metrics are available.`}</p></div> : <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{analytics.metrics.map(metric => <div key={metric.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-lg font-bold text-slate-900">{metric.value.toLocaleString()}</p><p className="text-[10px] font-semibold text-slate-600">{metric.label}</p>{metric.helper && <p className="mt-0.5 text-[9px] text-slate-400">{metric.helper}</p>}</div>)}</div>
      {activeChannel === 'feed' && <><section aria-labelledby="feed-content-preview" className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><h3 id="feed-content-preview" className="text-xs font-bold text-slate-800">Feed content</h3><span className="text-[10px] text-slate-400">Internal LMS Feed</span></div><h4 className="mt-3 text-sm font-bold text-slate-900">{post.title}</h4><div className="mt-1.5"><FormattedPostBody body={post.body} /></div><AttachmentList attachments={post.attachments} /></section><section aria-labelledby="feed-engagement"><h3 id="feed-engagement" className="text-xs font-bold text-slate-800">Engagement breakdown</h3><div className="mt-2 grid grid-cols-3 gap-2">{[[ThumbsUp, post.likes, 'Likes'], [MessageCircle, post.comments, 'Comments'], [Share2, post.shares, 'Shares']].map(([Icon, value, label]) => { const ItemIcon = Icon as typeof ThumbsUp; return <div key={label as string} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3"><ItemIcon className="h-4 w-4 text-teal-600" /><span className="text-xs font-bold text-slate-800">{value as number}<small className="ml-1 block font-normal text-slate-400 sm:inline">{label as string}</small></span></div> })}</div></section>{post.acknowledgementRequired && <section aria-labelledby="ack-roster"><div><h3 id="ack-roster" className="text-xs font-bold text-slate-800">Acknowledgement roster</h3><p className="mt-0.5 text-[10px] text-slate-500">{post.acknowledgements.toLocaleString()} of {post.audienceCount.toLocaleString()} students acknowledged</p></div><div className="relative mt-2"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input aria-label="Search acknowledgement roster" value={rosterSearch} onChange={e => setRosterSearch(e.target.value)} className={`${inputClass} pl-9`} placeholder="Search students..." /></div><div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">{roster.map(row => <div key={row.name} className="flex items-center justify-between px-3 py-2"><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600">{row.name.split(' ').map(value => value[0]).join('')}</span><span className="text-[11px] text-slate-700">{row.name}</span></div><span className={`text-[10px] font-semibold ${row.done ? 'text-teal-700' : 'text-amber-700'}`}>{row.done ? 'Acknowledged' : 'Pending'}</span></div>)}{!roster.length && <p className="px-3 py-4 text-center text-[10px] text-slate-400">No students match your search.</p>}</div></section>}</>}
      {activeChannel === 'in-app' && <><section aria-labelledby="push-content-preview"><div className="mb-2 flex items-center justify-between gap-3"><h3 id="push-content-preview" className="text-xs font-bold text-slate-800">In-App notification content</h3><span className="text-[10px] text-slate-400">Mobile push delivery</span></div><PushPreview title={post.mobilePushContent?.title ?? post.title} message={post.mobilePushContent?.message ?? post.body} imageUrl={post.mobilePushContent?.imageUrl} deepLink={post.mobilePushContent?.deepLink} /></section><div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] text-slate-600"><strong className="text-slate-700">Delivery funnel:</strong> {Math.max(0, targeted - delivered).toLocaleString()} failed or unreachable. Opens and clicks are estimated from delivered notifications.</div></>}
      {activeChannel === 'whatsapp' && <><section aria-labelledby="whatsapp-content-preview"><div className="mb-2 flex items-center justify-between gap-3"><h3 id="whatsapp-content-preview" className="text-xs font-bold text-slate-800">Message content</h3><span className="text-[10px] text-slate-400">WhatsApp</span></div><WhatsAppPreview title={post.whatsappContent?.title ?? post.title} description={post.whatsappContent?.description ?? post.body} /></section><div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] text-slate-600"><strong className="text-slate-700">Delivery funnel:</strong> {Math.max(0, targeted - delivered).toLocaleString()} failed or unreachable. Reads and LMS link clicks are estimated from delivered messages.</div></>}
    </div>}</div></aside></div>
}

function StudentPreview({ posts, category, setCategory, search, setSearch, dismissed, onDismiss, acknowledged, liked, onLike, commentPost, setCommentPost, comment, setComment, onComment, onShare, onAcknowledge, onClose }: { posts: Post[]; category: string; setCategory: (v: string) => void; search: string; setSearch: (v: string) => void; dismissed: string[]; onDismiss: (id: string) => void; acknowledged: string[]; liked: string[]; onLike: (post: Post) => void; commentPost: string | null; setCommentPost: (id: string | null) => void; comment: string; setComment: (v: string) => void; onComment: (post: Post) => void; onShare: (post: Post) => void; onAcknowledge: (post: Post) => void; onClose: () => void }) {
  const published = posts.filter(post => post.channels.includes('LMS Feed') && computedStatus(post) === 'Published' && post.title.toLowerCase().includes(search.toLowerCase()) && (category === 'All' || post.category === category || (category === 'Clubs' && post.category === 'Clubs & Life')))
  const activePinned = published.filter(post => post.priority === 'Pinned')
  const pinned = activePinned.filter(post => !dismissed.includes(post.id)).slice(0, 2); const stream = published.filter(post => post.priority !== 'Pinned').sort((a,b) => +new Date(b.publishDate) - +new Date(a.publishDate))
  const panelRef = useRef<HTMLDivElement>(null); useDialogFocus(panelRef, onClose)
  return <div ref={panelRef} className="fixed inset-0 z-[75] bg-slate-100" role="dialog" aria-modal="true" aria-labelledby="preview-title"><div className="mx-auto flex h-full max-w-4xl flex-col bg-white shadow-2xl"><header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6"><div><p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Student experience preview</p><h2 id="preview-title" className="text-base font-bold text-slate-900">Campus Feed</h2></div><button autoFocus onClick={onClose} className={secondaryButton}><X className="h-3.5 w-3.5" />Close preview</button></header><div className="border-b border-slate-100 px-4 py-3 sm:px-6"><div className="flex gap-2 overflow-x-auto pb-2">{['All','Academics','Events','Placements','Clubs'].map(item => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold ${category === item ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{item}</button>)}</div><div className="relative mt-1"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input aria-label="Search student feed" value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} pl-9`} placeholder="Search the campus feed..." /></div></div><main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6"><div className="mx-auto max-w-2xl space-y-3">{pinned.map(post => <article key={post.id} className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-xs"><div className="flex items-start gap-3"><div className="rounded-lg bg-amber-100 p-2 text-amber-700"><Pin className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-wide text-amber-700">Pinned · {post.category}</span><h3 className="mt-1 text-sm font-bold text-slate-900">{post.title}</h3></div><button onClick={() => onDismiss(post.id)} className="text-[10px] font-semibold text-slate-500 hover:text-slate-800">Dismiss</button></div><p className="mt-2 text-xs leading-5 text-slate-600">{post.body}</p>{post.expiry && <p className="mt-2 flex items-center gap-1 text-[10px] text-amber-700"><CalendarClock className="h-3 w-3" />Pinned until {dateText(post.expiry)}</p>}<AttachmentList attachments={post.attachments} />{post.acknowledgementRequired && <button disabled={acknowledged.includes(post.id)} onClick={() => onAcknowledge(post)} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-amber-700 disabled:cursor-default disabled:bg-teal-600"><Check className="h-3.5 w-3.5" />{acknowledged.includes(post.id) ? 'Acknowledged' : 'Mark as acknowledged'}</button>}</div></div></article>)}{stream.map(post => <article key={post.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700">{post.author.split(' ').slice(0,2).map(v => v[0]).join('')}</span><div className="min-w-0 flex-1"><div className="flex items-start justify-between"><div><p className="text-xs font-bold text-slate-900">{post.author}</p><p className="text-[10px] text-slate-400">{post.role} · {dateText(post.publishDate)}</p></div><MoreHorizontal className="h-4 w-4 text-slate-400" /></div><span className="mt-3 inline-flex rounded-full bg-teal-50 px-2 py-1 text-[10px] font-semibold text-teal-700">{post.category}</span><h3 className="mt-2 text-sm font-bold text-slate-900">{post.title}</h3><p className="mt-1.5 text-xs leading-5 text-slate-600">{post.body}</p><AttachmentList attachments={post.attachments} /><div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-2">{post.allowLikes && <button onClick={() => onLike(post)} className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] ${liked.includes(post.id) ? 'bg-teal-50 font-semibold text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}><ThumbsUp className="h-3.5 w-3.5" />{post.likes}</button>}{post.allowComments && <button onClick={() => setCommentPost(commentPost === post.id ? null : post.id)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-slate-500 hover:bg-slate-50"><MessageCircle className="h-3.5 w-3.5" />{post.comments}</button>}{post.allowSharing && <button onClick={() => onShare(post)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-slate-500 hover:bg-slate-50"><Share2 className="h-3.5 w-3.5" />{post.shares}</button>}</div>{commentPost === post.id && <div className="mt-2 flex gap-2"><input autoFocus value={comment} onChange={e => setComment(e.target.value)} aria-label={`Comment on ${post.title}`} className={inputClass} placeholder="Write a comment..." /><button onClick={() => onComment(post)} className={primaryButton}>Post</button></div>}</div></div></article>)}{!pinned.length && !stream.length && <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center"><Megaphone className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-2 text-xs font-semibold text-slate-700">No feed posts found</p></div>}</div></main></div></div>
}

function AttachmentList({ attachments }: { attachments: Attachment[] }) { if (!attachments.length) return null; return <div className={`mt-3 grid gap-2 ${attachments.length > 1 ? 'grid-cols-2' : ''}`}>{attachments.map(attachment => <div key={attachment.id} className="flex min-h-16 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-[10px] font-medium text-slate-600">{attachment.type === 'youtube' ? <><Video className="h-5 w-5 text-rose-500" /><span>{attachment.name}</span></> : attachment.name.toLowerCase().includes('image') || attachment.name.includes('gallery') ? <><Image className="h-5 w-5 text-indigo-500" /><span>{attachment.name}</span></> : <><File className="h-5 w-5 text-teal-600" /><span className="truncate">{attachment.name}</span></>}</div>)}</div> }
