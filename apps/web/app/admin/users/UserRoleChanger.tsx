/**
 * app/admin/users/UserRoleChanger.tsx
 *
 * Client component — inline role dropdown on /admin/users.
 * This is how you promote someone to lawyer or admin without touching SQL.
 * Uses admin API route so the update bypasses RLS.
 */
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const roles = ['beneficiary', 'sponsor', 'contact', 'lawyer', 'admin']
const roleColors: Record<string,{bg:string;color:string}> = {
  beneficiary: { bg:'#eef0f4', color:'#566173' },
  sponsor:     { bg:'#fdf3e3', color:'#b45309' },
  contact:     { bg:'#e8effe', color:'#1d4ed8' },
  lawyer:      { bg:'#f1ecfe', color:'#6d28d9' },
  admin:       { bg:'#fdeceb', color:'#b42318' },
}

export default function UserRoleChanger({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [saving, setSaving] = useState(false)
  const c = roleColors[role] || roleColors.beneficiary

  async function handleChange(newRole: string) {
    setRole(newRole)
    setSaving(true)
    await fetch('/api/admin/update-user-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <select value={role} onChange={e => handleChange(e.target.value)}
        style={{ padding: '5px 8px', border: `1.5px solid ${c.color}`, borderRadius: '8px', background: c.bg, color: c.color, fontSize: '12px', fontWeight: 600, cursor: 'pointer', outline: 'none', textTransform: 'capitalize' }}>
        {roles.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      {saving && <span style={{ fontSize: '11px', color: '#98a0b0' }}>Saving…</span>}
    </div>
  )
}
