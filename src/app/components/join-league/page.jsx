"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui"
import { Button } from "@/components/ui"
import { ArrowLeft } from "lucide-react"

export default function JoinLeaguePage() {
  const [ligaCode, setLigaCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const router = useRouter()

  const handleJoinLeague = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/join-league", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ligaCode }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setTimeout(() => {
          router.push(`/league/${data.leagueId}`)
        }, 1500)
      } else {
        setError(data.message || "Error al unirse a la liga.")
      }
    } catch (err) {
      setError("Error al unirse a la liga.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
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
  )
}
