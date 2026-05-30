'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [locked, setLocked] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    if (locked) return
    if (attempts >= 5) {
      setLocked(true)
      setError('Too many failed attempts. Please wait 5 minutes before trying again.')
      setTimeout(() => {
        setLocked(false)
        setAttempts(0)
        setError('')
      }, 5 * 60 * 1000)
      return
    }

    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAttempts(prev => prev + 1)
      setError(`Invalid credentials. ${5 - attempts - 1} attempts remaining.`)
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-xl font-medium text-gray-900 dark:text-white mb-1">
            The<span className="text-red-700 dark:text-red-400">Clinical</span>Ref
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {locked && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-300">Account temporarily locked due to too many failed attempts.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@theclinicalref.com"
              disabled={locked}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={locked}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading || locked || !email || !password}
            className="w-full py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in...' : locked ? 'Locked' : 'Sign in'}
          </button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
          TheClinicalRef LLC — Admin access only
        </p>
      </div>
    </div>
  )
}
