"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import AuthGuard from "@/components/authGuard/authGuard"
import { useLiga } from "@/context/ligaContext"
import { Copy, Trophy, Edit, UserX, Users } from "lucide-react"
import { Button } from "@/components/ui"
import EditLigaDialog from "@/components/clasificacion/editLigaDialog"
import KickUserDialog from "@/components/clasificacion/kickUserDialog"
import { useLanguage } from "@/context/languageContext"

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
  const { t } = useLanguage()
  const { currentLiga, loading: ligaLoading, refreshLiga } = useLiga()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [leaveError, setLeaveError] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isKickDialogOpen, setIsKickDialogOpen] = useState(false)
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
              Authorization: `Bearer ${token}`,
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
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join(""),
      )

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
          setError(t("common.notAuthenticated"))
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
          throw new Error(errorData.error || t("league.errorFetchingUsers"))
        }

        const data = await res.json()
        console.log("Users data:", data)

        // Use data.users and extract points from puntos_acumulados
        const usersWithPoints = (data.users || []).map((user) => ({
          ...user,
          points: user.puntos_acumulados || 0, // Use puntos_acumulados for total points
        }))

        const sortedUsers = usersWithPoints.sort((a, b) => (b.points || 0) - (a.points || 0))

        const usersWithPosition = sortedUsers.map((user, index) => ({
          ...user,
          position: index + 1,
        }))

        setUsers(usersWithPosition)
      } catch (err) {
        console.error("Error in fetchUsers:", err)
        setError(err.message || t("common.errorLoadingUsers"))
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentLiga, t])

  const copyCode = () => {
    if (currentLiga?.code) {
      navigator.clipboard.writeText(currentLiga.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLeaveLeague = async () => {
    if (!currentLiga?.id) {
      setLeaveError(t("league.leagueNotFound"))
      return
    }

    try {
      const token = localStorage.getItem("webToken")
      if (!token) {
        setLeaveError(t("common.notAuthenticated"))
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
        const errorMessage = errorData?.error || t("league.errorLeavingLeague")
        throw new Error(errorMessage)
      }

      window.location.href = "/components/choose-league"
    } catch (err) {
      console.error("Error al abandonar la liga:", err)
      setLeaveError(err.message || t("league.errorLeavingLeague"))
    }
  }

  const handleEditSuccess = () => {
    // Utilizar refreshLiga para actualizar el contexto
    if (refreshLiga) {
      refreshLiga()
    }
  }

  const handleKickSuccess = () => {
    // Actualizar la lista de usuarios después de expulsar a alguien
    if (refreshLiga) {
      refreshLiga()
    }

    // Re-fetch users
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("webToken")
        if (!token || !currentLiga?.code) return

        const res = await fetch(`http://localhost:3000/api/v1/liga/users/${currentLiga.code}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          throw new Error(t("league.errorUpdatingUsers"))
        }

        const data = await res.json()

        // Use data.users and extract points from puntos_acumulados
        const usersWithPoints = (data.users || []).map((user) => ({
          ...user,
          points: user.puntos_acumulados || 0, // Use puntos_acumulados for total points
        }))

        const sortedUsers = usersWithPoints.sort((a, b) => (b.points || 0) - (a.points || 0))

        const usersWithPosition = sortedUsers.map((user, index) => ({
          ...user,
          position: index + 1,
        }))

        setUsers(usersWithPosition)
      } catch (err) {
        console.error("Error actualizando usuarios:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }

  // Imagen placeholder por defecto (solo para la liga)
  const leaguePlaceholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' fontFamily='Arial' fontSize='12' textAnchor='middle' dominantBaseline='middle' fill='%23999'%3ELiga%3C/text%3E%3C/svg%3E"

  if (ligaLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-4 border-t-[#e5e5ea] border-r-[#e5e5ea] border-b-[#e5e5ea] border-l-black rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">{t("league.loadingLeagueData")}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>{t("common.retry")}</Button>
      </div>
    )
  }

  if (!currentLiga) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-lg text-gray-700 mb-4">{t("league.notInLeague")}</p>
        <Button onClick={() => (window.location.href = "/components/choose-league")}>{t("league.joinLeague")}</Button>
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
                  src={leagueImageUrl || "/placeholder.svg"}
                  alt={t("league.leagueLogo")}
                  className="h-16 w-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = leaguePlaceholder
                  }}
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{currentLiga.name || currentLiga.nombre || t("league.myLeague")}</h1>
              <div className="flex items-center mt-2">
                <p className="text-gray-600 mr-2">{t("league.leagueCode")}</p>
                <p className="font-medium">{currentLiga.code}</p>
                <button
                  onClick={copyCode}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  aria-label={t("league.copyCode")}
                >
                  {copied ? (
                    <span className="text-green-500 text-sm">{t("league.copied")}!</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCaptain && (
              <>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4" />
                  {t("league.editLeague")}
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsKickDialogOpen(true)}>
                  <Users className="h-4 w-4" />
                  {t("league.managePlayers")}
                </Button>
              </>
            )}
            <Button backgroundcolor="red" variant="destructive" size="sm" className="gap-2" onClick={handleLeaveLeague}>
              {t("league.leaveLeague")}
            </Button>
          </div>
        </div>
        {leaveError && <p className="text-sm text-red-500 mt-2">{leaveError}</p>}
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {t("league.currentMatchday")} <span className="font-medium">{currentLiga.created_jornada || "N/A"}</span>
          </p>
        </div>
      </div>

      {/* Classification Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            {t("league.classification")}
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600">{t("league.noPlayersInLeague")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("league.position")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("league.player")}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("league.totalPoints")}
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("league.matchdayPoints")}
                  </th>

                  {isCaptain && (
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("league.actions")}
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
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username || user.correo}</div>
                          {user.username && user.correo && <div className="text-sm text-gray-500">{user.correo}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{user.puntos_acumulados || 0}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{user.puntos_jornada || 0}</div>
                    </td>

                    {isCaptain && user.id !== currentUserId && (
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          className="text-red-500 hover:text-red-700"
                          title={t("league.kickFromLeague")}
                          onClick={() => {
                            setIsKickDialogOpen(true)
                          }}
                        >
                          <UserX className="h-5 w-5" />
                        </button>
                      </td>
                    )}
                    {isCaptain && user.id === currentUserId && (
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {t("league.captain")}
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
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("league.totalPlayers")}</h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("league.maxPoints")}</h3>
          <p className="text-2xl font-bold">
            {users.length > 0 ? Math.max(...users.map((user) => user.puntos_acumulados || 0)) : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{t("league.avgPoints")}</h3>
          <p className="text-2xl font-bold">
            {users.length > 0
              ? Math.round(users.reduce((sum, user) => sum + (user.puntos_acumulados || 0), 0) / users.length)
              : 0}
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

      {/* Kick Users Dialog Component */}
      {isKickDialogOpen && (
        <KickUserDialog
          users={users}
          currentUserId={currentUserId}
          ligaId={currentLiga.id}
          onClose={() => setIsKickDialogOpen(false)}
          onSuccess={handleKickSuccess}
        />
      )}
    </div>
  )
}
