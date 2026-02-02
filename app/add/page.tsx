'use client'

import { useState } from "react"
import { useRouter } from "next/navigation" // Untuk redirect manual
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MapWrapper from "@/components/map/MapWrapper"
import { createListing } from "../actions/listing"
import ImageUpload from "@/components/ImageUpload"
import { X, ArrowLeft, CheckCircle } from "lucide-react" // Tambah icon ArrowLeft & CheckCircle
import Image from "next/image"
import Link from "next/link"

const FACILITY_OPTIONS = [
  "Spacious Parking",
  "Public Toilet",
  "Prayer Room",
  "Photo Spot",
  "Food Stall/Restaurant",
  "Gazebo",
  "Power Outlet",
  "WiFi Access",
  "Camping Area"
]

export default function AddListingPage() {
  const router = useRouter()
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false) // State untuk Dialog
  
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])

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

  // Handle ketika tombol OK ditekan pada dialog sukses
  const handleSuccessConfirm = () => {
    setShowSuccessDialog(false)
    router.push('/') // Redirect ke Home
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 font-sans relative">
      
      {/* --- TOMBOL BACK (Koreksi 2) --- */}
      <div className="max-w-2xl mx-auto mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium">
            <ArrowLeft size={20} />
            Back
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Add New Place</CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              action={async (formData) => {
                setIsSubmitting(true)
                formData.set("facilities", JSON.stringify(selectedFacilities))
                formData.set("images", JSON.stringify(images))
                
                await createListing(formData)
                
                setIsSubmitting(false)
                setShowSuccessDialog(true) // Tampilkan Dialog Sukses
              }} 
              className="space-y-6"
            >
              
              {/* PHOTO UPLOAD */}
              <div className="space-y-3">
                 <Label>Photo Gallery ({images.length} photos)</Label>
                 
                 {images.length > 0 && (
                   <div className="grid grid-cols-2 gap-3 mb-4">
                      {images.map((url, index) => (
                          <div key={url} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group bg-slate-100">
                              <Image 
                                src={url} 
                                alt={`Foto ${index + 1}`} 
                                fill 
                                className="object-cover" 
                              />
                              <button 
                                  type="button"
                                  onClick={() => handleRemoveImage(url)}
                                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors z-10"
                              >
                                  <X size={14} />
                              </button>
                              {index === 0 && (
                                <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">
                                  Main Cover
                                </span>
                              )}
                          </div>
                      ))}
                   </div>
                 )}

                 <div className="bg-slate-50 p-6 rounded-lg border border-dashed border-slate-300 text-center">
                    <p className="text-sm text-slate-500 mb-3">Upload best photos of the location</p>
                    <div className="flex justify-center">
                        <ImageUpload 
                            value="" 
                            onChange={handleAddImage}
                            onRemove={() => {}} 
                        />
                    </div>
                 </div>
              </div>

              {/* INPUT FIELDS */}
              <div className="space-y-2">
                <Label>Place Name</Label>
                <Input name="title" placeholder="e.g. Ujung Batu Beach" required className="bg-white" />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select name="categoryId" className="w-full p-2.5 border border-slate-200 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" required>
                    <option value="">-- Select Category --</option>
                    <option value="nature">Nature</option> 
                    <option value="culinary">Culinary</option>
                    <option value="history">History</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea name="description" placeholder="Describe what makes this place special..." required className="bg-white min-h-[100px]"/>
              </div>

              {/* FACILITIES CHECKBOXES (Koreksi Mobile: Grid Responsive) */}
              <div className="space-y-3 border p-4 rounded-lg bg-slate-50/50">
                <Label className="text-base font-semibold">Facilities Available</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FACILITY_OPTIONS.map((item) => (
                        <div key={item} className="flex items-center space-x-2 bg-white p-2 rounded border border-slate-100">
                            <input 
                                type="checkbox" 
                                id={item}
                                checked={selectedFacilities.includes(item)}
                                onChange={() => toggleFacility(item)}
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor={item} className="text-sm cursor-pointer text-slate-700 flex-1">{item}</label>
                        </div>
                    ))}
                </div>
              </div>

              {/* MAP */}
              <div className="space-y-2">
                <Label>Location (Click on map)</Label>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                    <MapWrapper onLocationSelect={handleLocationSelect} />
                </div>
                <p className="text-xs text-slate-400">Make sure the marker is accurate.</p>
              </div>

              <input type="hidden" name="latitude" value={latitude || ""} />
              <input type="hidden" name="longitude" value={longitude || ""} />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base" disabled={!latitude || images.length === 0 || isSubmitting}>
                {isSubmitting ? "Saving Data..." : "Submit Listing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* --- SUCCESS DIALOG (Koreksi 3) --- */}
      {showSuccessDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Success!</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    Your listing has been submitted successfully. It is currently <b>waiting for admin approval</b> before it goes public.
                </p>
                <Button onClick={handleSuccessConfirm} className="w-full bg-slate-900 hover:bg-slate-800 h-11 rounded-xl">
                    Back to Home
                </Button>
            </div>
        </div>
      )}

    </div>
  )
}