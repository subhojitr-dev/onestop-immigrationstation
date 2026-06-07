'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (!accessToken) {
      setChecking(false)
      return
    }

    // Explicitly set the session from the recovery link tokens.
    // This ensures we're acting on the LAWYER's session, not any
    // existing admin session stored in cookies.
    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken || '' })
      .then(({ data, error }) => {
        if (!error && data.session) {
          setValidSession(true)
        }
        setChecking(false)
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      // Supabase returns a confusing "different from old password" error when
      // password reuse prevention is on. Give a clearer message.
      const msg = error.message.toLowerCase().includes('different')
        ? 'Please choose a different password and try again. If this is your first time setting a password, try a completely new password you have not used before.'
        : error.message
      setError(msg)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1>Password updated!</h1>
          <p className="auth-sub">Your password has been set successfully. Redirecting to sign in…</p>
        </div>
      </div>
    )
  }

  if (checking) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{textAlign:'center'}}>
          <p className="auth-sub">Verifying your link…</p>
        </div>
      </div>
    )
  }

  if (!validSession) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Invalid or expired link</h1>
          <p className="auth-sub">This password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="btn btn--navy auth-submit" style={{display:'block',textAlign:'center',textDecoration:'none',marginTop:'24px'}}>
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          <img src="/logo-bird.png" alt="One Stop Immigration Station" />
          <span>One Stop<br />Immigration Station</span>
        </Link>

        <h1>Set new password</h1>
        <p className="auth-sub">Choose a strong password for your account.</p>

        {error && (
          <div className="auth-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="password">New Password <span className="auth-hint">(min 8 characters)</span></label>
            <div style={{position:'relative'}}>
              <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" autoComplete="new-password" style={{paddingRight:'40px'}} />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#98a0b0', display:'flex', alignItems:'center', padding:0}}>
                {showPassword
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="confirm">Confirm New Password</label>
            <div style={{position:'relative'}}>
              <input id="confirm" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={8} placeholder="••••••••" autoComplete="new-password" style={{paddingRight:'40px'}} />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#98a0b0', display:'flex', alignItems:'center', padding:0}}>
                {showConfirm
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn--navy auth-submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
