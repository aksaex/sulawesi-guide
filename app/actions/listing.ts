'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// --- 1. FUNGSI CREATE (KODE DARI ANDA) ---
export async function createListing(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const latitude = parseFloat(formData.get("latitude") as string)
  const longitude = parseFloat(formData.get("longitude") as string)
  const categorySlug = formData.get("categoryId") as string
  
  // Tangkap Array Gambar
  const imagesJson = formData.get("images") as string
  const imageUrls = imagesJson ? JSON.parse(imagesJson) : []

  // Tangkap Fasilitas
  const facilitiesRaw = formData.get("facilities") as string
  const facilities = facilitiesRaw ? JSON.parse(facilitiesRaw) : []

  // Validasi
  if (!title || !latitude || !longitude || imageUrls.length === 0 || !categorySlug) {
    throw new Error("Data tidak lengkap! Minimal upload 1 foto.")
  }

  const user = await prisma.user.findFirst()
  if (!user) throw new Error("User belum ada di database")

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  })

  // Simpan
  await prisma.listing.create({
    data: {
      title,
      description,
      // Tips: Jika ingin Sulawesi luas, address bisa dibuat dinamis nanti
      address: "Sulawesi, Indonesia", 
      latitude,
      longitude,
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now(),
      type: "PLACE",
      status: "PENDING",
      userId: user.id,
      categoryId: category ? category.id : (await prisma.category.findFirst())!.id,
      facilities: facilities, 
      
      images: {
        create: imageUrls.map((url: string) => ({
            url: url
        }))
      }
    },
  })

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}


// --- 2. FUNGSI UPDATE (PENYESUAIAN BARU) ---
export async function updateListing(formData: FormData) {
  // Ambil ID untuk tahu mana yang diedit
  const id = formData.get("id") as string
  
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const latitude = parseFloat(formData.get("latitude") as string)
  const longitude = parseFloat(formData.get("longitude") as string)
  const categorySlug = formData.get("categoryId") as string
  
  // Tangkap Array Gambar (JSON)
  const imagesJson = formData.get("images") as string
  const imageUrls = imagesJson ? JSON.parse(imagesJson) : []

  // Tangkap Fasilitas (JSON)
  const facilitiesRaw = formData.get("facilities") as string
  const facilities = facilitiesRaw ? JSON.parse(facilitiesRaw) : []

  if (!id || !title || !categorySlug) {
    throw new Error("Data invalid")
  }

  // Cari ID Kategori baru (jika user ganti kategori)
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  })

  // Update Data Listing
  // Kita gunakan teknik 'deleteMany' lalu 'create' untuk gambar agar sinkron dengan frontend
  await prisma.listing.update({
    where: { id },
    data: {
      title,
      description,
      latitude,
      longitude,
      facilities, // Update array fasilitas
      categoryId: category?.id, // Update kategori
      
      // Update Gambar: Hapus semua gambar lama, masukkan yang baru
      images: {
        deleteMany: {}, // Hapus relasi lama
        create: imageUrls.map((url: string) => ({ // Buat baru sesuai list dari frontend
            url: url
        }))
      }
    }
  })

  // Refresh data di semua halaman terkait
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath(`/listing/${id}`) // Refresh halaman detail
  
  return { success: true }
}

// --- 3. FUNGSI DELETE (DARI STEP SEBELUMNYA) ---
export async function rejectListing(listingId: string) {
  await prisma.listing.delete({
    where: { id: listingId }
  })
  revalidatePath("/admin")
  revalidatePath("/")
}

// --- 4. FUNGSI APPROVE (DARI STEP SEBELUMNYA) ---
export async function approveListing(listingId: string) {
  await prisma.listing.update({
    where: { id: listingId },
    data: { status: "APPROVED" }
  })
  revalidatePath("/admin")
  revalidatePath("/") 
}