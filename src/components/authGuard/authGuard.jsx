"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("webToken")

      if (!token) {
        router.push("/components/login")
        return
      }

      try {
        // Puedes hacer una llamada a tu API para verificar que el token sea válido
        const res = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          localStorage.removeItem("webToken")
          router.push("/components/login")
        } else {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error validando el token:", error)
        localStorage.removeItem("webToken")
        router.push("/components/login")
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [router])

  if (loading) {
    return <p className="text-center mt-20 text-lg">Verificando sesión...</p>
  }

  return isAuthenticated ? children : null
}
