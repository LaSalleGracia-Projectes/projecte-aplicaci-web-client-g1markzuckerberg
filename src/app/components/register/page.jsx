"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"

import { useRegister } from "@/hooks/use-register"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { toast } = useToast()
  const { register, isLoading } = useRegister({
    onSuccess: () => {
      toast({
        title: "Registro exitoso",
        description: "Te hemos enviado un correo electrónico para que verifiques tu cuenta.",
      })
      router.push(callbackUrl)
    },
    onError: (error) => {
      toast({
        title: "Error al registrarse",
        description: error || "Ha ocurrido un error al registrarse.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      return
    }

    register({ email, password })
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Crear una cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo electrónico y contraseña para crear una cuenta
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      {/* Arreglar el ojo de las contraseñas en el componente register */}
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
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-3 transform -translate-y-1/2 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          <p className={password.length >= 8 ? "text-green-600" : "text-red-500"}>• Al menos 8 caracteres</p>
          <p className={/[A-Z]/.test(password) ? "text-green-600" : "text-red-500"}>• Al menos una letra mayúscula</p>
          <p className={/[a-z]/.test(password) ? "text-green-600" : "text-red-500"}>• Al menos una letra minúscula</p>
          <p className={/\d/.test(password) ? "text-green-600" : "text-red-500"}>• Al menos un número</p>
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
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-3 transform -translate-y-1/2 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <Button disabled={isLoading} onClick={onSubmit}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Crear cuenta
      </Button>
    </div>
  )
}
