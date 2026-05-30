'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Who is TheClinicalRef designed for?',
    a: 'TheClinicalRef is built for EMS professionals, paramedics, EMTs, firefighters, nurses, medical students, and anyone working in or studying emergency and clinical medicine. All tools are free to use.'
  },
  {
    q: 'Is this a substitute for my agency protocols?',
    a: 'No. TheClinicalRef is a reference and educational tool only. Always follow your local agency SOPs, medical direction, and protocols. Content here is for general reference and may not reflect your jurisdiction.'
  },
  {
    q: 'How accurate is the content?',
    a: 'Content is reviewed by experienced EMS and clinical professionals. However medicine evolves — always cross reference with your current protocols, drug guides, and medical direction. If you spot an error please contact us.'
  },
  {
    q: 'Is TheClinicalRef free?',
    a: 'Yes — all reference tools are completely free to use. The site is supported by display advertising. We will never put essential clinical reference content behind a paywall.'
  },
  {
    q: 'Can I use TheClinicalRef on my phone on scene?',
    a: 'Absolutely — the site is designed mobile-first for on-scene use. All calculators run locally on your device with no data sent to any server. No login required.'
  },
  {
    q: 'How do I report an error or suggest content?',
    a: 'Use the Contact link in the footer to reach our team. We welcome corrections, suggestions, and content requests from clinicians and first responders.'
  },
  {
    q: 'Who operates TheClinicalRef?',
    a: 'TheClinicalRef is operated by TheClinicalRef LLC, founded by an EMS professional with a background in paramedicine and emergency services. Content is built and reviewed by practitioners in the field.'
  },
  {
    q: 'Do you store my data?',
    a: 'No personal data is collected or stored. All calculator inputs stay on your device. We use standard analytics to understand site traffic but no personally identifiable information is collected.'
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="px-4 sm:px-8 pb-16">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
        Frequently asked questions
      </div>
      <div className="flex flex-col gap-2 max-w-3xl">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-gray-900 border rounded-xl overflow-hidden transition-colors ${
              open === i
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">{faq.q}</span>
              <div className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                open === i
                  ? 'bg-red-700 border-red-700 text-white rotate-45'
                  : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
              }`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </button>
            {open === i && (
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-4">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
