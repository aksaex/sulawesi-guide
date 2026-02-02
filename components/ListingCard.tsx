import Link from "next/link"
import { MapPin, Star } from "lucide-react" // Tambah icon Star
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import Image from "next/image"

interface ListingProps {
  data: {
    id: string
    title: string
    description: string
    address: string
    slug: string
    images?: { url: string }[]
    // Tambahkan tipe data reviews
    reviews?: { rating: number }[]
  }
}

export default function ListingCard({ data }: ListingProps) {
  const imageSrc = data.images && data.images.length > 0 
    ? data.images[0].url 
    : "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83"

  // --- LOGIKA HITUNG RATING ---
  const reviews = data.reviews || []
  const reviewCount = reviews.length
  
  // Hitung rata-rata: (Total Bintang / Jumlah Review)
  const averageRating = reviewCount > 0
    ? (reviews.reduce((total, next) => total + next.rating, 0) / reviewCount).toFixed(1)
    : null

  return (
    <Link href={`/listing/${data.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col border-slate-200">
        
        {/* Gambar Cover */}
        <div className="h-48 w-full relative overflow-hidden bg-slate-200">
             <Image 
                src={imageSrc}
                alt={data.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized 
             />
            
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                <Badge variant="secondary" className="bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm">
                    Spot
                </Badge>
            </div>

            {/* LABEL RATING (Muncul di Pojok Kiri Bawah Foto) */}
            {averageRating && (
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold">{averageRating}</span>
                    <span className="text-[10px] text-slate-300">({reviewCount})</span>
                </div>
            )}
        </div>

        <CardContent className="p-4 flex-grow">
          {/* Judul & Rating Star Text (Opsional jika mau ditampilkan di body juga) */}
          <div className="flex justify-between items-start mb-2">
             <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {data.title}
             </h3>
          </div>
          
          <p className="text-slate-500 text-sm line-clamp-2">
            {data.description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 text-slate-500 text-xs flex items-center justify-between border-t border-slate-50 mt-auto pt-3">
          <div className="flex items-center gap-1">
             <MapPin className="w-3 h-3 text-blue-500" />
             <span className="truncate max-w-[150px]">{data.address || "Barru, Sulsel"}</span>
          </div>
          
          {/* Indikator "Baru" jika belum ada review */}
          {!averageRating && (
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  New
              </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}