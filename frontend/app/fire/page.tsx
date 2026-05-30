'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface FireTerm {
  id: string
  term: string
  definition: string
  category: string
  tags: string[]
}

const categories = ['All', 'ICS', 'Structural', 'Wildland', 'Equipment']

export default function FirePage() {
  const [terms, setTerms] = useState<FireTerm[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTerms()
  }, [search, category])

  async function fetchTerms() {
    setLoading(true)
    let query = supabase
      .from('fire_terms')
      .select('*')
      .order('term', { ascending: true })

    if (search) {
      query = query.or(`term.ilike.%${search}%,definition.ilike.%${search}%`)
    }

    if (category !== 'All') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (!error && data) setTerms(data)
    setLoading(false)
  }

  const categoryColors: Record<string, string> = {
    ICS: 'bg-blue-50 text-blue-700',
    Structural: 'bg-red-50 text-red-700',
    Wildland: 'bg-green-50 text-green-700',
    Equipment: 'bg-gray-100 text-gray-700',
  }

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-md mb-4">
          ICS · Structural · Wildland · Equipment
        </div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Fire terminology</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Structural and wildland firefighting terms, ICS structure, equipment reference, and operational terminology.
        </p>
      </section>

      {/* Search */}
      <div className="px-8 mb-4">
        <input
          type="text"
          placeholder="Search fire terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 dark:text-white"
        />
      </div>

      {/* Category filters */}
      <div className="px-8 mb-6 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
              category === cat
                ? 'bg-red-700 text-white border-red-700'
                : 'bg-white text-gray-600 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>

      {/* Results */}
      <div className="px-4 sm:px-8 pb-12">
        {loading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        ) : terms.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No terms found for "{search}"</div>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-4">{terms.length} terms</div>

            {/* Group by category */}
            {(category === 'All' ? categories.filter(c => c !== 'All') : [category]).map((cat) => {
              const group = terms.filter((t) => t.category === cat)
              if (group.length === 0) return null
              return (
                <div key={cat} className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-medium text-gray-700">{cat}</h2>
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-xs text-gray-400">{group.length} terms</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-red-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-sm font-medium text-red-700">{t.term}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${categoryColors[t.category] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                            {t.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{t.definition}</p>
                        {t.tags && t.tags.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap mt-3">
                            {t.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>
    </Layout>
  )
}
