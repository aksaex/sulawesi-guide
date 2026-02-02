import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"
import EditListingForm from "@/components/EditListingForm"

interface EditPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: EditPageProps) {
  // 1. Cek Login Admin (Wajib Aman)
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  if (!userId) redirect("/login")

  const admin = await prisma.user.findUnique({ where: { id: userId } })
  if (!admin || admin.role !== "ADMIN") redirect("/login")

  // 2. Ambil Data Listing yang mau diedit
  const { id } = await params
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true, category: true } // Ambil gambar & kategori
  })

  if (!listing) notFound()

  // 3. Render Form
  return <EditListingForm listing={listing} />
}