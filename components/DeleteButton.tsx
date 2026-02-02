'use client'

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { rejectListing } from "@/app/actions/admin" // Import aksi server

export default function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        // Panggil server action
        await rejectListing(id)
      }}
      onSubmit={(e) => {
        // Logic konfirmasi di sisi Client
        if (!confirm("Are you sure you want to delete this listing permanently? This action cannot be undone.")) {
          e.preventDefault() // Batalkan submit jika user klik Cancel
        }
      }}
    >
      <Button 
        size="sm" 
        variant="destructive" 
        className="w-full h-8 text-xs bg-red-100 text-red-600 hover:bg-red-200 border-none"
      >
        <Trash2 size={14} className="mr-1" /> Delete
      </Button>
    </form>
  )
}