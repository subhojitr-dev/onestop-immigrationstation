'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Role = 'sponsor' | 'beneficiary'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<Role>('beneficiary')

  // Pre-select role and capture service from URL params
  useEffect(() => {
    const roleParam = searchParams.get('role') as Role
    if (roleParam === 'sponsor' || roleParam === 'beneficiary') {
      setRole(roleParam)
      setStep(2) // skip role selection, go straight to details
    }
  }, [searchParams])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          phone,
          role,
          business_name: role === 'sponsor' ? businessName : '',
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Insert profile row
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: `${firstName} ${lastName}`,
        phone,
        role,
      })
    }

    setSuccess(true)
    setLoading(false)

    // Store service param so we can redirect after email confirmation + login
    const service = searchParams.get('service')
    if (service) {
      sessionStorage.setItem('pendingService', service)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1>Check your email</h1>
          <p className="auth-sub">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in to access your portal.</p>
          {searchParams.get('service') && (
            <p style={{fontSize:'13px', color:'#b8952a', background:'#f7efd9', padding:'10px 14px', borderRadius:'8px', marginBottom:'16px'}}>
              ✓ Once logged in, you&apos;ll be taken directly to your {searchParams.get('service')?.replace('_',' ').toUpperCase()} application
            </p>
          )}
          <Link href="/login" className="btn btn--navy auth-submit" style={{display:'block',textAlign:'center',textDecoration:'none'}}>
            Go to Login
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

        <h1>Create your account</h1>
        <p className="auth-sub">Free to join — start your immigration journey today</p>

        {error && (
          <div className="auth-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            {error}
          </div>
        )}

        {/* Step 1 — Choose role */}
        {step === 1 && (
          <div>
            <p className="auth-role-label">I am registering as a:</p>
            <div className="role-grid">
              <button
                type="button"
                className={`role-card${role === 'sponsor' ? ' active' : ''}`}
                onClick={() => setRole('sponsor')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
                <strong>Employer / Sponsor</strong>
                <span>Sponsoring an employee&apos;s visa</span>
              </button>
              <button
                type="button"
                className={`role-card${role === 'beneficiary' ? ' active' : ''}`}
                onClick={() => setRole('beneficiary')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <strong>Individual / Beneficiary</strong>
                <span>Applying for a visa for myself or family</span>
              </button>
            </div>
            <button className="btn btn--navy auth-submit" onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 — Fill in details */}
        {step === 2 && (
          <form onSubmit={handleSignup}>
            <button type="button" className="auth-back" onClick={() => setStep(1)}>
              ← Back
            </button>
            <div className="auth-field-row">
              <div className="auth-field">
                <label htmlFor="firstName">First Name *</label>
                <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="Jane" autoComplete="given-name" />
              </div>
              <div className="auth-field">
                <label htmlFor="lastName">Last Name *</label>
                <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Smith" autoComplete="family-name" />
              </div>
            </div>
            {role === 'sponsor' && (
              <div className="auth-field">
                <label htmlFor="businessName">Company Name *</label>
                <input id="businessName" type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required placeholder="Acme Corp" />
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" autoComplete="tel" />
            </div>
            <div className="auth-field">
              <label htmlFor="email">Email address *</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" autoComplete="email" />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password * <span className="auth-hint">(min 8 characters)</span></label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" autoComplete="new-password" />
            </div>
            <button type="submit" className="btn btn--navy auth-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-card"><p>Loading…</p></div></div>}>
      <SignupForm />
    </Suspense>
  )
}
