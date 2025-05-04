"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui"
// Import the cookie service
import { getAuthToken } from "@/components/auth/cookie-service"

export default function EditLigaDialog({ currentLiga, onClose, onSuccess }) {
  const [newLigaName, setNewLigaName] = useState("")
  const [ligaImage, setLigaImage] = useState(null)
  const [updateError, setUpdateError] = useState(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Actualizar el nombre de la liga cuando currentLiga cambie
  useEffect(() => {
    if (currentLiga) {
      // Comprobar todas las posibles propiedades para el nombre
      const ligaName = currentLiga.name || currentLiga.nombre || ""
      setNewLigaName(ligaName)
    }
  }, [currentLiga])

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLigaImage(e.target.files[0])
    }
  }

  const updateLigaName = async () => {
    if (!currentLiga?.id || !newLigaName.trim()) return

    try {
      // Use getAuthToken() instead of localStorage
      const token = getAuthToken()
      if (!token) {
        throw new Error("No estás autenticado")
      }

      console.log(`Actualizando nombre de liga: ${newLigaName}`)

      // IMPORTANTE: Cambié el cuerpo de la solicitud para enviar 'newName' en lugar de 'name'
      // para que coincida con lo que espera el controlador del backend
      const res = await fetch(`http://localhost:3000/api/v1/liga/update-name/${currentLiga.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: newLigaName }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${res.status}: No se pudo actualizar el nombre de la liga`)
      }

      return true
    } catch (err) {
      console.error("Error al actualizar nombre:", err)
      throw err
    }
  }

  // Modificar la función uploadLigaImage para usar el nombre de campo correcto 'image'
  const uploadLigaImage = async () => {
    if (!currentLiga?.id || !ligaImage) return

    try {
      // Use getAuthToken() instead of localStorage
      const token = getAuthToken()
      if (!token) {
        throw new Error("No estás autenticado")
      }

      const formData = new FormData()
      // Cambiar el nombre del campo a 'image' para que coincida con lo que espera el backend
      formData.append("image", ligaImage)

      // Debug - check what's being sent
      console.log("Uploading image:", ligaImage.name, "Size:", ligaImage.size)

      // Don't set Content-Type header when sending FormData
      // The browser will automatically set the correct Content-Type with boundary
      const res = await fetch(`http://localhost:3000/api/v1/liga/${currentLiga.id}/upload-image`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Remove Content-Type header - let browser set it automatically for FormData
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${res.status}: No se pudo subir la imagen de la liga`)
      }

      return true
    } catch (err) {
      console.error("Error al subir imagen:", err)
      throw err
    }
  }

  // Modificar la función handleSaveChanges para recargar la página después de guardar cambios
  const handleSaveChanges = async () => {
    setUpdateError(null)
    setUpdateSuccess(false)
    setLoading(true)

    try {
      // Actualizaciones a realizar
      const updates = []

      // Actualizar nombre si ha cambiado
      if (newLigaName !== (currentLiga?.name || currentLiga?.nombre)) {
        updates.push(updateLigaName())
      }

      // Subir imagen si se ha seleccionado
      if (ligaImage) {
        updates.push(uploadLigaImage())
      }

      // Si no hay actualizaciones, simplemente cerrar
      if (updates.length === 0) {
        onClose()
        return
      }

      // Ejecutar todas las actualizaciones
      await Promise.all(updates)

      setUpdateSuccess(true)
      // Llamar a onSuccess inmediatamente para actualizar el contexto
      if (onSuccess) onSuccess()

      // Recargar la página después de un breve retraso para mostrar el mensaje de éxito
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setUpdateError(err.message || "Error al actualizar la liga")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Editar Liga</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Modifica la información de tu liga</p>
        <div className="space-y-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Nombre
            </label>
            <div className="col-span-3">
              <input
                id="name"
                type="text"
                value={newLigaName || ""}
                onChange={(e) => setNewLigaName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Nombre de la liga"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="image" className="text-right text-sm font-medium">
              Imagen
            </label>
            <div className="col-span-3">
              <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm" />
            </div>
          </div>
          {updateError && <div className="text-red-500 text-sm mt-2">{updateError}</div>}
          {updateSuccess && <div className="text-green-500 text-sm mt-2">¡Cambios guardados con éxito!</div>}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
    </div>
  )
}
