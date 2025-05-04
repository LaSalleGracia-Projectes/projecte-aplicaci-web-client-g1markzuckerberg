"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthToken } from "@/components/auth/cookie-service"

export default function AuthGuard({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      const token = getAuthToken()
      console.log("Token encontrado en cookies:", token)

      if (!token) {
        router.push("/components/login")
        return
      }

      try {
        const res = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          console.log("Token inválido")
          // No es necesario eliminar la cookie aquí, se hará en el logout
          router.push("/components/login")
        } else {
          console.log("Token válido")
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error al validar el token:", error)
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
