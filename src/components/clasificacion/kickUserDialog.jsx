// components/clasificacion/kickUserDialog.jsx
"use client"

import { useState, useEffect } from "react"
import { UserX, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui"

export default function KickUserDialog({ users, currentUserId, onClose, onSuccess, ligaId }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  
  // Filter out the current user (captain)
  const kickableUsers = users.filter(user => user.id !== currentUserId)
  
  const handleKickUser = async () => {
    if (!selectedUser) return
    
    setLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem("webToken")
      if (!token) {
        throw new Error("No estás autenticado")
      }
      
      // Fix: Use the correct API endpoint format and ensure proper error handling
      const res = await fetch(`http://localhost:3000/api/v1/liga/kickUser/${ligaId}/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Error ${res.status}` }))
        throw new Error(errorData.error || `Error ${res.status}: No se pudo expulsar al usuario`)
      }
      
      // Notify parent component about successful operation
      if (onSuccess) {
        onSuccess()
      }
      
      // Close confirmation dialog and then the main dialog
      setConfirmDialogOpen(false)
      onClose()
    } catch (err) {
      console.error("Error al expulsar al usuario:", err)
      setError(err.message || "Error al intentar expulsar al usuario")
    } finally {
      setLoading(false)
    }
  }
  
  const openConfirmDialog = (user) => {
    setSelectedUser(user)
    setConfirmDialogOpen(true)
  }
  
  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false)
    setSelectedUser(null)
  }
  
  // Default placeholder for user images
  const defaultPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='8' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EUser%3C/text%3E%3C/svg%3E"

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Dialog Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <UserX className="h-5 w-5 mr-2 text-red-500" />
            Expulsar Jugadores
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Dialog Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {kickableUsers.length === 0 ? (
            <p className="text-center py-6 text-gray-600">
              No hay otros jugadores en esta liga.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Selecciona un jugador para expulsarlo de la liga. Esta acción no se puede deshacer.
              </p>
              
              <ul className="divide-y divide-gray-200">
                {kickableUsers.map((user) => (
                  <li key={user.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.imageUrl || defaultPlaceholder}
                          alt={user.nombre || user.correo}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = defaultPlaceholder
                          }}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.nombre || "Usuario"}</p>
                          <p className="text-sm text-gray-500">{user.correo}</p>
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => openConfirmDialog(user)}
                      >
                        Expulsar
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Dialog Footer */}
        <div className="p-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {confirmDialogOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold">Confirmar expulsión</h3>
            </div>
            
            <p className="mb-6">
              ¿Estás seguro de que quieres expulsar a <span className="font-semibold">{selectedUser.nombre || selectedUser.correo}</span> de la liga? Esta acción no se puede deshacer.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={closeConfirmDialog}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleKickUser}
                disabled={loading}
              >
                {loading ? "Expulsando..." : "Expulsar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}