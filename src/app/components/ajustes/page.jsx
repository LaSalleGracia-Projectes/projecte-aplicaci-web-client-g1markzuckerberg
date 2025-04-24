"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import Link from "next/link"
import { ImageIcon, Trash2 } from "lucide-react"
import AuthGuard from "@/components/authGuard/authGuard"

export default function Ajustes() {
  const [isOpen, setIsOpen] = useState(false)
  const [popupType, setPopupType] = useState("")

  const [user, setUser] = useState(null)
  const [teamName, setTeamName] = useState("")
  const [teamImage, setTeamImage] = useState("")
  const [selectedImageFile, setSelectedImageFile] = useState(null)

  const [leagues, setLeagues] = useState([])

  const token = typeof window !== "undefined" ? localStorage.getItem("webToken") : null

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, leaguesRes] = await Promise.all([
          fetch("http://localhost:3000/api/v1/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/v1/user/leagues", {
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
        const res = await fetch("http://localhost:3000/api/v1/user/get-image", {
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

    if (token) fetchUserData()
  }, [token])

  const openPopup = (type) => {
    setPopupType(type)
    setIsOpen(true)
  }

  const handleSaveTeam = async () => {
    try {
      const resName = await fetch("http://localhost:3000/api/v1/user/update-username", {
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

        const resImage = await fetch("http://localhost:3000/api/v1/user/upload-image", {
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
      alert("Ocurrió un error al guardar los cambios")
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImageFile(file)
      setTeamImage(URL.createObjectURL(file))
    }
  }

  const handleLeaveLeague = async (leagueId) => {
    try {
      const confirmed = confirm("¿Estás seguro de que deseas abandonar esta liga?")
      if (!confirmed) return

      const res = await fetch(`http://localhost:3000/api/v1/ligas/leave/${leagueId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error al abandonar la liga")

      setLeagues((prev) => prev.filter((l) => l.id !== leagueId && l._id !== leagueId))
      alert("Has abandonado la liga correctamente.")
    } catch (err) {
      console.error("Error al abandonar la liga:", err)
      alert(err.message || "No se pudo abandonar la liga.")
    }
  }

  const opciones = [
    {
      img: "/images/user.png",
      text: "Equipo",
      action: () => openPopup("team"),
    },
    {
      img: "/images/gestion.png",
      text: "Gestión de ligas",
      action: () => openPopup("ligas"),
    },
    {
      img: "/images/proteccion.png",
      text: "Usuario",
      action: "/components/cuenta",
    },
    {
      img: "/images/interfaz.png",
      text: "Interfaz",
      action: "/components/interfaz",
    },
  ]

  return (
    <AuthGuard>
      <Layout currentPage="Ajustes">
        <div className="h-screen flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl h-[90vh] p-4">
            {opciones.map((opcion, index) =>
              typeof opcion.action === "string" ? (
                <Link
                  key={index}
                  href={opcion.action}
                  className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-300"
                >
                  <img src={opcion.img || "/placeholder.svg"} alt={opcion.text} className="w-24 h-24 mb-2" />
                  <p className="text-lg font-semibold">{opcion.text}</p>
                </Link>
              ) : (
                <div
                  key={index}
                  onClick={opcion.action}
                  className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-300"
                >
                  <img src={opcion.img || "/placeholder.svg"} alt={opcion.text} className="w-24 h-24 mb-2" />
                  <p className="text-lg font-semibold">{opcion.text}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* POPUP */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              {popupType === "team" ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">Información del Equipo</h2>

                  <div className="mb-4">
                    <label htmlFor="team-name" className="block text-sm font-medium mb-1">
                      Nombre del equipo
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
                    <label className="block text-sm font-medium mb-1">Imagen del equipo</label>
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {teamImage ? (
                          <img src={teamImage} alt="Team logo" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveTeam}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Guardar cambios
                  </button>
                </div>
              ) : popupType === "ligas" ? (
                <div>
                  <h2 className="text-xl font-bold mb-4">Gestión de Ligas</h2>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {leagues.length > 0 ? (
                      leagues.map((league) => (
                        <div key={league.id || league._id} className="flex items-center bg-gray-100 rounded-md p-2">
                          <div className="flex-1">
                            <p className="font-semibold">{league.name || league.nombre}</p>
                            <p className="text-sm text-gray-600">{league.points || 0} pts</p>
                          </div>
                          <button
                            onClick={() => handleLeaveLeague(league.id || league._id)}
                            className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                          >
                            Abandonar
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No estás en ninguna liga actualmente.</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                      Cerrar
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
