'use client'

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
} from "@/components/ui"
import AuthGuard from "@/components/authGuard/authGuard"

export default function Cuenta() {
  const [userData, setUserData] = useState(null)
  const [form, setForm] = useState({
    username: "",
    birthDate: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("webToken") : null

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        if (res.ok) {
          setUserData(data.user)
          setForm({
            username: data.user.username || "",
            birthDate: data.user.birthDate?.split("T")[0] || "",
            email: data.user.correo || "",
            password: "",
            newPassword: "",
            confirmPassword: "",
          })
        }
      } catch (err) {
        console.error("Error cargando usuario:", err)
      }
    }

    if (token) fetchUserData()
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateGeneral = async () => {
    try {
      const nameRes = await fetch("http://localhost:3000/api/v1/user/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: form.username }),
      })

      const birthRes = await fetch("http://localhost:3000/api/v1/user/update-birthDate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ birthDate: form.birthDate }),
      })

      if (nameRes.ok && birthRes.ok) {
        alert("Datos actualizados correctamente")
      } else {
        alert("Ocurrió un error actualizando la información")
      }
    } catch (err) {
      console.error("Error al actualizar usuario:", err)
      alert("Error de red")
    }
  }

  const handleUpdatePassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    try {
      const res = await fetch("http://localhost:3000/api/v1/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: form.password,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }),
      })

      if (res.ok) {
        alert("Contraseña actualizada correctamente")
        setForm((prev) => ({
          ...prev,
          password: "",
          newPassword: "",
          confirmPassword: "",
        }))
      } else {
        const error = await res.json()
        alert(error.message || "Error al cambiar la contraseña")
      }
    } catch (err) {
      console.error("Error al cambiar contraseña:", err)
    }
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
            {/* Información */}
            <Card>
              <CardHeader className="bg-black text-white p-4 rounded-t-lg">
                <Typography variant="h6">Información</Typography>
              </CardHeader>
              <CardBody className="space-y-4 bg-white p-6 rounded-b-lg">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha de nacimiento</label>
                  <Input
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="pt-4">
                  <Button onClick={handleUpdateGeneral} className="w-full bg-blue-500 text-white">
                    GUARDAR CAMBIOS
                  </Button>
                </div>

                <div className="pt-6">
                  <Typography variant="h6">Eliminación de cuenta</Typography>
                  <p className="text-sm text-gray-500">
                    Esta acción es irreversible y eliminará todos tus datos.
                  </p>
                  <Button color="red" className="w-full mt-3">ELIMINAR CUENTA</Button>
                </div>
              </CardBody>
            </Card>

            {/* Acceso */}
            <Card>
              <CardHeader className="bg-black text-white p-4 rounded-t-lg">
                <Typography variant="h6">Acceso</Typography>
              </CardHeader>
              <CardBody className="space-y-4 bg-white p-6 rounded-b-lg">
                <div>
                  <label className="text-sm font-medium">Email (no editable)</label>
                  <Input
                    type="email"
                    value={form.email}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Contraseña actual</label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nueva contraseña</label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirmar contraseña</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </CardBody>
              <CardFooter className="bg-white p-6 rounded-b-lg">
                <Button onClick={handleUpdatePassword} className="w-full">
                  CAMBIAR CONTRASEÑA
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
