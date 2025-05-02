"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLiga } from "@/context/ligaContext"

export default function BurgerMenuContent({ onClose }) {
  const router = useRouter()
  const { setLiga: cambiarLiga, currentLiga } = useLiga()

  const [user, setUser] = useState(null)
  const [leagues, setLeagues] = useState([])
  const [userImageUrl, setUserImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("webToken")
    if (!token) {
      setError("No se encontró token de autenticación")
      setLoading(false)
      return
    }

    const fetchUserData = async () => {
      try {
        setLoading(true)

        // Fetch user data and leagues in parallel
        const [userRes, leaguesRes] = await Promise.all([
          fetch("http://localhost:3000/api/v1/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/v1/user/leagues", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        // Check for errors in responses
        if (!userRes.ok) {
          const errorData = await userRes.json()
          throw new Error(errorData.error || "Error al obtener datos del usuario")
        }

        if (!leaguesRes.ok) {
          const errorData = await leaguesRes.json()
          throw new Error(errorData.error || "Error al obtener ligas del usuario")
        }

        // Parse response data
        const userData = await userRes.json()
        const leaguesData = await leaguesRes.json()

        setUser(userData.user)

        // Ensure leagues is always an array
        const leaguesList = leaguesData.leagues || []
        console.log("Leagues loaded:", leaguesList)
        setLeagues(leaguesList)

        // Try to fetch user image
        try {
          const imageRes = await fetch("http://localhost:3000/api/v1/user/get-image", {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (imageRes.ok) {
            const imageBlob = await imageRes.blob()
            const imageObjectUrl = URL.createObjectURL(imageBlob)
            setUserImageUrl(imageObjectUrl)
          }
        } catch (imageError) {
          console.error("Error al obtener imagen del usuario:", imageError)
          // Don't fail the whole component if image loading fails
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSelectLeague = (league) => {
    if (!league?.id) {
      console.warn("Liga sin ID:", league)
      return
    }

    console.log("Selecting league:", league)

    // Store the complete league object to avoid needing to fetch it again
    cambiarLiga(league)

    onClose?.()

    // Navigate to the classification page to see the league info
    router.push("/components/clasificacion")
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("webToken")

      // Try to call logout API, but don't wait for it
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (logoutError) {
        console.error("Error al llamar API de logout:", logoutError)
        // Continue with local logout even if API call fails
      }

      // Clear all local storage items
      localStorage.removeItem("webToken")
      localStorage.removeItem("refreshWebToken")
      localStorage.removeItem("currentLigaId")
      localStorage.removeItem("currentLigaData")

      router.push("/")
    } catch (error) {
      console.error("Error en el proceso de logout:", error)
    }
  }

  if (loading) {
    return (
      <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
        <p className="text-center">Cargando usuario...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
        <p className="text-red-400 text-center">Error: {error}</p>
        <button className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-700" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
        {userImageUrl ? (
          <img
            src={userImageUrl || "/placeholder.svg"}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            {user?.username?.charAt(0) || user?.correo?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <p className="text-lg font-semibold">{user?.username || "Usuario"}</p>
          <p className="text-sm text-gray-400">{user?.correo || ""}</p>
        </div>
        <Link href="/components/ajustes" className="ml-auto">
          <img src="/images/ajustes.png" alt="ajustes" className="w-4 h-4 cursor-pointer" />
        </Link>
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-2">Ligas:</p>
        {leagues.length > 0 ? (
          <ul className="space-y-1">
            {leagues.map((league, index) => (
              <li
                key={league.id || index}
                className={`text-sm p-2 rounded-md cursor-pointer ${
                  currentLiga?.id === league.id ? "bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => handleSelectLeague(league)}
              >
                {league.nombre || league.name || `Liga ${index + 1}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No hay ligas registradas.</p>
        )}
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
        onClick={() => router.push("/components/choose-league")}
      >
        + Añadir Liga
      </button>

      <Link href="/components/backoffice">
        <button
          className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-800"
          onClick={onClose}
        >
          Back Office
        </button>
      </Link>


      <Link href="/info-ayuda" className="block text-center text-sm text-blue-400 mt-3 hover:underline">
        Información y Ayuda
      </Link>

      <button className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-700" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  )
}
