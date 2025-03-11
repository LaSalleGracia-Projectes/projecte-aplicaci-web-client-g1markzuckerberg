"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function Login2() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-[#787878] py-4">
        <h1 className="text-center text-3xl font-normal">FantasyDraft</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-[#d9d9d9]">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-between">
            <div className="w-[240px] aspect-[4/3] border border-gray-300" />
            <div className="w-[240px] aspect-[4/3] border border-gray-300 hidden md:block" />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Mail className="h-5 w-5" />
              </div>
              <Input className="pl-10 py-6 bg-[#e5e5ea] border-none" placeholder="Correo" />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock className="h-5 w-5" />
              </div>
              <Input
                className="pl-10 py-6 bg-[#e5e5ea] border-none"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button className="w-full py-6 bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]">INICIAR SESION</Button>

          <div className="text-center">
            <button className="text-sm hover:underline">Olvidé mi contraseña</button>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center gap-2 justify-center">
              <span>¿No tienes cuenta?</span>
              <Link href="/register" className="text-black underline font-medium">
                Registrate
              </Link>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <div className="h-px bg-[#7d7d7d] flex-1" />
              <span>o</span>
              <div className="h-px bg-[#7d7d7d] flex-1" />
            </div>

            <p>Inicia sesión con :</p>
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
        </div>
      </div>

      <footer className="bg-[#787878] p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <span>Español</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:underline">
              Política de Privacidad
            </a>
            <a href="#" className="hover:underline">
              Contacto
            </a>
            <a href="#" className="hover:underline">
              Configuración de Cookies
            </a>
          </div>
          <div className="text-sm">© Noviembre 2024 Mark Zuckerberg S.L.</div>
        </div>
      </footer>
    </div>
  )
}

