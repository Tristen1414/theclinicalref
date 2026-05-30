'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface Acronym {
  id: string
  term: string
  definition: string
  context: string
  category: string
}

const categories = ['All', 'EMS', 'Clinical', 'Fire', 'Hospital', 'Trauma', 'Cardiac', 'Respiratory', 'Neurological']

export default function AcronymsPage() {
  const [acronyms, setAcronyms] = useState<Acronym[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<Acronym | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAcronyms() }, [search, category])

  async function fetchAcronyms() {
    setLoading(true)
    let query = supabase.from('acronyms').select('*').order('term', { ascending: true })
    if (search) query = query.or(`term.ilike.%${search}%,definition.ilike.%${search}%,context.ilike.%${search}%`)
    if (category !== 'All') query = query.eq('category', category)
    const { data, error } = await query
    if (!error && data) setAcronyms(data)
    setLoading(false)
  }

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-md mb-4">
          EMS · Clinical · Fire · Hospital
        </div>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">Acronyms & abbreviations</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Searchable database of EMS, clinical, fire, and hospital acronyms and abbreviations with context and usage examples.
        </p>
      </section>

      <div className="px-8 mb-4">
        <input
          type="text"
          placeholder="Search acronyms or definitions..."
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
        ) : acronyms.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No acronyms found for "{search}"</div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-72 shrink-0">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{acronyms.length} acronyms</div>
              <div className="flex flex-col gap-1">
                {acronyms.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                      selected?.id === a.id
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-red-300 dark:hover:border-red-600'
                    }`}
                  >
                    <div className="font-medium text-xs">{a.term}</div>
                    <div className={`text-xs mt-0.5 truncate ${selected?.id === a.id ? 'text-red-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {a.definition}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              {selected ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-3xl font-medium text-red-700 dark:text-red-400">{selected.term}</h2>
                    {selected.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 mt-2 inline-block">
                        {selected.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Definition</div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">{selected.definition}</p>
                    </div>
                    {selected.context && (
                      <>
                        <div className="h-px bg-gray-100 dark:bg-gray-800" />
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <div className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-2">Context & usage</div>
                          <p className="text-sm text-blue-900 dark:text-blue-300 leading-relaxed">{selected.context}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
                  <div className="text-gray-300 dark:text-gray-600 text-4xl mb-3">🔤</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select an acronym from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>
    </Layout>
  )
}
