"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/layout"
import AuthGuard from "@/components/authGuard/authGuard"
import LeagueMessage from "@/components/home_log/mensajes"
import { useLanguage } from "@/context/languageContext"
// Importar el servicio de cookies al principio del archivo
import { getAuthToken } from "@/components/auth/cookie-service"

export default function Notificaciones() {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (typeof window === "undefined") return

        // Reemplazar localStorage.getItem("webToken") con getAuthToken()
        const token = getAuthToken()
        if (!token) {
          console.error("No auth token found")
          return
        }

        const response = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          console.error("Failed to fetch notifications")
          return
        }

        const data = await response.json()

        const sorted = data.notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        setNotifications(sorted)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  const parseNotificationType = (mensaje) => {
    const lower = mensaje.toLowerCase()
    if (lower.includes("creado") || lower.includes("unido")) return "join"
    if (lower.includes("salido") || lower.includes("eliminado")) return "leave"
    if (lower.includes("posición") || lower.includes("cambio")) return "position"
    return "kick"
  }

  // Then, add a new function to translate notification messages
  const translateNotificationMessage = (message) => {
    // Get the original message in Spanish
    const originalMessage = message

    // Create patterns to match different types of notifications
    const patterns = {
      leagueCreated: {
        regex: /Has creado la liga (.*) correctamente/,
        translationKey: "notifications.leagueCreated",
      },
      leagueJoined: {
        regex: /Te has unido a la liga (.*) con éxito/,
        translationKey: "notifications.leagueJoined",
      },
      playerKicked: {
        regex: /Has expulsado a (.*) de la liga (.*)/,
        translationKey: "notifications.playerKicked",
      },
      // Add more patterns as needed
    }

    // Try to match the message with one of our patterns
    for (const [type, pattern] of Object.entries(patterns)) {
      const match = message.match(pattern.regex)

      if (match) {
        // If we have a match, get the dynamic parts (like league name)
        if (type === "leagueCreated") {
          const leagueName = match[1]
          return t(pattern.translationKey, { leagueName })
        } else if (type === "leagueJoined") {
          const leagueName = match[1]
          return t(pattern.translationKey, { leagueName })
        } else if (type === "playerKicked") {
          const playerName = match[1]
          const leagueName = match[2]
          return t(pattern.translationKey, { playerName, leagueName })
        }
      }
    }

    // If no pattern matches, return the original message
    return message
  }

  // Now modify the return statement to use the translation function
  return (
    <AuthGuard>
      <Layout currentPage={t("menu.home")}>
        <main className="p-8 space-y-4">
          <h1 className="text-2xl font-bold mb-4">{t("home.notifications")}</h1>
          {notifications.length === 0 ? (
            <p className="text-gray-500">{t("home.noNotifications")}</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 10).map((n) => (
                <LeagueMessage
                  key={n.id}
                  type={parseNotificationType(n.mensaje)}
                  message={translateNotificationMessage(n.mensaje)}
                />
              ))}
              {notifications.length > 10 && (
                <p className="text-sm text-gray-400">{t("home.showingRecentNotifications")}</p>
              )}
            </div>
          )}
        </main>
      </Layout>
    </AuthGuard>
  )
}
