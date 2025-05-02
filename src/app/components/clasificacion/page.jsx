"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import AuthGuard from "@/components/authGuard/authGuard"
import { useLiga } from "@/context/ligaContext"
import { Share2, Copy, Trophy, ArrowUp, ArrowDown, Minus, Edit, UserX } from "lucide-react"
import { Button } from "@/components/ui"
import EditLigaDialog from "@/components/clasificacion/editLigaDialog"

export default function Clasificacion() {
  return (
    <AuthGuard>
      <Layout currentPage="Clasificacion">
        <ClasificacionContent />
      </Layout>
    </AuthGuard>
  )
}

function ClasificacionContent() {
  const { currentLiga, loading: ligaLoading, refreshLiga } = useLiga() // Añadir refreshLiga aquí
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [leaveError, setLeaveError] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCaptain, setIsCaptain] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [leagueImageUrl, setLeagueImageUrl] = useState(null)
  
  // Fetch current user and check if is captain
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("webToken")
        if (!token) return
        
        // Get current user ID from token
        const userId = getUserIdFromToken(token)
        setCurrentUserId(userId)
        
        if (userId && currentLiga?.id) {
          const res = await fetch(`http://localhost:3000/api/v1/liga/${currentLiga.id}/user/${userId}`, {
            headers: { 
              Authorization: `Bearer ${token}` 
            },
          })
          
          if (res.ok) {
            const data = await res.json()
            setIsCaptain(data.user.is_capitan)
          }
        }
      } catch (err) {
        console.error("Error checking captain status:", err)
      }
    }
    
    fetchCurrentUser()
  }, [currentLiga])
  
  // Fetch league image
  useEffect(() => {
    if (currentLiga?.id) {
      setLeagueImageUrl(`http://localhost:3000/api/v1/liga/image/${currentLiga.id}`)
    }
  }, [currentLiga])

  // Helper function to extract user ID from token
  const getUserIdFromToken = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      
      return JSON.parse(jsonPayload).id
    } catch (error) {
      console.error("Error extracting user ID from token:", error)
      return null
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentLiga?.code) {
        console.log("No current liga or liga code found")
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("webToken")
        if (!token) {
          setError("No estás autenticado")
          setLoading(false)
          return
        }

        console.log("Fetching users for liga code:", currentLiga.code)

        const res = await fetch(`http://localhost:3000/api/v1/liga/users/${currentLiga.code}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          console.error("Error fetching users:", res.status, errorData)
          throw new Error(errorData.error || `Error ${res.status}: No se pudieron obtener los usuarios de la liga`)
        }

        const data = await res.json()
        console.log("Users data:", data)

        const sortedUsers = (data.users || []).sort((a, b) => (b.points || 0) - (a.points || 0))

        const usersWithPosition = sortedUsers.map((user, index) => ({
          ...user,
          position: index + 1,
          trend: Math.floor(Math.random() * 3) - 1,
        }))

        setUsers(usersWithPosition)
      } catch (err) {
        console.error("Error in fetchUsers:", err)
        setError(err.message || "Error al cargar usuarios")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentLiga])

  const copyCode = () => {
    if (currentLiga?.code) {
      navigator.clipboard.writeText(currentLiga.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLeaveLeague = async () => {
    if (!currentLiga?.id) {
      setLeaveError("No se encontró la liga.")
      return
    }

    try {
      const token = localStorage.getItem("webToken")
      if (!token) {
        setLeaveError("No estás autenticado.")
        return
      }

      const res = await fetch(`http://localhost:3000/api/v1/liga/leave/${currentLiga.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData?.error || `Error ${res.status}: No se pudo abandonar la liga`
        throw new Error(errorMessage)
      }

      window.location.href = "/components/choose-league"
    } catch (err) {
      console.error("Error al abandonar la liga:", err)
      setLeaveError(err.message || "Error al intentar abandonar la liga")
    }
  }

  const handleEditSuccess = () => {
    // Utilizar refreshLiga para actualizar el contexto
    if (refreshLiga) {
      refreshLiga()
    }
  }

  // Imagen placeholder por defecto
  const defaultPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='8' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EUser%3C/text%3E%3C/svg%3E"
  const leaguePlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3ELiga%3C/text%3E%3C/svg%3E"

  if (ligaLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-4 border-t-[#e5e5ea] border-r-[#e5e5ea] border-b-[#e5e5ea] border-l-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Cargando datos de la liga...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    )
  }

  if (!currentLiga) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-lg text-gray-700 mb-4">No estás inscrito en ninguna liga</p>
        <Button onClick={() => (window.location.href = "/components/choose-league")}>Unirse a una Liga</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* League Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {leagueImageUrl && (
              <div className="mr-4">
                <img 
                  src={leagueImageUrl} 
                  alt="Logo de la liga" 
                  className="h-16 w-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = leaguePlaceholder
                  }}
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{currentLiga.name || currentLiga.nombre || "Mi Liga"}</h1>
              <div className="flex items-center mt-2">
                <p className="text-gray-600 mr-2">Código:</p>
                <p className="font-medium">{currentLiga.code}</p>
                <button 
                  onClick={copyCode} 
                  className="ml-2 text-gray-500 hover:text-gray-700" 
                  aria-label="Copiar código"
                >
                  {copied ? <span className="text-green-500 text-sm">¡Copiado!</span> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCaptain && (
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4" />
                Editar Liga
              </Button>
            )}
            <Button variant="destructive" size="sm" className="gap-2" onClick={handleLeaveLeague}>
              Abandonar Liga
            </Button>
          </div>
        </div>
        {leaveError && (
          <p className="text-sm text-red-500 mt-2">
            {leaveError}
          </p>
        )}
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Jornada actual: <span className="font-medium">{currentLiga.created_jornada || "N/A"}</span>
          </p>
        </div>
      </div>

      {/* Classification Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Clasificación
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600">No hay jugadores en esta liga todavía.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jugador
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntos
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
                  </th>
                  {isCaptain && (
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.position}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.imageUrl || defaultPlaceholder}
                            alt={user.nombre || user.correo}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = defaultPlaceholder
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.nombre || user.correo}</div>
                          {user.nombre && <div className="text-sm text-gray-500">{user.correo}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{user.points || 0}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {user.trend === 1 ? (
                        <ArrowUp className="h-5 w-5 text-green-500 mx-auto" />
                      ) : user.trend === -1 ? (
                        <ArrowDown className="h-5 w-5 text-red-500 mx-auto" />
                      ) : (
                        <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    {isCaptain && user.id !== currentUserId && (
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button 
                          className="text-red-500 hover:text-red-700" 
                          title="Expulsar de la liga"
                        >
                          <UserX className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                    {isCaptain && user.id === currentUserId && (
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Capitán
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* League Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total de jugadores</h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Puntos máximos</h3>
          <p className="text-2xl font-bold">
            {users.length > 0 ? Math.max(...users.map((user) => user.points || 0)) : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Puntos promedio</h3>
          <p className="text-2xl font-bold">
            {users.length > 0 ? Math.round(users.reduce((sum, user) => sum + (user.points || 0), 0) / users.length) : 0}
          </p>
        </div>
      </div>

      {/* Edit League Dialog Component */}
      {isEditDialogOpen && (
        <EditLigaDialog 
          currentLiga={currentLiga}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}