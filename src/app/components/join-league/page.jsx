
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
// Importar el servicio de cookies
import { getAuthToken } from "@/components/auth/cookie-service"

export default function JoinLeague() {
  const router = useRouter()
  const { setLiga } = useLiga() // Usar el contexto para actualizar la liga actual
  const [ligaCode, setLigaCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleJoinLeague = async () => {
    setError("")
    setSuccess("")

    if (!ligaCode.trim()) {
      setError("Por favor ingresa el código de la liga")
      return
    }

    setLoading(true)

    try {
      const token = getAuthToken()

      if (!token) {
        setError("No estás autenticado")
        setLoading(false)
        return
      }

      // Llamar directamente al endpoint del backend
      const response = await fetch(`http://localhost:3000/api/v1/liga/join/${ligaCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "No se pudo unir a la liga")
        setLoading(false)
        return
      }

      setSuccess(data.message || "Te has unido a la liga con éxito")

      // Si la respuesta incluye la liga, actualizamos el contexto
      if (data.liga) {
        setLiga(data.liga)
      }

      // Redirigir inmediatamente usando window.location.href para forzar una recarga completa
      window.location.href = "/components/clasificacion"
    } catch (err) {
      console.error("Error al unirse a la liga:", err)
      setError("Error del servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <Layout2>
        <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
          <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <Link href="/components/choose-league" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h2 className="text-xl font-medium">UNIRSE A LIGA</h2>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="liga-code" className="text-sm font-medium">
                  Código de la liga:
                </label>
                <Input
                  id="liga-code"
                  type="text"
                  value={ligaCode}
                  onChange={(e) => setLigaCode(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
              onClick={handleJoinLeague}
              disabled={loading}
            >
              {loading ? "Uniéndose..." : "UNIRSE A LIGA"}
            </Button>
          </div>
        </div>
      </Layout2>
    </AuthGuard>
  )
}
