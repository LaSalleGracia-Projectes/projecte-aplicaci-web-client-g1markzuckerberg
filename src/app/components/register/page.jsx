"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import Link from "next/link"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Eye, EyeOff } from "lucide-react"
import Layout2 from "@/components/layout2"
// Modificar el componente de registro para usar cookies
// Importar el servicio de cookies al principio del archivo
import { setAuthToken, setRefreshToken } from "@/components/auth/cookie-service"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Reemplazar la parte donde se guarda el token en localStorage with:
  const handleRegister = async () => {
    setError("")
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }
    try {
      setLoading(true)
      const res = await fetch("http://localhost:3000/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: email,
          username,
          password,
          repeatPassword: confirmPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al registrar usuario")

      // Guardar tokens en cookies en lugar de localStorage
      setAuthToken(data.tokens.webToken)
      setRefreshToken(data.tokens.refreshWebToken)

      router.push("/components/home_logged")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // También actualizar onGoogleSuccess
  const onGoogleSuccess = async ({ credential }) => {
    if (!credential) {
      setError("No se recibió credencial de Google")
      return
    }
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/google/web/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error en login con Google")

      // Guardar tokens en cookies en lugar de localStorage
      setAuthToken(data.webToken)
      setRefreshToken(data.refreshWebToken)

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

            {/* —– Registro estándar —– */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo
                </label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Nombre de usuario
                </label>
                <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
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
                    className="pr-10" // deja espacio para el ícono
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  Repetir contraseña
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registrando..." : "REGÍSTRATE"}
            </Button>

            {/* —– OAuth con Google —– */}
            <div className="text-center space-y-4">
              <div className="flex items-center gap-2 justify-center">
                <div className="h-px bg-[#7d7d7d] flex-1" />
                <span>o</span>
                <div className="h-px bg-[#7d7d7d] flex-1" />
              </div>
              <p>Regístrate con:</p>
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => setError("Error al iniciar sesión con Google")}
                prompt="select_account"
              />
            </div>

            <div className="text-center text-sm">
              <Link href="/components/login" className="text-blue-600 hover:underline">
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </Layout2>
    </GoogleOAuthProvider>
  )
}