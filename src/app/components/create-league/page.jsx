"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui"
import { Button } from "@/components/ui"
import { ArrowLeft } from "lucide-react"

export default function CreateLeague() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleCreateLeague = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/create-league", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/league/${data.leagueId}`)
      } else {
        setError(data.message || "Error al crear la liga")
      }
    } catch (err) {
      setError("Error al crear la liga")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* Reemplazar el div gris vacío con la imagen del logo */}
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push("/components/choose-league")}
            className="text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-center">
            <img src="/images/Logo_fantasyDraft.png" alt="Fantasy Draft Logo" className="w-full max-w-[250px]" />
          </div>
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
