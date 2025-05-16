"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// Importar el servicio de cookies
import { getAuthToken } from "@/components/auth/cookie-service"

export const dynamic = "force-dynamic"

export default function BackOfficePage() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [editedUser, setEditedUser] = useState({
    id: null,
    username: "",
    birthDate: "",
    is_admin: false,
    password: ""
  })
  const [supportMessages, setSupportMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  const token = typeof window !== "undefined" ? getAuthToken() : null
  const router = useRouter()
  const API_BASE = "https://subirfantasydraftbackend.onrender.com/api/v1"

  // 1) Verificar permisos de admin
  useEffect(() => {
    if (!token) return
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error("Error al obtener info de usuario")
        const { user } = await res.json()
        if (user?.is_admin) setIsAdmin(true)
        else setError("Acceso denegado. No eres administrador.")
      } catch (err) {
        setError(err.message)
      }
    })()
  }, [token])

  // 2) Cargar usuarios y mensajes de soporte
  useEffect(() => {
    if (!isAdmin || !token) return
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [uRes, mRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/contactForm/getAll`, { headers: { Authorization: `Bearer ${token}` } })
        ])
        if (!uRes.ok) throw new Error("Error al obtener usuarios")
        if (!mRes.ok) throw new Error("Error al obtener mensajes de soporte")

        const { users } = await uRes.json()
        const msgs = await mRes.json()
        setUsers(users || [])
        setSupportMessages(
          Array.isArray(msgs) ? msgs.map(m => ({ ...m, id: m._id })) : []
        )
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [isAdmin, token])

  // 3) Abrir formulario de edición
  const handleEditClick = async userId => {
    try {
      const res = await fetch(`${API_BASE}/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error("Error al obtener datos del usuario")
      const { user } = await res.json()

      // fallback: si backend no devuelve id, usamos userId
      const effectiveId = user?.id ?? userId

      setSelectedUser({ ...user, id: effectiveId })
      setEditedUser({
        id: effectiveId,
        username: user?.username ?? "",
        birthDate: user?.birthDate?.split("T")[0] || "",
        is_admin: user?.is_admin ?? false,
        password: ""
      })
    } catch (err) {
      alert(err.message)
    }
  }

  // 4) Manejar cambios en inputs
  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }))
  }

  // 5) Enviar actualización (fecha opcional)
  const handleUpdateUser = async () => {
    const userId = editedUser.id ?? selectedUser?.id
    if (!userId) {
      alert("No se ha seleccionado ningún usuario para actualizar.")
      return
    }
    if (!editedUser.username) {
      alert("El campo 'username' es obligatorio.")
      return
    }
    try {
      // sólo incluimos birthDate si el usuario la ha rellenado
      const payload = {
        username: editedUser.username,
        ...(editedUser.birthDate && { birthDate: editedUser.birthDate }),
        is_admin: editedUser.is_admin,
        ...(editedUser.password ? { password: editedUser.password } : {})
      }

      const res = await fetch(
        `${API_BASE}/admin/update-user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      )
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || "Error al actualizar")

      // Actualizar lista local
      setUsers(prev =>
        prev.map(u =>
          u.id === body.user.id
            ? {
                ...body.user,
                birthDate: body.user.birthDate
                  ? body.user.birthDate.split("T")[0]
                  : ""
              }
            : u
        )
      )
      setSelectedUser(null)
      setEditedUser({ id: null, username: "", birthDate: "", is_admin: false, password: "" })
      alert("Usuario actualizado correctamente")
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  // 6) Eliminar usuario
  const handleDeleteUser = async userId => {
    if (!window.confirm("¿Eliminar este usuario?")) return
    try {
      const res = await fetch(
        `${API_BASE}/admin/delete-user/${userId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      )
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || "Error al eliminar")
      setUsers(prev => prev.filter(u => u.id !== userId))
      alert("Usuario eliminado correctamente")
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  // 7) Actualizar estado de mensaje de soporte
  const handleUpdateSupportMessage = async (msgId, resolved) => {
    try {
      const res = await fetch(
        `${API_BASE}/contactForm/update/${msgId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ resolved })
        }
      )
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || "Error desconocido")
      setSupportMessages(prev => prev.map(m => (m.id === msgId ? { ...m, resolved } : m)))
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  if (error) return <p className="text-red-500">{error}</p>
  if (!isAdmin) return <p>Cargando...</p>

  // Paginación
  const last = currentPage * usersPerPage
  const first = last - usersPerPage
  const currentUsers = users.slice(first, last)
  const totalPages = Math.ceil(users.length / usersPerPage)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <p>No hay usuarios disponibles.</p>
      ) : (
        <>
          <table className="w-full border text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Usuario</th>
                <th className="p-2">Administrador</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.is_admin ? "Sí" : "No"}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleEditClick(user.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {selectedUser && (
        <div className="mt-6 p-4 border bg-gray-100 rounded">
          <h2 className="text-lg font-bold mb-2">
            Editar Usuario #{editedUser.id}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Fecha de Nacimiento</label>
              <input
                type="date"
                className="w-full p-1 border rounded"
                value={editedUser.birthDate}
                onChange={e => handleInputChange("birthDate", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                className="w-full p-1 border rounded"
                value={editedUser.username}
                onChange={e => handleInputChange("username", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full p-1 border rounded"
                value={editedUser.password}
                onChange={e => handleInputChange("password", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Administrador</label>
              <input
                type="checkbox"
                className="mr-2"
                checked={editedUser.is_admin}
                onChange={e => handleInputChange("is_admin", e.target.checked)}
              />
              <span>{editedUser.is_admin ? "Sí" : "No"}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleUpdateUser}
            >
              Guardar cambios
            </button>
            <button
              className="bg-gray-400 px-4 py-2 rounded"
              onClick={() => setSelectedUser(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 border bg-gray-100 rounded">
        <h2 className="text-lg font-bold mb-2">Mensajes de Soporte</h2>
        <table className="w-full border text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Mensaje</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {supportMessages.length > 0 ? (
              supportMessages.map(msg => (
                <tr key={msg.id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{msg.id}</td>
                  <td className="p-2">{msg.correo}</td>
                  <td className="p-2">{msg.mensaje}</td>
                  <td className="p-2">{msg.resolved ? "Resuelto" : "Pendiente"}</td>
                  <td className="p-2">
                    <button
                      className={`px-2 py-1 rounded ${
                        msg.resolved ? "bg-green-500" : "bg-red-500"
                      } text-white`}
                      onClick={() => handleUpdateSupportMessage(msg.id, !msg.resolved)}
                    >
                      {msg.resolved ? "Marcar como pendiente" : "Marcar como resuelto"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center">
                  No hay mensajes de soporte disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}