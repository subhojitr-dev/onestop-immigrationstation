'use client'
import { useState } from 'react'

export default function ResendSetupEmailButton({ userId }: { userId: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleClick() {
    setState('sending')
    const res = await fetch('/api/admin/resend-setup-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    setState(res.ok ? 'sent' : 'error')
    if (res.ok) setTimeout(() => setState('idle'), 4000)
  }

  if (state === 'sent') {
    return <span style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>✓ Sent!</span>
  }
  if (state === 'error') {
    return <span style={{ fontSize: '12px', color: '#b42318', fontWeight: 600 }}>Failed — retry</span>
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === 'sending'}
      style={{
        background: 'none', border: '1.5px solid #6d28d9', color: '#6d28d9',
        borderRadius: '7px', padding: '4px 10px', fontSize: '11px', fontWeight: 700,
        cursor: state === 'sending' ? 'wait' : 'pointer', whiteSpace: 'nowrap',
      }}
    >
      {state === 'sending' ? 'Sending…' : 'Resend Setup Email'}
    </button>
  )
}
