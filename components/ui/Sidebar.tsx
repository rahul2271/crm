'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, TrendingUp, FileText,
  LogOut, ChevronRight, ClipboardList, History, Stethoscope,
} from 'lucide-react'

const adminNav = [
  { label: 'Dashboard',   href: '/admin/dashboard',   icon: <LayoutDashboard size={17} /> },
  { label: 'Analytics',   href: '/admin/analytics',   icon: <TrendingUp size={17} /> },
  { label: 'Reports',     href: '/admin/reports',     icon: <FileText size={17} /> },
  { label: 'Telecallers', href: '/admin/telecallers', icon: <Users size={17} /> },
  { label: 'Diseases',    href: '/admin/diseases',    icon: <Stethoscope size={17} /> },
]

const telecallerNav = [
  { label: 'Dashboard',  href: '/dashboard', icon: <LayoutDashboard size={17} /> },
  { label: 'Fill Today', href: '/entry',     icon: <ClipboardList size={17} /> },
  { label: 'My History', href: '/history',   icon: <History size={17} /> },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user.role === 'admin'
  const nav = isAdmin ? adminNav : telecallerNav

  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col border-r border-slate-800 flex-shrink-0">
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">PatientCRM</p>
            <p className="text-xs text-slate-400">{isAdmin ? 'Admin' : 'Telecaller'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {nav.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all',
                active ? 'bg-brand-600 text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}>
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={13} className="opacity-60" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t border-slate-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-white truncate">{session?.user.name}</p>
          <p className="text-xs text-slate-400 truncate">{session?.user.email}</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </aside>
  )
}
