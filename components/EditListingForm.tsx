'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MapWrapper from "@/components/map/MapWrapper"
import ImageUpload from "@/components/ImageUpload"
import { X, ArrowLeft, Save } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { updateListing } from "@/app/actions/listing" // Import aksi update

// Opsi Fasilitas
const FACILITY_OPTIONS = [
  "Spacious Parking", "Public Toilet", "Prayer Room", "Photo Spot",
  "Food Stall/Restaurant", "Gazebo", "Power Outlet", "WiFi Access", "Camping Area"
]

interface EditProps {
  listing: any // Data listing lama
}

export default function EditListingForm({ listing }: EditProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ISI STATE DENGAN DATA LAMA
  const [title, setTitle] = useState(listing.title)
  const [description, setDescription] = useState(listing.description)
  const [latitude, setLatitude] = useState<number>(listing.latitude)
  const [longitude, setLongitude] = useState<number>(listing.longitude)
  const [category, setCategory] = useState(listing.category?.slug || "")
  
  // State Array
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(listing.facilities || [])
  const [images, setImages] = useState<string[]>(listing.images.map((img: any) => img.url))

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
  }

  const toggleFacility = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    )
  }

  const handleAddImage = (url: string) => {
    setImages((prev) => [...prev, url]) 
  }

  const handleRemoveImage = (urlToRemove: string) => {
    setImages((prev) => prev.filter((url) => url !== urlToRemove))
  }

  return (
    <div className="bg-slate-50 min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium">
            <ArrowLeft size={20} /> Back
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Listing: {listing.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              action={async (formData) => {
                setIsSubmitting(true)
                // Append data manual ke FormData
                formData.set("id", listing.id) // PENTING: ID Listing
                formData.set("title", title)
                formData.set("description", description)
                formData.set("categoryId", category)
                formData.set("latitude", latitude.toString())
                formData.set("longitude", longitude.toString())
                formData.set("facilities", JSON.stringify(selectedFacilities))
                formData.set("images", JSON.stringify(images))
                
                await updateListing(formData)
                setIsSubmitting(false)
                router.push("/admin") // Balik ke admin setelah save
              }} 
              className="space-y-6"
            >
              
              {/* GAMBAR */}
              <div className="space-y-3">
                 <Label>Gallery ({images.length})</Label>
                 <div className="grid grid-cols-2 gap-3 mb-4">
                    {images.map((url, index) => (
                        <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                            <Image src={url} alt="img" fill className="object-cover" />
                            <button type="button" onClick={() => handleRemoveImage(url)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full z-10">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                 </div>
                 <div className="flex justify-center bg-slate-100 p-4 rounded-lg border-dashed border-2 border-slate-300">
                    <ImageUpload value="" onChange={handleAddImage} onRemove={() => {}} />
                 </div>
              </div>

              {/* TEXT INPUTS */}
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-md" required>
                    <option value="">Select Category</option>
                    <option value="nature">Nature</option> 
                    <option value="culinary">Culinary</option>
                    <option value="history">History</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="min-h-[100px]"/>
              </div>

              {/* FASILITAS */}
              <div className="space-y-3 border p-4 rounded-lg bg-slate-50/50">
                <Label>Facilities</Label>
                <div className="grid grid-cols-2 gap-3">
                    {FACILITY_OPTIONS.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                checked={selectedFacilities.includes(item)}
                                onChange={() => toggleFacility(item)}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <label className="text-sm">{item}</label>
                        </div>
                    ))}
                </div>
              </div>

              {/* PETA (Wajib ada marker awal) */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="h-[300px] rounded-xl overflow-hidden border">
                    {/* Kita passing koordinat lama sebagai default center & marker */}
                    <MapWrapper 
                        onLocationSelect={handleLocationSelect} 
                        center={[latitude, longitude]}
                        markers={[{ id: 'curr', latitude, longitude, title: 'Current' }]}
                    />
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                 <Save size={18} className="mr-2"/> 
                 {isSubmitting ? "Saving Changes..." : "Update Listing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}