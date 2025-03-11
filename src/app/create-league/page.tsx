"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download } from "lucide-react"

export default function CreateLeague() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
      <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h2 className="text-xl font-medium">CREAR LIGA</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre de la liga:
            </label>
            <Input id="name" type="text" />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descripción:
            </label>
            <Textarea id="description" rows={4} />
          </div>

          <div className="space-y-2">
            <label htmlFor="league-password" className="text-sm font-medium">
              Contraseña:
            </label>
            <Input id="league-password" type="password" />
            <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
              <li>Debe incluir una mayúscula</li>
              <li>Debe incluir números</li>
              <li>Debe contener al menos un carácter especial</li>
              <li>La contraseña debe ser de al menos 8 caracteres</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">Subir imagen de perfil de la liga:</label>
            <div className="bg-[#e5e5ea] p-4 text-center rounded-lg">
              <p className="text-sm mb-2">Arrastrar imagen</p>
              <p className="text-sm mb-4">o</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Seleccionar imagen
              </Button>
            </div>
          </div>
        </div>

        <Button className="w-full bg-[#e5e5ea] text-black hover:bg-[#d2d2d2]">CREAR LIGA</Button>
      </div>
    </div>
  )
}

