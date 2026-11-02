import { useState, useEffect, useRef, Fragment } from 'react'
import EditCohortPage from './EditCohortPage'
import UserManagementPage from './UserManagementPage'
import RolesAndPermissionsPage from './RolesAndPermissionsPage'
import AccessManagementSubView from './AccessManagementSubViews'
import CompetitionManagementPage from './CompetitionManagementPage'
import AnnouncementsPage from './AnnouncementsPage'
import {
  Home,
  Activity,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Sparkles,
  ClipboardCheck,
  FileText,
  LifeBuoy,
  BarChart2,
  ShieldCheck,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  Search,
  SlidersHorizontal,
  Bell,
  QrCode,
  Plus,
  MoreVertical,
  ChevronLeft,
  MessageCircle,
  Smartphone,
  ChevronDown,
  Info,
  Pencil,
  X,
  Download,
  CloudDownload,
  PlayCircle,
  Clock,
  Mail,
  CheckCircle,
  Calendar,
  History,
  Video,
  VideoOff,
  MapPin,
  ExternalLink,
  Copy,
  BookOpen,
  User,
  Users,
  KeyRound,
  Monitor,
  Headphones,
  UserCheck,
  Fingerprint,
  Check,
  Play,
  Maximize2,
  Presentation,
  FileSpreadsheet,
  Trash,
  Star,
  Trophy,
  Megaphone
} from 'lucide-react'

export interface SubNavRecord {
  id: string
  label: string
  icon?: any
}

export interface NavItem {
  id: string
  label: string
  icon: any
  hasSubmenu?: boolean
  subItems?: (string | SubNavRecord)[]
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'org-pulse', label: 'Organization Pulse', icon: Activity },
  {
    id: 'academics',
    label: 'Academics',
    icon: GraduationCap,
    hasSubmenu: true,
    subItems: ['Program Management', 'Program List', 'Curriculum', 'Cohorts']
  },
  { id: 'placement', label: 'Placement', icon: Briefcase, hasSubmenu: true },
  {
    id: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    hasSubmenu: true,
    subItems: [{ id: 'announcements', label: 'Announcements', icon: Megaphone }]
  },
  {
    id: 'student-experience',
    label: 'Student Experience',
    icon: Sparkles,
    hasSubmenu: true,
    subItems: [
      { id: 'student-dashboard', label: 'Dashboard', icon: Home },
      { id: 'student-events', label: 'Events', icon: Calendar },
      { id: 'student-clubs', label: 'Clubs', icon: Users },
      { id: 'student-feeds', label: 'Feeds', icon: MessageSquare },
      { id: 'student-polls', label: 'Polls', icon: BarChart2 },
      { id: 'student-competitions', label: 'Competitions', icon: Trophy }
    ]
  },
  { id: 'review-request', label: 'Review Request', icon: ClipboardCheck },
  { id: 'student-interface', label: 'Student Interface', icon: FileText },
  { id: 'help-support', label: 'Help & Support', icon: LifeBuoy, hasSubmenu: true },
  { id: 'analytics', label: 'Analytics', icon: BarChart2, hasSubmenu: true },
  {
    id: 'access-management',
    label: 'Access Management',
    icon: ShieldCheck,
    hasSubmenu: true,
    subItems: [
      { id: 'user-management', label: 'User Management', icon: Users },
      { id: 'roles-permission', label: 'Roles and Permission', icon: KeyRound },
      { id: 'team-setup', label: 'Team Setup', icon: Users },
      { id: 'user-active-session', label: 'User Active Session', icon: Monitor },
      { id: 'help-desk', label: 'Help Desk', icon: Headphones },
      { id: 'impersonation-logs', label: 'Impersonation Logs', icon: UserCheck },
      { id: 'user-active-session-logs', label: 'User Active Session Logs', icon: Activity },
      { id: 'biometric-logs', label: 'Biometric Logs', icon: Fingerprint }
    ]
  },
  { id: 'category-management', label: 'Category Management', icon: CreditCard },
  { id: 'coach-forms', label: 'Coach Forms', icon: FileText },
  { id: 'system-settings', label: 'System Settings', icon: Settings, hasSubmenu: true },
]

export interface StudentItem {
  srNo: number
  name: string
  email: string
}

const STUDENT_LIST: StudentItem[] = [
  { srNo: 1, name: 'AAYUSH', email: 'tbm26aayush@mastersunion.org' },
  { srNo: 2, name: 'Mr. ADHISH V SINGH', email: 'tbm26adhish.singh@mastersunion.org' },
  { srNo: 3, name: 'ADITI SHARMA', email: 'tbm26aditi.sharma@mastersunion.org' },
  { srNo: 4, name: 'ADITYA SINGH ROY', email: 'tbm26aditya.roy@mastersunion.org' },
  { srNo: 5, name: 'Akash Kumar', email: 'tbm26akash.kumar@mastersunion.org' },
  { srNo: 6, name: 'Akash Maurya', email: 'tbm26akash.maurya@mastersunion.org' },
  { srNo: 7, name: 'AKASH DEEPAK', email: 'tbm26akash.deepak@mastersunion.org' },
  { srNo: 8, name: 'Miss. ANADYA SINGH', email: 'tbm26anadya.singh@mastersunion.org' },
  { srNo: 9, name: 'Mr. ANDREW RAJAN', email: 'tbm26andrew.rajan@mastersunion.org' },
  { srNo: 10, name: 'Mr. ANIRUDDHA GARJE', email: 'tbm26aniruddha.garje@mastersunion.org' },
  { srNo: 11, name: 'ANSH', email: 'tbm26ansh@mastersunion.org' },
  { srNo: 12, name: 'ARPITA', email: 'tbm26arpita@mastersunion.org' },
  { srNo: 13, name: 'Mr.. ARUNTHEJA', email: 'tbm26aruntheja@mastersunion.org' },
  { srNo: 14, name: 'Mr. AVINASH MURALI', email: 'tbm26avinash.murali@mastersunion.org' },
  { srNo: 15, name: 'Mr. Ayush Chadha', email: 'tbm26ayush.chadha@mastersunion.org' },
  { srNo: 16, name: 'AYUSH JAIN', email: 'tbm26ayush.jain@mastersunion.org' },
  { srNo: 17, name: 'Bhavya Mittal', email: 'tbm26bhavya.mittal@mastersunion.org' },
  { srNo: 18, name: 'Chaitanya Sharma', email: 'tbm26chaitanya.sharma@mastersunion.org' },
  { srNo: 19, name: 'Deepika Patel', email: 'tbm26deepika.patel@mastersunion.org' },
  { srNo: 20, name: 'Devansh Agrawal', email: 'tbm26devansh.agrawal@mastersunion.org' },
  { srNo: 21, name: 'Dhruv Khurana', email: 'tbm26dhruv.khurana@mastersunion.org' },
  { srNo: 22, name: 'Divyansh Goel', email: 'tbm26divyansh.goel@mastersunion.org' },
  { srNo: 23, name: 'Gaurav Singhania', email: 'tbm26gaurav.singhania@mastersunion.org' },
  { srNo: 24, name: 'Hardik Soni', email: 'tbm26hardik.soni@mastersunion.org' },
  { srNo: 25, name: 'Harshita Nair', email: 'tbm26harshita.nair@mastersunion.org' },
  { srNo: 26, name: 'Ishaan Bhatia', email: 'tbm26ishaan.bhatia@mastersunion.org' },
  { srNo: 27, name: 'Jaya Vardhan', email: 'tbm26jaya.vardhan@mastersunion.org' },
  { srNo: 28, name: 'Karan Malhotra', email: 'tbm26karan.malhotra@mastersunion.org' },
  { srNo: 29, name: 'Kavya Kulkarni', email: 'tbm26kavya.kulkarni@mastersunion.org' },
  { srNo: 30, name: 'Keshav Singhal', email: 'tbm26keshav.singhal@mastersunion.org' },
  { srNo: 31, name: 'Kunal Mehra', email: 'tbm26kunal.mehra@mastersunion.org' },
  { srNo: 32, name: 'Manish Tiwari', email: 'tbm26manish.tiwari@mastersunion.org' },
  { srNo: 33, name: 'Mayank Joshi', email: 'tbm26mayank.joshi@mastersunion.org' },
  { srNo: 34, name: 'Naveen Reddy', email: 'tbm26naveen.reddy@mastersunion.org' },
  { srNo: 35, name: 'Niharika Verma', email: 'tbm26niharika.verma@mastersunion.org' },
  { srNo: 36, name: 'Nikita Kapoor', email: 'tbm26nikita.kapoor@mastersunion.org' },
  { srNo: 37, name: 'Palak Chawla', email: 'tbm26palak.chawla@mastersunion.org' },
  { srNo: 38, name: 'Pooja Deshmukh', email: 'tbm26pooja.deshmukh@mastersunion.org' },
  { srNo: 39, name: 'Pranav Sengupta', email: 'tbm26pranav.sengupta@mastersunion.org' },
  { srNo: 40, name: 'Prateek Yadav', email: 'tbm26prateek.yadav@mastersunion.org' },
  { srNo: 41, name: 'Priya Nambiar', email: 'tbm26priya.nambiar@mastersunion.org' },
  { srNo: 42, name: 'Raghav Arora', email: 'tbm26raghav.arora@mastersunion.org' },
  { srNo: 43, name: 'Rahul Varma', email: 'tbm26rahul.varma@mastersunion.org' },
  { srNo: 44, name: 'Rhea Pillai', email: 'tbm26rhea.pillai@mastersunion.org' },
  { srNo: 45, name: 'Rishabh Mittal', email: 'tbm26rishabh.mittal@mastersunion.org' },
  { srNo: 46, name: 'Rohan Saxena', email: 'tbm26rohan.saxena@mastersunion.org' },
  { srNo: 47, name: 'Rohit Pillai', email: 'tbm26rohit.pillai@mastersunion.org' },
  { srNo: 48, name: 'Sahil Bansal', email: 'tbm26sahil.bansal@mastersunion.org' },
  { srNo: 49, name: 'Samarth Jain', email: 'tbm26samarth.jain@mastersunion.org' },
  { srNo: 50, name: 'Sanya Bajaj', email: 'tbm26sanya.bajaj@mastersunion.org' },
  { srNo: 51, name: 'Sarthak Gupta', email: 'tbm26sarthak.gupta@mastersunion.org' },
  { srNo: 52, name: 'Shashank Shekhar', email: 'tbm26shashank.shekhar@mastersunion.org' },
  { srNo: 53, name: 'Shivam Anand', email: 'tbm26shivam.anand@mastersunion.org' },
  { srNo: 54, name: 'Shreya Sen', email: 'tbm26shreya.sen@mastersunion.org' },
  { srNo: 55, name: 'Siddharth Rao', email: 'tbm26siddharth.rao@mastersunion.org' },
  { srNo: 56, name: 'Sneha Roy', email: 'tbm26sneha.roy@mastersunion.org' },
  { srNo: 57, name: 'Sparsh Grover', email: 'tbm26sparsh.grover@mastersunion.org' },
  { srNo: 58, name: 'Tanmay Ghosh', email: 'tbm26tanmay.ghosh@mastersunion.org' },
  { srNo: 59, name: 'Tarun Chopra', email: 'tbm26tarun.chopra@mastersunion.org' },
  { srNo: 60, name: 'Utkarsh Pandey', email: 'tbm26utkarsh.pandey@mastersunion.org' },
  { srNo: 61, name: 'Vaibhav Srivastava', email: 'tbm26vaibhav.srivastava@mastersunion.org' },
  { srNo: 62, name: 'Varun Khanna', email: 'tbm26varun.khanna@mastersunion.org' },
  { srNo: 63, name: 'Vikas Meena', email: 'tbm26vikas.meena@mastersunion.org' },
  { srNo: 64, name: 'Yash Khandelwal', email: 'tbm26yash.khandelwal@mastersunion.org' },
  { srNo: 65, name: 'Zoya Akhtar', email: 'tbm26zoya.akhtar@mastersunion.org' }
]

export interface MaterialItem {
  name: string
  type: string
  size: string
  status: 'Available' | 'Pending'
}

export interface CourseSession {
  id: string
  sessionNum: number
  title: string
  isDefault?: boolean
  date: string
  time: string
  description: string
  faculty: string
  facultyRole?: string
  programAssociate: string
  modality: 'Offline' | 'Online' | 'Hybrid'
  location: string
  sessionLink?: string
  hasRecording?: boolean
  recordingUrl?: string
  recordingDuration?: string
  thumbnailUrl?: string
  feedbackRating?: number
  feedbackCount?: number
  topic: string
  subtopics: string[]
  preRead?: MaterialItem
  inClassMaterial?: MaterialItem
  postClass?: MaterialItem
  creator?: string
  updator?: string
  createTime?: string
  updateTime?: string
}

const DEFAULT_SESSIONS: CourseSession[] = [
  {
    id: 's1',
    sessionNum: 1,
    title: 'Keynote Session: Deepali Naair, Group CMO, CK Birla Group',
    isDefault: true,
    date: '30-06-2025',
    time: '10:00 AM - 11:00 AM',
    description: 'Exclusive fireside address on enterprise customer acquisition, brand repositioning across multi-billion-dollar conglomerates, and architecting modern digital-first corporate brand identities.',
    faculty: 'Ms. Deepali Naair',
    facultyRole: 'Group CMO, CK Birla Group',
    programAssociate: 'Ms. Priya Sharma',
    modality: 'Offline',
    location: 'Executive Hall 4, Masters\' Union Tower, Cybercity',
    sessionLink: 'https://meet.mastersunion.org/cxo-session-01',
    hasRecording: true,
    recordingUrl: 'https://stream.mastersunion.org/cxo4101/session-1.mp4',
    recordingDuration: '58 Mins',
    thumbnailUrl: '/session_thumbnail.jpg',
    feedbackRating: 4.8,
    feedbackCount: 46,
    topic: 'Corporate Brand Transformation & CXO Leadership',
    subtopics: [
      'Conglomerate brand equity vs subsidiary positioning',
      'Omnichannel marketing transition playbooks',
      'Managing stakeholder alignment during major rebranding',
      'CMO-CFO governance metrics and marketing ROI'
    ],
    preRead: {
      name: 'CK_Birla_Brand_Transformation_Case.pdf',
      type: 'PDF',
      size: '2.4 MB',
      status: 'Available'
    },
    inClassMaterial: {
      name: 'Deepali_Naair_CXO_Deck_2025.pptx',
      type: 'Deck',
      size: '14.8 MB',
      status: 'Available'
    },
    postClass: {
      name: 'Brand_Architecture_Framework_Template.xlsx',
      type: 'Spreadsheet',
      size: '1.1 MB',
      status: 'Available'
    },
    creator: 'Saumya Datta',
    updator: 'Saumya Datta',
    createTime: '24/06/2025, 6:04 PM',
    updateTime: '24/03/2026, 5:25 PM'
  },
  {
    id: 's2',
    sessionNum: 2,
    title: 'Panel Discussion: Future Of Finance & FinTech Unicorns',
    date: '07-07-2025',
    time: '11:30 AM - 01:00 PM',
    description: 'CFOs and Venture Partners delve into payments disruption, AI-driven credit underwriting, and evolving capital structures for high-growth tech firms.',
    faculty: 'Mr. Ankur Kulshreshtha',
    facultyRole: 'Managing Director & FinTech Leader',
    programAssociate: 'Ms. Priya Sharma',
    modality: 'Hybrid',
    location: 'Auditorium A & Zoom Room #824-102',
    sessionLink: 'https://zoom.us/j/9482746129',
    hasRecording: true,
    recordingUrl: 'https://stream.mastersunion.org/cxo4101/session-2.mp4',
    recordingDuration: '82 Mins',
    thumbnailUrl: '/session_thumbnail.jpg',
    feedbackRating: 3.2,
    feedbackCount: 38,
    topic: 'FinTech Capital Allocation & Digital Banking',
    subtopics: [
      'Unit economics of neo-banking vs legacy financial institutions',
      'Algorithmic credit risk modeling and regulatory compliance',
      'Treasury management in dynamic interest rate environments',
      'Series C to Pre-IPO capital raising dynamics'
    ],
    preRead: {
      name: 'RBI_Digital_Lending_Guidelines_Summary.pdf',
      type: 'PDF',
      size: '1.8 MB',
      status: 'Available'
    },
    inClassMaterial: {
      name: 'FinTech_CFO_Roundtable_Deck.pdf',
      type: 'PDF',
      size: '9.2 MB',
      status: 'Available'
    },
    postClass: {
      name: 'FinTech_Valuation_Model_v3.xlsx',
      type: 'Spreadsheet',
      size: '3.4 MB',
      status: 'Available'
    },
    creator: 'Saumya Datta',
    updator: 'Saumya Datta',
    createTime: '24/06/2025, 6:15 PM',
    updateTime: '24/03/2026, 5:30 PM'
  },
  {
    id: 's3',
    sessionNum: 3,
    title: 'Panel Discussion: Consumer Brands Scaling 0 to 100 Cr ARR',
    date: '14-07-2025',
    time: '02:00 PM - 03:30 PM',
    description: 'D2C founders and growth heads break down channel strategy, CAC-to-LTV levers, omnichannel expansion into quick-commerce, and offline modern trade distribution.',
    faculty: 'Mr. Vivek Shah',
    facultyRole: 'Co-Founder & Growth Partner',
    programAssociate: 'Ms. Ananya Roy',
    modality: 'Offline',
    location: 'Innovation Hub, Floor 2, MU Campus',
    sessionLink: 'https://meet.mastersunion.org/cxo-session-03',
    hasRecording: false,
    topic: 'D2C Unit Economics & Omnichannel Scale',
    subtopics: [
      'First-party vs marketplace revenue distribution strategies',
      'Quick-commerce logistics and dark store replenishment economics',
      'Performance marketing efficiency curves and cohort retention',
      'Building defensible customer moats in crowded categories'
    ],
    preRead: {
      name: 'D2C_Brands_Scaling_Playbook_2025.pdf',
      type: 'PDF',
      size: '3.1 MB',
      status: 'Available'
    },
    inClassMaterial: {
      name: 'Omnichannel_Unit_Economics_Slides.pdf',
      type: 'PDF',
      size: '6.5 MB',
      status: 'Available'
    },
    postClass: {
      name: 'CAC_LTV_Sensitivity_Calculator.xlsx',
      type: 'Spreadsheet',
      size: '850 KB',
      status: 'Pending'
    },
    creator: 'Saumya Datta',
    updator: 'Saumya Datta',
    createTime: '24/06/2025, 6:20 PM',
    updateTime: '24/03/2026, 5:40 PM'
  },
  {
    id: 's4',
    sessionNum: 4,
    title: 'Keynote Session: Ankit Goel, VP, Samagra Governance',
    date: '21-07-2025',
    time: '10:00 AM - 11:30 AM',
    description: 'Understanding large-scale systems engineering, public policy transformation, and public-private partnerships driving nationwide digital public infrastructure.',
    faculty: 'Mr. Ankit Goel',
    facultyRole: 'Vice President, Samagra Governance',
    programAssociate: 'Mr. Rohan Kapoor',
    modality: 'Online',
    location: 'Virtual Main Hall (Zoom Pro Classroom)',
    sessionLink: 'https://zoom.us/j/9128374650',
    hasRecording: true,
    recordingUrl: 'https://stream.mastersunion.org/cxo4101/session-4.mp4',
    recordingDuration: '75 Mins',
    thumbnailUrl: '/session_thumbnail.jpg',
    feedbackRating: 4.7,
    feedbackCount: 51,
    topic: 'Public Sector Digital Transformation & Scale',
    subtopics: [
      'Designing for population-scale adoption (100M+ citizens)',
      'Interoperable digital public infrastructure (DPI) architecture',
      'Government stakeholder alignment and milestone delivery frameworks',
      'Measuring real-world socioeconomic outcomes'
    ],
    preRead: {
      name: 'Samagra_State_Transformation_Case.pdf',
      type: 'PDF',
      size: '4.2 MB',
      status: 'Available'
    },
    inClassMaterial: {
      name: 'Systems_Change_Architecture_Presentation.pdf',
      type: 'PDF',
      size: '11.0 MB',
      status: 'Available'
    },
    postClass: {
      name: 'Public_Policy_Implementation_Roadmap.docx',
      type: 'Doc',
      size: '520 KB',
      status: 'Available'
    },
    creator: 'Saumya Datta',
    updator: 'Saumya Datta',
    createTime: '24/06/2025, 6:30 PM',
    updateTime: '24/03/2026, 5:45 PM'
  },
  {
    id: 's5',
    sessionNum: 5,
    title: 'Keynote Session: Amit Kumar, Managing Partner, Venture Ecosystem',
    date: '28-07-2025',
    time: '04:00 PM - 05:30 PM',
    description: 'Early-stage to growth venture investing, fund lifecycle dynamics, boardroom negotiation, and navigating market cycles from seed to liquidity.',
    faculty: 'Mr. Amit Kumar',
    facultyRole: 'Managing Partner, Venture Capital',
    programAssociate: 'Ms. Priya Sharma',
    modality: 'Offline',
    location: 'Executive Hall 4, Masters\' Union Tower',
    sessionLink: 'https://meet.mastersunion.org/cxo-session-05',
    hasRecording: false,
    topic: 'Venture Capital Strategy & Liquidity Frameworks',
    subtopics: [
      'Term sheet negotiations and critical governance protective clauses',
      'Portfolio construction and follow-on reserve capital strategies',
      'Down-round mitigation and anti-dilution mechanisms',
      'Strategic M&A and secondary sale exit pathways'
    ],
    preRead: {
      name: 'NVCA_Model_Term_Sheet_Annotated.pdf',
      type: 'PDF',
      size: '1.5 MB',
      status: 'Available'
    },
    inClassMaterial: {
      name: 'VC_Boardroom_Simulations_Case.pdf',
      type: 'PDF',
      size: '5.8 MB',
      status: 'Available'
    },
    postClass: {
      name: 'Cap_Table_Waterfalls_Simulation.xlsx',
      type: 'Spreadsheet',
      size: '2.2 MB',
      status: 'Pending'
    },
    creator: 'Saumya Datta',
    updator: 'Saumya Datta',
    createTime: '24/06/2025, 6:40 PM',
    updateTime: '24/03/2026, 5:50 PM'
  }
]

const COURSE_DETAIL_TABS = [
  { id: 'sessions', label: 'Sessions (31)' },
  { id: 'resources', label: 'Resources (0)' },
  { id: 'grades', label: 'Grades' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'groups', label: 'Groups' },
  { id: 'grading-template', label: 'Grading Template' },
  { id: 'attendance-template', label: 'Attendance Template' },
  { id: 'messages', label: 'Messages' }
]

export interface CourseItem {
  id: string
  name: string
  code: string
  domain: string
  type: string
  credit: number
  faculty: string
  facultyExtra?: string
  programAssociate?: string
  sessions: number
  status: 'Published' | 'Draft'
}

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: '1',
    name: 'Knowledge Sessions',
    code: 'PGP0006',
    domain: 'Leadership & Professional Development',
    type: 'Core',
    credit: 0,
    faculty: 'Dean & Leadership Team',
    programAssociate: 'Ms. Priya Sharma',
    sessions: 15,
    status: 'Published'
  },
  {
    id: '2',
    name: 'Leadership Lessons By CXOs',
    code: 'CXO4101',
    domain: 'Leadership & Professional Development',
    type: 'Core',
    credit: 0,
    faculty: 'CXO Guest Faculty',
    facultyExtra: '+12',
    programAssociate: 'Ms. Priya Sharma',
    sessions: 31,
    status: 'Published'
  },
  {
    id: '3',
    name: 'Generative AI - Foundations',
    code: 'DTP6102',
    domain: 'Technology & Emerging AI',
    type: 'Core',
    credit: 1,
    faculty: 'Mr. Kundan Gupta',
    facultyExtra: '+1',
    programAssociate: 'Mr. Rohan Kapoor',
    sessions: 6,
    status: 'Published'
  },
  {
    id: '4',
    name: 'Art of Communication',
    code: 'CSD6101',
    domain: 'Business Communication',
    type: 'Core',
    credit: 2,
    faculty: 'Ms. Nidhi Dinesh',
    facultyExtra: '+2',
    programAssociate: 'Ms. Priya Sharma',
    sessions: 10,
    status: 'Published'
  },
  {
    id: '5',
    name: 'Excel for Managers',
    code: 'DTP6103',
    domain: 'Data & Analytics',
    type: 'Core',
    credit: 1,
    faculty: 'Ms. Raveena Rawat',
    facultyExtra: '+1',
    programAssociate: 'Mr. Rohan Kapoor',
    sessions: 8,
    status: 'Published'
  },
  {
    id: '6',
    name: 'Digital Marketing',
    code: 'SAMA6102',
    domain: 'Marketing & Modern Growth',
    type: 'Core',
    credit: 2,
    faculty: 'Mr. Vivek Shah',
    facultyExtra: '+1',
    programAssociate: 'Ms. Ananya Roy',
    sessions: 9,
    status: 'Published'
  },
  {
    id: '7',
    name: 'Dropshipping Operations',
    code: 'DTP6104',
    domain: 'Operations & Supply Chain',
    type: 'Core',
    credit: 1,
    faculty: 'Dr. Ashish Singh Bhandari',
    facultyExtra: '+1',
    programAssociate: 'Ms. Ananya Roy',
    sessions: 8,
    status: 'Published'
  },
  {
    id: '8',
    name: 'Financial Accounting & Analysis',
    code: 'FIFI6101',
    domain: 'Finance & Accounting',
    type: 'Core',
    credit: 3,
    faculty: 'Mr. Ankur Kulshreshtha',
    facultyExtra: '+1',
    programAssociate: 'Mr. Rohan Kapoor',
    sessions: 19,
    status: 'Published'
  },
  {
    id: '9',
    name: 'Managerial Economics',
    code: 'MAST6101',
    domain: 'Finance & Economics',
    type: 'Core',
    credit: 2,
    faculty: 'Ms. Divya Rai',
    facultyExtra: '+1',
    programAssociate: 'Ms. Ananya Roy',
    sessions: 12,
    status: 'Published'
  }
]

export interface CohortItem {
  id: string
  name: string
  badge?: string
  cohortSize?: number
  spoc?: string
  spocExtra?: string
  durationYears?: string
  totalCourses?: number
  terms: number
  section: number
  modality: 'Online' | 'Offline' | 'Hybrid'
  startDate: string
  endDate: string
  status: 'Active' | 'Inactive'
}

function getCohortsForProgram(program: ProgramItem): CohortItem[] {
  if (program.id === '2' || program.name.includes('Technology and Business Management')) {
    return [
      {
        id: 'c1',
        name: 'Cohort 1',
        badge: 'C1',
        cohortSize: 350,
        spoc: 'Mrs. Arjoo Mahajan',
        spocExtra: '+07',
        durationYears: '1.2 Years',
        totalCourses: 417,
        terms: 8,
        section: 1,
        modality: 'Offline',
        startDate: '23/01/2024',
        endDate: '30/06/2025',
        status: 'Active'
      },
      {
        id: 'c2',
        name: 'Cohort 2',
        badge: 'C2',
        cohortSize: 320,
        spoc: 'Mrs. Arjoo Mahajan',
        spocExtra: '+05',
        durationYears: '1.2 Years',
        totalCourses: 380,
        terms: 9,
        section: 6,
        modality: 'Offline',
        startDate: '07/03/2024',
        endDate: '01/08/2025',
        status: 'Active'
      },
      {
        id: 'c3',
        name: 'Cohort 3',
        badge: 'C3',
        cohortSize: 180,
        spoc: 'Mr. Sameer Sen',
        spocExtra: '+03',
        durationYears: '1.0 Year',
        totalCourses: 210,
        terms: 8,
        section: 10,
        modality: 'Online',
        startDate: '01/08/2025',
        endDate: '31/12/2025',
        status: 'Active'
      },
      {
        id: 'c4',
        name: 'Cohort 4',
        badge: 'C4',
        cohortSize: 280,
        spoc: 'Mr. Gaurav Batra',
        spocExtra: '+04',
        durationYears: '1.2 Years',
        totalCourses: 350,
        terms: 9,
        section: 4,
        modality: 'Offline',
        startDate: '23/06/2023',
        endDate: '20/08/2024',
        status: 'Active'
      },
      {
        id: 'c6',
        name: 'Cohort 6',
        badge: 'C6',
        cohortSize: 140,
        spoc: 'Dr. Rakesh Nair',
        spocExtra: '+02',
        durationYears: '9 Months',
        totalCourses: 160,
        terms: 8,
        section: 1,
        modality: 'Online',
        startDate: '01/04/2026',
        endDate: '31/05/2026',
        status: 'Active'
      }
    ]
  }

  return [
    {
      id: `${program.id}-c1`,
      name: 'Cohort 1',
      badge: 'C1',
      cohortSize: 120,
      spoc: 'Faculty Chair',
      spocExtra: '+02',
      durationYears: '1.0 Year',
      totalCourses: 140,
      terms: 4,
      section: 1,
      modality: program.modality,
      startDate: '01/08/2025',
      endDate: '31/12/2025',
      status: 'Active'
    },
    {
      id: `${program.id}-c2`,
      name: 'Cohort 2',
      badge: 'C2',
      cohortSize: 150,
      spoc: 'Academic Dean',
      spocExtra: '+03',
      durationYears: '1.2 Years',
      totalCourses: 180,
      terms: 4,
      section: 2,
      modality: program.modality,
      startDate: '07/03/2024',
      endDate: '01/08/2025',
      status: 'Active'
    },
    {
      id: `${program.id}-c3`,
      name: 'Cohort 3',
      badge: 'C3',
      cohortSize: 135,
      spoc: 'Academic Director',
      spocExtra: '+01',
      durationYears: '1.0 Year',
      totalCourses: 160,
      terms: 4,
      section: 1,
      modality: program.modality,
      startDate: '15/09/2025',
      endDate: '15/09/2026',
      status: 'Active'
    }
  ]
}

interface ProgramItem {
  id: string
  name: string
  duration: number
  modality: 'Hybrid' | 'Offline' | 'Online'
  activeCohorts: number
  totalCohorts: number
  category: string
  status: 'Active' | 'Inactive'
}

const INITIAL_PROGRAMS: ProgramItem[] = [
  {
    id: '1',
    name: 'Strategic Business Management | Leadership and Strategy',
    duration: 12,
    modality: 'Hybrid',
    activeCohorts: 2,
    totalCohorts: 4,
    category: 'MasterCamp',
    status: 'Active'
  },
  {
    id: '2',
    name: 'PGP in Technology and Business Management (PGP-TBM)',
    duration: 16,
    modality: 'Offline',
    activeCohorts: 3,
    totalCohorts: 4,
    category: 'Masters Union',
    status: 'Active'
  },
  {
    id: '3',
    name: 'PGP in Applied AI, LLMs and Agentic Systems',
    duration: 15,
    modality: 'Offline',
    activeCohorts: 2,
    totalCohorts: 3,
    category: 'Masters Union',
    status: 'Active'
  },
  {
    id: '4',
    name: 'PGP in Sustainability and CleanTech Business',
    duration: 16,
    modality: 'Offline',
    activeCohorts: 1,
    totalCohorts: 2,
    category: 'Masters Union',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Executive MasterCamp in Product Leadership & Growth',
    duration: 12,
    modality: 'Hybrid',
    activeCohorts: 3,
    totalCohorts: 5,
    category: 'MasterCamp',
    status: 'Active'
  },
  {
    id: '6',
    name: 'Undergraduate Programme in Tech, Finance and Economics',
    duration: 48,
    modality: 'Offline',
    activeCohorts: 2,
    totalCohorts: 2,
    category: 'Masters Union',
    status: 'Active'
  },
  {
    id: '7',
    name: 'Venture Capital, Private Equity & Angel Investing',
    duration: 12,
    modality: 'Hybrid',
    activeCohorts: 2,
    totalCohorts: 4,
    category: 'MasterCamp',
    status: 'Active'
  },
  {
    id: '8',
    name: 'FinTech & Quantitative Financial Engineering',
    duration: 9,
    modality: 'Hybrid',
    activeCohorts: 1,
    totalCohorts: 3,
    category: 'MasterCamp',
    status: 'Active'
  },
  {
    id: '9',
    name: 'Direct-to-Consumer (D2C) & Modern Brand Building',
    duration: 6,
    modality: 'Hybrid',
    activeCohorts: 2,
    totalCohorts: 3,
    category: 'MasterCamp',
    status: 'Active'
  },
  {
    id: '10',
    name: 'PGP in Sports Management, Gaming & Entertainment',
    duration: 16,
    modality: 'Offline',
    activeCohorts: 1,
    totalCohorts: 2,
    category: 'School of Technology and Business Management',
    status: 'Active'
  }
]


function getInitialNavigation() {
  if (typeof window === 'undefined') {
    return { prog: null, coh: null, term: 'Term 1', section: 'Section 1', course: null }
  }

  const params = new URLSearchParams(window.location.search)
  const programId = params.get('program') || localStorage.getItem('lms_selected_program_id')
  const cohortId = params.get('cohort') || localStorage.getItem('lms_selected_cohort_id')
  const term = params.get('term') || localStorage.getItem('lms_selected_term') || 'Term 1'
  const section = params.get('section') || localStorage.getItem('lms_selected_section') || 'Section 1'
  const courseId = params.get('course') || localStorage.getItem('lms_selected_course_id')

  let prog: ProgramItem | null = null
  let coh: CohortItem | null = null
  let course: CourseItem | null = null

  if (programId) {
    prog = INITIAL_PROGRAMS.find((p) => p.id === programId) || null
    if (prog && cohortId) {
      const cohorts = getCohortsForProgram(prog)
      coh = cohorts.find((c) => c.id === cohortId) || null
      if (coh && courseId) {
        course = DEFAULT_COURSES.find((c) => c.id === courseId || c.code === courseId) || null
      }
    }
  }

  return { prog, coh, term, section, course }
}

export default function App() {
  const initialNav = getInitialNavigation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState(() => (initialNav.prog ? 'academics' : 'student-experience'))
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(() => (initialNav.prog ? 'academics' : 'student-experience'))
  const [activeSubItem, setActiveSubItem] = useState<string>(() => (initialNav.prog ? 'Program List' : 'Competitions'))
  const [searchTableQuery, setSearchTableQuery] = useState('')
  const [searchCohortQuery, setSearchCohortQuery] = useState('')
  const [searchCourseQuery, setSearchCourseQuery] = useState('')
  const [searchSessionQuery, setSearchSessionQuery] = useState('')
  const [programs] = useState<ProgramItem[]>(INITIAL_PROGRAMS)
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(initialNav.prog)
  const [selectedCohort, setSelectedCohort] = useState<CohortItem | null>(initialNav.coh)
  const [selectedTerm, setSelectedTerm] = useState(initialNav.term)
  const [selectedSection, setSelectedSection] = useState(initialNav.section)
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(initialNav.course)
  const [isEditingCohort, setIsEditingCohort] = useState(false)
  const [activeCourseTab, setActiveCourseTab] = useState<string>('sessions')
  const [selectedSessionId, setSelectedSessionId] = useState<string>('s1')
  const currentSession =
    DEFAULT_SESSIONS.find((s) => s.id === selectedSessionId) || DEFAULT_SESSIONS[0]
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false)
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const [groupByDomain, setGroupByDomain] = useState(false)
  const [actionNotification, setActionNotification] = useState<string | null>(null)
  const actionMenuRef = useRef<HTMLDivElement>(null)

  // Session governance controls
  const [feedbackEnabled, setFeedbackEnabled] = useState(true)
  const [mandatoryFeedback, setMandatoryFeedback] = useState(false)
  const [isAttendanceMenuOpen, setIsAttendanceMenuOpen] = useState(false)
  const [qrModalType, setQrModalType] = useState<'feedback' | 'attendance' | null>(null)
  const [isFeedbackDrawerOpen, setIsFeedbackDrawerOpen] = useState(false)
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const attendanceMenuRef = useRef<HTMLDivElement>(null)

  // Reset description expansion on session change
  useEffect(() => {
    setIsDescExpanded(false)
  }, [selectedSessionId])

  // Close attendance menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (attendanceMenuRef.current && !attendanceMenuRef.current.contains(e.target as Node)) {
        setIsAttendanceMenuOpen(false)
      }
    }
    if (isAttendanceMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isAttendanceMenuOpen])

  // Close action menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setIsActionMenuOpen(false)
      }
    }
    if (isActionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isActionMenuOpen])

  // Auto-dismiss action notification
  useEffect(() => {
    if (actionNotification) {
      const timer = setTimeout(() => setActionNotification(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [actionNotification])

  // Handle action menu items
  const handleActionClick = (actionName: string) => {
    setIsActionMenuOpen(false)
    if (actionName === 'Attendance Section Wise') {
      const csvHeader = 'Sr.No,Name,Email,Attendance Percentage,Status\n'
      const rows = STUDENT_LIST.map(
        (s, idx) => `${s.srNo},"${s.name}","${s.email}",${90 + (idx % 10)}%,Present`
      ).join('\n')
      const blob = new Blob([csvHeader + rows], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Attendance_${selectedCohort?.name || 'Cohort'}_${selectedSection.replace(/\s+/g, '_')}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setActionNotification('Attendance Section Wise report downloaded successfully.')
    } else if (actionName === 'Download Term Report/ Transcript') {
      const csvHeader = 'Course Code,Course Name,Domain,Credits,Sessions,Status\n'
      const rows = DEFAULT_COURSES.map(c => `"${c.code}","${c.name}","${c.domain}",${c.credit},${c.sessions},"${c.status}"`).join('\n')
      const blob = new Blob([csvHeader + rows], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Term_Report_${selectedCohort?.name || 'Cohort'}_${selectedTerm.replace(/\s+/g, '_')}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setActionNotification('Term Report / Transcript downloaded successfully.')
    } else if (actionName === 'Download Course Feedback') {
      const csvHeader = 'Course Code,Course Name,Domain,Faculty,Rating,Responses\n'
      const rows = DEFAULT_COURSES.map(c => `"${c.code}","${c.name}","${c.domain}","${c.faculty}",4.8,62`).join('\n')
      const blob = new Blob([csvHeader + rows], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Course_Feedback_${selectedCohort?.name || 'Cohort'}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      setActionNotification('Course Feedback report downloaded successfully.')
    } else {
      setActionNotification(`${actionName} opened.`)
    }
  }

  // Download students as CSV
  const handleDownloadCSV = () => {
    const csvHeader = 'Sr.No,Name,Email\n'
    const csvRows = STUDENT_LIST.map(
      (s) => `${s.srNo},"${s.name.replace(/"/g, '""')}","${s.email}"`
    ).join('\n')
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `Students_${selectedCohort?.name || 'Cohort'}_${selectedSection.replace(/\s+/g, '_')}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isManageStudentsOpen) {
        setIsManageStudentsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isManageStudentsOpen])

  // Synchronize state with URL parameters and localStorage so refresh stays on current view
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedProgram) {
      params.set('program', selectedProgram.id)
      localStorage.setItem('lms_selected_program_id', selectedProgram.id)
    } else {
      localStorage.removeItem('lms_selected_program_id')
    }

    if (selectedCohort) {
      params.set('cohort', selectedCohort.id)
      localStorage.setItem('lms_selected_cohort_id', selectedCohort.id)
    } else {
      localStorage.removeItem('lms_selected_cohort_id')
    }

    if (selectedProgram && selectedCohort) {
      params.set('term', selectedTerm)
      params.set('section', selectedSection)
      localStorage.setItem('lms_selected_term', selectedTerm)
      localStorage.setItem('lms_selected_section', selectedSection)
    } else {
      params.delete('term')
      params.delete('section')
      localStorage.removeItem('lms_selected_term')
      localStorage.removeItem('lms_selected_section')
    }

    if (selectedProgram && selectedCohort && selectedCourse) {
      params.set('course', selectedCourse.id)
      localStorage.setItem('lms_selected_course_id', selectedCourse.id)
    } else {
      params.delete('course')
      localStorage.removeItem('lms_selected_course_id')
    }

    const query = params.toString()
    const targetUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname
    if (window.location.search !== (query ? `?${query}` : '')) {
      window.history.pushState({}, '', targetUrl)
    }
  }, [selectedProgram, selectedCohort, selectedTerm, selectedSection, selectedCourse])

  // Handle browser Back & Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const nav = getInitialNavigation()
      setSelectedProgram(nav.prog)
      setSelectedCohort(nav.coh)
      setSelectedTerm(nav.term)
      setSelectedSection(nav.section)
      setSelectedCourse(nav.course)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const toggleSubmenu = (tabId: string) => {
    setActiveTab(tabId)
    if (tabId === 'communication') {
      setActiveSubItem('Announcements')
    }
    setExpandedSubmenu(prev => (prev === tabId ? null : tabId))
  }

  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTableQuery.toLowerCase())
  )

  const filteredCourses = DEFAULT_COURSES.filter(c =>
    c.name.toLowerCase().includes(searchCourseQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchCourseQuery.toLowerCase()) ||
    c.faculty.toLowerCase().includes(searchCourseQuery.toLowerCase())
  )

  const normalizedSessionQuery = searchSessionQuery.trim().toLowerCase()
  const filteredSessions = DEFAULT_SESSIONS.filter(session =>
    session.title.toLowerCase().includes(normalizedSessionQuery) ||
    session.topic.toLowerCase().includes(normalizedSessionQuery) ||
    `session ${session.sessionNum}`.includes(normalizedSessionQuery)
  )

  return (
    <div className="h-screen bg-[#f8fafc] text-slate-700 flex flex-col font-sans overflow-hidden">
      {/* Top Header Navbar */}
      <header className="shrink-0 sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 select-none">
            {/* Masters' Union Logo Symbol */}
            <div className="flex flex-col gap-0.5 justify-center">
              <div className="w-5 h-2.5 bg-black rounded-sm transform skew-x-[-18deg]"></div>
              <div className="w-5 h-2.5 bg-black rounded-sm transform skew-x-[-18deg]"></div>
            </div>
            <div className="leading-none pl-1">
              <span className="font-extrabold text-[17px] tracking-tight text-black block font-sans">masters'</span>
              <span className="font-extrabold text-[17px] tracking-tight text-black block -mt-1 font-sans">union</span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything here.."
              className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl pl-10 pr-24 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all shadow-inner"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-slate-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="text-[11px] font-mono border border-gray-200 px-1.5 py-0.5 rounded bg-white text-slate-500">
                CTRL + K
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & User Info */}
        <div className="flex items-center gap-3">
          {/* What's New Pill */}
          <button className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-teal-200/80 bg-teal-50/50 text-teal-700 text-xs font-semibold hover:bg-teal-50 transition-colors">
            <span className="text-rose-500">✨</span>
            <span>What's New</span>
            <span className="text-[10px] text-teal-600">⟳</span>
          </button>

          {/* Download App Pill */}
          <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-teal-200/80 bg-teal-50/50 text-teal-700 text-xs font-semibold hover:bg-teal-50 transition-colors">
            <Smartphone className="h-3.5 w-3.5 text-teal-600" />
            <span>Download App</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white ring-2 ring-white">
              42
            </span>
          </button>

          {/* QR/Apps Icon */}
          <button className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <QrCode className="h-4 w-4" />
          </button>

          {/* Country flag indicator */}
          <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full overflow-hidden border border-gray-200 shadow-sm" title="India">
            <span className="text-sm">🇮🇳</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Akash Sharma"
              className="h-8 w-8 rounded-full object-cover border border-gray-300"
            />
            <div className="hidden md:block text-left">
              <span className="text-[11px] text-slate-400 font-medium block leading-tight">Super Admin</span>
              <span className="text-xs font-semibold text-slate-800 block leading-tight">Akash Sharma</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-4rem)]">
        {/* Left Sidebar (Fixed and non-scrolling with page) */}
        <aside
          className={`bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-200 z-30 select-none shrink-0 h-full ${
            isSidebarOpen ? 'w-64' : 'w-[70px]'
          }`}
        >
          {/* Scrollable Navigation List */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
            <div className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon
                const isActive = activeTab === item.id
                const isSubmenuOpen = expandedSubmenu === item.id && isSidebarOpen

                return (
                  <div key={item.id} className="relative">
                    {/* Active teal pill indicator on left edge (matching screenshot) */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-teal-600 rounded-r-md"></div>
                    )}

                    <button
                      onClick={() => {
                        if (item.hasSubmenu) {
                          toggleSubmenu(item.id)
                        } else {
                          setActiveTab(item.id)
                        }
                      }}
                      title={!isSidebarOpen ? item.label : undefined}
                      className={`w-full flex items-center transition-colors relative ${
                        isSidebarOpen ? 'px-4 py-2.5 justify-between' : 'h-11 justify-center'
                      } ${
                        isActive
                          ? 'text-teal-700 bg-teal-50/40 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <IconComponent
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            isActive ? 'text-teal-600' : 'text-slate-500'
                          }`}
                        />
                        {isSidebarOpen && (
                          <span className="text-xs truncate tracking-normal font-medium">
                            {item.label}
                          </span>
                        )}
                      </div>

                      {isSidebarOpen && item.hasSubmenu && (
                        <ChevronRight
                          className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
                            isSubmenuOpen ? 'rotate-90 text-teal-600' : ''
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenu in expanded mode */}
                    {isSidebarOpen && isSubmenuOpen && item.subItems && (
                      <div className="bg-white border-y border-gray-100 py-1 pl-6 pr-3 space-y-0.5">
                        {item.subItems.map((sub, idx) => {
                          const subLabel = typeof sub === 'string' ? sub : sub.label
                          const SubIcon = typeof sub === 'string' ? null : sub.icon
                          const isSubActive =
                            item.id === 'academics'
                              ? (subLabel === 'Program List' && !selectedProgram) ||
                                (subLabel === 'Program Management' && !selectedProgram) ||
                                (subLabel === 'Cohorts' && selectedProgram && !selectedCohort) ||
                                (subLabel === 'Curriculum' && selectedCohort)
                              : activeTab === item.id && activeSubItem === subLabel
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (item.id === 'access-management') {
                                  setActiveTab('access-management')
                                  setActiveSubItem(subLabel)
                                } else if (item.id === 'academics') {
                                  setActiveTab('academics')
                                  if (subLabel === 'Program Management' || subLabel === 'Program List') {
                                    setSelectedProgram(null)
                                    setSelectedCohort(null)
                                    setSelectedCourse(null)
                                  } else if (subLabel === 'Cohorts') {
                                    if (!selectedProgram) {
                                      setSelectedProgram(INITIAL_PROGRAMS[1])
                                    }
                                    setSelectedCohort(null)
                                    setSelectedCourse(null)
                                  } else if (subLabel === 'Curriculum') {
                                    const prog = selectedProgram || INITIAL_PROGRAMS[1]
                                    setSelectedProgram(prog)
                                    const cohorts = getCohortsForProgram(prog)
                                    setSelectedCohort(cohorts[0])
                                    setSelectedCourse(null)
                                  }
                                } else {
                                  setActiveTab(item.id)
                                  setActiveSubItem(subLabel)
                                }
                              }}
                              className={`w-full text-left py-2 px-2.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-2.5 ${
                                isSubActive
                                  ? 'text-teal-700 font-semibold bg-teal-50 border border-teal-100/80 shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              {SubIcon && (
                                <SubIcon
                                  className={`h-4 w-4 shrink-0 ${
                                    isSubActive ? 'text-teal-600' : 'text-slate-400'
                                  }`}
                                />
                              )}
                              <span className="truncate">{subLabel}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom Area: Log Out */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => alert('Log out clicked')}
              className={`w-full flex items-center text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ${
                isSidebarOpen ? 'px-3 py-2.5 gap-3' : 'h-10 justify-center'
              }`}
              title={!isSidebarOpen ? 'Log Out' : undefined}
            >
              <LogOut className="h-4 w-4 text-rose-600 shrink-0" />
              {isSidebarOpen && (
                <span className="text-xs font-semibold">Log Out</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'access-management' ? (
            activeSubItem === 'User Management' ? (
              <UserManagementPage
                onActionNotify={(msg) => setActionNotification(msg)}
              />
            ) : activeSubItem === 'Roles and Permission' ? (
              <RolesAndPermissionsPage
                onActionNotify={(msg) => setActionNotification(msg)}
              />
            ) : (
              <AccessManagementSubView
                viewId={activeSubItem}
                onActionNotify={(msg) => setActionNotification(msg)}
              />
            )
          ) : activeTab === 'student-experience' && activeSubItem === 'Competitions' ? (
            <CompetitionManagementPage
              onActionNotify={(msg) => setActionNotification(msg)}
            />
          ) : activeTab === 'communication' && activeSubItem === 'Announcements' ? (
            <AnnouncementsPage
              onActionNotify={(msg) => setActionNotification(msg)}
            />
          ) : selectedProgram ? (
            selectedCohort ? (
              isEditingCohort ? (
                <EditCohortPage
                  cohort={selectedCohort}
                  programName={selectedProgram.name}
                  onDiscard={() => setIsEditingCohort(false)}
                  onSave={(updatedCohort) => {
                    setSelectedCohort(updatedCohort)
                    setIsEditingCohort(false)
                    setActionNotification('Cohort details saved successfully.')
                  }}
                />
              ) : selectedCourse ? (
                /* View 4: Course Detail View (Harmonized to match Program and Cohort design system) */
                <>
                  {/* Breadcrumbs with Teal Bar */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-teal-600 rounded-full"></div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedProgram(null)
                          setSelectedCohort(null)
                          setSelectedCourse(null)
                        }}
                        className="hover:text-teal-700 cursor-pointer transition-colors"
                      >
                        Program Management
                      </button>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      <button
                        onClick={() => {
                          setSelectedCohort(null)
                          setSelectedCourse(null)
                        }}
                        className="hover:text-teal-700 cursor-pointer transition-colors"
                      >
                        {selectedProgram.name}
                      </button>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="hover:text-teal-700 cursor-pointer transition-colors text-slate-600"
                      >
                        {selectedCohort.name}
                      </button>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="hover:text-teal-700 cursor-pointer transition-colors text-slate-600"
                      >
                        {selectedTerm}
                      </button>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="hover:text-teal-700 cursor-pointer transition-colors text-slate-600"
                      >
                        {selectedSection}
                      </button>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      <span className="text-teal-700 font-semibold">{selectedCourse.name}</span>
                    </div>
                  </div>

                  {/* Course Header & Metadata matching Cohort & Program Header Style */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm select-none shrink-0 shadow-xs tracking-wider">
                        {selectedCourse.code.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {selectedCourse.name}
                          </h1>
                          <button
                            onClick={() => setActionNotification(`Course details: ${selectedCourse.name} (${selectedCourse.code})`)}
                            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            title="Course Info"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 ml-1">
                            {selectedCourse.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-slate-500 font-medium flex-wrap">
                          <span>
                            CREDIT - <strong className="text-slate-800 font-semibold">{selectedCourse.credit}</strong>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span className="flex items-center gap-1.5">
                            FACULTY - <strong className="text-slate-800 font-semibold">{selectedCourse.faculty !== '-' ? selectedCourse.faculty : 'CXO Guest Faculty'}</strong>
                            {selectedCourse.facultyExtra && (
                              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
                                {selectedCourse.facultyExtra}
                              </span>
                            )}
                          </span>
                          <span className="text-slate-300">|</span>
                          <span>
                            PROGRAM ASSOCIATE - <strong className="text-slate-800 font-semibold">{selectedCourse.programAssociate || 'Ms. Priya Sharma'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Top right action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setActionNotification(`Documents for ${selectedCourse.name}`)}
                        className="p-2 rounded-lg border border-gray-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                        title="Documents"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setActionNotification(`Editing course ${selectedCourse.name}`)}
                        className="p-2 rounded-lg border border-gray-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                        title="Edit Course"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tabs Strip */}
                  <div className="border-b border-gray-200">
                    <div className="flex items-center gap-6 overflow-x-auto scrollbar-none text-xs">
                      {COURSE_DETAIL_TABS.map((tab) => {
                        const isActive = activeCourseTab === tab.id
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveCourseTab(tab.id)}
                            className={`pb-3 font-medium whitespace-nowrap transition-colors relative cursor-pointer ${
                              isActive
                                ? 'text-teal-700 font-semibold border-b-2 border-teal-600'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {tab.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Tabs Content */}
                  {activeCourseTab === 'sessions' ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                      {/* Unified sessions toolbar: search and collection actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-white border-b border-gray-200">
                        <div className="relative w-full sm:w-72">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search sessions..."
                            value={searchSessionQuery}
                            onChange={(e) => setSearchSessionQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-xs"
                          />
                        </div>

                        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                          <button
                            onClick={() => setActionNotification('Schedule Sessions modal opened')}
                            className="bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs text-xs transition-colors cursor-pointer"
                          >
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                            <span>Schedule Sessions</span>
                          </button>
                          <button
                            onClick={() => setActionNotification('Add Session modal opened')}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-xs text-xs transition-colors cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Session</span>
                          </button>
                        </div>
                      </div>

                      {/* Connected master-detail workspace */}
                      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] items-start">
                        {/* Left Column: Sessions List */}
                        <div className="bg-slate-50/40 border-b border-gray-200 lg:border-b-0 lg:border-r overflow-hidden">
                          <div className="px-4 py-3 bg-slate-50/70 border-b border-gray-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                            <span>Sessions List ({filteredSessions.length})</span>
                            <span className="text-[11px] font-normal text-slate-400">
                              {normalizedSessionQuery ? `${filteredSessions.length} of ${DEFAULT_SESSIONS.length}` : 'Chronological'}
                            </span>
                          </div>
                          <div className="divide-y divide-gray-100 max-h-[720px] overflow-y-auto">
                            {filteredSessions.length === 0 && (
                              <div className="px-5 py-12 text-center">
                                <Search className="h-5 w-5 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-slate-700">No sessions found</p>
                                <p className="text-[11px] text-slate-400 mt-1">Try a title, topic, or session number.</p>
                              </div>
                            )}
                            {filteredSessions.map((session) => {
                              const isSelected = selectedSessionId === session.id
                              return (
                                <div
                                  key={session.id}
                                  onClick={() => setSelectedSessionId(session.id)}
                                  className={`p-3.5 transition-colors cursor-pointer flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-teal-50/70 border-l-4 border-l-teal-600'
                                      : 'hover:bg-slate-50/60'
                                  }`}
                                >
                                  <div className="min-w-0 pr-3 flex-1">
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                      <span
                                        className={`text-[11px] font-semibold ${
                                          isSelected ? 'text-teal-700' : 'text-slate-500'
                                        }`}
                                      >
                                        Session {session.sessionNum}
                                      </span>

                                      {/* Recording Status Icon & Label */}
                                      {session.hasRecording ? (
                                        <span
                                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 shrink-0"
                                          title="Recording available"
                                        >
                                          <Video className="h-3 w-3 text-teal-600" />
                                          <span>Recorded</span>
                                        </span>
                                      ) : (
                                        <span
                                          className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0"
                                          title="Recording not uploaded"
                                        >
                                          <VideoOff className="h-3 w-3 text-slate-400" />
                                          <span>No Rec</span>
                                        </span>
                                      )}
                                    </div>

                                    {/* Session Title */}
                                    <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                                      {session.title}
                                    </p>

                                    {/* Date & Time metadata */}
                                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-medium flex-wrap">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-slate-400 shrink-0" />
                                        <span>{session.date}</span>
                                      </span>
                                      <span className="text-slate-300">•</span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                                        <span>{session.time}</span>
                                      </span>
                                    </div>
                                  </div>
                                  <ChevronRight
                                    className={`h-4 w-4 shrink-0 transition-colors ${
                                      isSelected ? 'text-teal-600' : 'text-slate-400'
                                    }`}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Right Column: Selected Session Detail View */}
                        <div className="min-w-0 bg-white">
                          {currentSession && (
                            <div className="overflow-hidden">
                              {/* 1. Header & Title Section with Smart Compact Governance Controls */}
                              <div className="p-4 sm:p-4.5 space-y-2.5">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
                                  {/* Title & Description */}
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                                      {currentSession.title}
                                    </h3>
                                    <div className="max-w-3xl">
                                      <p className={`text-xs text-slate-500 leading-relaxed transition-all ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                                        {currentSession.description}
                                      </p>
                                      {currentSession.description && currentSession.description.length > 120 && (
                                        <button
                                          type="button"
                                          onClick={() => setIsDescExpanded(!isDescExpanded)}
                                          className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer inline-flex items-center gap-0.5 mt-0.5"
                                        >
                                          <span>{isDescExpanded ? 'Show less' : 'Read more'}</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Top Right Action Cluster (Mark Attendance + Watch + Edit, History, Delete) */}
                                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                                    {/* Mark Attendance Dropdown (Manually / QR) */}
                                    <div className="relative" ref={attendanceMenuRef}>
                                      <button
                                        onClick={() => setIsAttendanceMenuOpen(!isAttendanceMenuOpen)}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                                      >
                                        <ClipboardCheck className="h-3.5 w-3.5" />
                                        <span>Mark Attendance</span>
                                        <ChevronDown className={`h-3 w-3 ml-0.5 transition-transform duration-200 ${isAttendanceMenuOpen ? 'rotate-180' : ''}`} />
                                      </button>

                                      {isAttendanceMenuOpen && (
                                        <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-40 animate-in fade-in zoom-in-95 duration-150">
                                          <button
                                            onClick={() => {
                                              setIsAttendanceMenuOpen(false)
                                              setActionNotification(`Manual attendance roster opened for: ${currentSession.title}`)
                                            }}
                                            className="w-full flex items-start gap-2.5 px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors cursor-pointer group"
                                          >
                                            <ClipboardCheck className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                                            <div>
                                              <p className="font-semibold text-slate-800 group-hover:text-teal-700">Mark Manually</p>
                                              <p className="text-[10px] text-slate-500">Roll sheet roster verification</p>
                                            </div>
                                          </button>

                                          <div className="border-t border-gray-100 my-0.5" />

                                          <button
                                            onClick={() => {
                                              setIsAttendanceMenuOpen(false)
                                              setQrModalType('attendance')
                                            }}
                                            className="w-full flex items-start gap-2.5 px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors cursor-pointer group"
                                          >
                                            <QrCode className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
                                            <div>
                                              <p className="font-semibold text-slate-800 group-hover:text-teal-700">Display Attendance QR</p>
                                              <p className="text-[10px] text-slate-500">Dynamic QR for student scanning</p>
                                            </div>
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    {/* Edit Session Icon Button */}
                                    <button
                                      onClick={() => setActionNotification(`Edit dialog opened for: ${currentSession.title}`)}
                                      className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-gray-300 transition-colors cursor-pointer shadow-2xs"
                                      title="Edit Session"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>

                                    {/* History Icon Button */}
                                    <button
                                      onClick={() => setActionNotification('Session change history opened')}
                                      className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-teal-50/60 text-slate-600 hover:text-teal-700 hover:border-teal-300 transition-colors cursor-pointer shadow-2xs"
                                      title="Session History"
                                    >
                                      <History className="h-3.5 w-3.5" />
                                    </button>

                                    {/* Delete Session Icon Button */}
                                    <button
                                      onClick={() => setActionNotification(`Delete confirmation for: ${currentSession.title}`)}
                                      className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer shadow-2xs"
                                      title="Delete Session"
                                    >
                                      <Trash className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Feedback governance: settings left, actions right */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-3 border-t border-gray-100">
                                  {/* Configuration group */}
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                      Feedback settings
                                    </span>

                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={feedbackEnabled}
                                      onClick={() => {
                                        const next = !feedbackEnabled
                                        setFeedbackEnabled(next)
                                        setActionNotification(next ? 'Feedback collection enabled for session' : 'Feedback collection disabled')
                                      }}
                                      className="flex items-center gap-2 cursor-pointer select-none group"
                                    >
                                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                        Collection
                                      </span>
                                      <span
                                        className={`w-8 h-[18px] rounded-full relative flex items-center p-0.5 transition-colors duration-200 ${
                                          feedbackEnabled ? 'bg-teal-600' : 'bg-slate-300'
                                        }`}
                                      >
                                        <span
                                          className={`w-3.5 h-3.5 rounded-full bg-white shadow-2xs transform transition-transform duration-200 ${
                                            feedbackEnabled ? 'translate-x-3.5' : 'translate-x-0'
                                          }`}
                                        />
                                      </span>
                                    </button>

                                    {feedbackEnabled && (
                                      <div className="relative group/mandatory flex items-center gap-2 pl-3 border-l border-gray-200 animate-in fade-in duration-200">
                                        <button
                                          type="button"
                                          role="switch"
                                          aria-checked={mandatoryFeedback}
                                          onClick={() => {
                                            const next = !mandatoryFeedback
                                            setMandatoryFeedback(next)
                                            setActionNotification(
                                              next
                                                ? 'Mandatory feedback enabled: Attendance linked to feedback submission'
                                                : 'Mandatory feedback disabled'
                                            )
                                          }}
                                          className="flex items-center gap-2 cursor-pointer select-none"
                                        >
                                          <span className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1">
                                            <span>Required for attendance</span>
                                            <Info className="h-3 w-3 text-slate-400 group-hover/mandatory:text-teal-600 transition-colors" />
                                          </span>
                                          <span
                                            className={`w-8 h-[18px] rounded-full relative flex items-center p-0.5 transition-colors duration-200 ${
                                              mandatoryFeedback ? 'bg-teal-600' : 'bg-slate-300'
                                            }`}
                                          >
                                            <span
                                              className={`w-3.5 h-3.5 rounded-full bg-white shadow-2xs transform transition-transform duration-200 ${
                                                mandatoryFeedback ? 'translate-x-3.5' : 'translate-x-0'
                                              }`}
                                            />
                                          </span>
                                        </button>

                                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-64 p-2 bg-slate-900 text-white text-[11px] leading-snug rounded-lg shadow-xl opacity-0 group-hover/mandatory:opacity-100 transition-opacity duration-200 z-50 text-center">
                                          Student attendance will only be marked Present upon successful feedback submission.
                                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Student access and results actions */}
                                  <div className="flex items-center gap-2 self-start lg:self-auto">
                                    {feedbackEnabled && (
                                      <button
                                        onClick={() => setQrModalType('feedback')}
                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-200 bg-teal-50/80 hover:bg-teal-100 text-teal-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                                        title="Show dynamic feedback QR code for students"
                                      >
                                        <QrCode className="h-3.5 w-3.5 text-teal-600" />
                                        <span>Share QR</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => {
                                        setIsFeedbackDrawerOpen(true)
                                        setActionNotification(`Viewing student feedback for: ${currentSession.title}`)
                                      }}
                                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold transition-colors cursor-pointer shadow-2xs group/rating"
                                      title={`View student feedback (${currentSession.feedbackRating || 3.2}/5.0)`}
                                    >
                                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500 shrink-0" />
                                      <span>View responses</span>
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-200/80 text-amber-950 font-bold text-[10px]">
                                        {currentSession.feedbackRating !== undefined ? currentSession.feedbackRating.toFixed(1) : '3.2'}
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* 2. Logistics & Info Bar (Icon-Led, Zero Nested Boxes) */}
                              <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-y border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2.5 gap-x-5">
                                {/* Date & Time */}
                                <div className="flex items-start gap-2.5">
                                  <div className="w-7 h-7 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                      Date & Time
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                                      {currentSession.date}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                      <Clock className="h-3 w-3 text-slate-400" />
                                      <span>{currentSession.time}</span>
                                    </span>
                                  </div>
                                </div>

                                {/* Faculty */}
                                <div className="flex items-start gap-2.5">
                                  <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <User className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                      Faculty
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                                      {currentSession.faculty}
                                    </span>
                                    {currentSession.facultyRole && (
                                      <span className="text-[10px] text-slate-500 font-medium truncate block">
                                        {currentSession.facultyRole}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Program Associate */}
                                <div className="flex items-start gap-2.5">
                                  <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <Mail className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                      Program Associate
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                                      {currentSession.programAssociate}
                                    </span>
                                    <span className="text-[10px] text-teal-700 font-medium block">
                                      Lead Coordinator
                                    </span>
                                  </div>
                                </div>

                                {/* Modality & Location */}
                                <div className="flex items-start gap-2.5">
                                  <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                                      Location ({currentSession.modality})
                                    </span>
                                    <span className="text-xs font-bold text-slate-800 block mt-0.5">
                                      {currentSession.location}
                                    </span>
                                  </div>
                                </div>

                                {/* Session Link */}
                                <div className="flex items-start gap-2.5 sm:col-span-2 lg:col-span-2">
                                  <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Session Link
                                      </span>
                                      {currentSession.sessionLink && (
                                        <button
                                          onClick={() => {
                                            navigator.clipboard?.writeText(currentSession.sessionLink || '')
                                            setActionNotification('Session link copied to clipboard!')
                                          }}
                                          className="text-[10px] text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <Copy className="h-3 w-3" />
                                          <span>Copy Link</span>
                                        </button>
                                      )}
                                    </div>
                                    {currentSession.sessionLink ? (
                                      <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <a
                                          href={currentSession.sessionLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline truncate"
                                        >
                                          {currentSession.sessionLink}
                                        </a>
                                        <a
                                          href={currentSession.sessionLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shrink-0 shadow-2xs"
                                        >
                                          <span>Join Room</span>
                                          <ExternalLink className="h-3 w-3" />
                                        </a>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-slate-400 font-medium block mt-0.5">
                                        No online session link assigned
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* 3. Session Video Recording */}
                              <div className="p-5 sm:p-6 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                                      <Video className="h-3.5 w-3.5" />
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                      Session Video Recording
                                    </h4>
                                  </div>

                                  {currentSession.hasRecording && currentSession.recordingDuration && (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center gap-1.5 shadow-2xs">
                                      <Clock className="h-3 w-3 text-teal-600" />
                                      <span>Duration: {currentSession.recordingDuration}</span>
                                    </span>
                                  )}
                                </div>

                                {currentSession.hasRecording ? (
                                  <div
                                    onClick={() => setActionNotification(`Playing recording: ${currentSession.title}`)}
                                    className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer border border-slate-800 bg-slate-950 aspect-video max-h-[360px] w-full flex items-center justify-center select-none"
                                  >
                                    <img
                                      src={currentSession.thumbnailUrl || '/session_thumbnail.jpg'}
                                      alt={currentSession.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-95"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-slate-950/50 pointer-events-none" />

                                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 pointer-events-none">
                                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                        HD 1080p
                                      </span>
                                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/60 backdrop-blur-md text-slate-200 border border-white/10 shadow-sm">
                                        {currentSession.recordingDuration}
                                      </span>
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <div className="relative flex items-center justify-center">
                                        <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-teal-500/30 animate-ping opacity-60 group-hover:opacity-90 duration-1000" />
                                        <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-teal-600/40 blur-md group-hover:bg-teal-500/60 transition-all" />
                                        <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-white text-teal-700 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-50 transition-all duration-300 ring-4 ring-white/30">
                                          <Play className="h-6 w-6 sm:h-8 sm:w-8 ml-1 fill-teal-700 text-teal-700" />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white flex flex-col gap-2">
                                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-500 rounded-full w-1/4 group-hover:w-1/3 transition-all duration-300"></div>
                                      </div>
                                      <div className="flex items-center justify-between gap-3 pt-1">
                                        <div className="min-w-0">
                                          <p className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-sm">
                                            {currentSession.title}
                                          </p>
                                          <p className="text-[11px] text-slate-300 truncate mt-0.5">
                                            {currentSession.faculty} • {currentSession.location}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setActionNotification(`Streaming video: ${currentSession.title}`)
                                            }}
                                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                          >
                                            <Play className="h-3.5 w-3.5 fill-current" />
                                            <span>Stream Now</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setActionNotification(`Downloading MP4 recording...`)
                                            }}
                                            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-xs text-white border border-white/10 transition-colors cursor-pointer"
                                            title="Download MP4"
                                          >
                                            <Download className="h-4 w-4" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setActionNotification(`Fullscreen video mode`)
                                            }}
                                            className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-xs text-white border border-white/10 transition-colors cursor-pointer hidden sm:block"
                                            title="Fullscreen"
                                          >
                                            <Maximize2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border border-dashed border-gray-200 rounded-xl p-5 text-center bg-slate-50/60 space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                      <VideoOff className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-700">
                                      No Session Recording Uploaded
                                    </p>
                                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                                      The video recording for this session has not yet been processed or published by the Program Associate.
                                    </p>
                                    <button
                                      onClick={() => setActionNotification(`Upload recording dialog opened for Session ${currentSession.sessionNum}`)}
                                      className="px-3 py-1.5 rounded-lg border border-teal-500 text-teal-700 hover:bg-teal-50 text-xs font-semibold transition-colors cursor-pointer shadow-2xs mt-1"
                                    >
                                      Upload Recording
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* 4. Topics & Sub-topics (Clean List, Zero Nested Boxes) */}
                              <div className="p-5 sm:p-6 border-t border-gray-100 space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                                    <BookOpen className="h-3.5 w-3.5" />
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Topics & Sub-topics
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2 pt-0.5">
                                  <span className="w-1.5 h-4 bg-teal-600 rounded-full"></span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {currentSession.topic}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                  {currentSession.subtopics.map((sub, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                                      <div className="w-4 h-4 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                                      </div>
                                      <span className="leading-snug">{sub}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 5. Learning Materials: Pre-Read, In-Class, Post-Class (Clean Unified List with Icons) */}
                              <div className="p-5 sm:p-6 border-t border-gray-100 space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-600 flex items-center justify-center">
                                    <FileText className="h-3.5 w-3.5" />
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Class Materials & Resources
                                  </h4>
                                </div>

                                <div className="divide-y divide-gray-100 border border-gray-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
                                  {/* Pre-Read Material */}
                                  <div className="flex items-center justify-between p-3.5 hover:bg-slate-50/70 transition-colors gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <FileText className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                                            Pre-Read
                                          </span>
                                          <span className="text-[11px] text-slate-400 font-medium">
                                            {currentSession.preRead?.size || 'PDF'}
                                          </span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                                          {currentSession.preRead?.name || 'Pre-reading document'}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => setActionNotification(`Downloading Pre-Read: ${currentSession.preRead?.name}`)}
                                      className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
                                    >
                                      <Download className="h-3.5 w-3.5 text-slate-500" />
                                      <span>Download</span>
                                    </button>
                                  </div>

                                  {/* In-Class Material */}
                                  <div className="flex items-center justify-between p-3.5 hover:bg-slate-50/70 transition-colors gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                        <Presentation className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/50">
                                            In-Class Deck
                                          </span>
                                          <span className="text-[11px] text-slate-400 font-medium">
                                            {currentSession.inClassMaterial?.size || 'Deck'}
                                          </span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                                          {currentSession.inClassMaterial?.name || 'In-class presentation'}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => setActionNotification(`Downloading In-Class Deck: ${currentSession.inClassMaterial?.name}`)}
                                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                      <span>Download Deck</span>
                                    </button>
                                  </div>

                                  {/* Post-Class Material */}
                                  <div className="flex items-center justify-between p-3.5 hover:bg-slate-50/70 transition-colors gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                        <FileSpreadsheet className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/50">
                                            Post-Class
                                          </span>
                                          <span className="text-[11px] text-slate-400 font-medium">
                                            {currentSession.postClass?.size || 'Template'}
                                          </span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                                          {currentSession.postClass?.name || 'Post-class exercise'}
                                        </p>
                                      </div>
                                    </div>
                                    {currentSession.postClass?.status === 'Available' ? (
                                      <button
                                        onClick={() => setActionNotification(`Downloading Post-Class: ${currentSession.postClass?.name}`)}
                                        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
                                      >
                                        <Download className="h-3.5 w-3.5 text-slate-500" />
                                        <span>Download</span>
                                      </button>
                                    ) : (
                                      <span className="text-xs font-medium text-slate-400 px-3 py-1.5">
                                        Pending Release
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Other tabs preview state */
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-xs space-y-3">
                      <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {COURSE_DETAIL_TABS.find((t) => t.id === activeCourseTab)?.label}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Course materials and configuration for {selectedCourse.name} under {selectedCohort.name} ({selectedSection}).
                      </p>
                      <button
                        onClick={() => setActiveCourseTab('sessions')}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 transition-colors cursor-pointer"
                      >
                        Back to Sessions
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* View 3: Cohort Detail View (Courses / Curriculum table matching user's screenshot) */
                <>
                  {/* Breadcrumbs with Teal Bar */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-teal-600 rounded-full"></div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedProgram(null)
                          setSelectedCohort(null)
                          setSelectedCourse(null)
                        }}
                        className="hover:text-teal-700 cursor-pointer transition-colors"
                      >
                        Program Management
                      </button>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      <button
                        onClick={() => {
                          setSelectedCohort(null)
                          setSelectedCourse(null)
                        }}
                        className="hover:text-teal-700 cursor-pointer transition-colors"
                      >
                        {selectedProgram.name}
                      </button>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-700 font-medium">{selectedCohort.name}</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-700 font-medium">{selectedTerm}</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <span className="text-teal-700 font-semibold">{selectedSection}</span>
                  </div>
                </div>

                {/* Cohort Header & Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg select-none shrink-0 shadow-xs">
                      {selectedCohort.badge || selectedCohort.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                          {selectedCohort.name}
                        </h1>
                        <button
                          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="Cohort Info"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs text-slate-500 font-medium flex-wrap">
                        <span>
                          COHORT SIZE - <strong className="text-slate-800 font-semibold">{selectedCohort.cohortSize || 350}</strong>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span className="flex items-center gap-1.5">
                          COHORT SPOC - <strong className="text-slate-800 font-semibold">{selectedCohort.spoc || 'Mrs. Arjoo Mahajan'}</strong>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold border border-slate-200">
                            {selectedCohort.spocExtra || '+07'}
                          </span>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>
                          DURATION - <strong className="text-slate-800 font-semibold">{selectedCohort.durationYears || '1.2 Years'}</strong>
                        </span>
                        <span className="text-slate-300">|</span>
                        <span>
                          TOTAL COURSES - <strong className="text-slate-800 font-semibold">{selectedCohort.totalCourses || 417}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top right action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="p-2 rounded-lg border border-gray-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                      title="Documents"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingCohort(true)}
                      className="p-2 rounded-lg border border-gray-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                      title="Edit Cohort"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Filter and Action Bar */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
                  {/* Left: Term & Section Selectors */}
                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <div className="w-48">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Select Term
                      </label>
                      <div className="relative">
                        <select
                          value={selectedTerm}
                          onChange={(e) => setSelectedTerm(e.target.value)}
                          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-xs cursor-pointer pr-8"
                        >
                          <option value="Term 1">Term 1</option>
                          <option value="Term 2">Term 2</option>
                          <option value="Term 3">Term 3</option>
                          <option value="Term 4">Term 4</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="w-56">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Select Section
                        </label>
                        <button
                          onClick={() => setIsManageStudentsOpen(true)}
                          className="text-[11px] text-teal-700 hover:underline font-medium cursor-pointer"
                        >
                          Students (65)
                        </button>
                      </div>
                      <div className="relative">
                        <select
                          value={selectedSection}
                          onChange={(e) => setSelectedSection(e.target.value)}
                          className="w-full appearance-none bg-white border border-teal-500 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-xs cursor-pointer pr-8 ring-1 ring-teal-500/20"
                        >
                          <option value="Section 1">Section 1</option>
                          <option value="Section 2">Section 2</option>
                          <option value="Section 3">Section 3</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Right: Search and Action Menu Dropdown */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchCourseQuery}
                        onChange={(e) => setSearchCourseQuery(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all w-52 sm:w-60 shadow-xs"
                      />
                    </div>

                    {/* Action Dropdown Menu matching Reference Screenshot */}
                    <div className="relative" ref={actionMenuRef}>
                      <button
                        onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                        className={`p-2 rounded-lg border transition-colors shadow-xs cursor-pointer ${
                          isActionMenuOpen
                            ? 'bg-slate-100 text-slate-900 border-gray-300'
                            : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-gray-200'
                        }`}
                        title="Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {isActionMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100 select-none">
                          <button
                            onClick={() => handleActionClick('Attendance Section Wise')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                          >
                            <Download className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Attendance Section Wise</span>
                          </button>

                          <button
                            onClick={() => handleActionClick('Custom Report Card')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                          >
                            <BarChart2 className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Custom Report Card</span>
                          </button>

                          <button
                            onClick={() => handleActionClick('Download Term Report/ Transcript')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                          >
                            <CloudDownload className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Download Term Report/ Transcript</span>
                          </button>

                          <button
                            onClick={() => handleActionClick('Consent Signed Details')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                          >
                            <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Consent Signed Details</span>
                          </button>

                          <button
                            onClick={() => handleActionClick('NPS Details')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                          >
                            <PlayCircle className="h-4 w-4 text-teal-600 shrink-0" />
                            <span>NPS Details</span>
                          </button>

                          <button
                            onClick={() => handleActionClick('Download Course Feedback')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                          >
                            <Download className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Download Course Feedback</span>
                          </button>

                          <button
                            onClick={() => handleActionClick('Student Workload Analysis')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                          >
                            <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Student Workload Analysis</span>
                          </button>

                          <button
                            onClick={() => handleActionClick('Failed Course Email')}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer text-left"
                          >
                            <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>Failed Course Email</span>
                          </button>

                          <div className="border-t border-gray-100 my-1"></div>

                          {/* Group by Domain Switch */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setGroupByDomain(!groupByDomain)
                            }}
                            className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer select-none transition-colors"
                          >
                            <span className="font-medium">Group by Domain</span>
                            <div
                              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                                groupByDomain ? 'bg-teal-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                                  groupByDomain ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Courses / Domain Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 bg-white text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          <th className="py-3.5 px-5">Domain/Course</th>
                          <th className="py-3.5 px-4">Code</th>
                          <th className="py-3.5 px-4">Type</th>
                          <th className="py-3.5 px-4">Credit</th>
                          <th className="py-3.5 px-4">Faculty</th>
                          <th className="py-3.5 px-4">Sessions</th>
                          <th className="py-3.5 px-4 text-center">Status</th>
                          <th className="py-3.5 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {groupByDomain ? (
                          /* Group by Domain view */
                          Array.from(new Set(filteredCourses.map(c => c.domain))).map(domain => {
                            const domainCourses = filteredCourses.filter(c => c.domain === domain)
                            if (domainCourses.length === 0) return null
                            return (
                              <Fragment key={domain}>
                                <tr className="bg-slate-50/90 border-y border-gray-200/70">
                                  <td colSpan={8} className="py-2.5 px-5 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-3.5 bg-teal-600 rounded-full"></span>
                                      <span>{domain}</span>
                                      <span className="text-slate-400 font-normal">({domainCourses.length})</span>
                                    </div>
                                  </td>
                                </tr>
                                {domainCourses.map((course) => (
                                  <tr
                                    key={course.id}
                                    onClick={() => setSelectedCourse(course)}
                                    className="hover:bg-teal-50/30 transition-colors group cursor-pointer"
                                  >
                                    <td className="py-3.5 px-5 font-semibold text-slate-800 group-hover:text-teal-700 transition-colors pl-8">
                                      {course.name}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                      {course.code}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                      {course.type}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                      {course.credit}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                      {course.faculty !== '-' ? (
                                        <span className="inline-flex items-center gap-1.5">
                                          <span>{course.faculty}</span>
                                          {course.facultyExtra && (
                                            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                                              {course.facultyExtra}
                                            </span>
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400">-</span>
                                      )}
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600">
                                      {course.sessions}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
                                        {course.status}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setActionNotification(`Actions for ${course.name}`)
                                        }}
                                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                        title="Actions"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </Fragment>
                            )
                          })
                        ) : (
                          /* Standard flat list view */
                          filteredCourses.map((course) => (
                            <tr
                              key={course.id}
                              onClick={() => setSelectedCourse(course)}
                              className="hover:bg-teal-50/30 transition-colors group cursor-pointer"
                            >
                              <td className="py-3.5 px-5 font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                                {course.name}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {course.code}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {course.type}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {course.credit}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {course.faculty !== '-' ? (
                                  <span className="inline-flex items-center gap-1.5">
                                    <span>{course.faculty}</span>
                                    {course.facultyExtra && (
                                      <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                                        {course.facultyExtra}
                                      </span>
                                    )}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {course.sessions}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
                                  {course.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActionNotification(`Actions for ${course.name}`)
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Actions"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}

                        {filteredCourses.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-10 text-center text-slate-400">
                              No courses found matching "{searchCourseQuery}".
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="border-t border-gray-100 px-5 py-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>Rows per page</span>
                      <div className="relative inline-flex items-center border border-gray-200 rounded-md px-2 py-1 bg-white cursor-pointer hover:border-gray-300">
                        <span className="text-slate-700 font-medium mr-1">10</span>
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span>1-{filteredCourses.length} of {filteredCourses.length}</span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled
                          className="p-1.5 rounded border border-gray-200 text-slate-300 cursor-not-allowed"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled
                          className="p-1.5 rounded border border-gray-200 text-slate-300 cursor-not-allowed"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          ) : (
              /* View 2: Cohorts List for Selected Program */
              <>
                {/* Breadcrumbs with Teal Bar */}
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-6 bg-teal-600 rounded-full"></div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 flex-wrap">
                    <button
                      onClick={() => {
                        setSelectedProgram(null)
                        setSelectedCohort(null)
                      }}
                      className="hover:text-teal-700 cursor-pointer transition-colors"
                    >
                      Program Management
                    </button>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-700 font-semibold">{selectedProgram.name}</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white text-[11px] font-semibold">
                      All Cohorts
                    </span>
                  </div>
                </div>

                {/* Page Title & Search/Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg select-none shrink-0 shadow-xs">
                      M
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                          {selectedProgram.name}
                        </h1>
                        <button
                          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="Program Info"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-5 mt-0.5 text-xs text-slate-500 font-medium">
                        <span>
                          DURATION - <strong className="text-slate-700 font-semibold">{selectedProgram.duration}</strong>
                        </span>
                        <span>
                          MODE - <strong className="text-slate-700 font-semibold">{selectedProgram.modality}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search here..."
                        value={searchCohortQuery}
                        onChange={(e) => setSearchCohortQuery(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all w-52 sm:w-60 shadow-xs"
                      />
                    </div>

                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Cohort</span>
                    </button>
                  </div>
                </div>

                {/* Cohorts Data Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 bg-white text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                          <th className="py-3.5 px-5">Cohort Name</th>
                          <th className="py-3.5 px-4">Terms</th>
                          <th className="py-3.5 px-4">Section</th>
                          <th className="py-3.5 px-4">Modality</th>
                          <th className="py-3.5 px-4">Start Date</th>
                          <th className="py-3.5 px-4">End Date</th>
                          <th className="py-3.5 px-4 text-center">Status</th>
                          <th className="py-3.5 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        {getCohortsForProgram(selectedProgram)
                          .filter((cohort) =>
                            cohort.name.toLowerCase().includes(searchCohortQuery.toLowerCase()) ||
                            cohort.modality.toLowerCase().includes(searchCohortQuery.toLowerCase())
                          )
                          .map((cohort) => (
                            <tr
                              key={cohort.id}
                              onClick={() => {
                                setSelectedCohort(cohort)
                                setSelectedCourse(null)
                              }}
                              className="hover:bg-teal-50/30 transition-colors group cursor-pointer"
                            >
                              <td className="py-3.5 px-5 font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                                {cohort.name}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {cohort.terms}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {cohort.section}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {cohort.modality}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {cohort.startDate}
                              </td>
                              <td className="py-3.5 px-4 text-slate-600">
                                {cohort.endDate}
                              </td>
                              <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
                                  {cohort.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <button
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Actions"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}

                        {getCohortsForProgram(selectedProgram).filter((cohort) =>
                          cohort.name.toLowerCase().includes(searchCohortQuery.toLowerCase()) ||
                          cohort.modality.toLowerCase().includes(searchCohortQuery.toLowerCase())
                        ).length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-10 text-center text-slate-400">
                              No cohorts found matching "{searchCohortQuery}".
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="border-t border-gray-100 px-5 py-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>Cohorts per page</span>
                      <div className="relative inline-flex items-center border border-gray-200 rounded-md px-2 py-1 bg-white cursor-pointer hover:border-gray-300">
                        <span className="text-slate-700 font-medium mr-1">10</span>
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span>
                        1-
                        {
                          getCohortsForProgram(selectedProgram).filter((cohort) =>
                            cohort.name.toLowerCase().includes(searchCohortQuery.toLowerCase()) ||
                            cohort.modality.toLowerCase().includes(searchCohortQuery.toLowerCase())
                          ).length
                        }{' '}
                        of{' '}
                        {
                          getCohortsForProgram(selectedProgram).filter((cohort) =>
                            cohort.name.toLowerCase().includes(searchCohortQuery.toLowerCase()) ||
                            cohort.modality.toLowerCase().includes(searchCohortQuery.toLowerCase())
                          ).length
                        }
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled
                          className="p-1.5 rounded border border-gray-200 text-slate-300 cursor-not-allowed"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled
                          className="p-1.5 rounded border border-gray-200 text-slate-300 cursor-not-allowed"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          ) : (
            /* Program List Page */
            <>
              {/* Breadcrumbs with Teal Bar */}
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-6 bg-teal-600 rounded-full"></div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="hover:text-slate-700 cursor-pointer">Program Management</span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                  <span className="text-teal-700 font-semibold">Program List</span>
                </div>
              </div>

              {/* Page Title & Search/Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Program List
                </h1>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      value={searchTableQuery}
                      onChange={(e) => setSearchTableQuery(e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all w-52 sm:w-60 shadow-xs"
                    />
                  </div>

                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Program</span>
                  </button>
                </div>
              </div>

              {/* Programs Data Table */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-white text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-5">Program Name</th>
                        <th className="py-3.5 px-4">Duration</th>
                        <th className="py-3.5 px-4">Modality</th>
                        <th className="py-3.5 px-4">Active Cohorts</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {filteredPrograms.map((program) => (
                        <tr
                          key={program.id}
                          onClick={() => {
                            setSelectedProgram(program)
                            setSelectedCohort(null)
                            setSelectedCourse(null)
                          }}
                          className="hover:bg-teal-50/30 transition-colors group cursor-pointer"
                        >
                          <td className="py-3.5 px-5 font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                            {program.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {program.duration}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {program.modality}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {program.activeCohorts}/{program.totalCohorts}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {program.category}
                          </td>
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200/60">
                              {program.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredPrograms.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400">
                            No programs found matching "{searchTableQuery}".
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="border-t border-gray-100 px-5 py-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>Programs per page</span>
                    <div className="relative inline-flex items-center border border-gray-200 rounded-md px-2 py-1 bg-white cursor-pointer hover:border-gray-300">
                      <span className="text-slate-700 font-medium mr-1">10</span>
                      <ChevronDown className="h-3 w-3 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span>1-10 of 33</span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled
                        className="p-1.5 rounded border border-gray-200 text-slate-300 cursor-not-allowed"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded border border-gray-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Floating Chatbot Widget: Coach Bug Bot */}
      {activeTab !== 'access-management' && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 z-40">
          <div className="relative">
            <div className="absolute -top-7 right-0 bg-slate-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow whitespace-nowrap">
              Coach Bug Bot
            </div>
            <button className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white ring-2 ring-white">
                1
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification for Action Menu Feedback */}
      {actionNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{actionNotification}</span>
        </div>
      )}

      {/* Manage Students Slide-Over Drawer matching Reference Screenshot */}
      {isManageStudentsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dark Backdrop Overlay */}
          <div
            onClick={() => setIsManageStudentsOpen(false)}
            className="fixed inset-0 bg-black/45 transition-opacity backdrop-blur-[0.5px]"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Manage Students
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownloadCSV}
                    className="border border-teal-500 hover:bg-teal-50 text-teal-700 text-xs font-semibold px-3.5 py-1.5 rounded-md transition-colors cursor-pointer"
                  >
                    Download CSV
                  </button>
                  <button
                    onClick={() => setIsManageStudentsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-white sticky top-0 z-10 text-slate-600 text-xs font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <th className="py-3 px-6 w-20">Sr.No</th>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Email</th>
                      <th className="py-3 px-6 text-center w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {STUDENT_LIST.map((student) => (
                      <tr
                        key={student.srNo}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3 px-6 text-slate-600 font-medium">
                          {student.srNo}
                        </td>
                        <td className="py-3 px-6 font-medium text-slate-900">
                          {student.name}
                        </td>
                        <td className="py-3 px-6 text-slate-600">
                          {student.email}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Action"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Interactive QR Code Modal (Feedback or Attendance) */}
      {qrModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setQrModalType(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-sm p-6 text-center z-10 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setQrModalType(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <QrCode className="h-6 w-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {qrModalType === 'feedback' ? 'Session Feedback QR Code' : 'Attendance Scan QR Code'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              {currentSession.title}
            </p>

            {/* QR Code Card Frame */}
            <div className="my-5 p-4 bg-slate-50 border border-gray-200/80 rounded-xl inline-block shadow-inner">
              <div className="w-44 h-44 bg-white rounded-lg p-2 border border-gray-200 shadow-xs flex flex-col items-center justify-center relative">
                {/* SVG QR Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <path fill="currentColor" d="M10 10h30v30h-30zM15 15v20h20v-20zM22 22h6v6h-6zM60 10h30v30h-30zM65 15v20h20v-20zM72 22h6v6h-6zM10 60h30v30h-30zM15 65v20h20v-20zM22 72h6v6h-6zM46 15h8v8h-8zM46 31h8v8h-8zM15 46h8v8h-8zM31 46h8v8h-8zM46 46h8v8h-8zM60 46h8v8h-8zM76 46h8v8h-8zM60 60h8v8h-8zM76 60h8v8h-8zM68 68h8v8h-8zM60 76h8v8h-8zM76 76h8v8h-8zM84 68h8v8h-8zM68 84h8v8h-8zM84 84h8v8h-8z" />
                </svg>
                {/* Center logo badge */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                    MU
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
              {qrModalType === 'feedback'
                ? mandatoryFeedback
                  ? '⚠️ Students must scan and complete feedback to be marked Present.'
                  : 'Students can scan this code to submit feedback for this session.'
                : 'Students in class can scan this code with the LMS app to record attendance.'}
            </p>

            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://lms.mastersunion.org/qr/${qrModalType}/${currentSession.id}`)
                  setActionNotification(`${qrModalType === 'feedback' ? 'Feedback' : 'Attendance'} link copied!`)
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy URL</span>
              </button>
              <button
                onClick={() => {
                  setActionNotification(`QR Code image downloaded`)
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download QR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Feedback Slide-Over Drawer */}
      {isFeedbackDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsFeedbackDrawerOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-[0.5px] transition-opacity"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Student Feedback
                  </h2>
                  <p className="text-xs text-slate-500 truncate max-w-xs">
                    {currentSession.title}
                  </p>
                </div>
                <button
                  onClick={() => setIsFeedbackDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Overall Rating Score Card */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Average Session Rating
                  </span>
                  <div className="flex items-center justify-center gap-2 my-2">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {currentSession.feedbackRating !== undefined ? currentSession.feedbackRating.toFixed(1) : '3.2'}
                    </span>
                    <span className="text-slate-400 text-sm font-semibold">/ 5.0</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(currentSession.feedbackRating || 3.2)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Based on <strong className="text-slate-900">{currentSession.feedbackCount || 38}</strong> verified student responses
                  </p>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Score Breakdown
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Faculty Delivery & Clarity', score: 3.5, pct: '70%' },
                      { label: 'Content Depth & Materials', score: 3.2, pct: '64%' },
                      { label: 'Real-world Practical Relevance', score: 3.4, pct: '68%' },
                      { label: 'Pacing & Time Management', score: 2.9, pct: '58%' },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-gray-100 rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">{item.label}</span>
                          <span className="font-bold text-slate-900">{item.score} / 5</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-600 rounded-full" style={{ width: item.pct }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Qualitative Highlights */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recent Student Comments
                  </h4>
                  {[
                    { text: 'Great practical insights on neo-banking unit economics. Would love deeper case studies on credit underwriting.', time: 'Yesterday' },
                    { text: 'The panel discussions brought immense clarity to growth financing and debt syndication.', time: '2 days ago' },
                    { text: 'Pacing felt slightly rushed towards the last 20 minutes, otherwise stellar speaker.', time: '3 days ago' },
                  ].map((comment, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200/80 bg-white text-xs space-y-1 shadow-2xs">
                      <p className="text-slate-700 leading-relaxed italic">"{comment.text}"</p>
                      <span className="text-[10px] text-slate-400 block">{comment.time} • Anonymous Cohort Student</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setActionNotification('Feedback report exported to CSV')
                  }}
                  className="w-full py-2 px-3 rounded-lg border border-gray-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span>Export Feedback (CSV)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
