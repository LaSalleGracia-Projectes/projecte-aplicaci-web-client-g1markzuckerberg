"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "../../utils/auth"

const JoinLeaguePage = () => {
  const [ligaCode, setLigaCode] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLigaCodeChange = (e) => {
    setLigaCode(e.target.value)
  }

  // Modificar la función handleJoinLeague para recargar la página después de unirse a una liga
  const handleJoinLeague = async () => {
    setError("")
    setSuccess("")

    if (!ligaCode.trim()) {
      setError("Por favor ingresa el código de la liga")
      return
    }

    setLoading(true)

    try {
      // Usar getAuthToken en lugar de localStorage
      const token = getAuthToken()

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

      // Recargar la página en lugar de usar setTimeout y router.push
      window.location.href = "/components/home_logged"
    } catch (err) {
      setError("Error del servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Unirse a una Liga</h2>

        {error && <div className="bg-red-200 text-red-700 border border-red-700 rounded p-3 mb-4">{error}</div>}

        {success && (
          <div className="bg-green-200 text-green-700 border border-green-700 rounded p-3 mb-4">{success}</div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ligaCode">
            Código de la Liga:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ligaCode"
            type="text"
            placeholder="Ingresa el código de la liga"
            value={ligaCode}
            onChange={handleLigaCodeChange}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleJoinLeague}
            disabled={loading}
          >
            {loading ? "Uniendo..." : "Unirse"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default JoinLeaguePage
