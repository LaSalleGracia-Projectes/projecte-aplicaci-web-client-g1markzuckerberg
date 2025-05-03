"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Input } from "@/components/ui"
import Layout2 from "@/components/layout2"

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleForgotPassword = async () => {
    if (!correo) {
      setError("Por favor ingresa tu correo electrónico")
      return
    }

    setError("")
    setLoading(true)

    try {
      console.log("Enviando solicitud con correo:", correo)
      
      // Hacer la solicitud exactamente como lo haces en Thunder Client
      const response = await fetch("http://localhost:3000/api/v1/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo })
      })

      console.log("Respuesta recibida:", response.status)
      
      // Obtener los datos de la respuesta
      let data = {}
      try {
        data = await response.json()
        console.log("Datos de la respuesta:", data)
      } catch (jsonError) {
        console.error("Error al parsear JSON:", jsonError)
      }

      if (!response.ok) {
        setError(data.error || `Error ${response.status}: No se pudo procesar la solicitud`)
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (error) {
      console.error("Error de conexión:", error)
      setError("Error de conexión con el servidor. Por favor, verifica que el servidor esté funcionando.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
    <Layout2>
        <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
          <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold">¡Correo enviado!</h2>
            <p>Hemos enviado una contraseña temporal a tu correo electrónico.</p>
            <p className="text-sm">Revisa tu bandeja de entrada y utiliza la contraseña temporal para iniciar sesión.</p>
            <p className="text-sm">Una vez que hayas iniciado sesión, podrás cambiar tu contraseña desde la sección de ajustes.</p>
            <Button
              className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
              onClick={() => router.push("/components/login")}
            >
              VOLVER AL INICIO DE SESIÓN
            </Button>
          </div>
        </div>
      </Layout2>
    )
  }

  return (
    <Layout2>
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-center">Recuperar contraseña</h2>
          <p className="text-center text-sm">Ingresa tu correo electrónico y te enviaremos una contraseña temporal.</p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="correo" className="text-sm font-medium">Correo electrónico</label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? "Enviando..." : "ENVIAR"}
          </Button>

          <div className="text-center text-sm">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => router.push("/components/login")}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </Layout2>
  )
}