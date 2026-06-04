'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1>Check your email</h1>
          <p className="auth-sub">
            We sent a password reset link to <strong>{email}</strong>.
            Click the link in the email to set a new password.
          </p>
          <p className="auth-sub" style={{fontSize:'13px', color:'#9ca3af', marginTop:'8px'}}>
            Didn&apos;t get it? Check your spam folder or{' '}
            <button
              onClick={() => setSent(false)}
              style={{background:'none',border:'none',color:'#1a2744',cursor:'pointer',fontWeight:600,fontSize:'13px'}}
            >
              try again
            </button>
          </p>
          <Link href="/login" className="btn btn--navy auth-submit" style={{display:'block',textAlign:'center',textDecoration:'none',marginTop:'24px'}}>
            Back to Login
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

        <h1>Reset your password</h1>
        <p className="auth-sub">Enter your email and we&apos;ll send you a reset link.</p>

        {error && (
          <div className="auth-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@email.com"
            />
          </div>
          <button type="submit" className="btn btn--navy auth-submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-switch">
          Remember your password? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
