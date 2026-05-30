import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServiceWorker from '@/components/ServiceWorker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'TheClinicalRef — Medical Reference for First Responders',
    template: '%s | TheClinicalRef'
  },
  description: 'Free medical reference for EMS, paramedics, firefighters, and healthcare professionals. Acronyms, med math, pharmacology, hazmat, anatomy, and more.',
  keywords: ['EMS reference', 'paramedic reference', 'medical acronyms', 'med math calculator', 'prehospital reference', 'firefighter terminology', 'hazmat reference', 'CBRN', 'EMT study guide', 'clinical reference'],
  authors: [{ name: 'TheClinicalRef LLC' }],
  creator: 'TheClinicalRef LLC',
  publisher: 'TheClinicalRef LLC',
  metadataBase: new URL('https://theclinicalref.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://theclinicalref.com',
    siteName: 'TheClinicalRef',
    title: 'TheClinicalRef — Medical Reference for First Responders',
    description: 'Free medical reference for EMS, paramedics, firefighters, and healthcare professionals.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TheClinicalRef — Medical Reference for First Responders',
    description: 'Free medical reference for EMS, paramedics, firefighters, and healthcare professionals.',
    creator: '@theclinicalref',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#A32D2D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ClinicalRef" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="TheClinicalRef" />
      </head>
      <body className={inter.className}>
        <ServiceWorker />
        {children}
      </body>
    </html>
  )
}
