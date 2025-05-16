"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import { Button, Input } from "@/components/ui"
import { Eye, EyeOff } from "lucide-react"
import Layout2 from "@/components/layout2"
// Importar el servicio de cookies al principio del archivo
import { setAuthToken, setRefreshToken } from "@/components/auth/cookie-service"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Modificar la función handleLogin para usar cookies en lugar de localStorage
  const handleLogin = async () => {
    if (!correo || !password) {
      setError("Por favor completa todos los campos")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión")
        setLoading(false)
        return
      }

      // Guardar tokens en cookies en lugar de localStorage
      setAuthToken(data.tokens.webToken)
      setRefreshToken(data.tokens.refreshWebToken)

      router.push("/components/home_logged")
    } catch (error) {
      setError("Error en el servidor")
    } finally {
      setLoading(false)
    }
  }

  const onGoogleSuccess = async ({ credential }) => {
    if (!credential) {
      setError("No se recibió credencial de Google")
      return
    }
    try {
      const res = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/auth/google/web/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error en login con Google")

      localStorage.setItem("webToken", data.webToken)
      localStorage.setItem("refreshWebToken", data.refreshWebToken)
      router.push("/components/home_logged")
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} autoSelect={false}>
      <Layout2>
        <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
          <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="w-full aspect-[4/3] bg-[#e5e5ea] mb-6" />

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="correo" className="text-sm font-medium">
                  Correo
                </label>
                <Input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button
              className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
            </Button>

            <div className="text-center">
              <button className="text-sm hover:underline" onClick={() => router.push("/components/forgot-password")}>
                Olvidé mi contraseña
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <div className="h-px bg-[#7d7d7d] flex-1" />
                <span>o</span>
                <div className="h-px bg-[#7d7d7d] flex-1" />
              </div>
              <p>Inicia sesión con:</p>
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => setError("Error al iniciar sesión con Google")}
                prompt="select_account"
              />
            </div>

            <div className="text-center text-sm">
              <button className="text-blue-600 hover:underline" onClick={() => router.push("/components/register")}>
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
          </div>
        </div>
      </Layout2>
    </GoogleOAuthProvider>
  )
}
