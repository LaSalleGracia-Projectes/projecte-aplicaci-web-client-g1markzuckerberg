"use client"

import Link from "next/link"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { ArrowLeft } from "lucide-react"
import Layout2 from "@/components/layout2"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/authGuard/authGuard"
import { useState } from "react"
import { useLiga } from "@/context/ligaContext"
// Importar el servicio de cookies correctamente
import { getAuthToken } from "@/components/auth/cookie-service"

// Separate the inner component that will use the hook
function CreateLeagueContent() {
  const router = useRouter()
  const { setLiga } = useLiga() // Use the context hook to access setLiga
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateLeague = async () => {
    setError("")
    setLoading(true)

    try {
      // Usar getAuthToken en lugar de localStorage
      const token = getAuthToken()
      if (!token) {
        setError("No estás autenticado.")
        setLoading(false)
        return
      }

      const res = await fetch("http://localhost:3000/api/v1/liga/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Error al crear la liga")
      }

      // Get the created liga data with the code
      const responseData = await res.json()

      // Save the liga to context using setLiga
      if (responseData.liga) {
        // This will set currentLiga in context and save the ID to localStorage
        setLiga(responseData.liga)
      }

      // Redirigir a la página de clasificación
      // Usar window.location.href para forzar una recarga completa de la página
      window.location.href = "/components/clasificacion"
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/components/choose-league" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h2 className="text-xl font-medium">CREAR LIGA</h2>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre de la liga:
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full"
            />
          </div>
        </div>

        <Button
          className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
          onClick={handleCreateLeague}
          disabled={loading}
        >
          {loading ? "Creando..." : "CREAR LIGA"}
        </Button>
      </div>
    </div>
  )
}

// Main component that provides the context
export default function CreateLeague() {
  return (
    <AuthGuard>
      <Layout2>
        <CreateLeagueContent />
      </Layout2>
    </AuthGuard>
  )
}
