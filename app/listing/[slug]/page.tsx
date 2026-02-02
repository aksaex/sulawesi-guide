import { prisma } from "@/lib/prisma"
import MapWrapper from "@/components/map/MapWrapper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowLeft, Star } from "lucide-react" // Tambah import Star
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import ShareButton from "@/components/ShareButton"
import ReviewForm from "@/components/ReviewForm" // Tambah import Form Review

interface DetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function ListingDetailPage({ params }: DetailPageProps) {
  // 1. Tangkap Slug dari URL
  const { slug } = await params

  // 2. Cari data di Database
  const listing = await prisma.listing.findUnique({
    where: { slug: slug },
    include: {
      images: true, 
      user: { select: { name: true } },
      // 3. AMBIL DATA REVIEW (Terbaru di atas)
      reviews: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!listing) {
    notFound()
  }

  // --- LOGIKA GAMBAR (Supaya tidak kembar) ---
  const images = listing.images || []
  
  const image1 = images[0]?.url || "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83"
  const image2 = images[1]?.url || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"
  const image3 = images[2]?.url || "https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image"

  return (
    <main className="min-h-screen bg-white pb-20 font-sans text-slate-900">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </Link>
        <div className="font-bold text-lg tracking-tight">
            Celebes<span className="text-blue-600">Explore</span>
        </div>
        <ShareButton title={listing.title} slug={listing.slug} />
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-24">
        
        {/* HEADER */}
        <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    Tour
                </Badge>
                <div className="flex items-center text-slate-500 text-sm gap-1">
                    <MapPin size={14} />
                    {listing.address}
                </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {listing.title}
            </h1>
        </div>

        {/* --- GALERI FOTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-10 relative">
            
            {/* GAMBAR 1 (Utama) */}
            <div className="md:col-span-2 h-full relative bg-slate-200 group">
                <Image 
                    src={image1} 
                    alt="Main Photo" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                    unoptimized
                />
            </div>

            {/* GAMBAR SAMPING */}
            <div className="hidden md:flex flex-col gap-2 md:gap-4 h-full">
                <div className="flex-1 relative bg-slate-100 group overflow-hidden">
                    <Image 
                        src={image2} 
                        alt="Gallery 2" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                    />
                </div>
                <div className="flex-1 relative bg-slate-100 group overflow-hidden">
                    <Image 
                         src={image3} 
                         alt="Gallery 3" 
                         fill 
                         className="object-cover transition-transform duration-700 group-hover:scale-105"
                         unoptimized
                    />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-all cursor-pointer">
                        <span className="text-white font-medium text-xs md:text-sm border border-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                            View All Photos ({images.length})
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* KOLOM KIRI (Info + Review) */}
            <div className="lg:col-span-2 space-y-8">
                {/* User Info */}
                <div className="flex items-center gap-4 py-6 border-y border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {listing.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">Posted by {listing.user?.name || "Contributor"}</p>
                        <p className="text-xs text-slate-500">
                             Joined since {new Date().getFullYear()}
                        </p>
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">About this place</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                        {listing.description}
                    </p>
                </div>

                {/* Fasilitas */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Facilities</h2>
                    {listing.facilities && listing.facilities.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {listing.facilities.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                    </div>
                                    <span className="text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 italic text-sm pl-4 border-l-4 border-slate-200">
                            No amenity information available.
                        </p>
                    )}
                </div>

                {/* --- BAGIAN REVIEW & RATING (BARU) --- */}
                <div className="pt-8 border-t border-gray-100 mt-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        Visitor Reviews 
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {listing.reviews.length}
                        </span>
                    </h2>

                    {/* Daftar Review */}
                    <div className="space-y-6">
                        {listing.reviews.length > 0 ? (
                            listing.reviews.map((review) => (
                                <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-slate-800">{review.userName}</div>
                                        <div className="text-xs text-slate-400">
                                            {review.createdAt.toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    {/* Bintang Static */}
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={14} 
                                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-slate-50 p-6 rounded-lg text-center border border-dashed border-slate-200">
                                <p className="text-slate-500 text-sm">There are no reviews yet. Be the first to rate this.!</p>
                            </div>
                        )}
                    </div>

                    {/* Form Input Review */}
                    <ReviewForm listingId={listing.id} />
                </div>

            </div>

            {/* KOLOM KANAN (Peta) */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin className="text-blue-600" size={18}/> Location on Map
                        </h3>
                        
                        <div className="h-[300px] w-full rounded-xl overflow-hidden relative z-0">
                            <MapWrapper 
                                markers={[listing]} 
                                center={[listing.latitude, listing.longitude]} 
                                zoom={14}
                            />
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <Link 
                                href={`http://googleusercontent.com/maps.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base rounded-xl">
                                    Open in Google Maps
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </main>
  )
}