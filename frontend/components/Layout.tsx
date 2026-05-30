import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <Link href="/" className="text-lg font-medium tracking-tight text-gray-900 dark:text-white shrink-0">
          The<span className="text-red-700 dark:text-red-400">Clinical</span>Ref
        </Link>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600 dark:text-gray-300 justify-end">
          <Link href="/acronyms" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Acronyms</Link>
          <Link href="/medmath" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Med math</Link>
          <Link href="/pharmacology" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Pharmacology</Link>
          <Link href="/prescriptions" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Prescriptions</Link>
          <Link href="/anatomy" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Anatomy</Link>
          <Link href="/pathology" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Pathology</Link>
          <Link href="/terminology" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Terminology</Link>
          <Link href="/radio" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Radio</Link>
          <Link href="/fire" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Fire</Link>
          <Link href="/hazmat" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Hazmat</Link>
          <Link href="/mnemonics" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Mnemonics</Link>
          <Link href="/translation" className="hover:text-red-700 dark:hover:text-red-400 transition-colors">Translation</Link>
        </div>
      </nav>

      {/* Disclaimer banner */}
      <div className="bg-yellow-50 dark:bg-yellow-950 border-b border-yellow-200 dark:border-yellow-800 px-6 py-2 text-center">
        <p className="text-xs text-yellow-800 dark:text-yellow-300">
          <span className="font-medium">Clinical notice:</span> TheClinicalRef is a reference and educational tool only. Always follow your local protocols and medical direction. Not a substitute for clinical judgment.
        </p>
      </div>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <div className="text-base font-medium text-gray-900 dark:text-white mb-1">
              The<span className="text-red-700 dark:text-red-400">Clinical</span>Ref
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
              Free medical and emergency services reference for first responders and clinical professionals.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              2026 TheClinicalRef LLC — TheClinicalRef.com
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              For reference and educational use only. Always follow local protocols and medical direction.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">Tools</div>
              <div className="flex flex-col gap-1.5">
                <Link href="/acronyms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Acronyms</Link>
                <Link href="/medmath" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Med math</Link>
                <Link href="/pharmacology" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Pharmacology</Link>
                <Link href="/prescriptions" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Prescriptions</Link>
                <Link href="/anatomy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Anatomy</Link>
                <Link href="/pathology" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Pathology</Link>
                <Link href="/terminology" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Terminology</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-widest">More</div>
              <div className="flex flex-col gap-1.5">
                <Link href="/radio" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Radio & dispatch</Link>
                <Link href="/fire" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Fire terminology</Link>
                <Link href="/hazmat" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Hazmat & CBRN</Link>
                <Link href="/mnemonics" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Mnemonics</Link>
                <Link href="/translation" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Translation</Link>
                <Link href="/about" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">About</Link>
                <Link href="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-700 dark:hover:text-red-400">Privacy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
