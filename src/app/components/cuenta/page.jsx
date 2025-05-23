"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Typography } from "@/components/ui"
import AuthGuard from "@/components/authGuard/authGuard"
import { useLanguage } from "@/context/languageContext"
// Importar el servicio de cookies
import { getAuthToken } from "@/components/auth/cookie-service"

export default function Cuenta() {
  const { t } = useLanguage()
  const [userData, setUserData] = useState(null)
  const [form, setForm] = useState({
    username: "",
    birthDate: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [correoConfirmacion, setCorreoConfirmacion] = useState("")

  // Usar getAuthToken en lugar de localStorage
  const token = typeof window !== "undefined" ? getAuthToken() : null

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/me", {
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

  // Modificar la función handleUpdateGeneral para recargar la página después de guardar
  const handleUpdateGeneral = async () => {
    try {
      const nameRes = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: form.username }),
      })

      const birthRes = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/update-birthDate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ birthDate: form.birthDate }),
      })

      if (nameRes.ok && birthRes.ok) {
        alert("Datos actualizados correctamente")

        // Recargar la página después de actualizar correctamente
        window.location.reload()
      } else {
        alert("Ocurrió un error actualizando la información")
      }
    } catch (err) {
      console.error("Error al actualizar usuario:", err)
      alert("Error de red")
    }
  }

  // Modificar la función handleUpdatePassword para recargar la página después de guardar
  const handleUpdatePassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    try {
      const res = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/update-password", {
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

        // Recargar la página después de actualizar correctamente
        window.location.reload()
      } else {
        const error = await res.json()
        alert(error.message || "Error al cambiar la contraseña")
      }
    } catch (err) {
      console.error("Error al cambiar contraseña:", err)
    }
  }

  const handleDeleteAccount = async () => {
    if (correoConfirmacion !== form.email) {
      alert("El correo no coincide con el de tu cuenta.")
      return
    }

    try {
      const res = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/auth/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ correo: correoConfirmacion }),
      })

      if (res.ok) {
        alert("Cuenta eliminada exitosamente.")
        // Limpiar cookies en lugar de localStorage
        import("@/components/auth/cookie-service").then(({ clearAuthCookies }) => {
          clearAuthCookies()
          window.location.href = "/"
        })
      } else {
        const error = await res.json()
        alert(error.error || "Error al eliminar la cuenta")
      }
    } catch (err) {
      console.error("Error al eliminar cuenta:", err)
      alert("Error de red")
    }
  }

  return (
    <AuthGuard>
      <Layout currentPage={t("account.user")}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información */}
            <Card className="w-full">
              <CardHeader className="bg-black text-white p-4 rounded-t-lg">
                <Typography variant="h6">{t("common.information")}</Typography>
              </CardHeader>
              <CardBody className="space-y-4 bg-white p-6 rounded-b-lg">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha de nacimiento</label>
                  <Input
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div className="pt-4">
                  <Button onClick={handleUpdateGeneral} className="w-full bg-blue-500 text-white">
                    {t("common.saveChanges")}
                  </Button>
                </div>

                <div className="pt-6">
                  <Typography variant="h6">{t("account.deleteAccount")}</Typography>
                  <p className="text-sm text-gray-500">{t("account.deleteAccountWarning")}</p>
                  <Input
                    type="email"
                    placeholder="Confirma tu correo"
                    value={correoConfirmacion}
                    onChange={(e) => setCorreoConfirmacion(e.target.value)}
                    className="mt-2 w-full"
                  />
                  <Button color="red" className="w-full mt-3" onClick={handleDeleteAccount}>
                    {t("account.deleteAccount")}
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Acceso */}
            <Card className="w-full">
              <CardHeader className="bg-black text-white p-4 rounded-t-lg">
                <Typography variant="h6">{t("common.access")}</Typography>
              </CardHeader>
              <CardBody className="space-y-4 bg-white p-6 rounded-b-lg">
                <div>
                  <label className="text-sm font-medium">Email (no editable)</label>
                  <Input type="email" value={form.email} disabled className="w-full" />
                </div>
                <div>
                  <label className="text-sm font-medium">Contraseña actual</label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nueva contraseña</label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirmar contraseña</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </CardBody>
              <CardFooter className="bg-white p-6 rounded-b-lg">
                <Button onClick={handleUpdatePassword} className="w-full">
                  {t("common.changePassword")}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
