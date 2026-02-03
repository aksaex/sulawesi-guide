import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. JUDUL WEB
  // template: "%s" artinya kalau di halaman detail judulnya "Pantai Bira", 
  // maka di tab browser akan tertulis: "Pantai Bira | Sulawesi Explore"
  title: {
    default: "Sulawesi Explore - Panduan Wisata Terbaik",
    template: "%s | Sulawesi Explore"
  },

  // 2. DESKRIPSI UNTUK GOOGLE
  description: "Temukan destinasi wisata alam, kuliner, dan sejarah terbaik di Sulawesi. Jelajahi hidden gems, lihat peta lokasi, dan bagikan pengalamanmu di sini.",

  // 3. AGAR KEREN SAAT DI-SHARE DI SOSMED (WA, Twitter, FB)
  openGraph: {
    title: "Sulawesi Explore - Jelajahi Keindahan Sulawesi",
    description: "Panduan lengkap wisata alam dan kuliner di Sulawesi.",
    url: "https://sulawesi-guide.vercel.app", // Ganti dengan domain Vercel kamu nanti
    siteName: "Sulawesi Explore",
    images: [
      {
        url: "/og-image.jpg", // Pastikan kamu punya gambar ini di folder public (opsional)
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // 4. TEMPAT KODE VERIFIKASI GOOGLE SEARCH CONSOLE
  // Nanti kalau sudah dapat kodenya, paste di dalam tanda kutip di bawah ini
  verification: {
    google: "Hw8ZCe-FBYl2EvPc17MxGwZ59AfdLXJjEktrlfNXFRM", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}