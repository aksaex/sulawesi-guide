'use client'

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitReview } from "@/app/actions/review"

export default function ReviewForm({ listingId }: { listingId: string }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0) // Efek hover saat pilih bintang
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-10">
      <h3 className="font-bold text-lg mb-4 text-slate-900">Write a Review</h3>
      
      <form 
        action={async (formData) => {
            setIsSubmitting(true)
            await submitReview(formData)
            setIsSubmitting(false)
            // Reset form manual (reload halaman otomatis karena server action)
            setRating(0)
        }} 
        className="space-y-4"
      >
        <input type="hidden" name="listingId" value={listingId} />
        <input type="hidden" name="rating" value={rating} />

        {/* INPUT BINTANG INTERAKTIF */}
        <div>
            <label className="block text-sm font-medium mb-1 text-slate-600">Rating</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="transition-colors focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <Star 
                            size={24} 
                            // Warnai kuning jika dipilih atau di-hover
                            className={star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} 
                        />
                    </button>
                ))}
            </div>
            {rating === 0 && <p className="text-xs text-red-500 mt-1">Please select a star rating</p>}
        </div>

        <div>
            <label className="block text-sm font-medium mb-1 text-slate-600">Your Name</label>
            <Input name="userName" placeholder="Example: Aksa the Adventurer" required className="bg-white" />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1 text-slate-600">Share your experience</label>
            <Textarea name="comment" placeholder="The place is clean, but parking is a bit difficult..." required className="bg-white" />
        </div>

        <Button type="submit" disabled={rating === 0 || isSubmitting} className="bg-slate-900 text-white hover:bg-slate-800">
            {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  )
}