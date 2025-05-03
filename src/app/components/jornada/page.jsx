"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout"
import AuthGuard from "@/components/authGuard/authGuard"
import { useLiga } from "@/context/ligaContext"
import Formacion433 from "@/components/formaciones/formacion-433"
import Formacion343 from "@/components/formaciones/formacion-343"
import Formacion442 from "@/components/formaciones/formacion-442"
import SeleccionFormacion from "@/components/jornada/seleccion-formacion"
import EditorFormacion from "@/components/jornada/editor-formacion"
import { useLanguage } from "@/context/languageContext"

export default function Jornada() {
  const { t } = useLanguage()
  const { currentLiga } = useLiga()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [plantilla, setPlantilla] = useState(null)
  const [players, setPlayers] = useState([])

  // Estados para la creación de draft
  const [creandoDraft, setCreandoDraft] = useState(false)
  const [formacionSeleccionada, setFormacionSeleccionada] = useState(null)
  const [tempDraft, setTempDraft] = useState(null)
  const [guardandoDraft, setGuardandoDraft] = useState(false)
  const [draftGuardado, setDraftGuardado] = useState(false)

  useEffect(() => {
    const fetchUserDraft = async () => {
      if (!currentLiga?.id) {
        setError("No hay una liga seleccionada")
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

        const response = await fetch(`http://localhost:3000/api/v1/draft/getuserDraft?ligaId=${currentLiga.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          // Para cualquier error (404, 500, etc.), permitir crear un nuevo draft
          console.log(`Error al obtener draft: ${response.status}`)
          setPlantilla(null)
          setLoading(false)
          return
        }

        const data = await response.json()
        setPlantilla(data.plantilla)
        setPlayers(data.players)
      } catch (err) {
        console.error("Error al obtener el draft:", err)
        // En caso de cualquier error, permitir crear un nuevo draft
        setPlantilla(null)
        setError(null) // Limpiamos el error para mostrar la opción de crear draft
      } finally {
        setLoading(false)
      }
    }

    fetchUserDraft()
  }, [currentLiga, draftGuardado])

  const handleCrearDraft = async (formacion) => {
    if (!currentLiga?.id) {
      setError("No hay una liga seleccionada")
      return
    }

    setFormacionSeleccionada(formacion)
    setCreandoDraft(true)
    setLoading(true)
    setError(null) // Limpiar errores anteriores

    try {
      const token = localStorage.getItem("webToken")
      if (!token) {
        throw new Error("No estás autenticado")
      }

      console.log("Creando draft con formación:", formacion, "para liga:", currentLiga.id)

      // 1. Crear el draft con la formación seleccionada
      const createResponse = await fetch("http://localhost:3000/api/v1/draft/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          formation: formacion,
          ligaId: currentLiga.id,
        }),
      })

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${createResponse.status}: No se pudo crear el draft`)
      }

      console.log("Draft creado correctamente, obteniendo jugadores disponibles...")

      // 2. Obtener los jugadores disponibles para el draft temporal
      const tempDraftResponse = await fetch(`http://localhost:3000/api/v1/draft/tempDraft/${currentLiga.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!tempDraftResponse.ok) {
        const errorData = await tempDraftResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${tempDraftResponse.status}: No se pudo obtener el draft temporal`)
      }

      const tempDraftData = await tempDraftResponse.json()
      console.log("Draft temporal obtenido:", tempDraftData)
      setTempDraft(tempDraftData.tempDraft)
    } catch (err) {
      console.error("Error al crear el draft:", err)
      setError(err.message || "Error al crear el draft")
      setCreandoDraft(false)
    } finally {
      setLoading(false)
    }
  }

  // Función actualizada para gestionar correctamente la actualización del draft
  const handleUpdateDraft = async (posicion, jugadorIndex, posicionIndex) => {
    if (!currentLiga?.id || !tempDraft) return

    try {
      const token = localStorage.getItem("webToken")

      // Obtener las opciones de jugadores actuales
      let playerOptions
      try {
        playerOptions =
          typeof tempDraft.playerOptions === "string" ? JSON.parse(tempDraft.playerOptions) : tempDraft.playerOptions
      } catch (err) {
        console.error("Error al parsear playerOptions:", err)
        setError("Error al procesar los datos del draft")
        return
      }

      // Mapear IDs de posición a nombres
      const posicionToId = {
        portero: "24",
        defensa: "25",
        mediocampista: "26",
        delantero: "27",
      }

      // Filtrar grupos por el tipo de posición que nos interesa
      const gruposPorPosicion = playerOptions.filter(
        (grupo) => grupo.length > 0 && grupo[0] && grupo[0].positionId === posicionToId[posicion]
      )

      // Si no hay suficientes grupos para esta posición
      if (posicionIndex >= gruposPorPosicion.length) {
        throw new Error(`Índice de posición ${posicionIndex} fuera de rango para ${posicion}`)
      }

      // Encontrar el grupo correcto en el array original
      const indiceGrupoOriginal = playerOptions.findIndex((grupo) => {
        return JSON.stringify(grupo.slice(0, 4)) === JSON.stringify(gruposPorPosicion[posicionIndex].slice(0, 4))
      })

      if (indiceGrupoOriginal === -1) {
        throw new Error(`No se encontró el grupo para la posición ${posicion} índice ${posicionIndex}`)
      }

      // Actualizar la selección en el grupo correcto
      playerOptions[indiceGrupoOriginal][4] = jugadorIndex

      console.log("Actualizando draft con playerOptions:", playerOptions)

      const updateResponse = await fetch(`http://localhost:3000/api/v1/draft/update/${currentLiga.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          playerOptions: playerOptions,
          ligaId: currentLiga.id,
        }),
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${updateResponse.status}: No se pudo actualizar el draft`)
      }

      const updatedData = await updateResponse.json()
      console.log("Draft actualizado:", updatedData)

      // Si la respuesta incluye el tempDraft actualizado, actualizamos el estado
      if (updatedData.tempDraft) {
        setTempDraft(updatedData.tempDraft)
      } else {
        // Si no, actualizamos manualmente el estado con los datos que enviamos
        setTempDraft({
          ...tempDraft,
          playerOptions: playerOptions,
        })
      }
    } catch (err) {
      console.error("Error al actualizar el draft:", err)
      setError(err.message || "Error al actualizar el draft")
    }
  }

  const handleSaveDraft = async () => {
    if (!currentLiga?.id || !tempDraft) return

    setGuardandoDraft(true)

    try {
      const token = localStorage.getItem("webToken")

      const saveResponse = await fetch("http://localhost:3000/api/v1/draft/saveDraft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ligaId: currentLiga.id,
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${saveResponse.status}: No se pudo guardar el draft`)
      }

      // Reiniciar estados y recargar el draft guardado
      setCreandoDraft(false)
      setFormacionSeleccionada(null)
      setTempDraft(null)
      setDraftGuardado(true)
    } catch (err) {
      console.error("Error al guardar el draft:", err)
      setError(err.message || "Error al guardar el draft")
    } finally {
      setGuardandoDraft(false)
    }
  }

  const handleCancelarCreacion = () => {
    setCreandoDraft(false)
    setFormacionSeleccionada(null)
    setTempDraft(null)
  }

  // Función para renderizar la formación correcta según el valor de plantilla.formation
  const renderFormacion = () => {
    if (!plantilla || !players.length) return null

    // Organizar jugadores por posición
    const jugadoresPorPosicion = {
      // Portero (24)
      portero: players.filter((player) => player.positionId === "24"),
      // Defensas (25)
      defensas: players.filter((player) => player.positionId === "25"),
      // Mediocampistas (26)
      mediocampistas: players.filter((player) => player.positionId === "26"),
      // Delanteros (27)
      delanteros: players.filter((player) => player.positionId === "27"),
    }

    switch (plantilla.formation) {
      case "4-3-3":
        return <Formacion433 jugadores={jugadoresPorPosicion} />
      case "3-4-3":
        return <Formacion343 jugadores={jugadoresPorPosicion} />
      case "4-4-2":
        return <Formacion442 jugadores={jugadoresPorPosicion} />
      default:
        return <div className="text-center text-red-500">Formación no reconocida: {plantilla.formation}</div>
    }
  }

  return (
    <AuthGuard>
      <Layout currentPage={t("menu.matchday")}>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6 text-center">{t("menu.matchday")}</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            </div>
          ) : error && currentLiga ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center mb-6">
                <p>{error}</p>
                <p className="mt-2">Hubo un problema al cargar tu draft. Puedes intentar crear uno nuevo.</p>
              </div>
              <h2 className="text-xl font-semibold text-center mb-6">Crear un nuevo draft para esta jornada</h2>
              <SeleccionFormacion onSeleccionarFormacion={handleCrearDraft} />
            </div>
          ) : !currentLiga ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
              <p>No hay una liga seleccionada</p>
              <p className="mt-2">
                <a href="/components/choose-league" className="underline">
                  Selecciona una liga primero
                </a>
              </p>
            </div>
          ) : creandoDraft ? (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-semibold">
                  Creando Draft: <span className="text-blue-600">{formacionSeleccionada}</span>
                </h2>
              </div>

              {tempDraft ? (
                <EditorFormacion
                  tempDraft={tempDraft}
                  formacion={formacionSeleccionada}
                  onUpdateDraft={handleUpdateDraft}
                  onSaveDraft={handleSaveDraft}
                  onCancel={handleCancelarCreacion}
                  guardando={guardandoDraft}
                />
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          ) : !plantilla ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-center mb-6">No tienes un draft creado para esta jornada</h2>
              <SeleccionFormacion onSeleccionarFormacion={handleCrearDraft} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-semibold">
                  Formación: <span className="text-blue-600">{plantilla.formation}</span>
                </h2>
                <p className="text-sm text-gray-600">
                  Jornada ID: {plantilla.jornada_id} • {plantilla.finalized ? "Finalizado" : "En progreso"}
                </p>
              </div>

              <div className="mt-6">{renderFormacion()}</div>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  )
}