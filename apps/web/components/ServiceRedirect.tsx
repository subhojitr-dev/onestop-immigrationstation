'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ServiceRedirect() {
  const router = useRouter()
  useEffect(() => {
    const service = sessionStorage.getItem('pendingService')
    if (service) {
      sessionStorage.removeItem('pendingService')
      router.push(`/dashboard/apply/${service}`)
    }
  }, [router])
  return null
}
