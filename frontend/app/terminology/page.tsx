'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface MedTerm {
  id: string
  term: string
  type: string
  meaning: string
  origin: string
  examples: string[]
}

const types = ['All', 'Prefix', 'Root', 'Suffix']

export default function TerminologyPage() {
  const [terms, setTerms] = useState<MedTerm[]>([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [loading, setLoading] = useState(true)
  const [breakdown, setBreakdown] = useState('')
  const [breakdownResult, setBreakdownResult] = useState<MedTerm[]>([])

  useEffect(() => { fetchTerms() }, [search, type])

  async function fetchTerms() {
    setLoading(true)
    let query = supabase.from('medical_terms').select('*').order('term', { ascending: true })
    if (search) query = query.or(`term.ilike.%${search}%,meaning.ilike.%${search}%,origin.ilike.%${search}%`)
    if (type !== 'All') query = query.eq('type', type)
    const { data, error } = await query
    if (!error && data) {
      if (search) {
        const lower = search.toLowerCase()
        const withExamples = data.filter((t) => {
          const inExamples = t.examples?.some((ex: string) => ex.toLowerCase().includes(lower))
          return t.term.toLowerCase().includes(lower) || t.meaning.toLowerCase().includes(lower) || t.origin?.toLowerCase().includes(lower) || inExamples
        })
        setTerms(withExamples)
      } else {
        setTerms(data)
      }
    }
    setLoading(false)
  }

  async function breakdownTerm() {
    if (!breakdown.trim()) return
    const { data, error } = await supabase.from('medical_terms').select('*')
    if (!error && data) {
      const word = breakdown.toLowerCase()
      const matches = data.filter((t) => {
        const term = t.term.replace(/-/g, '').replace(/\//g, '').toLowerCase()
        return word.includes(term)
      })
      setBreakdownResult(matches)
    }
  }

  const typeColors: Record<string, string> = {
    Prefix: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    Root: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
    Suffix: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  }

  const typeBorder: Record<string, string> = {
    Prefix: 'border-blue-200 dark:border-blue-800',
    Root: 'border-green-200 dark:border-green-800',
    Suffix: 'border-purple-200 dark:border-purple-800',
  }

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-md mb-4">
          Prefix · Root · Suffix
        </div>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">Medical terminology</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Break down medical terms into their component parts. Search by the component itself or by its meaning — type "heart" to find "cardia", or type "cardia" to see what it means.
        </p>
      </section>

      {/* Breakdown tool */}
      <div className="px-8 mb-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Term breakdown tool</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Enter a full medical term to identify its components.
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g. tachycardia, hypertension, bradypnea..."
              value={breakdown}
              onChange={(e) => setBreakdown(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && breakdownTerm()}
              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              onClick={breakdownTerm}
              className="px-5 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800"
            >
              Break down
            </button>
          </div>

          {breakdownResult.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Found {breakdownResult.length} component{breakdownResult.length !== 1 ? 's' : ''} in "{breakdown}"
              </div>
              <div className="flex flex-col gap-2">
                {breakdownResult.map((t) => (
                  <div key={t.id} className={`p-3 rounded-lg border ${typeBorder[t.type] || 'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{t.term}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[t.type] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                        {t.type}
                      </span>
                      {t.origin && <span className="text-xs text-gray-400 dark:text-gray-500">{t.origin}</span>}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {breakdown && breakdownResult.length === 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              No components found for "{breakdown}" — try the reference search below.
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-8 mb-2">
        <input
          type="text"
          placeholder="Search by component or meaning — try 'heart', 'fast', 'cardia', 'tachy'..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>
      <div className="px-8 mb-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Searches term, meaning, origin, and examples — works in both directions
        </p>
      </div>

      {/* Type filters */}
      <div className="px-8 mb-6 flex gap-2 flex-wrap">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
              type === t
                ? 'bg-red-700 text-white border-red-700'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
            }`}
          >
            {t}
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
          <div className="text-sm text-gray-500 dark:text-gray-400">No results for "{search}"</div>
        ) : (
          <>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">{terms.length} results</div>
            {(type === 'All' ? ['Prefix', 'Root', 'Suffix'] : [type]).map((t) => {
              const group = terms.filter((term) => term.type === t)
              if (group.length === 0) return null
              return (
                <div key={t} className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t}es</h2>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                    <span className="text-xs text-gray-400 dark:text-gray-500">{group.length} terms</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.map((term) => (
                      <div
                        key={term.id}
                        className={`bg-white dark:bg-gray-900 border rounded-xl p-4 hover:border-red-200 dark:hover:border-red-800 transition-colors ${typeBorder[term.type] || 'border-gray-200 dark:border-gray-700'}`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-base font-medium text-red-700 dark:text-red-400">{term.term}</h3>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[term.type] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                              {term.type}
                            </span>
                            {term.origin && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">{term.origin}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{term.meaning}</p>
                        {term.examples && term.examples.length > 0 && (
                          <div className="flex flex-col gap-1">
                            <div className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Examples</div>
                            {term.examples.map((ex) => (
                              <div key={ex} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ex}</div>
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
