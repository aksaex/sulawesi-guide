import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Ganti dengan domain Vercel kamu yang asli
const BASE_URL = 'https://sulawesi-guide.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Ambil semua data wisata untuk dibuatkan linknya
  const listings = await prisma.listing.findMany({
    select: { slug: true, updatedAt: true }
  })

  // 2. Buat URL untuk setiap wisata
  const listingUrls = listings.map((listing) => ({
    url: `${BASE_URL}/listing/${listing.slug}`,
    lastModified: listing.updatedAt,
  }))

  // 3. Gabungkan dengan halaman statis (Home, Add, Login)
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/add`,
      lastModified: new Date(),
    },
    ...listingUrls,
  ]
}