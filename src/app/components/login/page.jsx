"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Eye, EyeOff } from "lucide-react"
import Layout2 from "@/components/layout2"

export default function Login2() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  return (
    <Layout2>
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div className="w-full aspect-[4/3] bg-[#e5e5ea] mb-6" />

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo
              </label>
              <Input id="email" type="email" />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} />
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

          <Button
            className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]"
            onClick={() => router.push("/components/home_logged")} 
          >
            INICIAR SESIÓN
          </Button>

          <div className="text-center">
            <button className="text-sm hover:underline">Olvidé mi contraseña</button>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center gap-2 justify-center">
              <div className="h-px bg-[#7d7d7d] flex-1" />
              <span>o</span>
              <div className="h-px bg-[#7d7d7d] flex-1" />
            </div>
            <p>Inicia sesión con:</p>
            <button className="p-2 border rounded-md mx-auto block">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-v6zqTeTlQ21tVc0cuHzCv5eadUosMZ.png"
                alt="Google Sign In"
                width={32}
                height={32}
                className="mx-auto"
              />
            </button>
          </div>

          <div className="text-center text-sm">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => router.push("/components/register")}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </div>
      </div>
    </Layout2>
  )
}
