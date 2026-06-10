'use client'
import { useState } from 'react'

const FORM_LABELS: Record<string, string> = {
  h1b:              'I-129 H-1B Pre-Fill',
  family_petition:  'I-130 Family Petition Pre-Fill',
  k1:               'I-129F K-1 Fiancé(e) Pre-Fill',
  green_card:       'I-140 Green Card Pre-Fill',
  l1:               'I-129 L-1 Transfer Pre-Fill',
}

interface Props {
  appId: string
  visaType: string
}

export default function DownloadUscisForm({ appId, visaType }: Props) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  const label = FORM_LABELS[visaType]
  if (!label) return null

  async function handleDownload() {
    setDownloading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/uscis-form/${appId}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Failed to generate PDF')
        return
      }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || 'uscis-prefill.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError('Download failed. Please try again.')
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          width: '100%', padding: '11px', borderRadius: '10px', border: '1.5px solid #1a2744',
          background: downloading ? '#eef0f4' : '#fff',
          color: downloading ? '#98a0b0' : '#1a2744',
          fontSize: '13px', fontWeight: 700, cursor: downloading ? 'not-allowed' : 'pointer',
          transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
        }}
      >
        {downloading ? (
          <>Generating…</>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>
            </svg>
            {label}
          </>
        )}
      </button>
      {error && (
        <div style={{ marginTop: '6px', fontSize: '12px', color: '#b42318', textAlign: 'center' }}>{error}</div>
      )}
      <div style={{ marginTop: '6px', fontSize: '11px', color: '#98a0b0', textAlign: 'center', lineHeight: 1.5 }}>
        Pre-filled by Part & Item number.<br />Use alongside the official blank USCIS form.
      </div>
    </div>
  )
}
