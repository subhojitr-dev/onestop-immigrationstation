'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userName: string
  userRole: string
}

const svgs: Record<string, string> = {
  dashboard:      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  cases:          '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  appointments:   '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  documents:      '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  tickets:        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  beneficiaries:  '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  contacts:       '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M22 11c0 4-2 6-6 8"/>',
  profile:        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  signout:        '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
}

function NavIcon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: svgs[id] }} />
  )
}

export default function PortalSidebar({ userName, userRole }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const initial = userName ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const mainNav = [
    { id: 'dashboard',    href: '/dashboard',              label: 'Dashboard' },
    { id: 'cases',        href: '/dashboard/cases',         label: 'My Cases' },
    { id: 'appointments', href: '/dashboard/appointments',  label: 'Appointments' },
    { id: 'documents',    href: '/dashboard/documents',     label: 'Documents' },
    { id: 'tickets',      href: '/dashboard/tickets',       label: 'Support' },
    ...(userRole === 'sponsor' || userRole === 'admin' ? [
      { id: 'beneficiaries', href: '/dashboard/beneficiaries', label: 'Beneficiaries' },
      { id: 'contacts',      href: '/dashboard/contacts',      label: 'HR Contacts' },
    ] : []),
  ]

  const accountNav = [
    { id: 'profile', href: '/dashboard/profile', label: 'Profile' },
  ]

  return (
    <aside className="portal-sidebar">
      <Link href="/" className="portal-logo">
        <span className="portal-logo-badge">
          <img src="/logo-bird.png" alt="OSIS" />
        </span>
        <span className="portal-logo-text">
          <b>One Stop</b>
          <span>Immigration</span>
        </span>
      </Link>

      <div className="portal-nav-group">
        <div className="portal-nav-group-label">Menu</div>
        {mainNav.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className={`portal-nav-link${isActive(item.href) ? ' active' : ''}`}
          >
            <NavIcon id={item.id} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="portal-nav-group">
        <div className="portal-nav-group-label">Account</div>
        {accountNav.map(item => (
          <Link
            key={item.id}
            href={item.href}
            className={`portal-nav-link${isActive(item.href) ? ' active' : ''}`}
          >
            <NavIcon id={item.id} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="portal-sidebar-foot">
        <div className="portal-user-chip">
          <span className="portal-user-av">{initial}</span>
          <span className="portal-user-info">
            <b>{userName || 'My Account'}</b>
            <span>{userRole}</span>
          </span>
          <button className="portal-signout-btn" title="Sign out" onClick={handleSignOut}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: svgs.signout }} />
          </button>
        </div>
      </div>
    </aside>
  )
}
