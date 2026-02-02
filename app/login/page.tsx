'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { loginAdmin } from "../actions/admin"
import { Lock, Mail } from "lucide-react" // Tambah icon biar manis

export default function LoginPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-slate-900">
            Admin Access
          </CardTitle>
          <p className="text-center text-sm text-slate-500">
            Enter your credentials to manage Sulawesi Guide
          </p>
        </CardHeader>
        <CardContent>
          <form 
            action={async (formData) => {
                setIsLoading(true)
                setError("")
                try {
                    await loginAdmin(formData)
                } catch (e: any) {
                    setError(e.message)
                    setIsLoading(false)
                }
            }} 
            className="space-y-4"
          >
            {/* Input Email */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Admin</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input 
                        name="email" 
                        placeholder="admin@sulawesi.com" 
                        required 
                        className="pl-10" // Padding kiri biar gak nabrak icon
                    />
                </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                    <Input 
                        type="password" // Tipe Password (titik-titik)
                        name="password" 
                        placeholder="••••••••" 
                        required 
                        className="pl-10"
                    />
                </div>
            </div>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
                    ⚠️ {error}
                </div>
            )}

            <Button disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 h-11">
                {isLoading ? "Checking..." : "Login Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}