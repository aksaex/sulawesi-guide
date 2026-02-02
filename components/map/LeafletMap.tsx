// components/map/LeafletMap.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react'

// --- FIX ICON ---
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png'
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon
// ---------------

// 1. Definisikan bentuk data Marker
interface ListingMarker {
  id: string
  title: string
  latitude: number
  longitude: number
}

interface MapProps {
  center?: [number, number]
  zoom?: number
  onLocationSelect?: (lat: number, lng: number) => void
  // 2. Tambahkan props baru: Array of Markers
  markers?: ListingMarker[]
}

// Koordinat Barru (Default)
const DEFAULT_CENTER: [number, number] = [-2.0, 120.5]

// Komponen Kecil untuk Handle Klik
const LocationPicker = ({ onSelect }: { onSelect: (lat: number, lng: number) => void }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null)

  useMapEvents({
    click(e) {
      setPosition(e.latlng) // Update marker visual
      onSelect(e.latlng.lat, e.latlng.lng) // Kirim data ke Form
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location!</Popup>
    </Marker>
  )
}

const LeafletMap = ({ 
  center = DEFAULT_CENTER, 
  zoom = 6, 
  onLocationSelect, 
  markers = [] 
}: MapProps) => {
  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border border-slate-200 z-0 relative shadow-sm">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* LOGIC 1: Jika Mode Input (Ada onLocationSelect) */}
        {onLocationSelect && (
          <LocationPicker onSelect={onLocationSelect} />
        )}

        {/* LOGIC 2: Tampilkan Data dari Database (Looping) */}
        {markers.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.latitude, item.longitude]}
          >
            <Popup>
              <div className="text-center">
                <b className="text-sm">{item.title}</b>
                <br />
                <span className="text-xs text-slate-500">Click for details</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Jika tidak ada markers dan tidak mode input, tampilkan marker default */}
        {!onLocationSelect && markers.length === 0 && (
          <Marker position={center}>
            <Popup>Sulawesi Center</Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  )
}

export default LeafletMap
