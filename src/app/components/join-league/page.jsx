"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input, Button } from "@/components/ui"
import Layout2 from "@/components/layout2"

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
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-center">Unirse a una Liga</h2>
          
          <Input
            type="text"
            placeholder="Código de la liga"
            value={ligaCode}
            onChange={(e) => setLigaCode(e.target.value)}
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
