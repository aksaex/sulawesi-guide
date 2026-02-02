import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, MapPin, Pencil, ShieldCheck } from "lucide-react" 
import Image from "next/image"
import Link from "next/link"
import { approveListing } from "../actions/admin"
import DeleteButton from "@/components/DeleteButton" 

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value

  if (!userId) redirect("/login")
  
  const admin = await prisma.user.findUnique({ where: { id: userId } })
  if (!admin || admin.role !== "ADMIN") redirect("/login")

  const allListings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: true }
  })

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- 1. NAVBAR FIXED (MENEMPEL DI ATAS) --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">Dashboard</h1>
                <p className="text-xs md:text-sm text-slate-500">Manage travel list</p>
            </div>
            
            {/* Badge Admin Kecil */}
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <ShieldCheck size={16} className="text-blue-600"/>
                <span className="text-xs font-bold text-slate-700">Admin</span>
            </div>
        </div>
      </nav>

      {/* --- 2. KONTEN UTAMA --- */}
      {/* Kita kasih padding-top (pt-24 atau pt-28) supaya konten tidak ketutupan navbar */}
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-10">

        <div className="grid gap-4">
            {allListings.map((item) => (
                <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white border-slate-200">
                    <div className="flex flex-col md:flex-row gap-4 p-4">
                        {/* Gambar */}
                        <div className="w-full md:w-40 h-32 bg-slate-200 rounded-lg relative overflow-hidden flex-shrink-0">
                            {item.images[0] ? (
                                <Image src={item.images[0].url} alt={item.title} fill className="object-cover"/>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 text-xs">No Image</div>
                            )}
                            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold text-white ${item.status === 'APPROVED' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                {item.status}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-2">
                            <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                            <p className="text-slate-500 text-sm line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <MapPin size={12} /> {item.address}
                            </div>
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 pl-0 md:pl-4 border-slate-100 mt-4 md:mt-0 min-w-[120px]">
                            
                            {/* Tombol Approve */}
                            {item.status === 'PENDING' && (
                                <form action={approveListing.bind(null, item.id)}>
                                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs">
                                        <Check size={14} className="mr-1"/> Approve
                                    </Button>
                                </form>
                            )}

                            {/* Tombol EDIT */}
                            <Link href={`/admin/edit/${item.id}`} className="w-full">
                                <Button size="sm" variant="outline" className="w-full h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                                    <Pencil size={14} className="mr-1"/> Edit
                                </Button>
                            </Link>

                            {/* Tombol DELETE */}
                            <DeleteButton id={item.id} />

                        </div>
                    </div>
                </Card>
            ))}

            {allListings.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                    <p>No listings found.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}