"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/layout"
import AuthGuard from "@/components/authGuard/authGuard"
import LeagueMessage from "@/components/home_log/mensajes"
import { useLanguage } from "@/context/languageContext"

export default function Notificaciones() {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (typeof window === "undefined") return

        const token = localStorage.getItem("webToken")
        if (!token) {
          console.error("No auth token found")
          return
        }

        const response = await fetch("http://localhost:3000/api/v1/user/notifications", {
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
                <LeagueMessage key={n.id} type={parseNotificationType(n.mensaje)} message={n.mensaje} />
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
