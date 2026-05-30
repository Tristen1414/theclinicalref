'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface Med {
  id: string
  brand_name: string
  generic_name: string
  drug_class: string
  prescribed_for: string
  mechanism: string
  prehospital_relevance: string
  considerations: string
  red_flags: string
  category: string
}

const categories = ['All', 'Cardiac', 'Respiratory', 'Neurological', 'Pain', 'Endocrine', 'Cholesterol', 'GI', 'Infection', 'Allergy', 'Musculoskeletal', 'Urological', 'Oncology', 'Addiction']

export default function PrescriptionsPage() {
  const [meds, setMeds] = useState<Med[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<Med | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMeds() }, [search, category])

  async function fetchMeds() {
    setLoading(true)
    let query = supabase.from('prescription_meds').select('*').order('brand_name', { ascending: true })
    if (search) query = query.or(`brand_name.ilike.%${search}%,generic_name.ilike.%${search}%,drug_class.ilike.%${search}%`)
    if (category !== 'All') query = query.eq('category', category)
    const { data, error } = await query
    if (!error && data) setMeds(data)
    setLoading(false)
  }

  const categoryColors: Record<string, string> = {
    Cardiac: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
    Respiratory: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    Neurological: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    Pain: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    Endocrine: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
    Cholesterol: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
    GI: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
    Infection: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400',
    Allergy: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-400',
    Musculoskeletal: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
    Urological: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400',
    Oncology: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    Addiction: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  }

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-md mb-4">
          Brand · Generic · Prehospital relevance
        </div>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">Prescription reference</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Look up commonly prescribed medications by brand or generic name. Understand what a patient's medications tell you about their history and what to watch for on scene.
        </p>
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-300 leading-relaxed">
            <span className="font-medium">Clinical notice:</span> This reference is for educational purposes only. Always follow your local protocols and medical direction.
          </p>
        </div>
      </section>

      <div className="px-8 mb-4">
        <input
          type="text"
          placeholder="Search by brand name, generic name, or condition..."
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
        ) : meds.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No medications found for "{search}"</div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-72 shrink-0">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">{meds.length} medications</div>
              <div className="flex flex-col gap-1">
                {meds.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => setSelected(med)}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                      selected?.id === med.id
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-red-300 dark:hover:border-red-600'
                    }`}
                  >
                    <div className="font-medium">{med.brand_name}</div>
                    <div className={`text-xs mt-0.5 ${selected?.id === med.id ? 'text-red-200' : 'text-gray-500 dark:text-gray-400'}`}>
                      {med.generic_name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              {selected ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <h2 className="text-2xl font-medium text-gray-900 dark:text-white">{selected.brand_name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{selected.generic_name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{selected.drug_class}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full shrink-0 font-medium ${categoryColors[selected.category] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                      {selected.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Prescribed for</div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{selected.prescribed_for}</p>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-800" />
                    <div>
                      <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Mechanism</div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{selected.mechanism}</p>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-800" />
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-2">Prehospital relevance</div>
                      <p className="text-sm text-blue-900 dark:text-blue-300 leading-relaxed font-medium">{selected.prehospital_relevance}</p>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-800" />
                    <div>
                      <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Considerations</div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{selected.considerations}</p>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-800" />
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-widest mb-2">Red flags</div>
                      <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed font-medium">{selected.red_flags}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                      Always follow local protocols and medical direction. This reference does not replace clinical judgment.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center">
                  <div className="text-gray-300 dark:text-gray-600 text-4xl mb-3">💊</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select a medication from the list to view details</p>
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
