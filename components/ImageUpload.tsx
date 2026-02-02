'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { ImagePlus, Trash } from 'lucide-react'
import Image from 'next/image'
import { useCallback } from 'react'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  onRemove: () => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove
}) => {
  
  const handleUpload = useCallback((result: any) => {
    // Ambil URL aman dari Cloudinary
    onChange(result.info.secure_url)
  }, [onChange])

  return (
    <div className="mb-4">
      {/* Jika ada value (URL), tampilkan preview internal (Hanya dipakai untuk single upload) */}
      {value && (
        <div className="relative w-[200px] h-[150px] rounded-md overflow-hidden border border-slate-200 mb-4">
           <div className="absolute top-2 right-2 z-10">
             <Button type="button" onClick={onRemove} variant="destructive" size="icon" className="h-6 w-6">
               <Trash size={14} />
             </Button>
           </div>
           <Image 
             fill 
             className="object-cover" 
             alt="Image" 
             src={value} 
           />
        </div>
      )}

      {/* Widget Cloudinary */}
      <CldUploadWidget 
        onSuccess={handleUpload}
        uploadPreset="cityguide" // Pastikan Preset ini BENAR
        options={{
          maxFiles: 1 // Kita upload satu per satu untuk dimasukkan ke array
        }}
      >
        {({ open }) => {
          return (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => open?.()}
              className="flex gap-2 items-center bg-slate-100 border border-dashed border-slate-300 text-slate-600 hover:bg-slate-200"
            >
              <ImagePlus size={18} />
              Upload Foto
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload