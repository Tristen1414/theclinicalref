import Link from 'next/link'
import Layout from '@/components/Layout'

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="text-6xl font-medium text-red-700 dark:text-red-400 mb-4">404</div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Page not found</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed mb-8">
          The page you are looking for does not exist or may have moved. Use the navigation above or return to the home page.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </Layout>
  )
}
