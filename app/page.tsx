import Link from "next/link"
import { Button } from "@/components/ui/button"
import MapWrapper from "../components/map/MapWrapper"
import { prisma } from "@/lib/prisma"
import ListingCard from "../components/ListingCard"
// Pastikan import LandPlot huruf P besar
import { MapPin, Search, Mountain, Coffee, LandPlot, XCircle } from "lucide-react"

// Definisi Tipe untuk URL Parameters (Next.js 15)
interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  // 1. TANGKAP URL PARAMETER
  // Contoh URL: localhost:3000/?cat=alam&search=pantai
  const filters = await searchParams
  const categorySlug = typeof filters.cat === 'string' ? filters.cat : undefined
  const searchQuery = typeof filters.search === 'string' ? filters.search : undefined

  // 2. QUERY DATABASE DENGAN FILTER
  const listings = await prisma.listing.findMany({
    where: {
      status: "APPROVED", // PENTING: Hanya tampilkan yang sudah di-approve Admin
      
      // Logika Filter Kategori (Relasi ke tabel Category)
      category: categorySlug ? { slug: categorySlug } : undefined,
      
      // Logika Pencarian Judul (Case Insensitive)
      title: searchQuery ? { contains: searchQuery, mode: 'insensitive' } : undefined
    },
    orderBy: { createdAt: 'desc' }, // Data terbaru di atas
    select: {
      id: true, 
      title: true, 
      description: true, 
      address: true, 
      slug: true,
      latitude: true, 
      longitude: true,
      // Ambil 1 gambar untuk cover card
      images: {
        select: { url: true },
        take: 1 
      },
      // PENTING: Ambil data rating review agar bintang muncul di halaman depan
      reviews: {
        select: { rating: true }
      }
    }
  })

  // 3. HELPER UNTUK STYLE TOMBOL FILTER
  const getButtonClass = (isActive: boolean) => 
    `rounded-full h-8 text-xs px-4 border shadow-sm transition-all flex items-center gap-1 ${
      isActive 
      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
      : "bg-white text-slate-600 border-gray-200 hover:bg-gray-50 hover:border-blue-300"
    }`

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-slate-900 selection:bg-blue-100">
      
      {/* --- 1. NAVBAR (FIXED) --- */}
      <nav className="fixed top-0 left-0 right-0 z-[999] bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <MapPin size={18} />
          </div>
          <div className="font-bold text-lg tracking-tight text-slate-800">
            Celebes<span className="text-blue-600">Explore</span>
          </div>
        </Link>
        <Link href="/add">
           <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-9 px-4 rounded-lg font-medium text-xs shadow-sm">
             + Add List
           </Button>
        </Link>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="pt-24 pb-6 px-4 text-center bg-white border-b border-gray-200">
        <div className="max-w-xl mx-auto space-y-3">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900">
           Every corner of Sulawesi <br />
          <span className="text-blue-600">holds a story</span>
          </h1>
 
          {/* SEARCH BAR (FORM HTML NATIVE) */}
          <form action="/" method="GET" className="relative max-w-sm mx-auto mt-4">
             {/* Input Hidden: Agar saat search, kategori yang dipilih tidak hilang */}
             {categorySlug && <input type="hidden" name="cat" value={categorySlug} />}
             
             <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="text-slate-400 w-4 h-4" />
             </div>
             <input 
                type="text" 
                name="search"
                defaultValue={searchQuery} // Isi otomatis jika user sudah mencari
                placeholder="Where do you want to go today?" 
                className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-sm"
             />
          </form>
        </div>
      </section>

      {/* --- 3. MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* KOLOM PETA */}
          {/* Mobile: Order 1 (Muncul Paling Atas). Desktop: Order 2 (Sebelah Kanan) */}
          <div className="lg:col-span-2 order-1 lg:order-2 w-full">
             <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100 relative z-0">
                <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full rounded-lg overflow-hidden relative z-0">
                    <MapWrapper markers={listings} />
                </div>
                <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 border border-gray-200 shadow-sm flex items-center gap-1">
                  <MapPin size={12} className="text-blue-600"/> Map View
                </div>
             </div>
          </div>

          {/* KOLOM LISTING & FILTER */}
          {/* Mobile: Order 2 (Muncul Di Bawah Peta). Desktop: Order 1 (Sebelah Kiri) */}
          <div className="lg:col-span-1 order-2 lg:order-1 flex flex-col gap-4">
            
            {/* STICKY FILTER PANEL */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm sticky top-20 z-10">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Categories</h2>
                    {/* Tampilkan tombol Reset jika sedang memfilter */}
                    {(categorySlug || searchQuery) && (
                      <Link href="/" className="text-xs text-red-500 hover:underline">
                        Reset Filter
                      </Link>
                    )}
                </div>
                
                {/* TOMBOL FILTER (MENGGUNAKAN LINK) */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {/* Tombol SEMUA */}
                    <Link href="/">
                      <button className={getButtonClass(!categorySlug)}>
                          All
                      </button>
                    </Link>

                    {/* Tombol ALAM */}
                    <Link href="/?cat=alam">
                      <button className={getButtonClass(categorySlug === 'alam')}>
                          <Mountain size={14} /> Nature
                      </button>
                    </Link>

                    {/* Tombol KULINER */}
                    <Link href="/?cat=kuliner">
                      <button className={getButtonClass(categorySlug === 'kuliner')}>
                          <Coffee size={14} /> Culinary
                      </button>
                    </Link>

                    {/* Tombol SEJARAH */}
                    <Link href="/?cat=sejarah">
                      <button className={getButtonClass(categorySlug === 'sejarah')}>
                          <LandPlot size={14} /> History
                      </button>
                    </Link>
                </div>
            </div>

            {/* LIST DAFTAR WISATA */}
            <div className="flex flex-col gap-3">
                {listings.length > 0 ? (
                    listings.map((item) => (
                        <ListingCard key={item.id} data={item} />
                    ))
                ) : (
                    // --- EMPTY STATE (TAMPILAN JIKA DATA KOSONG) ---
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                           <XCircle className="text-gray-400 w-8 h-8" />
                        </div>
                        <h3 className="text-slate-900 font-medium">No results found</h3>
                        <p className="text-slate-500 text-xs mt-1 max-w-[200px]">
                           Try searching with different keywords or change the category filter.
                        </p>
                        <Link href="/">
                          <Button variant="outline" size="sm" className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50">
                             View All
                          </Button>
                        </Link>
                    </div>
                )}
            </div>

          </div>

        </div>
      </div>
      
      <footer className="text-center py-8 text-slate-400 text-xs border-t border-gray-100 mt-8 bg-white">
         <p>Explore Celebes @aksaex</p>
      </footer>

    </main>
  )
}