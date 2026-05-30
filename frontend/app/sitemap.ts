import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://theclinicalref.com'
  const pages = [
    '',
    '/acronyms',
    '/medmath',
    '/pharmacology',
    '/prescriptions',
    '/anatomy',
    '/pathology',
    '/terminology',
    '/radio',
    '/fire',
    '/hazmat',
    '/mnemonics',
    '/translation',
    '/about',
    '/privacy',
  ]

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'weekly' : 'monthly',
    priority: page === '' ? 1.0 : 0.8,
  }))
}
