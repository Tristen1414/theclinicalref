import Layout from '@/components/Layout'

export default function AboutPage() {
  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs px-3 py-1 rounded-md mb-4">
          About us
        </div>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-2">About TheClinicalRef</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Built by first responders, for first responders.
        </p>
      </section>

      <div className="px-8 pb-16 max-w-2xl">

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-3">Our mission</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            TheClinicalRef exists because the tools first responders and medical professionals need on scene should be fast, accurate, and free. Whether you are a paramedic on a 2am call, a nursing student studying for boards, or a firefighter looking up a radio code, you should not have to dig through a textbook or wait for a slow website to load.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            We built TheClinicalRef to be the reference platform we wished existed — comprehensive enough to be genuinely useful, simple enough to use under pressure, and mobile-first because that is where real work happens.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-3">Who we are</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            TheClinicalRef is operated by TheClinicalRef LLC, founded by an EMS professional with a background in paramedicine, emergency services, and military service. Content is built and continuously reviewed by practitioners with real field experience.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            We are not a pharmaceutical company, hospital system, or academic institution. We are clinicians and first responders who understand what information matters on scene and how it needs to be presented to be actually useful.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-3">What we cover</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Acronyms and abbreviations', desc: 'EMS, clinical, fire, and hospital terminology' },
              { title: 'Med math calculators', desc: 'Drip rates, dosing, GCS, APGAR, MAP and more' },
              { title: 'Pharmacology', desc: 'Prehospital drug reference with indications and contraindications' },
              { title: 'Prescription reference', desc: 'Brand to generic lookup with prehospital relevance' },
              { title: 'Anatomy and body systems', desc: 'Body system reference for clinical and EMS use' },
              { title: 'Diseases and pathology', desc: 'Condition reference with EMS treatment focus' },
              { title: 'Medical terminology', desc: 'Prefix, root, and suffix breakdown' },
              { title: 'Radio and dispatch', desc: '10-codes, signal codes, hospital patching' },
              { title: 'Fire terminology', desc: 'ICS, structural, and wildland firefighting terms' },
              { title: 'Hazmat and CBRN', desc: 'ERG data, PPE levels, decon, agent recognition' },
              { title: 'Protocol mnemonics', desc: 'SAMPLE, DCAP-BTLS, AEIOU-TIPS and more' },
              { title: 'Language translation', desc: 'Medical terms for patient communication' },
            ].map((item) => (
              <div key={item.title} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">{item.title}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-red-800 dark:text-red-300 mb-3">Important disclaimer</h2>
          <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed mb-3">
            TheClinicalRef is a reference and educational tool only. Content here does not replace your agency protocols, medical direction, or clinical judgment. Medicine evolves and local protocols vary — always follow your jurisdiction specific SOPs and the guidance of your medical director.
          </p>
          <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed">
            If you identify an error or outdated information please contact us immediately. Patient safety is our highest priority.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-3">How we are funded</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            TheClinicalRef is free to use and supported entirely by display advertising. We will never put essential clinical reference content behind a paywall. Advertisers have no influence over our content — what you read here is written and reviewed by clinicians, not marketers.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            We may also pursue affiliate partnerships with relevant medical education, equipment, and certification preparation resources in the future. Any such relationships will be clearly disclosed.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-3">Contact us</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We welcome feedback, corrections, content suggestions, and partnership inquiries.
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">General inquiries: </span>
              info@theclinicalref.com
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Content corrections: </span>
              corrections@theclinicalref.com
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Partnerships: </span>
              partnerships@theclinicalref.com
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 dark:text-white mb-3">Also from our team</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">PrehospitalPrep</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
              AI-powered NREMT exam preparation platform for EMT and paramedic students. Practice quizzes, flashcards, patient scenarios, and study guides built specifically for prehospital certification.
            </p>
            <p className="text-xs text-red-700 dark:text-red-400 font-medium">
              Visit us at prehospitalprep.com
            </p>
          </div>
        </div>

      </div>
    </Layout>
  )
}
