'use server'

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache" // <--- INI YANG TADINYA KURANG!

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string 

  // 1. Cek Password di .env
  if (password !== process.env.ADMIN_PASSWORD) {
    throw new Error("Password salah! Akses ditolak.")
  }
  
  // 2. Cek Email di Database
  const user = await prisma.user.findUnique({
    where: { email }
  })

  // 3. Cek Role
  if (!user || user.role !== "ADMIN") {
    throw new Error("Email tidak terdaftar sebagai Admin.")
  }

  // 4. Set Cookie
  const cookieStore = await cookies()
  cookieStore.set("userId", user.id)

  redirect("/admin")
}

// 2. FUNGSI APPROVE LISTING
export async function approveListing(listingId: string) {
  await prisma.listing.update({
    where: { id: listingId },
    data: { status: "APPROVED" }
  })
  // Fungsi ini butuh import dari next/cache
  revalidatePath("/admin")
  revalidatePath("/") 
}

// 3. FUNGSI REJECT (HAPUS) LISTING
export async function rejectListing(listingId: string) {
  await prisma.listing.delete({
    where: { id: listingId }
  })
  revalidatePath("/admin")
}