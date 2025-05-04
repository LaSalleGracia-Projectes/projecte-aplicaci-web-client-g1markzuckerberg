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
    username: "",
    password: "",
    is_admin: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentPage, setCurrentPage] = useState(1) // Estado para la página actual
  const usersPerPage = 10 // Número de usuarios por página

  // Usar getAuthToken en lugar de localStorage
  const token = typeof window !== "undefined" ? getAuthToken() : null
  const router = useRouter()

  useEffect(() => {
    if (!token) return

    const fetchUserInfo = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Error al obtener información del usuario")
        const data = await res.json()

        console.log("Respuesta del backend (/me):", data) // Depuración

        if (data.user && data.user.is_admin) {
          setIsAdmin(true)
        } else {
          setError("Acceso denegado. No tienes permisos de administrador.")
        }
      } catch (err) {
        setError(err.message)
      }
    }

    fetchUserInfo()
  }, [token])

  useEffect(() => {
    if (!isAdmin || !token) return

    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:3000/api/v1/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Error al obtener usuarios")
        const data = await res.json()
        setUsers(data.users || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isAdmin, token])

  const handleEditClick = async (userId) => {
    try {
      console.log("ID del usuario seleccionado:", userId) // Depuración

      if (!userId || typeof userId !== "number") {
        throw new Error("ID de usuario inválido")
      }

      const res = await fetch(`http://localhost:3000/api/v1/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error("Error al obtener datos del usuario")

      const data = await res.json()
      console.log("Datos del usuario seleccionado:", data.user) // Verifica que data.user tenga un id

      setSelectedUser(data.user) // Asegúrate de que selectedUser tenga un id
      setEditedUser({
        id: data.user.id, // Asegúrate de incluir el id aquí
        username: data.user.username || "",
        password: "", // Inicialmente vacío para evitar mostrar la contraseña anterior
        is_admin: data.user.is_admin || false,
      })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => {
      const updatedUser = { ...prev, [field]: value }
      console.log("Estado editedUser actualizado:", updatedUser) // Depuración
      return updatedUser
    })
  }

  const handleUpdateUser = async () => {
    if (!editedUser.id) {
      alert("No se ha seleccionado ningún usuario para actualizar.")
      return
    }

    // Validar campos obligatorios
    if (!editedUser.username || !editedUser.password) {
      alert("Por favor, completa todos los campos.")
      return
    }

    try {
      console.log("Datos enviados para actualizar:", editedUser) // Depuración

      const res = await fetch(`http://localhost:3000/api/v1/admin/update-user/${editedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editedUser.username,
          password: editedUser.password,
          is_admin: editedUser.is_admin,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Error desconocido")
      }

      alert("Usuario actualizado correctamente")

      const updated = users.map((u) => (u.id === editedUser.id ? { ...u, ...editedUser } : u))
      setUsers(updated)

      setSelectedUser(null)
      setEditedUser({})
    } catch (err) {
      console.error("Error al actualizar usuario:", err.message) // Depuración
      alert(err.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este usuario?")
    if (!confirm) return

    try {
      const res = await fetch(`http://localhost:3000/api/v1/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Error desconocido")
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId))
      alert("Usuario eliminado correctamente")
    } catch (err) {
      console.error("Error al eliminar usuario:", err.message) // Depuración
      alert(err.message)
    }
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (!isAdmin) {
    return <p>Cargando...</p>
  }

  // Calcular los usuarios visibles según la página actual
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

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
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.username}</td>
                  <td className="p-2">{user.is_admin ? "Sí" : "No"}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleEditClick(user.id)} // Asegúrate de que user.id sea válido
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

          {/* Botones de paginación */}
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {currentPage} de {Math.ceil(users.length / usersPerPage)}
            </span>
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(users.length / usersPerPage)))}
              disabled={currentPage === Math.ceil(users.length / usersPerPage)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {selectedUser && (
        <div className="mt-6 p-4 border bg-gray-100 rounded">
          <h2 className="text-lg font-bold mb-2">Editar Usuario</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                className="w-full p-1 border rounded"
                value={editedUser.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full p-1 border rounded"
                value={editedUser.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Administrador</label>
              <input
                type="checkbox"
                checked={editedUser.is_admin || false}
                onChange={(e) => handleInputChange("is_admin", e.target.checked)}
                className="mr-2"
              />
              <span>{editedUser.is_admin ? "Sí" : "No"}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleUpdateUser}>
              Guardar cambios
            </button>
            <button className="bg-gray-400 px-4 py-2 rounded" onClick={() => setSelectedUser(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
