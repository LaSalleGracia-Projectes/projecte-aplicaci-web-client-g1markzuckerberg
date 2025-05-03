"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Button } from "@/components/ui"
import Layout2 from "@/components/layout2"
import { ArrowLeft } from "lucide-react";

export default function JoinLeague() {
  const [ligaCode, setLigaCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoinLeague = async () => {
    setError("")
    setSuccess("")

    if (!ligaCode.trim()) {
      setError("Por favor ingresa el código de la liga")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("webToken")

      if (!token) {
        setError("No estás autenticado")
        setLoading(false)
        return
      }

      const response = await fetch(`/api/league/join/${ligaCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "No se pudo unir a la liga")
        return
      }
      
      setSuccess(data.message)
      setLigaCode("")
      
      setTimeout(() => {
        router.push("/components/home_logged")
      }, 1500)
      

      setSuccess(data.message)
      setLigaCode("")
      // opcional: redirigir al usuario a la liga
      // router.push(`/ligas/${data.liga.id}`)

    } catch (err) {
      setError("Error del servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout2>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] p-4">
        <div className="w-full max-w-md sm:max-w-lg bg-white p-6 rounded-lg shadow-sm space-y-4">
          {/* Flecha de volver */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-black transition"
              aria-label="Volver"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold sm:text-2xl">Unirse a una Liga</h2>
          </div>

          <Input
            type="text"
            placeholder="Código de la liga"
            value={ligaCode}
            onChange={(e) => setLigaCode(e.target.value)}
            className="w-full py-2 px-4 border rounded-md shadow-sm text-sm sm:text-base"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <Button
            onClick={handleJoinLeague}
            className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
            disabled={loading}
          >
            {loading ? "Uniendo..." : "UNIRSE"}
          </Button>
        </div>
      </div>
    </Layout2>
  )
}
