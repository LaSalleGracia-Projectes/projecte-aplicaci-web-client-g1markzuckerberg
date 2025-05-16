"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLiga } from "@/context/ligaContext"
// Importar el servicio de cookies al principio del archivo
import { getAuthToken, clearAuthCookies } from "@/components/auth/cookie-service"
// Importar el hook de idioma
import { useLanguage } from "@/context/languageContext"

export default function BurgerMenuContent({ onClose }) {
  const router = useRouter()
  const { setLiga: cambiarLiga, currentLiga } = useLiga()
  const { t } = useLanguage() // Añadir el hook de idioma

  const [user, setUser] = useState(null) // Datos del usuario
  const [leagues, setLeagues] = useState([]) // Ligas del usuario
  const [userImageUrl, setUserImageUrl] = useState(null) // Imagen del usuario
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Reemplazar las referencias a localStorage.getItem("webToken") con getAuthToken()
    const token = getAuthToken()
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
          fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/leagues", {
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
          const imageRes = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/get-image", {
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

  // Modificar la función handleLogout para usar clearAuthCookies
  const handleLogout = async () => {
    try {
      const token = getAuthToken()

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

      // Clear all cookies
      clearAuthCookies()

      // Clear localStorage items that might still be there
      localStorage.removeItem("currentLigaId")
      localStorage.removeItem("currentLigaData")

      router.push("/")
    } catch (error) {
      console.error("Error en el proceso de logout:", error)
    }
  }

  const handleSelectLeague = (league) => {
    if (!league?.id) {
      console.warn("Liga sin ID:", league)
      return
    }

    console.log("Selecting league:", league)

    // Verificar si estamos en la página de jornada
    const isJornadaPage = window.location.pathname.includes("/components/jornada")

    // Store the complete league object to avoid needing to fetch it again
    cambiarLiga(league)

    onClose?.()

    // Si estamos en la página de jornada, recargar la página para actualizar los datos
    if (isJornadaPage) {
      window.location.reload()
    } else {
      // Si no estamos en la página de jornada, navegar a la clasificación
      router.push("/components/clasificacion")
    }
  }

  if (loading) {
    return (
      <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
        <p className="text-center">{t("burger.loading")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
        <p className="text-red-400 text-center">
          {t("burger.error")} {error}
        </p>
        <button className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-700" onClick={handleLogout}>
          {t("burger.logout")}
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
          <p className="text-lg font-semibold">{user?.username || t("common.user")}</p>
          <p className="text-sm text-gray-400">{user?.correo || ""}</p>
        </div>
        <Link href="/components/ajustes" className="ml-auto">
          <img src="/images/ajustes.png" alt="ajustes" className="w-4 h-4 cursor-pointer" />
        </Link>
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-2">{t("burger.leagues")}:</p>
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
          <p className="text-sm text-gray-400">{t("burger.noLeaguesRegistered")}</p>
        )}
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
        onClick={() => router.push("/components/choose-league")}
      >
        {t("league.addLeague")}
      </button>

      {/* Botón del Back Office (visible solo para administradores) */}
      {user?.is_admin && (
        <Link href="/components/backoffice">
          <button className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-800" onClick={onClose}>
            {t("burger.backOffice")}
          </button>
        </Link>
      )}

      <Link href="/components/contactForm" className="block text-center text-sm text-blue-400 mt-3 hover:underline">
        {t("burger.contactForm")}
      </Link>

      <button className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-700" onClick={handleLogout}>
        {t("burger.logout")}
      </button>
    </div>
  )
}
