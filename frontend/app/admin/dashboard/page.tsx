'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import SessionTimeout from '@/components/SessionTimeout'

type Table = 'acronyms' | 'drugs' | 'mnemonics' | 'radio_codes' | 'fire_terms' | 'hazmat_terms' | 'anatomy' | 'pathology' | 'medical_terms' | 'translations' | 'prescription_meds'

const tables: { id: Table; label: string; icon: string }[] = [
  { id: 'acronyms', label: 'Acronyms', icon: '🔤' },
  { id: 'drugs', label: 'Pharmacology', icon: '💊' },
  { id: 'prescription_meds', label: 'Prescriptions', icon: '📋' },
  { id: 'mnemonics', label: 'Mnemonics', icon: '🧠' },
  { id: 'radio_codes', label: 'Radio codes', icon: '📻' },
  { id: 'fire_terms', label: 'Fire terms', icon: '🔥' },
  { id: 'hazmat_terms', label: 'Hazmat terms', icon: '☣️' },
  { id: 'anatomy', label: 'Anatomy', icon: '🫀' },
  { id: 'pathology', label: 'Pathology', icon: '🔬' },
  { id: 'medical_terms', label: 'Med terminology', icon: '📖' },
  { id: 'translations', label: 'Translations', icon: '🌐' },
]

const tableFields: Record<Table, string[]> = {
  acronyms: ['term', 'definition', 'context', 'category'],
  drugs: ['name', 'drug_class', 'mechanism', 'indications', 'contraindications', 'dosage', 'route', 'category'],
  prescription_meds: ['brand_name', 'generic_name', 'drug_class', 'prescribed_for', 'mechanism', 'prehospital_relevance', 'considerations', 'red_flags', 'category'],
  mnemonics: ['name', 'expansion', 'usage', 'category'],
  radio_codes: ['code', 'meaning', 'region', 'service'],
  fire_terms: ['term', 'definition', 'category'],
  hazmat_terms: ['term', 'definition', 'category'],
  anatomy: ['system', 'structure', 'description', 'function', 'clinical_relevance', 'ems_relevance', 'landmarks', 'category'],
  pathology: ['name', 'category', 'description', 'pathophysiology', 'signs_symptoms', 'ems_treatment', 'hospital_treatment', 'complications', 'risk_factors'],
  medical_terms: ['term', 'type', 'meaning', 'origin'],
  translations: ['english', 'spanish', 'category', 'context', 'phonetic'],
}

const primaryField: Record<Table, string> = {
  acronyms: 'term',
  drugs: 'name',
  prescription_meds: 'brand_name',
  mnemonics: 'name',
  radio_codes: 'code',
  fire_terms: 'term',
  hazmat_terms: 'term',
  anatomy: 'structure',
  pathology: 'name',
  medical_terms: 'term',
  translations: 'english',
}

const isTextArea = (field: string, value: string) =>
  value?.length > 80 ||
  ['description', 'relevance', 'treatment', 'mechanism', 'pathophysiology',
   'signs_symptoms', 'complications', 'considerations', 'expansion',
   'indications', 'contraindications', 'definition', 'function',
   'clinical_relevance', 'ems_relevance', 'risk_factors', 'prescribed_for',
   'red_flags', 'prehospital_relevance', 'landmarks'].includes(field)

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTable, setActiveTable] = useState<Table>('acronyms')
  const [records, setRecords] = useState<any[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<any | null>(null)
  const [adding, setAdding] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => { checkAuth(); fetchCounts() }, [])
  useEffect(() => { fetchRecords() }, [activeTable, search])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin')
  }

  async function fetchCounts() {
    const results: Record<string, number> = {}
    for (const t of tables) {
      const { count } = await supabase.from(t.id).select('*', { count: 'exact', head: true })
      results[t.id] = count || 0
    }
    setCounts(results)
  }

  async function fetchRecords() {
    setLoading(true)
    const primary = primaryField[activeTable]
    let query = supabase.from(activeTable).select('*').order(primary, { ascending: true }).limit(100)
    if (search) query = query.ilike(primary, `%${search}%`)
    const { data, error } = await query
    if (!error && data) setRecords(data)
    setLoading(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  function startAdd() {
    const empty: Record<string, string> = {}
    tableFields[activeTable].forEach(f => empty[f] = '')
    setFormData(empty)
    setAdding(true)
    setEditing(null)
  }

  function startEdit(record: any) {
    const data: Record<string, string> = {}
    tableFields[activeTable].forEach(f => data[f] = record[f] || '')
    setFormData(data)
    setEditing(record)
    setAdding(false)
  }

  function cancelForm() {
    setEditing(null)
    setAdding(false)
    setFormData({})
  }

  async function handleSave() {
    setSaving(true)
    let error
    if (adding) {
      const { error: e } = await supabase.from(activeTable).insert([formData])
      error = e
    } else if (editing) {
      const { error: e } = await supabase.from(activeTable).update(formData).eq('id', editing.id)
      error = e
    }
    if (!error) {
      setSuccessMsg(adding ? 'Record added' : 'Record updated')
      setTimeout(() => setSuccessMsg(''), 3000)
      cancelForm()
      fetchRecords()
      fetchCounts()
    } else {
      alert('Error: ' + error.message)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from(activeTable).delete().eq('id', id)
    if (!error) {
      setSuccessMsg('Record deleted')
      setTimeout(() => setSuccessMsg(''), 3000)
      setDeleteConfirm(null)
      fetchRecords()
      fetchCounts()
    } else {
      alert('Error: ' + error.message)
    }
  }

  const fields = tableFields[activeTable]
  const primary = primaryField[activeTable]

  const inputClass = "w-full px-3 py-2.5 text-sm border border-gray-600 rounded-lg focus:outline-none focus:border-red-400 bg-gray-700 text-white placeholder-gray-400"
  const textareaClass = "w-full px-3 py-2.5 text-sm border border-gray-600 rounded-lg focus:outline-none focus:border-red-400 bg-gray-700 text-white placeholder-gray-400 resize-none"

  return (
    <div className="min-h-screen" style={{ background: '#1a1a2e' }}>

      {/* Top nav */}
      <SessionTimeout />
      <nav style={{ background: '#16213e', borderBottom: '1px solid #2d3561' }} className="px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="text-base font-medium text-white">
          The<span className="text-red-400">Clinical</span>Ref
          <span className="text-gray-400 text-sm font-normal ml-2">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          {successMsg && (
            <span className="text-xs text-green-300 bg-green-900 border border-green-700 px-3 py-1 rounded-full">
              {successMsg}
            </span>
          )}
          <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-white transition-colors">
            View site
          </a>
          <button onClick={handleSignOut} className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      <div className="flex">

        {/* Sidebar */}
        <aside style={{ background: '#16213e', borderRight: '1px solid #2d3561' }} className="w-56 min-h-screen sticky top-14 p-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">
            Tables
          </div>
          <div className="flex flex-col gap-1">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTable(t.id); setSearch(''); cancelForm() }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  activeTable === t.id
                    ? 'bg-red-900 text-red-300'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span>{t.icon} {t.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTable === t.id ? 'bg-red-800 text-red-300' : 'bg-gray-700 text-gray-400'
                }`}>
                  {counts[t.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-medium text-white">
                {tables.find(t => t.id === activeTable)?.icon}{' '}
                {tables.find(t => t.id === activeTable)?.label}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">{counts[activeTable] || 0} records total</p>
            </div>
            <button
              onClick={startAdd}
              className="px-4 py-2 bg-red-700 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              + Add record
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder={`Search by ${primary}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 text-sm border border-gray-600 rounded-lg focus:outline-none focus:border-red-400 bg-gray-700 text-white placeholder-gray-400"
            />
          </div>

          {/* Add/Edit form */}
          {(adding || editing) && (
            <div style={{ background: '#16213e', border: '1px solid #2d3561' }} className="rounded-xl p-6 mb-6">
              <h2 className="text-sm font-medium text-white mb-4">
                {adding ? 'Add new record' : `Editing: ${editing?.[primary]}`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {fields.map((field) => (
                  <div key={field} className={isTextArea(field, formData[field]) ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-medium text-gray-400 block mb-1 capitalize">
                      {field.replace(/_/g, ' ')}
                    </label>
                    {isTextArea(field, formData[field]) ? (
                      <textarea
                        value={formData[field] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                        rows={3}
                        className={textareaClass}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-red-700 text-white text-xs font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save record'}
                </button>
                <button
                  onClick={cancelForm}
                  className="px-5 py-2 text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Records table */}
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : records.length === 0 ? (
            <div className="text-sm text-gray-500">No records found</div>
          ) : (
            <div style={{ background: '#16213e', border: '1px solid #2d3561' }} className="rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2d3561', background: '#0f3460' }}>
                      {fields.slice(0, 4).map((field) => (
                        <th key={field} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-widest capitalize">
                          {field.replace(/_/g, ' ')}
                        </th>
                      ))}
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-widest">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr
                        key={record.id}
                        style={{ borderBottom: '1px solid #1e2a4a' }}
                        className={`hover:bg-gray-800 transition-colors ${editing?.id === record.id ? 'bg-red-950' : ''}`}
                      >
                        {fields.slice(0, 4).map((field) => (
                          <td key={field} className="px-4 py-3 text-xs text-gray-300 max-w-xs">
                            <div className="truncate max-w-48">{record[field] || '—'}</div>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(record)}
                              className="text-xs px-3 py-1 bg-blue-900 text-blue-300 border border-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                            >
                              Edit
                            </button>
                            {deleteConfirm === record.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(record.id)}
                                  className="text-xs px-3 py-1 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs px-3 py-1 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(record.id)}
                                className="text-xs px-3 py-1 bg-red-900 text-red-300 border border-red-700 rounded-lg hover:bg-red-800 transition-colors"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ borderTop: '1px solid #2d3561' }} className="px-4 py-3 text-xs text-gray-500">
                Showing {records.length} of {counts[activeTable] || 0} records — use search to filter
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
