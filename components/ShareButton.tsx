'use client'

import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react" // Kita tambah icon Check
import { useState } from "react"

interface ShareProps {
  title: string
  slug: string
}

export default function ShareButton({ title, slug }: ShareProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // 1. Cek url website saat ini
    // Di localhost: http://localhost:3000/listing/slug
    // Di Vercel: https://domainkamu.com/listing/slug
    const url = `${window.location.origin}/listing/${slug}`

    // 2. Cek apakah browser support Native Share (biasanya di HP)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Cek tempat wisata keren ini: ${title}`,
          url: url,
        })
      } catch (err) {
        console.log("Batal share")
      }
    } else {
      // 3. Fallback untuk Desktop (Copy to Clipboard)
      navigator.clipboard.writeText(url)
      setCopied(true)
      
      // Reset icon checklist setelah 2 detik
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleShare}>
      {copied ? (
        <Check size={20} className="text-green-600" />
      ) : (
        <Share2 size={20} className="text-slate-600" />
      )}
    </Button>
  )
}