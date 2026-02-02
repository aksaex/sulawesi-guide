// components/map/MapWrapper.tsx
'use client'

import dynamic from 'next/dynamic'

// Sesuaikan interface dengan LeafletMap
interface MapProps {
  center?: [number, number]
  zoom?: number
  onLocationSelect?: (lat: number, lng: number) => void
  markers?: any[] // Kita pakai any[] dulu biar praktis passing datanya
}

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">
      Loading Map...
    </div>
  ),
})

const MapWrapper = (props: MapProps) => {
  return <LeafletMap {...props} />
}

export default MapWrapper