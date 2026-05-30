'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface Mnemonic {
  id: string
  name: string
  expansion: string
  usage: string
  category: string
}

const categories = ['All', 'Assessment', 'Trauma', 'Cardiac', 'Airway', 'Toxicology', 'Pediatric']

export default function MnemonicsPage() {
  const [mnemonics, setMnemonics] = useState<Mnemonic[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [open, setOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMnemonics() }, [search, category])

  async function fetchMnemonics() {
    setLoading(true)
    let query = supabase.from('mnemonics').select('*').order('name', { ascending: true })
    if (search) query = query.or(`name.ilike.%${search}%,expansion.ilike.%${search}%,usage.ilike.%${search}%`)
    if (category !== 'All') query = query.eq('category', category)
    const { data, error } = await query
    if (!error && data) setMnemonics(data)
    setLoading(false)
  }

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-md mb-4">
          Assessment · Trauma · Cardiac · Airway
        </div>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">Protocol mnemonics</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          SAMPLE, DCAP-BTLS, AEIOU-TIPS, and all major assessment mnemonics explained with full expansion and clinical context.
        </p>
      </section>

      <div className="px-8 mb-4">
        <input
          type="text"
          placeholder="Search mnemonics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      <div className="px-8 mb-6 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
              category === cat
                ? 'bg-red-700 text-white border-red-700'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>

      <div className="px-4 sm:px-8 pb-12">
        {loading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        ) : mnemonics.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No mnemonics found for "{search}"</div>
        ) : (
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{mnemonics.length} mnemonics</div>
            {mnemonics.map((m) => (
              <div
                key={m.id}
                className={`bg-white dark:bg-gray-900 border rounded-xl overflow-hidden transition-colors ${
                  open === m.id
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <button
                  onClick={() => setOpen(open === m.id ? null : m.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</span>
                    {m.category && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {m.category}
                      </span>
                    )}
                  </div>
                  <div className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    open === m.id
                      ? 'bg-red-700 border-red-700 text-white rotate-45'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>

                {open === m.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800">
                    <div className="pt-4 flex flex-col gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Expansion</div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{m.expansion}</p>
                      </div>
                      {m.usage && (
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <div className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-2">Clinical usage</div>
                          <p className="text-sm text-blue-900 dark:text-blue-300 leading-relaxed">{m.usage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>
    </Layout>
  )
}
