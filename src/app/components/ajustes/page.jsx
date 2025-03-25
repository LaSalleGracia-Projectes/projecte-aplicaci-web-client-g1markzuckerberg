"use client"

import { useState } from "react"
import Layout from "@/components/layout"
import Link from "next/link"
import { ImageIcon, Trash2 } from "lucide-react"
import AuthGuard from "@/components/authGuard/authGuard"

export default function Ajustes() {
  const [isOpen, setIsOpen] = useState(false)
  const [popupContent, setPopupContent] = useState("")
  const [popupType, setPopupType] = useState("")

  // Team data state
  const [teamName, setTeamName] = useState("Mi Equipo")
  const [teamImage, setTeamImage] = useState("/images/user.png")

  // League data state
  const [leagues, setLeagues] = useState([
    { id: 1, name: "Nombre de la liga", points: "X PTS" },
    { id: 2, name: "Nombre de la liga", points: "Y PTS" },
    { id: 3, name: "Nombre de la liga", points: "Z PTS" },
  ])

  const openPopup = (content, type = "text") => {
    setPopupContent(content)
    setPopupType(type)
    setIsOpen(true)
  }

  const handleSaveTeam = () => {
    // Here you would typically save the data to your backend
    console.log("Saving team data:", { teamName, teamImage })
    setIsOpen(false)
  }

  const handleImageChange = () => {
    // In a real implementation, this would open a file picker
    // For now, we'll just simulate changing the image
    alert("Esta funcionalidad estará disponible próximamente")
  }

  const handleDeleteLeague = (id) => {
    setLeagues(leagues.filter((league) => league.id !== id))
  }

  const opciones = [
    {
      img: "/images/user.png",
      text: "Equipo",
      action: () => openPopup("", "team"),
    },
    {
      img: "/images/gestion.png",
      text: "Gestion de ligas",
      action: () => openPopup("", "ligas"),
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
            ),
          )}
        </div>
      </div>

      {/* Popup implementation */}
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
                    placeholder="Introduce el nombre del equipo"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Imagen del equipo</label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {teamImage ? (
                        <img
                          src={teamImage || "/placeholder.svg"}
                          alt="Team logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={handleImageChange}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cambiar imagen
                    </button>
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
                <div className="space-y-2">
                  {leagues.map((league) => (
                    <div key={league.id} className="flex items-center bg-gray-100 rounded-md p-2">
                      <span className="mr-2">{league.id}.</span>
                      <div className="flex-1 bg-gray-200 rounded-md px-3 py-2">{league.name}</div>
                      <span className="mx-2">{league.points}</span>
                      <button
                        onClick={() => handleDeleteLeague(league.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
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
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Información</h2>
                <p className="mb-4">{popupContent}</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Layout>
    </AuthGuard>
  )
}
