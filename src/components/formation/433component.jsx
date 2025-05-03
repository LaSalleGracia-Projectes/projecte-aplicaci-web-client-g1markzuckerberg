"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/layout"
import AuthGuard from "@/components/authGuard/authGuard"
import { useLiga } from "@/context/ligaContext"
import Formation433 from "@/components/formation/433component"
import Formation343 from "@/components/formation/343component"
import Formation442 from "@/components/formation/442component"

export default function Jornada() {
  const { currentLiga } = useLiga()
  const [userId, setUserId] = useState(null)
  const [jornada, setJornada] = useState(null)
  const [hasDraft, setHasDraft] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tempDraft, setTempDraft] = useState(null)

  useEffect(() => {
    console.log("Iniciando useEffect con liga:", currentLiga)
    const fetchData = async () => {
      try {
        // Validar que exista una liga seleccionada primero
        if (!currentLiga || !currentLiga.id) {
          console.warn("No hay una liga seleccionada.")
          setHasDraft(false)
          setLoading(false)
          return
        }

        const token = localStorage.getItem("webToken")
        if (!token) {
          console.warn("No se encontró el token de autenticación")
          setHasDraft(false)
          setLoading(false)
          return
        }

        // 1. Obtener ID de usuario
        try {
          const userRes = await fetch("http://localhost:3000/api/v1/user/me", {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (!userRes.ok) {
            throw new Error(`Error obteniendo usuario: ${userRes.status}`)
          }

          const userData = await userRes.json()
          if (!userData || !userData.user || !userData.user.id) {
            throw new Error("No se pudo obtener el ID de usuario")
          }

          setUserId(userData.user.id)
          console.log("ID de usuario obtenido:", userData.user.id)
        } catch (error) {
          console.error("Error obteniendo datos de usuario:", error)
          setLoading(false)
          return
        }

        // 2. Obtener jornada actual
        try {
          const jornadaRes = await fetch("http://localhost:3000/api/v1/sportmonks/jornadaActual")

          if (!jornadaRes.ok) {
            throw new Error(`Error obteniendo jornada: ${jornadaRes.status}`)
          }

          const jornadaData = await jornadaRes.json()
          if (!jornadaData || !jornadaData.name) {
            throw new Error("No se pudo obtener la jornada actual")
          }

          setJornada(jornadaData)
        } catch (error) {
          console.error("Error obteniendo jornada actual:", error)
          setLoading(false)
          return
        }

        // Asegurémonos de que tenemos todos los datos necesarios antes de continuar
        if (!userId || !currentLiga?.id || !jornada?.name) {
          console.warn("Faltan datos para verificar el draft", {
            userId,
            ligaId: currentLiga?.id,
            jornadaName: jornada?.name,
          })
          setHasDraft(false)
          setLoading(false)
          return
        }

        let foundDraft = false

        // 4. Verificar si ya existe un draft para esta liga y jornada
        try {
          console.log(
            `Verificando draft existente para usuario ${userId}, liga ${currentLiga.id}, jornada ${jornada.name}`,
          )

          // Construir la URL con los parámetros correctos y asegurarse de que estén codificados adecuadamente
          const queryParams = new URLSearchParams({
            userId: userId.toString(),
            ligaId: currentLiga.id.toString(),
          })

          if (jornada.name) {
            queryParams.append("roundName", jornada.name)
          }

          const draftRes = await fetch(`http://localhost:3000/api/v1/draft/getuserDraft?${queryParams.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (!draftRes.ok) {
            console.warn(`Error en respuesta al verificar draft: ${draftRes.status}`)
            const errorText = await draftRes.text()
            console.error("Detalle del error:", errorText)
          } else {
            const draftData = await draftRes.json()
            console.log("Respuesta del draft:", draftData)

            if (draftData?.plantilla) {
              // Verificar si hay una plantilla válida
              setHasDraft(true)

              // Preparar el tempDraft con la estructura correcta para los componentes de formación
              const formattedDraft = {
                ...draftData,
                id_plantilla: draftData.plantilla.id,
                formation: draftData.plantilla.formation,
                playerOptions: draftData.plantilla.playerOptions || draftData.players,
                ligaId: currentLiga.id,
              }

              setTempDraft(formattedDraft)
              foundDraft = true
              console.log("Draft completo encontrado:", formattedDraft)
            } else {
              console.log("No se encontró un draft completo")
            }
          }
        } catch (err) {
          console.error("Error verificando draft existente:", err)
        }

        // 5. Verificar si hay un tempDraft (borrador temporal) si no se encontró un draft completo
        if (!foundDraft) {
          try {
            console.log(`Verificando tempDraft para liga ${currentLiga.id}, jornada ${jornada.name}`)

            const tempDraftRes = await fetch(
              `http://localhost:3000/api/v1/draft/tempDraft/${currentLiga.id}?roundName=${jornada.name}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )

            if (!tempDraftRes.ok) {
              console.warn(`Error en respuesta al verificar tempDraft: ${tempDraftRes.status}`)
            } else {
              const tempDraftData = await tempDraftRes.json()
              console.log("Respuesta del tempDraft:", tempDraftData)

              if (tempDraftData?.tempDraft) {
                console.log("Temp draft encontrado:", tempDraftData.tempDraft)

                // Asegurarnos de que tempDraft tiene la información de formación
                const draft = tempDraftData.tempDraft

                // Si no tiene formación, intentamos extraerla de la cadena
                if (!draft.formation && typeof draft === "object") {
                  // Buscar alguna propiedad que contenga información sobre la formación
                  console.log("Propiedades del tempDraft:", Object.keys(draft))

                  // Intenta buscar el patrón de formación (ej: 4-3-3, 4-4-2, 3-4-3) en el objeto
                  const formationPattern = /(\d-\d-\d)/
                  const formationStr = JSON.stringify(draft)
                  const match = formationStr.match(formationPattern)

                  if (match && match[0]) {
                    console.log("Formación detectada en el objeto:", match[0])
                    // Crear una copia con la formación detectada
                    const draftWithFormation = {
                      ...draft,
                      formation: match[0],
                    }
                    setTempDraft(draftWithFormation)
                  } else {
                    console.log("No se pudo detectar la formación en el objeto")
                    setTempDraft(draft)
                  }
                } else {
                  setTempDraft(draft)
                }

                setHasDraft(true)
              } else {
                console.log("No se encontró un tempDraft")
                setHasDraft(false)
              }
            }
          } catch (err) {
            console.error("Error verificando tempDraft:", err)
            setHasDraft(false)
          }
        }
      } catch (err) {
        console.error("Error obteniendo datos:", err)
        setHasDraft(false)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentLiga])

  const handleFormationSelect = async (formation) => {
    const token = localStorage.getItem("webToken")

    if (!formation || !currentLiga?.id) {
      alert("Faltan datos para crear el draft")
      return
    }

    try {
      setLoading(true)

      const res = await fetch("http://localhost:3000/api/v1/draft/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          formation: formation,
          ligaId: currentLiga.id,
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Error response:", errorText)
        throw new Error(`Error al crear el draft: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()

      if (data.tempDraft) {
        // Asegurarnos de que el tempDraft tenga la formación seleccionada
        const enhancedTempDraft = {
          ...data.tempDraft,
          formation: formation,
          formationSelected: formation,
        }
        setTempDraft(enhancedTempDraft)
        setHasDraft(true)
        alert("Draft creado correctamente. ¡Ya puedes seleccionar jugadores!")
      } else {
        throw new Error("No se recibió el draft temporal")
      }
    } catch (error) {
      console.error("Error creando draft:", error)
      alert(`No se pudo crear el draft. ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const renderFormationOptions = () => (
    <div className="flex flex-col items-center justify-center gap-6 pt-12">
      <h2 className="text-xl font-semibold text-gray-800">Elige una formación para comenzar tu draft</h2>
      <div className="flex gap-4">
        {["4-4-2", "4-3-3", "3-4-3"].map((formacion) => (
          <button
            key={formacion}
            onClick={() => handleFormationSelect(formacion)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            disabled={loading}
          >
            {formacion}
          </button>
        ))}
      </div>
    </div>
  )

  const renderFormationComponent = () => {
    if (!tempDraft) return null

    // Debugging para ver la estructura completa del tempDraft
    console.log("Renderizando formación con tempDraft:", tempDraft)

    // Intentar determinar la formación a partir del objeto tempDraft
    let formation = null

    // Método 1: Buscar directamente en las propiedades principales
    if (tempDraft.formation) {
      formation = tempDraft.formation
      console.log("Formación encontrada en tempDraft.formation:", formation)
    } else if (tempDraft.formacion) {
      formation = tempDraft.formacion
      console.log("Formación encontrada en tempDraft.formacion:", formation)
    } else if (tempDraft.formation_id) {
      // Mapear IDs a formaciones si es necesario
      const formationMap = {
        1: "4-3-3",
        2: "4-4-2",
        3: "3-4-3",
      }
      formation = formationMap[tempDraft.formation_id] || "desconocida"
      console.log("Formación mapeada desde formation_id:", formation)
    }

    // Método 2: Si no se encontró en las propiedades principales, buscar en propiedades anidadas
    if (!formation && tempDraft.tempDraft) {
      const nestedDraft = tempDraft.tempDraft
      console.log("Buscando en tempDraft.tempDraft:", nestedDraft)

      if (nestedDraft.formation) {
        formation = nestedDraft.formation
        console.log("Formación encontrada en tempDraft.tempDraft.formation:", formation)
      } else if (nestedDraft.formacion) {
        formation = nestedDraft.formacion
        console.log("Formación encontrada en tempDraft.tempDraft.formacion:", formation)
      }
    }

    // Método 3: Buscar en el cuerpo del objeto completo
    if (!formation) {
      console.log("Buscando formación en todo el objeto...")
      const formationPattern = /(\d-\d-\d)/
      const tempDraftStr = JSON.stringify(tempDraft)
      const match = formationStr.match(formationPattern)

      if (match && match[0]) {
        formation = match[0]
        console.log("Formación detectada en el string:", formation)
      }
    }

    // Método 4: Si hay playerOptions, intentar determinar la formación por la estructura
    if (!formation && tempDraft.playerOptions) {
      console.log("Intentando determinar formación por estructura de playerOptions")

      // Contar jugadores por posición
      let defenders = 0
      let midfielders = 0
      let forwards = 0

      tempDraft.playerOptions.forEach((group) => {
        group.forEach((player) => {
          if (player && player.positionId) {
            if (player.positionId === "25") defenders++
            else if (player.positionId === "26") midfielders++
            else if (player.positionId === "27") forwards++
          }
        })
      })

      console.log(`Conteo por posición: DEF=${defenders}, MID=${midfielders}, FWD=${forwards}`)

      // Determinar formación basada en el conteo
      if (defenders === 4 && midfielders === 3 && forwards === 3) {
        formation = "4-3-3"
      } else if (defenders === 4 && midfielders === 4 && forwards === 2) {
        formation = "4-4-2"
      } else if (defenders === 3 && midfielders === 4 && forwards === 3) {
        formation = "3-4-3"
      }

      if (formation) {
        console.log("Formación determinada por conteo de jugadores:", formation)
      }
    }

    // Método 5: Último recurso - usar la formación del botón que se presionó
    if (!formation && tempDraft.formationSelected) {
      formation = tempDraft.formationSelected
      console.log("Usando formación seleccionada:", formation)
    }

    // Si aún no tenemos formación, usar una por defecto
    if (!formation) {
      // Verificar si hay alguna propiedad que contenga "4-3-3", "4-4-2" o "3-4-3"
      const tempDraftStr = JSON.stringify(tempDraft)
      if (tempDraftStr.includes("4-3-3")) {
        formation = "4-3-3"
        console.log("Formación 4-3-3 encontrada en el string")
      } else if (tempDraftStr.includes("4-4-2")) {
        formation = "4-4-2"
        console.log("Formación 4-4-2 encontrada en el string")
      } else if (tempDraftStr.includes("3-4-3")) {
        formation = "3-4-3"
        console.log("Formación 3-4-3 encontrada en el string")
      } else {
        // Si todo falla, usar 4-3-3 como predeterminado
        formation = "4-3-3"
        console.log("Usando formación predeterminada 4-3-3")
      }
    }

    console.log("Formación final determinada:", formation)

    // Renderizar el componente de formación correspondiente
    switch (formation) {
      case "4-3-3":
        return <Formation433 tempDraft={tempDraft} setTempDraft={setTempDraft} jornada={jornada} />
      case "4-4-2":
        return <Formation442 tempDraft={tempDraft} setTempDraft={setTempDraft} jornada={jornada} />
      case "3-4-3":
        return <Formation343 tempDraft={tempDraft} setTempDraft={setTempDraft} jornada={jornada} />
      default:
        // Si no podemos determinar la formación, mostramos todo el tempDraft en modo desarrollo
        return (
          <div className="text-center p-8 bg-white bg-opacity-70 rounded-lg">
            <p>La visualización para la formación {formation || "desconocida"} está en desarrollo.</p>
            <div className="mt-4">
              <details>
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  Ver datos del draft (Debug)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 text-gray-800 rounded overflow-auto text-sm max-h-96">
                  {JSON.stringify(tempDraft, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )
    }
  }

  const renderDraftContent = () => {
    return (
      <div className="pt-6 pb-16">
        <div className="text-center mb-6">
          <p className="text-green-600 text-lg">Ya tienes un draft creado para esta jornada.</p>
          {tempDraft && (
            <div className="mt-2">
              <p className="font-semibold">
                Formación:{" "}
                {tempDraft.formation ||
                  tempDraft.formacion ||
                  (tempDraft.formation_id &&
                    (tempDraft.formation_id === 1
                      ? "4-3-3"
                      : tempDraft.formation_id === 2
                        ? "4-4-2"
                        : tempDraft.formation_id === 3
                          ? "3-4-3"
                          : "Desconocida"))}
              </p>
            </div>
          )}
        </div>

        {/* Render appropriate formation component based on selected formation */}
        <div className="mt-4 h-full">
          {tempDraft ? (
            renderFormationComponent()
          ) : (
            <div className="text-center p-8 bg-white bg-opacity-70 rounded-lg">
              <p>No se pudo cargar la información del draft</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <Layout currentPage="Jornada">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/campo.png")',
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            minHeight: "100%",
          }}
        >
          {loading ? (
            <div className="text-center pt-10">
              <p className="text-lg text-gray-700">Cargando datos...</p>
              <div className="mt-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            </div>
          ) : hasDraft ? (
            renderDraftContent()
          ) : (
            renderFormationOptions()
          )}
        </div>
      </Layout>
    </AuthGuard>
  )
}
