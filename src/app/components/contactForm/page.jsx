"use client"

import { useState } from "react"
import Layout from "@/components/layout"
import AuthGuard from "@/components/authGuard/authGuard"
import { useRouter } from "next/navigation"
// Importar el servicio de cookies
import { getAuthToken } from "@/components/auth/cookie-service"
// Importar el hook de idioma
import { useLanguage } from "@/context/languageContext"

export default function ContactForm() {
  const { t } = useLanguage() // Añadir el hook de idioma
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      // Usar getAuthToken en lugar de localStorage
      const token = getAuthToken()

      if (!token) {
        setError(t("common.notAuthenticated"))
        setIsSubmitting(false)
        return
      }

      const response = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/contactForm/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mensaje: message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ha ocurrido un error al enviar el formulario")
      }

      setSuccess(t("common.success"))
      setMessage("")
    } catch (error) {
      setError(error.message || "Ha ocurrido un error al enviar el formulario")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-4 px-6 sm:px-8 md:px-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">{t("contactForm.title")}</h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-full max-w-lg">
            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-lg">
            <p>{error}</p>
          </div>
        )}

        <div className="w-full max-w-lg bg-white shadow-md rounded-lg px-6 py-6 sm:px-8 sm:py-8 space-y-4">
          <p className="text-gray-700 text-sm sm:text-base mb-4">{t("contactForm.description")}</p>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
              {t("contactForm.messageLabel")}
            </label>
            <textarea
              id="message"
              placeholder={t("contactForm.messagePlaceholder")}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base text-gray-700 shadow-sm focus:outline-none focus:ring focus:border-blue-300 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded w-full sm:w-auto"
            >
              {t("contactForm.back")}
            </button>

            <button
              type="button"
              disabled={isSubmitting || !message.trim()}
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full sm:w-auto disabled:opacity-50"
            >
              {isSubmitting ? t("contactForm.sending") : t("contactForm.send")}
            </button>
          </div>
        </div>
        <AuthGuard />
      </main>
    </Layout>
  )
}
