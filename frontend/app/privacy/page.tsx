import Layout from '@/components/Layout'

export default function PrivacyPage() {
  return (
    <Layout>
      <section className="px-8 pt-10 pb-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs px-3 py-1 rounded-md mb-4">
          Legal
        </div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2">Privacy policy</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Last updated: January 1, 2026 — TheClinicalRef LLC
        </p>
      </section>

      <div className="px-8 pb-16 max-w-2xl">

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Overview</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            TheClinicalRef LLC operates TheClinicalRef.com. We are committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights regarding that information.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Information we do not collect</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            TheClinicalRef does not require an account or login. We do not collect:
          </p>
          <div className="flex flex-col gap-2">
            {[
              'Your name, email address, or any personal identifying information',
              'Calculator inputs — all calculations run locally on your device',
              'Search queries entered into our reference tools',
              'Medical information or patient data of any kind',
              'Location data beyond what is necessary for general analytics',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-700 mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Information we do collect</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Like all websites, we collect standard server and analytics data including:
          </p>
          <div className="flex flex-col gap-3">
            {[
              { title: 'Usage analytics', desc: 'Pages visited, time on site, general geographic region, device type, and browser. Used to understand how the site is used and improve content.' },
              { title: 'Server logs', desc: 'IP addresses, browser type, referring pages, and access timestamps. Retained for security and operational purposes.' },
              { title: 'Cookies', desc: 'We use cookies for analytics and advertising. See the Cookies section below for details.' },
            ].map((item) => (
              <div key={item.title} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-800 mb-1">{item.title}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Advertising</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            TheClinicalRef displays advertisements to support the free operation of the site. We use Google AdSense and may use other advertising networks. These networks may use cookies and similar tracking technologies to serve relevant ads based on your browsing behavior.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Advertisers do not have access to any user data we collect. They operate under their own privacy policies. You can learn more about Google advertising practices at policies.google.com/privacy
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Cookies</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We use the following types of cookies:
          </p>
          <div className="flex flex-col gap-3">
            {[
              { title: 'Analytics cookies', desc: 'Help us understand how visitors use the site. You can opt out using browser settings or the Google Analytics opt-out tool.' },
              { title: 'Advertising cookies', desc: 'Set by our advertising partners to serve relevant ads. You can manage these through your browser settings or opt-out tools provided by ad networks.' },
              { title: 'Functional cookies', desc: 'Used to remember basic preferences such as category filters. These do not contain personal information.' },
            ].map((item) => (
              <div key={item.title} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-800 mb-1">{item.title}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            You can disable cookies in your browser settings. Note that disabling cookies may affect site functionality.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Third party services</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            We use the following third party services which have their own privacy policies:
          </p>
          <div className="flex flex-col gap-2">
            {[
              { name: 'Google AdSense', purpose: 'Display advertising', url: 'policies.google.com/privacy' },
              { name: 'Google Analytics', purpose: 'Site analytics', url: 'policies.google.com/privacy' },
              { name: 'Cloudflare', purpose: 'Content delivery and security', url: 'cloudflare.com/privacypolicy' },
              { name: 'Supabase', purpose: 'Database hosting', url: 'supabase.com/privacy' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div>
                  <div className="text-xs font-medium text-gray-800">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.purpose}</div>
                </div>
                <span className="text-xs text-gray-500 shrink-0">{item.url}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Your rights</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Depending on your location you may have rights regarding your data including:
          </p>
          <div className="flex flex-col gap-2">
            {[
              'The right to know what data we hold about you',
              'The right to request deletion of your data',
              'The right to opt out of advertising tracking',
              'The right to data portability',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-700 mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mt-3">
            Since we collect minimal personal data most of these rights have limited applicability for typical users. To exercise any of these rights contact us at the address below.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Children</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            TheClinicalRef is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information please contact us and we will delete it immediately.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">Changes to this policy</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            We may update this privacy policy from time to time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-base font-medium text-gray-900 mb-3">Contact</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            For privacy related inquiries contact us at:
          </p>
          <p className="text-sm font-medium text-gray-900">TheClinicalRef LLC</p>
          <p className="text-sm text-gray-700 mt-1">privacy@theclinicalref.com</p>
        </div>

      </div>
    </Layout>
  )
}
