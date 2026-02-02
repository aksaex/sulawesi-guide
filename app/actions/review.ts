'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function submitReview(formData: FormData) {
  const listingId = formData.get("listingId") as string
  const userName = formData.get("userName") as string
  const comment = formData.get("comment") as string
  const rating = parseInt(formData.get("rating") as string)

  if (!listingId || !userName || !comment || !rating) {
    throw new Error("Mohon lengkapi semua data ulasan.")
  }

  // Simpan ke Database
  await prisma.review.create({
    data: {
      listingId,
      userName,
      comment,
      rating
    }
  })

  // Refresh halaman agar review baru langsung muncul
  revalidatePath(`/listing/[slug]`) 
}