import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Folder,
  Globe,
  GraduationCap,
  Grid2X2,
  Home,
  Info,
  LogOut,
  Maximize2,
  Megaphone,
  Menu,
  MessageSquare,
  QrCode,
  RotateCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  X
} from 'lucide-react'

interface StudentPortalViewProps {
  onSwitchToAdmin: () => void
}

export default function StudentPortalView({ onSwitchToAdmin }: StudentPortalViewProps) {
  const [activeNav, setActiveNav] = useState('home')
  const [scheduleView, setScheduleView] = useState<'day' | 'week' | 'month'>('week')
  const [toDoTab, setToDoTab] = useState<'today' | 'upcoming' | 'overdue' | 'feedback' | 'concern'>('upcoming')
  const [leaderboardTab, setLeaderboardTab] = useState<'deans' | 'attendance'>('deans')
  const [showToast, setShowToast] = useState(true)

  const days = [
    { name: 'MON', date: '2' },
    { name: 'TUE', date: '3' },
    { name: 'WED', date: '4' },
    { name: 'THU', date: '5', active: true },
    { name: 'FRI', date: '6' },
    { name: 'SAT', date: '7' },
    { name: 'SUN', date: '8' }
  ]

  const timeSlots = [
    '03:00 PM',
    '04:00 PM',
    '04:45 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM'
  ]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0d0e] text-[#f4f4f5] font-sans select-none">
      {/* Left Icon Rail Sidebar */}
      <aside className="flex flex-col items-center justify-between w-14 shrink-0 border-r border-[#222226] bg-[#121214] py-3 z-30">
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Logo mark */}
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] text-black font-extrabold text-xs shadow-md">
            MU
          </div>

          {/* Navigation Icons */}
          <nav className="flex flex-col items-center gap-1.5 w-full px-2 mt-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'courses', icon: BookOpen, label: 'My Courses' },
              { id: 'badges', icon: ShieldCheck, label: 'Badges & Credentials' },
              { id: 'messages', icon: MessageSquare, label: 'Feeds & Messages' },
              { id: 'pulse', icon: Activity, label: 'Organization Pulse' },
              { id: 'materials', icon: Folder, label: 'Materials' },
              { id: 'fees', icon: CircleDollarSign, label: 'Fees & Finance' },
              { id: 'apps', icon: Grid2X2, label: 'Campus Apps' },
              { id: 'quest', icon: Sparkles, label: 'Intellect Quest' }
            ].map(({ id, icon: Icon, label }) => {
              const active = activeNav === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  title={label}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                    active
                      ? 'bg-[#222226] text-[#f59e0b] shadow-xs'
                      : 'text-[#71717a] hover:bg-[#1c1c1f] hover:text-[#d4d4d8]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-[#f59e0b]" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom User & Switcher Shortcuts */}
        <div className="flex flex-col items-center gap-2.5">
          <button
            onClick={onSwitchToAdmin}
            title="Switch to Admin Portal"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-950/80 border border-teal-600/60 text-teal-400 text-[10px] font-bold hover:scale-105 transition"
          >
            ADM
          </button>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#27272a] border border-[#3f3f46] text-[11px] font-bold text-[#f4f4f5]"
            title="Student Profile: DR"
          >
            DR
          </div>
          <button
            onClick={onSwitchToAdmin}
            title="Log Out / Exit to Admin"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10 transition"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#222226] bg-[#121214] px-4">
          {/* Left: Hamburger & University Brand */}
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-1.5 text-[#a1a1aa] hover:bg-[#1c1c1f] hover:text-white">
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold tracking-tight text-sm">
                masters’union
              </span>
              <span className="text-[10px] tracking-widest text-[#a1a1aa] uppercase font-light">
                university
              </span>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="relative hidden md:flex items-center w-80 lg:w-96">
            <Search className="absolute left-3.5 h-3.5 w-3.5 text-[#71717a]" />
            <input
              placeholder="Type to search..."
              className="w-full rounded-full border border-[#27272a] bg-[#18181b] py-1.5 pl-9 pr-14 text-xs text-[#f4f4f5] outline-none placeholder:text-[#71717a] focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]"
            />
            <span className="absolute right-3 rounded border border-[#3f3f46] bg-[#222226] px-1.5 py-0.5 text-[9px] font-semibold text-[#a1a1aa]">
              CTRL + K
            </span>
          </div>

          {/* Right Controls: Role Switcher & Icons */}
          <div className="flex items-center gap-2.5">
            {/* Prominent Admin / Student Switcher */}
            <div className="flex items-center rounded-full bg-[#1c1c1f] p-0.5 border border-[#2e2e33]">
              <button
                onClick={onSwitchToAdmin}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#a1a1aa] hover:text-white transition"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
                <span>Admin</span>
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#f59e0b] text-black shadow-xs transition"
              >
                <GraduationCap className="h-3.5 w-3.5 text-black" />
                <span>Student</span>
              </button>
            </div>

            <button className="rounded-lg p-2 text-[#a1a1aa] hover:bg-[#1c1c1f] hover:text-white" title="Language & Campus">
              <Globe className="h-4 w-4" />
            </button>

            <button className="relative rounded-lg p-2 text-[#a1a1aa] hover:bg-[#1c1c1f] hover:text-white" title="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f59e0b] text-[9px] font-bold text-black">
                10
              </span>
            </button>

            <button className="rounded-lg p-2 text-[#a1a1aa] hover:bg-[#1c1c1f] hover:text-white" title="AI Assistant">
              <Sparkles className="h-4 w-4 text-[#fbbf24]" />
            </button>

            <button className="rounded-lg p-2 text-[#a1a1aa] hover:bg-[#1c1c1f] hover:text-white" title="QR Code">
              <QrCode className="h-4 w-4" />
            </button>

            <div
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#27272a] border border-[#3f3f46] text-[10px] font-bold text-white cursor-pointer"
              title="Student: IN"
            >
              IN
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Row 1: Live News Ticker + Quick Chips + Guesstimate Quest Banner */}
          <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]">
            {/* Live Ticker & Quick Links */}
            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#222226] bg-[#161619] p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-[#a1a1aa]">
                    <span className="rounded bg-[#27272a] px-1.5 py-0.5 font-bold uppercase tracking-wider text-[#f59e0b]">
                      LIVEMINI
                    </span>
                    <span>•</span>
                    <span>29 Sep • 10:13 AM</span>
                  </div>
                  <h2 className="mt-1.5 text-sm font-bold text-white hover:text-[#f59e0b] cursor-pointer">
                    Mark Zuckerberg loses ₹1,92,300 crore in 2 days
                  </h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#a1a1aa]">
                    Meta CEO Mark Zuckerberg's net worth fell by nearly $20 billion (around ₹1,92,300 crore) in two days, taking his total wealth below $250 billion, according to financial reports.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3f3f46]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3f3f46]" />
                </div>
              </div>

              {/* Quick Navigation Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#222226]">
                <button
                  onClick={() => setActiveNav('courses')}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2f] bg-[#1e1e22] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#27272c] hover:border-[#3f3f46] transition"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#f59e0b]" />
                  <span>My Courses</span>
                  <ArrowRight className="h-3 w-3 text-[#71717a]" />
                </button>
                <button
                  onClick={() => setActiveNav('messages')}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2f] bg-[#1e1e22] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#27272c] hover:border-[#3f3f46] transition"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#38bdf8]" />
                  <span>Messages</span>
                  <ArrowRight className="h-3 w-3 text-[#71717a]" />
                </button>
              </div>
            </div>

            {/* Ready to Test Your Intellect? Quest Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#2e2612] bg-gradient-to-r from-[#1c1810] via-[#1a1711] to-[#221c10] p-4 flex items-center justify-between shadow-xs">
              <div className="z-10 max-w-[280px]">
                <h3 className="text-base font-extrabold text-white">
                  Ready to Test Your <span className="text-[#f59e0b]">Intellect</span>?
                </h3>
                <p className="mt-1 text-xs text-[#d4d4d8]">
                  Take a Shot at Today's Guesstimate Quest!
                </p>
                <button className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#f59e0b] px-4 py-1.5 text-xs font-bold text-black shadow-xs hover:bg-[#fbbf24] transition">
                  Let's Go
                </button>
              </div>

              {/* Space Hat Graphic Simulation */}
              <div className="relative flex items-center justify-center pr-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2a2313] border border-[#f59e0b]/40 text-[#f59e0b] shadow-inner">
                  <Sparkles className="h-8 w-8 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Schedule (Calendar Grid) & To-Do List */}
          <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1.1fr)]">
            {/* Schedule Calendar Widget */}
            <div className="rounded-2xl border border-[#222226] bg-[#161619] p-4 shadow-xs space-y-3.5">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222226] pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#f59e0b]" />
                  <h3 className="text-sm font-bold text-white">Schedule</h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Date range switcher */}
                  <div className="flex items-center gap-1 rounded-xl bg-[#1f1f23] border border-[#2a2a2f] px-2 py-1 text-xs font-semibold text-white">
                    <button className="p-0.5 text-[#a1a1aa] hover:text-white">
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <span>Nov 2 - Nov 8</span>
                    <button className="p-0.5 text-[#a1a1aa] hover:text-white">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button className="rounded-lg p-1.5 text-[#a1a1aa] hover:bg-[#1f1f23]" title="Filter schedule">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </button>

                  {/* Day | Week | Month Toggle */}
                  <div className="flex items-center rounded-xl bg-[#1f1f23] p-0.5 border border-[#2a2a2f] text-xs font-semibold">
                    {(['day', 'week', 'month'] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setScheduleView(view)}
                        className={`rounded-lg px-2.5 py-1 capitalize transition ${
                          scheduleView === view
                            ? 'bg-[#f59e0b] text-black font-bold'
                            : 'text-[#a1a1aa] hover:text-white'
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>

                  <button className="rounded-lg p-1.5 text-[#a1a1aa] hover:bg-[#1f1f23]">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[620px]">
                  {/* Days Row */}
                  <div className="grid grid-cols-8 border-b border-[#222226] pb-2 text-center text-xs">
                    <div className="text-[10px] text-[#71717a] font-mono">GMT +5:30 h</div>
                    {days.map((day) => (
                      <div
                        key={day.name}
                        className={`font-semibold ${
                          day.active ? 'text-[#f59e0b] font-bold' : 'text-[#a1a1aa]'
                        }`}
                      >
                        {day.name} <span className="ml-0.5">{day.date}</span>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots & Event Area */}
                  <div className="relative divide-y divide-[#222226]/60">
                    {timeSlots.map((time) => {
                      const isCurrent = time === '04:45 PM'
                      return (
                        <div key={time} className="grid grid-cols-8 py-2 text-xs items-center">
                          <div className="text-[10px] text-[#71717a] font-mono flex items-center gap-1">
                            {isCurrent ? (
                              <span className="rounded bg-[#f59e0b] px-1 py-0.5 text-[9px] font-bold text-black">
                                {time}
                              </span>
                            ) : (
                              <span>{time}</span>
                            )}
                          </div>
                          {days.map((d) => (
                            <div key={d.name} className="relative h-6 border-l border-[#222226]/40 px-1">
                              {/* Event: Book Launch on Thu 5 at 04:45 */}
                              {d.active && time === '04:45 PM' && (
                                <div className="absolute inset-y-0 left-0 right-0 z-10 flex flex-col justify-center rounded-lg bg-[#182338] border border-[#2563eb] p-1.5 text-white shadow-xs">
                                  <p className="truncate text-[10px] font-bold text-[#60a5fa]">
                                    Book Launch + Fireside chat wit...
                                  </p>
                                  <p className="text-[9px] text-[#93c5fd]">4:30PM - 6:30PM</p>
                                </div>
                              )}
                              {/* Yellow horizontal time cursor indicator */}
                              {d.active && time === '04:45 PM' && (
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#f59e0b] -translate-y-1/2 z-20" />
                              )}
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom: Google Calendar sync pill */}
              <div className="flex items-center justify-end pt-2 border-t border-[#222226]">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#27272a] border border-[#3f3f46] text-[#34a853] shadow-xs cursor-pointer hover:bg-[#323236]"
                  title="Google Calendar Integration"
                >
                  <span className="font-bold text-xs">31</span>
                </div>
              </div>
            </div>

            {/* To Do List Widget */}
            <div className="rounded-2xl border border-[#222226] bg-[#161619] p-4 shadow-xs space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#222226] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col items-center justify-center rounded-lg bg-[#f59e0b] px-2 py-1 text-black font-extrabold text-[11px] leading-tight shadow-xs">
                    <span>Thu</span>
                    <span className="text-sm">05</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">To Do List</h3>
                    <Info className="h-3.5 w-3.5 text-[#71717a]" />
                  </div>
                </div>
                <button className="rounded-lg p-1.5 text-[#a1a1aa] hover:bg-[#1f1f23]">
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'today', label: 'Today', count: 0 },
                  { id: 'upcoming', label: 'Upcoming', count: 1 },
                  { id: 'overdue', label: 'Overdue', count: 0 },
                  { id: 'feedback', label: 'Feedback', count: 2 },
                  { id: 'concern', label: 'Concern', count: 0 }
                ].map(({ id, label, count }) => {
                  const active = toDoTab === id
                  return (
                    <button
                      key={id}
                      onClick={() => setToDoTab(id as any)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1 transition ${
                        active
                          ? 'bg-[#f59e0b] text-black font-bold'
                          : 'bg-[#1e1e22] text-[#a1a1aa] hover:bg-[#25252a] hover:text-white'
                      }`}
                    >
                      <span>{label}</span>
                      <span className={`text-[10px] font-bold ${active ? 'text-black' : 'text-[#71717a]'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Task Items */}
              <div className="space-y-2 pt-1">
                <div className="rounded-xl border border-[#27272a] bg-[#1a1a1d] p-3 hover:border-[#3f3f46] transition">
                  <span className="inline-flex items-center gap-1 rounded-md bg-teal-950/70 border border-teal-800/60 px-2 py-0.5 text-[10px] font-semibold text-teal-400">
                    Coach Form
                  </span>
                  <h4 className="mt-1.5 text-xs font-bold text-white leading-snug">
                    Jashn-e-Noor by The Socio-Cultural Society - Feedback Form
                  </h4>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-[#a1a1aa]">
                    <Clock className="h-3 w-3 text-[#f59e0b]" />
                    <span>Due Sun, 8 Nov • 11:59 PM</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Announcements, Leaderboard & Ongoing Courses */}
          <div className="grid gap-3.5 lg:grid-cols-3">
            {/* Announcements Card */}
            <div className="rounded-2xl border border-[#222226] bg-[#161619] p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#222226] pb-3">
                <h3 className="text-sm font-bold text-white">Announcements</h3>
                <button
                  onClick={onSwitchToAdmin}
                  className="flex items-center gap-1 text-xs font-semibold text-[#a1a1aa] hover:text-[#f59e0b]"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Empty state illustration from Image 2 */}
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-[#27272a]/60" />
                  <div className="absolute flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f59e0b] text-black shadow-lg">
                    <Megaphone className="h-6 w-6 fill-black" />
                  </div>
                </div>
                <h4 className="mt-3 text-xs font-bold text-[#f59e0b]">
                  No Announcements Found
                </h4>
              </div>

              <div className="pt-2 border-t border-[#222226] text-center text-[11px] text-[#71717a]">
                Stay tuned for cohort updates and broadcasts.
              </div>
            </div>

            {/* Leaderboard Card */}
            <div className="rounded-2xl border border-[#222226] bg-[#161619] p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#222226] pb-3">
                <h3 className="text-sm font-bold text-white">Leaderboard</h3>
                <button className="flex items-center gap-1 text-xs font-semibold text-[#a1a1aa] hover:text-[#f59e0b]">
                  <span>View All</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Dean's List vs Attendance Switcher */}
              <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-[#1e1e22] p-1 text-xs font-semibold">
                <button
                  onClick={() => setLeaderboardTab('deans')}
                  className={`rounded-lg py-1 transition ${
                    leaderboardTab === 'deans'
                      ? 'bg-[#f59e0b] text-black font-bold'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  Dean’s List
                </button>
                <button
                  onClick={() => setLeaderboardTab('attendance')}
                  className={`rounded-lg py-1 transition ${
                    leaderboardTab === 'attendance'
                      ? 'bg-[#f59e0b] text-black font-bold'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  Attendance
                </button>
              </div>

              {/* Tablet/Results Pending illustration */}
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1f1f23] border border-[#2e2e33] text-[#f59e0b]">
                  <Trophy className="h-8 w-8" />
                </div>
                <h4 className="mt-3 text-xs font-bold text-white">Results Pending</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-[#71717a] max-w-[220px]">
                  The Dean's List hasn't been released yet. Rankings will appear here once the final grades are released.
                </p>
              </div>

              <div className="pt-2 border-t border-[#222226]" />
            </div>

            {/* Ongoing Courses Card */}
            <div className="rounded-2xl border border-[#222226] bg-[#161619] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#222226] pb-3">
                <div className="flex items-center gap-1.5">
                  <Grid2X2 className="h-4 w-4 text-[#f59e0b]" />
                  <h3 className="text-sm font-bold text-white">Ongoing Courses</h3>
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold text-[#a1a1aa] hover:text-[#f59e0b]">
                  <span>View All</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Course Items from Image 2 */}
              <div className="space-y-2.5">
                {/* Course 1 */}
                <div className="rounded-xl border border-[#27272a] bg-[#1a1a1d] p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-[#27272a] px-1.5 py-0.5 text-[9px] font-semibold text-[#a1a1aa]">
                      PGPBHC3
                    </span>
                    <span className="rounded bg-[#f59e0b]/20 text-[#f59e0b] px-1.5 py-0.5 text-[9px] font-bold">
                      InClass
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    How Do Companies Structure Processes To Deliver...
                  </h4>
                  <p className="text-[10px] text-[#71717a]">Faculty: Not Assigned</p>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#a1a1aa] pt-1 border-t border-[#222226]">
                    <div>
                      PROGRESS <span className="text-white">1/10</span>
                    </div>
                    <div className="text-emerald-400">ATTENDANCE 100%</div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#27272a] overflow-hidden">
                    <div className="h-full bg-[#f59e0b] rounded-full w-[10%]" />
                  </div>
                </div>

                {/* Course 2 */}
                <div className="rounded-xl border border-[#27272a] bg-[#1a1a1d] p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-[#27272a] px-1.5 py-0.5 text-[9px] font-semibold text-[#a1a1aa]">
                      PGPBHC3
                    </span>
                    <span className="rounded bg-[#f59e0b]/20 text-[#f59e0b] px-1.5 py-0.5 text-[9px] font-bold">
                      InClass
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    How Can Professionals Use Financial Language To...
                  </h4>
                  <p className="text-[10px] text-[#71717a]">Faculty: Not Assigned</p>
                  <div className="text-[10px] font-semibold text-[#a1a1aa] pt-1 border-t border-[#222226]">
                    PROGRESS <span className="text-white">0/2</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#27272a]" />
                </div>

                {/* Course 3 */}
                <div className="rounded-xl border border-[#27272a] bg-[#1a1a1d] p-3 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-[#27272a] px-1.5 py-0.5 text-[9px] font-semibold text-[#a1a1aa]">
                      PGPBHC3
                    </span>
                    <span className="rounded bg-[#f59e0b]/20 text-[#f59e0b] px-1.5 py-0.5 text-[9px] font-bold">
                      InClass
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    ODC Preparation
                  </h4>
                  <p className="text-[10px] text-[#71717a]">Faculty: Not Assigned</p>
                  <div className="text-[10px] font-semibold text-[#a1a1aa] pt-1 border-t border-[#222226]">
                    PROGRESS <span className="text-white">0/2</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#27272a]" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Sticky Note on right edge */}
      <div
        className="fixed right-4 bottom-20 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fef08a] text-black shadow-lg cursor-pointer hover:scale-105 transition"
        title="Notes & Reminders"
      >
        <span className="text-base">📝</span>
      </div>

      {/* Floating Robot Coach Bug Bot bottom right */}
      <div
        className="fixed right-4 bottom-5 z-40 flex items-center gap-2 rounded-2xl bg-[#1f1f23] border border-[#2e2e33] px-3 py-1.5 shadow-2xl cursor-pointer hover:border-[#f59e0b] transition"
        title="Coach Bug Bot"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">
          🤖
        </div>
        <span className="text-xs font-bold text-white">Coach Bug Bot</span>
      </div>

      {/* Bottom Center Floating Toast (from screenshot) */}
      {showToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-2xl animate-in slide-in-from-bottom duration-300">
          <span>Content might be updated</span>
          <button
            onClick={() => setShowToast(false)}
            className="flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-800 transition"
          >
            <RotateCw className="h-3 w-3" />
            <span>Reload</span>
          </button>
          <button
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-black ml-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
