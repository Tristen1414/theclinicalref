'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/lib/supabase'

interface Translation {
  id: string
  english: string
  spanish: string
  category: string
  context: string
  phonetic: string
  tags: string[]
}

const categories = ['All', 'Introduction', 'Assessment', 'History', 'Instructions', 'Body Parts', 'Symptoms', 'Pain Scale', 'Cardiac', 'Respiratory', 'Trauma', 'Stroke', 'Diabetic', 'Pediatric', 'Mental Health', 'Consent']

const languages = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'ht', name: 'Haitian Creole', flag: '🇭🇹' },
]

async function translate(text: string, from: string, to: string): Promise<string> {
  const fromCode = from === 'zh' ? 'zh-CN' : from
  const toCode = to === 'zh' ? 'zh-CN' : to
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromCode}|${toCode}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Translation failed')
  const data = await res.json()
  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText
  }
  throw new Error('No translation returned')
}

export default function TranslationPage() {
  const [phrases, setPhrases] = useState<Translation[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [translateText, setTranslateText] = useState('')
  const [selectedLang, setSelectedLang] = useState('es')
  const [direction, setDirection] = useState<'to' | 'from'>('to')
  const [translated, setTranslated] = useState('')
  const [translating, setTranslating] = useState(false)
  const [translateError, setTranslateError] = useState('')
  const [activeTab, setActiveTab] = useState<'translator' | 'phrases'>('translator')
  const [copied, setCopied] = useState(false)

  useEffect(() => { fetchPhrases() }, [search, category])

  async function fetchPhrases() {
    setLoading(true)
    let query = supabase.from('translations').select('*').order('category', { ascending: true })
    if (search) query = query.or(`english.ilike.%${search}%,spanish.ilike.%${search}%,context.ilike.%${search}%`)
    if (category !== 'All') query = query.eq('category', category)
    const { data, error } = await query
    if (!error && data) setPhrases(data)
    setLoading(false)
  }

  async function handleTranslate() {
    if (!translateText.trim()) return
    setTranslating(true)
    setTranslateError('')
    setTranslated('')
    try {
      const from = direction === 'to' ? 'en' : selectedLang
      const to = direction === 'to' ? selectedLang : 'en'
      const result = await translate(translateText, from, to)
      setTranslated(result)
    } catch {
      setTranslateError('Translation temporarily unavailable. Please try again or use the phrase library.')
    }
    setTranslating(false)
  }

  function swapDirection() {
    setDirection(d => d === 'to' ? 'from' : 'to')
    setTranslateText(translated)
    setTranslated('')
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeLang = languages.find(l => l.code === selectedLang)
  const fromLabel = direction === 'to' ? '🇺🇸 English' : `${activeLang?.flag} ${activeLang?.name}`
  const toLabel = direction === 'to' ? `${activeLang?.flag} ${activeLang?.name}` : '🇺🇸 English'
  const placeholder = direction === 'to' ? 'Type medical phrase in English...' : `Type in ${activeLang?.name}...`

  const categoryColors: Record<string, string> = {
    Introduction: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    Assessment: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
    History: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    Instructions: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    'Body Parts': 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
    Symptoms: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
    'Pain Scale': 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-400',
    Cardiac: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
    Respiratory: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    Trauma: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    Stroke: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    Diabetic: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
    Pediatric: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-400',
    'Mental Health': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
    Consent: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  }

  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-md mb-4">
          18 languages · Bidirectional · Medical phrases
        </div>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">Language translation</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Bidirectional live translation in 18 languages. Includes a curated Spanish medical phrase library with phonetic pronunciation.
        </p>
      </section>

      {/* Tab switcher */}
      <div className="px-8 mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('translator')}
          className={`px-4 py-2 text-xs rounded-lg border font-medium transition-colors ${
            activeTab === 'translator'
              ? 'bg-red-700 text-white border-red-700'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
          }`}
        >
          Live translator
        </button>
        <button
          onClick={() => setActiveTab('phrases')}
          className={`px-4 py-2 text-xs rounded-lg border font-medium transition-colors ${
            activeTab === 'phrases'
              ? 'bg-red-700 text-white border-red-700'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
          }`}
        >
          Spanish phrase library
        </button>
      </div>

      {/* Live translator */}
      {activeTab === 'translator' && (
        <div className="px-8 pb-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Live medical translator</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Powered by MyMemory — free translation in 18 languages. Works in both directions.
            </p>

            {/* Language selector */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">Select language</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLang(lang.code); setTranslated('') }}
                    className={`px-2 py-2 text-xs rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                      selectedLang === lang.code
                        ? 'bg-red-700 text-white border-red-700'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-xs leading-tight text-center">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direction indicator */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex-1 text-center">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">From</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{fromLabel}</div>
              </div>
              <button
                onClick={swapDirection}
                className="px-3 py-2 bg-red-700 text-white rounded-lg text-xs font-medium hover:bg-red-800 transition-colors shrink-0"
              >
                Swap
              </button>
              <div className="flex-1 text-center">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">To</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{toLabel}</div>
              </div>
            </div>

            {/* Input */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">{fromLabel}</label>
              <textarea
                value={translateText}
                onChange={(e) => setTranslateText(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-red-300 dark:focus:border-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleTranslate() }}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Press Ctrl+Enter to translate</p>
            </div>

            <button
              onClick={handleTranslate}
              disabled={translating || !translateText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {translating ? 'Translating...' : `Translate to ${toLabel}`}
            </button>

            {translateError && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">{translateError}</p>
              </div>
            )}

            {translated && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-widest mb-1">
                      {toLabel}
                    </div>
                    <p className="text-lg font-medium text-green-900 dark:text-green-300 leading-relaxed">{translated}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(translated)}
                      className="text-xs px-3 py-1.5 bg-green-700 text-white rounded-lg hover:bg-green-800"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={swapDirection}
                      className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      Reverse
                    </button>
                  </div>
                </div>
                <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                  Always verify critical medical translations with a qualified interpreter when possible.
                </p>
              </div>
            )}
          </div>

          {/* Quick phrases */}
          {direction === 'to' && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Quick tap phrases</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Tap any phrase to load it into the translator</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Where does it hurt?',
                  'Can you hear me?',
                  'Do not move',
                  'I am here to help you',
                  'Are you having chest pain?',
                  'Are you having trouble breathing?',
                  'What is your name?',
                  'Do you have any allergies?',
                  'Do you take any medications?',
                  'Are you pregnant?',
                  'When did this start?',
                  'How bad is the pain on a scale of 1 to 10?',
                  'We need to take you to the hospital',
                  'Please stay calm',
                  'Can you squeeze my hand?',
                  'Open your eyes',
                  'Do you have diabetes?',
                  'Have you taken your medications today?',
                  'Is there someone we can call?',
                  'You are safe',
                ].map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => { setTranslateText(phrase); setTranslated('') }}
                    className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          )}

          {direction === 'from' && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Patient is communicating with you</h3>
              <p className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed">
                You are in reverse mode — type what the patient is saying in {activeLang?.name} and it will be translated to English.
              </p>
            </div>
          )}

          <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Advertisement
          </div>
        </div>
      )}

      {/* Spanish phrase library */}
      {activeTab === 'phrases' && (
        <>
          <div className="px-8 mb-4">
            <input
              type="text"
              placeholder="Search English or Spanish phrases..."
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
            ) : phrases.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">No phrases found for "{search}"</div>
            ) : (
              <>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">{phrases.length} phrases</div>
                {(category === 'All' ? [...new Set(phrases.map(p => p.category))] : [category]).map((cat) => {
                  const group = phrases.filter(p => p.category === cat)
                  if (group.length === 0) return null
                  return (
                    <div key={cat} className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat}</h2>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                        <span className="text-xs text-gray-400 dark:text-gray-500">{group.length} phrases</span>
                      </div>
                      <div className="flex flex-col gap-3">
                        {group.map((phrase) => (
                          <div key={phrase.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-red-200 dark:hover:border-red-800 transition-colors">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">English</span>
                                  {phrase.category && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[phrase.category] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                      {phrase.category}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{phrase.english}</p>
                              </div>
                              <button
                                onClick={() => { setTranslateText(phrase.english); setActiveTab('translator'); setTranslated('') }}
                                className="text-xs px-2 py-1 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 shrink-0"
                              >
                                Translate
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">🇪🇸 Spanish</div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{phrase.spanish}</p>
                                <button onClick={() => copyToClipboard(phrase.spanish)} className="text-xs text-red-700 dark:text-red-400 mt-1 hover:underline">
                                  Copy
                                </button>
                              </div>
                              {phrase.phonetic && (
                                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-100 dark:border-blue-800">
                                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Phonetic pronunciation</div>
                                  <p className="text-sm text-blue-900 dark:text-blue-300 font-medium italic">{phrase.phonetic}</p>
                                </div>
                              )}
                            </div>
                            {phrase.context && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Context: {phrase.context}</p>
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
        </>
      )}
    </Layout>
  )
}
