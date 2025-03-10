"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui"
import { Input } from "@/components/ui"
import { Textarea } from "@/components/ui"
import { ArrowLeft, Download } from "lucide-react"
import Layout2 from "@/components/layout2"

export default function CreateLeague() {
  const [showPassword, setShowPassword] = useState(false)

  return (
        <Layout2>
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
    </Layout2>
  )
}

