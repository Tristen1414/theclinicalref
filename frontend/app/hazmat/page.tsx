'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface HazmatTerm {
  id: string
  term: string
  definition: string
  category: string
  tags: string[]
}

const categories = ['All', 'General', 'Hazard Classes', 'Response Zones', 'PPE Levels', 'Decontamination', 'Detection', 'CBRN', 'Exposure Limits', 'Spill Response']

export default function HazmatPage() {
  const [terms, setTerms] = useState<HazmatTerm[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTerms()
  }, [search, category])

  async function fetchTerms() {
    setLoading(true)
    let query = supabase
      .from('hazmat_terms')
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
    'General': 'bg-gray-100 text-gray-700',
    'Hazard Classes': 'bg-orange-50 text-orange-700',
    'Response Zones': 'bg-red-50 text-red-700',
    'PPE Levels': 'bg-blue-50 text-blue-700',
    'Decontamination': 'bg-green-50 text-green-700',
    'Detection': 'bg-purple-50 text-purple-700',
    'CBRN': 'bg-red-100 text-red-800',
    'Exposure Limits': 'bg-yellow-50 text-yellow-700',
    'Spill Response': 'bg-teal-50 text-teal-700',
  }

  const groupOrder = [
    'General',
    'Hazard Classes',
    'Response Zones',
    'PPE Levels',
    'Decontamination',
    'Detection',
    'CBRN',
    'Exposure Limits',
    'Spill Response',
  ]

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-md mb-4">
          Hazmat · CBRN · Decon · Detection
        </div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Hazmat & CBRN</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Hazardous materials reference including ERG data, CBRN agents, PPE levels, decontamination procedures, and spill response tactics.
        </p>

        {/* Warning */}
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800 leading-relaxed">
            <span className="font-medium">Safety notice:</span> This reference is for educational and general guidance purposes only. Always follow your agency SOPs, consult the ERG, and contact CHEMTREC (1-800-424-9300) for emergency chemical guidance. Never enter a hazmat scene without proper training and PPE.
          </p>
        </div>
      </section>

      {/* Quick reference cards */}
      <div className="px-8 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'CHEMTREC', value: '1-800-424-9300', sub: '24hr emergency hotline', color: 'bg-red-50 border-red-200' },
            { label: 'NRC', value: '1-800-424-8802', sub: 'National Response Center', color: 'bg-orange-50 border-orange-200' },
            { label: 'Poison Control', value: '1-800-222-1222', sub: 'US Poison Control', color: 'bg-yellow-50 border-yellow-200' },
            { label: 'ERG Guide', value: 'DOT 2024', sub: 'Emergency Response Guidebook', color: 'bg-blue-50 border-blue-200' },
          ].map((card) => (
            <div key={card.label} className={`p-3 rounded-lg border ${card.color}`}>
              <div className="text-xs font-medium text-gray-600 mb-1">{card.label}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{card.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{card.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-8 mb-4">
        <input
          type="text"
          placeholder="Search hazmat terms, agents, procedures..."
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

            {(category === 'All' ? groupOrder : [category]).map((cat) => {
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

      {/* PPE Level quick reference */}
      <div className="px-8 mb-12">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-100">
            PPE levels — quick reference
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { level: 'Level A', color: 'bg-red-50 border-red-200 text-red-700', desc: 'Fully encapsulating vapor tight suit + SCBA', use: 'Unknown hazard or highest vapor/gas threat' },
              { level: 'Level B', color: 'bg-orange-50 border-orange-200 text-orange-700', desc: 'Non-encapsulating splash suit + SCBA', use: 'Liquid splash hazard without vapor threat' },
              { level: 'Level C', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', desc: 'Splash suit + air purifying respirator', use: 'Known contaminant at safe concentration' },
              { level: 'Level D', color: 'bg-green-50 border-green-200 text-green-700', desc: 'Standard work uniform — no respiratory protection', use: 'No significant hazard present' },
            ].map((item) => (
              <div key={item.level} className={`p-4 rounded-lg border ${item.color}`}>
                <div className="font-medium text-sm mb-1">{item.level}</div>
                <div className="text-xs font-medium mb-1">{item.desc}</div>
                <div className="text-xs opacity-75">{item.use}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CBRN agent quick reference */}
      <div className="px-8 mb-12">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4 pb-3 border-b border-gray-100">
            CBRN agent recognition — quick reference
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { type: 'Nerve agents', signs: 'SLUDGE — salivation, lacrimation, urination, defecation, GI distress, emesis. Miosis, seizures', tx: 'Atropine + Pralidoxime (DuoDote), remove from exposure' },
              { type: 'Blister agents', signs: 'Skin blistering, eye irritation, respiratory damage. Mustard has delayed 2-24hr onset', tx: 'Remove clothing, flush skin and eyes, supportive care' },
              { type: 'Blood agents', signs: 'Rapid onset — headache, seizure, cardiovascular collapse. Bitter almond odor (cyanide)', tx: 'Hydroxocobalamin (Cyanokit), remove from exposure, 100% O2' },
              { type: 'Choking agents', signs: 'Pulmonary edema, respiratory distress. Phosgene has delayed 24hr onset. Chlorine bleach odor', tx: 'Remove from exposure, 100% O2, supportive care, avoid exertion' },
              { type: 'Biological agents', signs: 'Flu-like illness, fever, respiratory symptoms — delayed onset hours to days', tx: 'Antibiotics for bacterial agents, supportive care, isolation' },
              { type: 'Radiation', signs: 'Nausea, vomiting, hair loss, ARS — dose and time dependent', tx: 'Remove from exposure, decon, potassium iodide for radioactive iodine' },
            ].map((item) => (
              <div key={item.type} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-red-700 mb-1">{item.type}</div>
                <div className="text-xs text-gray-700 mb-2"><span className="font-medium">Signs:</span> {item.signs}</div>
                <div className="text-xs text-gray-700"><span className="font-medium">Treatment:</span> {item.tx}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>
    </Layout>
  )
}
