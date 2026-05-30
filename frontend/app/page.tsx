import Link from 'next/link'
import Layout from '@/components/Layout'
import FAQ from '@/components/FAQ'
import HeroSearch from '@/components/HeroSearch'

const tools = [
  { href: '/acronyms', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80', title: 'Acronyms & abbreviations', desc: 'EMS, clinical, fire, and hospital terminology lookup with context and usage examples.' },
  { href: '/medmath', img: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&q=80', title: 'Med math', desc: 'Drip rates, weight-based dosing, unit conversions, GCS, APGAR, and more.' },
  { href: '/pharmacology', img: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=600&q=80', title: 'Pharmacology', desc: 'Drug classes, mechanisms of action, prehospital indications and contraindications.' },
  { href: '/prescriptions', img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80', title: 'Prescription reference', desc: 'Brand to generic lookup — understand what your patients medications mean on scene.' },
  { href: '/pathology', img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80', title: 'Diseases & pathology', desc: 'Condition reference covering pathophysiology, signs, symptoms, EMS and hospital treatment.' },
  { href: '/anatomy', img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80', title: 'Anatomy & body systems', desc: 'Interactive body map with clickable organs, skeletal, circulatory, and muscular layers.' },
  { href: '/terminology', img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80', title: 'Medical terminology', desc: 'Prefix, root, and suffix breakdown for medical terms — build your vocabulary.' },
  { href: '/radio', img: 'https://images.unsplash.com/photo-1599493758267-c6c884c7071f?w=600&q=80', title: 'Radio & dispatch', desc: '10-codes, signal codes, hospital patching protocols, and dispatch terminology.' },
  { href: '/fire', img: 'https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=600&q=80', title: 'Fire terminology', desc: 'ICS structure, structural and wildland terms, suppression tactics and operations.' },
  { href: '/hazmat', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80', title: 'Hazmat & CBRN', desc: 'ERG data, SDS lookup, isolation distances, decon procedures, and agent identification.' },
  { href: '/mnemonics', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80', title: 'Protocol mnemonics', desc: 'SAMPLE, DCAP-BTLS, AEIOU-TIPS, and all major assessment mnemonics explained.' },
  { href: '/translation', img: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&q=80', title: 'Language translation', desc: 'Live translation in 18 languages with curated Spanish phrase library and phonetics.' },
]

export default function Home() {
  return (
    <Layout>

      {/* Hero */}
      <section className="px-8 pt-14 pb-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-md mb-5">
          For EMS, fire, and clinical professionals
        </div>
        <h1 className="text-4xl font-medium leading-tight tracking-tight mb-4 text-gray-900 dark:text-white">
          The reference tool built for{' '}
          <span className="text-red-700 dark:text-red-400">first responders</span>{' '}
          and medical professionals
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-xl mb-7">
          Fast, mobile-ready lookups for medical acronyms, drug references, med math,
          hazmat/CBRN, radio terminology, and more — all in one place. Free forever.
        </p>
        <HeroSearch />
      </section>

      {/* Stats */}
      <div className="flex flex-wrap gap-8 px-8 py-6 border-t border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {[
          { num: '10,000+', label: 'Medical acronyms' },
          { num: '12', label: 'Reference categories' },
          { num: '100%', label: 'Free to use' },
          { num: 'Mobile', label: 'On-scene ready' },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-xl font-medium text-red-700 dark:text-red-400">{s.num}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ad banner */}
      <div className="mx-8 my-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>

      {/* Tools grid */}
      <section className="px-4 sm:px-8 pb-12">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
          Reference tools
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-red-300 dark:hover:border-red-700 transition-colors"
            >
              <img src={tool.img} alt={tool.title} className="w-full h-40 object-cover" />
              <div className="p-5">
                <h3 className="text-sm font-medium mb-1 text-gray-900 dark:text-white">{tool.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{tool.desc}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs text-red-700 dark:text-red-400 font-medium">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad banner */}
      <div className="mx-8 mb-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>

      {/* FAQ */}
      <FAQ />

      {/* Ad banner */}
      <div className="mx-8 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Advertisement
      </div>

    </Layout>
  )
}
