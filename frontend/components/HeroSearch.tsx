'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSearch() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  function handleSearch() {
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="flex gap-2 max-w-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search acronyms, drugs, conditions, terms..."
        className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />
      <button
        onClick={handleSearch}
        className="px-5 py-2.5 bg-red-700 dark:bg-red-800 text-white text-sm font-medium rounded-lg hover:bg-red-800 dark:hover:bg-red-700"
      >
        Search
      </button>
    </div>
  )
}
