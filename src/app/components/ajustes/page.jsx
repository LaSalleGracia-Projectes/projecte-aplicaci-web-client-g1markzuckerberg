"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import Link from "next/link"
import { ImageIcon } from 'lucide-react'
import AuthGuard from "@/components/authGuard/authGuard"
import { useLanguage } from "@/context/languageContext"

export default function Ajustes() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [popupType, setPopupType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingLeagueId, setLoadingLeagueId] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const [user, setUser] = useState(null)
  const [teamName, setTeamName] = useState("")
  const [teamImage, setTeamImage] = useState("")
  const [selectedImageFile, setSelectedImageFile] = useState(null)

  const [leagues, setLeagues] = useState([])

  const token = typeof window !== "undefined" ? localStorage.getItem("webToken") : null
  const API_BASE_URL = "http://localhost:3000/api/v1"

  useEffect(() => {
    if (token) fetchUserData()
  }, [token])

  const fetchUserData = async () => {
    try {
      const [userRes, leaguesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/user/leagues`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const userData = await userRes.json()
      const leaguesData = await leaguesRes.json()

      if (userRes.ok) {
        setUser(userData.user)
        setTeamName(userData.user.username)
        fetchUserImage()
      }

      if (leaguesRes.ok) {
        setLeagues(leaguesData.leagues || [])
      }
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }

  const fetchUserImage = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/get-image`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const blob = await res.blob()
        const imageUrl = URL.createObjectURL(blob)
        setTeamImage(imageUrl)
      }
    } catch (err) {
      console.error("Error fetching user image:", err)
    }
  }

  const openPopup = (type) => {
    setPopupType(type)
    setIsOpen(true)
    setErrorMessage("")
  }

  const handleSaveTeam = async () => {
    try {
      setIsLoading(true)

      const resName = await fetch(`${API_BASE_URL}/user/update-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: teamName }),
      })

      if (!resName.ok) throw new Error("Error actualizando el nombre")

      if (selectedImageFile) {
        const formData = new FormData()
        formData.append("image", selectedImageFile)

        const resImage = await fetch(`${API_BASE_URL}/user/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })

        if (!resImage.ok) throw new Error("Error subiendo la imagen")
      }

      alert("Cambios guardados correctamente")
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      setErrorMessage("Ocurrió un error al guardar los cambios")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImageFile(file)
      setTeamImage(URL.createObjectURL(file))
    }
  }

  const opciones = [
    {
      img: "/images/user.png",
      text: t("account.team"),
      action: () => openPopup("team"),
    },
    {
      img: "/images/gestion.png",
      text: t("account.leagueManagement"),
      action: () => openPopup("ligas"),
    },
    {
      img: "/images/proteccion.png",
      text: t("account.user"),
      action: "/components/cuenta",
    },
    {
      img: "/images/interfaz.png",
      text: t("account.interface"),
      action: "/components/interfaz",
    },
  ]

  return (
    <AuthGuard>
      <Layout currentPage={t("account.settings")}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
            {opciones.map((opcion, index) =>
              typeof opcion.action === "string" ? (
                <Link
                  key={index}
                  href={opcion.action}
                  className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-300 transition"
                >
                  <img
                    src={opcion.img || "/placeholder.svg"}
                    alt={opcion.text}
                    className="w-20 h-20 sm:w-24 sm:h-24 mb-2"
                  />
                  <p className="text-base sm:text-lg font-semibold text-center">{opcion.text}</p>
                </Link>
              ) : (
                <div
                  key={index}
                  onClick={opcion.action}
                  className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-300 transition"
                >
                  <img
                    src={opcion.img || "/placeholder.svg"}
                    alt={opcion.text}
                    className="w-20 h-20 sm:w-24 sm:h-24 mb-2"
                  />
                  <p className="text-base sm:text-lg font-semibold text-center">{opcion.text}</p>
                </div>
              ),
            )}
          </div>
        </div>

        {/* POPUP */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                aria-label={t("common.close")}
              >
                &times;
              </button>

              {popupType === "team" ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">{t("account.teamInfo")}</h2>

                  <div className="mb-4">
                    <label htmlFor="team-name" className="block text-sm font-medium mb-1">
                      {t("account.teamName")}
                    </label>
                    <input
                      id="team-name"
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">{t("account.teamImage")}</label>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {teamImage ? (
                          <img src={teamImage || "/placeholder.svg"} alt={t("account.teamLogo")} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                  </div>

                  {errorMessage && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">{errorMessage}</div>}

                  <button
                    onClick={handleSaveTeam}
                    disabled={isLoading}
                    className={`w-full ${
                      isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
                    } text-white py-2 px-4 rounded-md`}
                  >
                    {isLoading ? t("common.saving") : t("common.saveChanges")}
                  </button>
                </div>
              ) : popupType === "ligas" ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">{t("account.leagueManagement")}</h2>

                  {errorMessage && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">{errorMessage}</div>}

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {leagues.length > 0 ? (
                      leagues.map((league) => (
                        <div key={league.id || league._id} className="flex items-center bg-gray-100 rounded-md p-2">
                          <div className="flex-1">
                            <p className="font-semibold">{league.name || league.nombre}</p>
                            <p className="text-sm text-gray-600">{league.points || 0} pts</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">{t("account.noLeagues")}</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      {t("common.close")}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Layout>
    </AuthGuard>
  )
}
