'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Result {
  id: string
  title: string
  subtitle: string
  description: string
  category: string
  href: string
  type: string
}

const typeColors: Record<string, string> = {
  'Acronym': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  'Drug': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  'Prescription': 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  'Condition': 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  'Anatomy': 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
  'Terminology': 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
  'Fire term': 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
  'Hazmat': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
  'Mnemonic': 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-400',
  'Radio code': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
  'Translation': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400',
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (query) runSearch(query)
  }, [query])

  async function runSearch(q: string) {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    const all: Result[] = []

    const { data: acronyms } = await supabase.from('acronyms').select('id, term, definition, category').or(`term.ilike.%${q}%,definition.ilike.%${q}%`).limit(5)
    acronyms?.forEach(a => all.push({ id: a.id, title: a.term, subtitle: a.category || 'EMS', description: a.definition, category: a.category, href: '/acronyms', type: 'Acronym' }))

    const { data: drugs } = await supabase.from('drugs').select('id, name, drug_class, indications, category').or(`name.ilike.%${q}%,drug_class.ilike.%${q}%,indications.ilike.%${q}%`).limit(5)
    drugs?.forEach(d => all.push({ id: d.id, title: d.name, subtitle: d.drug_class, description: d.indications, category: d.category, href: '/pharmacology', type: 'Drug' }))

    const { data: prescriptions } = await supabase.from('prescription_meds').select('id, brand_name, generic_name, prehospital_relevance, category').or(`brand_name.ilike.%${q}%,generic_name.ilike.%${q}%`).limit(5)
    prescriptions?.forEach(p => all.push({ id: p.id, title: p.brand_name, subtitle: p.generic_name, description: p.prehospital_relevance, category: p.category, href: '/prescriptions', type: 'Prescription' }))

    const { data: conditions } = await supabase.from('pathology').select('id, name, category, description').or(`name.ilike.%${q}%,description.ilike.%${q}%`).limit(5)
    conditions?.forEach(c => all.push({ id: c.id, title: c.name, subtitle: c.category, description: c.description, category: c.category, href: '/pathology', type: 'Condition' }))

    const { data: anatomy } = await supabase.from('anatomy').select('id, structure, system, description').or(`structure.ilike.%${q}%,description.ilike.%${q}%`).limit(5)
    anatomy?.forEach(a => all.push({ id: a.id, title: a.structure, subtitle: a.system, description: a.description, category: a.system, href: '/anatomy', type: 'Anatomy' }))

    const { data: terms } = await supabase.from('medical_terms').select('id, term, type, meaning').or(`term.ilike.%${q}%,meaning.ilike.%${q}%`).limit(5)
    terms?.forEach(t => all.push({ id: t.id, title: t.term, subtitle: t.type, description: t.meaning, category: t.type, href: '/terminology', type: 'Terminology' }))

    const { data: fire } = await supabase.from('fire_terms').select('id, term, category, definition').or(`term.ilike.%${q}%,definition.ilike.%${q}%`).limit(3)
    fire?.forEach(f => all.push({ id: f.id, title: f.term, subtitle: f.category, description: f.definition, category: f.category, href: '/fire', type: 'Fire term' }))

    const { data: hazmat } = await supabase.from('hazmat_terms').select('id, term, category, definition').or(`term.ilike.%${q}%,definition.ilike.%${q}%`).limit(3)
    hazmat?.forEach(h => all.push({ id: h.id, title: h.term, subtitle: h.category, description: h.definition, category: h.category, href: '/hazmat', type: 'Hazmat' }))

    const { data: mnemonics } = await supabase.from('mnemonics').select('id, name, category, usage').or(`name.ilike.%${q}%,usage.ilike.%${q}%`).limit(3)
    mnemonics?.forEach(m => all.push({ id: m.id, title: m.name, subtitle: m.category, description: m.usage, category: m.category, href: '/mnemonics', type: 'Mnemonic' }))

    const { data: radio } = await supabase.from('radio_codes').select('id, code, meaning, service').or(`code.ilike.%${q}%,meaning.ilike.%${q}%`).limit(3)
    radio?.forEach(r => all.push({ id: r.id, title: r.code, subtitle: r.service, description: r.meaning, category: r.service, href: '/radio', type: 'Radio code' }))

    setResults(all)
    setLoading(false)
  }

  return (
    <div>
      {loading && <div className="text-sm text-gray-500 dark:text-gray-400">Searching across all categories...</div>}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try a different search term or browse a specific category</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {results.length} results for "{query}" across all categories
          </div>
          <div className="flex flex-col gap-3">
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.href}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-red-300 dark:hover:border-red-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">{result.title}</h3>
                    {result.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{result.subtitle}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${typeColors[result.type] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                    {result.type}
                  </span>
                </div>
                {result.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{result.description}</p>
                )}
                <span className="text-xs text-red-700 dark:text-red-400 font-medium mt-2 block">
                  View in {result.type === 'Acronym' ? 'Acronyms' : result.type === 'Drug' ? 'Pharmacology' : result.href.replace('/', '')} →
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {!searched && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enter a search term above to search across all categories</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['STEMI', 'epinephrine', 'stroke', 'tachycardia', 'pneumothorax', 'naloxone', 'GCS', 'DCAP-BTLS'].map(term => (
              <Link
                key={term}
                href={`/search?q=${term}`}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">Search results</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Searching across acronyms, pharmacology, prescriptions, pathology, anatomy, terminology, and more.
        </p>
      </section>

      <div className="px-8 mb-6">
        <form action="/search" method="get" className="flex gap-2 max-w-lg">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search all categories..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            autoFocus
          />
          <button type="submit" className="px-5 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800">
            Search
          </button>
        </form>
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>

      <div className="px-8 pb-12">
        <Suspense fallback={<div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>}>
          <SearchResults />
        </Suspense>
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>
    </Layout>
  )
}
