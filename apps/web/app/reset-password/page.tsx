'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const hasToken = window.location.hash.includes('access_token')

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setValidSession(true)
        setChecking(false)
      } else if (event === 'SIGNED_IN' && session && hasToken) {
        // Recovery links sign the user in — treat this as valid too
        setValidSession(true)
        setChecking(false)
      }
    })

    // If no token in URL, stop checking immediately
    if (!hasToken) setChecking(false)

    // Safety timeout — stop spinner after 4 seconds regardless
    const timer = setTimeout(() => setChecking(false), 4000)
    return () => { subscription.unsubscribe(); clearTimeout(timer) }
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
            <label htmlFor="password">
              New Password <span className="auth-hint">(min 8 characters)</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="confirm">Confirm New Password</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={8}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn--navy auth-submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
