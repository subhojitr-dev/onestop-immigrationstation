import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PortalSidebar from '@/components/PortalSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const userName = profile?.full_name || user.email?.split('@')[0] || 'My Account'
  const userRole = profile?.role || 'beneficiary'

  return (
    <div className="portal-body">
      <div className="portal">
        <PortalSidebar userName={userName} userRole={userRole} />
        <div className="portal-main">
          {/* Topbar */}
          <div className="portal-topbar">
            <div className="portal-topbar-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input placeholder="Search cases, documents…" />
            </div>
            <div className="portal-topbar-right">
              <button className="portal-topbar-icon" title="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
                <span className="dot" />
              </button>
              <div className="portal-topbar-av" title={userName}>
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="portal-page">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
