'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface RadioCode {
  id: string
  code: string
  meaning: string
  region: string
  service: string
}

const services = ['All', 'EMS', 'Fire', 'Police', 'Dispatch']

export default function RadioPage() {
  const [codes, setCodes] = useState<RadioCode[]>([])
  const [search, setSearch] = useState('')
  const [service, setService] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCodes()
  }, [search, service])

  async function fetchCodes() {
    setLoading(true)
    let query = supabase
      .from('radio_codes')
      .select('*')
      .order('service', { ascending: true })

    if (search) {
      query = query.or(`code.ilike.%${search}%,meaning.ilike.%${search}%`)
    }

    if (service !== 'All') {
      query = query.eq('service', service)
    }

    const { data, error } = await query
    if (!error && data) setCodes(data)
    setLoading(false)
  }

  const serviceColors: Record<string, string> = {
    EMS: 'bg-blue-50 text-blue-700',
    Fire: 'bg-red-50 text-red-700',
    Police: 'bg-gray-100 text-gray-700',
    Dispatch: 'bg-yellow-50 text-yellow-700',
  }

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-md mb-4">
          EMS · Fire · Police · Dispatch
        </div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Radio & dispatch</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          10-codes, signal codes, response codes, and hospital patching terminology for EMS, fire, and law enforcement.
        </p>

        {/* Jurisdiction disclaimer */}
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-xs text-yellow-800 leading-relaxed">
            <span className="font-medium">Jurisdiction notice:</span> Radio codes vary significantly by region and agency. Codes listed here represent common national standards and may differ from your local SOPs and policies. Always follow your agency's specific protocols and communication standards.
          </p>
        </div>
      </section>

      {/* Search */}
      <div className="px-8 mb-4">
        <input
          type="text"
          placeholder="Search codes or meanings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 dark:text-white"
        />
      </div>

      {/* Service filters */}
      <div className="px-8 mb-6 flex gap-2 flex-wrap">
        {services.map((s) => (
          <button
            key={s}
            onClick={() => setService(s)}
            className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
              service === s
                ? 'bg-red-700 text-white border-red-700'
                : 'bg-white text-gray-600 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
            }`}
          >
            {s}
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
        ) : codes.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">No codes found for "{search}"</div>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-4">{codes.length} codes</div>

            {['EMS', 'Fire', 'Police', 'Dispatch'].map((svc) => {
              const group = codes.filter((c) => c.service === svc)
              if (group.length === 0) return null
              return (
                <div key={svc} className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-medium text-gray-700">{svc}</h2>
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-xs text-gray-400">{group.length} codes</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.map((c) => (
                      <div
                        key={c.id}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-red-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className="text-base font-medium text-red-700">{c.code}</span>
                          <div className="flex gap-1.5 shrink-0">
                            {c.service && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${serviceColors[c.service] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                {c.service}
                              </span>
                            )}
                            {c.region && (
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                {c.region}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{c.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Hospital patching quick reference */}
      <div className="px-8 mb-12">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-1 pb-3 border-b border-gray-100">
            Hospital patching — quick reference
          </h2>
          <p className="text-xs text-gray-500 mb-4">Follow your local medical direction and hospital contact protocols.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Medical command contact', value: 'Identify unit, location, patient count, chief complaint' },
              { label: 'Standard patch format', value: 'Unit ID → Patient age/sex → Chief complaint → Vitals → Treatment → ETA' },
              { label: 'Trauma activation', value: 'Mechanism, injuries, vitals, GCS, ETA' },
              { label: 'STEMI alert', value: 'Transmit 12-lead, notify cath lab, confirm ETA and patient stability' },
              { label: 'Stroke alert', value: 'Last known well time, FAST findings, blood glucose, BP, ETA' },
              { label: 'OB emergency', value: 'Gestational age, contractions, crowning status, fetal heart tones if available' },
              { label: 'Pediatric alert', value: 'Age, weight estimate, Broselow color, chief complaint, interventions' },
              { label: 'Termination of resuscitation', value: 'Contact medical command, report downtime, interventions, rhythm, request order' },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-red-700 mb-1">{item.label}</div>
                <p className="text-xs text-gray-700 leading-relaxed">{item.value}</p>
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
