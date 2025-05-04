"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getAuthToken } from "@/components/auth/cookie-service"

const LigaContext = createContext()

export function LigaProvider({ children }) {
  const [currentLiga, setCurrentLigaState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [initialized, setInitialized] = useState(false)

  // Load liga from localStorage on initial render
  useEffect(() => {
    const loadLiga = async () => {
      try {
        // Only run on client
        if (typeof window === "undefined") return

        // Prevent multiple initializations
        if (initialized) return
        setInitialized(true)

        // First try to load from localStorage cached data for immediate display
        try {
          const cachedLigaData = localStorage.getItem("currentLigaData")
          if (cachedLigaData) {
            const parsedLiga = JSON.parse(cachedLigaData)
            console.log("Loaded liga from localStorage cache:", parsedLiga)
            setCurrentLigaState(parsedLiga)
            // Don't set loading to false yet, still try to refresh from API
          }
        } catch (cacheError) {
          console.error("Error loading cached liga data:", cacheError)
          // Continue to API fetch even if cache fails
        }

        const token = getAuthToken()
        if (!token) {
          setLoading(false)
          return
        }

        const savedLigaId = localStorage.getItem("currentLigaId")
        if (!savedLigaId) {
          setLoading(false)
          return
        }

        console.log("Fetching liga with ID:", savedLigaId)

        try {
          // Añadir un timeout a la solicitud fetch para evitar que se quede colgada indefinidamente
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

          const res = await fetch(`http://localhost:3000/api/v1/liga/${savedLigaId}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }).catch((err) => {
            console.error("Network error when fetching liga:", err)
            // Si ya tenemos datos en caché, no mostramos error
            if (!currentLiga) {
              setError("Error de conexión al servidor. Usando datos en caché si están disponibles.")
            }
            return null
          })

          clearTimeout(timeoutId)

          // Si la solicitud falló completamente
          if (!res) {
            setLoading(false)
            return
          }

          if (!res.ok) {
            console.error("Liga no encontrada, status:", res.status)
            // If we already have cached data, keep using it
            if (!currentLiga) {
              setLoading(false)
            }
            return
          }

          const ligaData = await res.json()
          console.log("Liga data refreshed from API:", ligaData)

          // Update state and localStorage cache
          setCurrentLigaState(ligaData)
          try {
            localStorage.setItem("currentLigaData", JSON.stringify(ligaData))
          } catch (e) {
            console.error("Error storing liga data in localStorage:", e)
          }
        } catch (fetchError) {
          console.error("Error fetching liga:", fetchError)
          // Si tenemos datos en caché, seguimos usándolos sin mostrar error
          if (!currentLiga) {
            setError("Error al cargar datos de la liga. Usando datos en caché si están disponibles.")
          }
        }
      } catch (err) {
        console.error("Error cargando liga:", err)
        setError("No se pudo cargar la liga")
      } finally {
        setLoading(false)
      }
    }

    loadLiga()
  }, [initialized])

  // This function updates both state and localStorage
  const setLiga = (liga) => {
    if (!liga?.id) {
      console.error("Attempted to set liga without ID:", liga)
      return
    }

    console.log("Setting liga:", liga)

    // Update state
    setCurrentLigaState(liga)

    // Update localStorage (both ID and full data)
    if (typeof window !== "undefined") {
      localStorage.setItem("currentLigaId", liga.id)

      // Store the entire liga object for immediate access on page loads
      try {
        localStorage.setItem("currentLigaData", JSON.stringify(liga))

        // Recargar la página después de actualizar el estado y localStorage
        window.location.reload()
      } catch (e) {
        console.error("Error storing liga data in localStorage:", e)
      }
    }
  }

  const clearLiga = () => {
    setCurrentLigaState(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentLigaId")
      localStorage.removeItem("currentLigaData")
    }
  }

  // Modificar la función getLigaById para manejar mejor los errores de conexión
  const getLigaById = async (id) => {
    try {
      setLoading(true)

      const token = getAuthToken()
      if (!token) throw new Error("No autenticado")

      console.log("Fetching liga by ID:", id)

      // Añadir un timeout a la solicitud fetch
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

      const res = await fetch(`http://localhost:3000/api/v1/liga/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }).catch((err) => {
        console.error("Network error when fetching liga by ID:", err)
        throw new Error("Error de conexión al servidor")
      })

      clearTimeout(timeoutId)

      if (!res.ok) throw new Error("No se pudo obtener la liga")

      const ligaData = await res.json()
      setLiga(ligaData)
      return ligaData
    } catch (err) {
      console.error("Error in getLigaById:", err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // For debugging - log when context is created or updated
  useEffect(() => {
    console.log("Liga context state updated:", currentLiga)
  }, [currentLiga])

  return (
    <LigaContext.Provider
      value={{
        currentLiga,
        setLiga,
        clearLiga,
        getLigaById,
        loading,
        error,
      }}
    >
      {children}
    </LigaContext.Provider>
  )
}

export function useLiga() {
  const context = useContext(LigaContext)
  if (context === undefined) {
    throw new Error("useLiga debe usarse dentro de LigaProvider")
  }
  return context
}
