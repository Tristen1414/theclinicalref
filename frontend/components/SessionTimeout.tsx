'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const TIMEOUT_MINUTES = 30

export default function SessionTimeout() {
  const router = useRouter()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  function resetTimer() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      await supabase.auth.signOut()
      router.push('/admin?reason=timeout')
    }, TIMEOUT_MINUTES * 60 * 1000)
  }

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return null
}
