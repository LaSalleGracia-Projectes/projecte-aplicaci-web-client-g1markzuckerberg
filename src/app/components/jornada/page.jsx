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
  const [jornada, setJornada] = useState(null)
  const [hasDraft, setHasDraft] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tempDraft, setTempDraft] = useState(null)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  // Función para obtener el usuario actual
  const fetchCurrentUser = async (token) => {
    try {
      console.log("Obteniendo información del usuario actual...")
      const userRes = await fetch("http://localhost:3000/api/v1/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!userRes.ok) {
        console.error(`Error obteniendo usuario: ${userRes.status}`)
        return null
      }

      const userData = await userRes.json()
      console.log("Datos de usuario obtenidos:", userData)
      return userData.user
    } catch (err) {
      console.error("Error obteniendo usuario:", err)
      return null
    }
  }

  // Función para verificar si existe un draft
  const checkExistingDraft = async (ligaId, jornadaValue, token, userId = null) => {
    console.log(
      `Verificando draft existente para liga ${ligaId}, jornada ${jornadaValue}${userId ? `, usuario ${userId}` : ""}`,
    )

    try {
      // Construir la URL con los parámetros
      let url = `http://localhost:3000/api/v1/draft/getuserDraft?ligaId=${ligaId}&roundName=${jornadaValue}`

      // Añadir userId a la URL si está presente
      if (userId) {
        url += `&userId=${userId}`
        console.log("Añadiendo userId a la petición:", userId)
      }

      console.log("URL de petición completa:", url)

      const draftRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!draftRes.ok) {
        const status = draftRes.status
        console.warn(`Error en respuesta al verificar draft: ${status}`)

        // Properly handle 404 status
        if (status === 404) {
          console.log("No existe un draft para esta liga y jornada (404)")
          return { found: false, data: null, notFound: true }
        }

        let errorText = ""
        try {
          const errorData = await draftRes.json()
          errorText = errorData.error || (await draftRes.text())
        } catch (e) {
          errorText = "No se pudo obtener el texto del error"
        }

        console.error("Detalle del error:", errorText)

        // Check for specific error message or code
        if (
          errorText.includes("No se encontró la plantilla") ||
          (typeof errorText === "object" && errorText.code === "DRAFT_NOT_FOUND")
        ) {
          console.log("No existe un draft para esta liga y jornada (error específico)")
          return { found: false, data: null, notFound: true }
        }

        return { found: false, data: null, error: { status, text: errorText } }
      }

      const draftData = await draftRes.json()
      console.log("Respuesta del draft:", draftData)

      if (draftData?.plantilla) {
        // Verificar si hay una plantilla válida
        // Preparar el tempDraft con la estructura correcta para los componentes de formación
        const formattedDraft = {
          ...draftData,
          id_plantilla: draftData.plantilla.id,
          formation: draftData.plantilla.formation,
          playerOptions: draftData.plantilla.playerOptions || draftData.players,
          ligaId: ligaId,
        }

        return { found: true, data: formattedDraft }
      } else {
        console.log("No se encontró un draft completo")
        return { found: false, data: null }
      }
    } catch (err) {
      console.error("Error verificando draft existente:", err)
      return { found: false, data: null, error: err.message }
    }
  }

  // Función para verificar si hay un tempDraft
  const checkTempDraft = async (ligaId, jornadaValue, token, userId = null) => {
    try {
      console.log(
        `Verificando tempDraft para liga ${ligaId}, jornada ${jornadaValue}${userId ? `, usuario ${userId}` : ""}`,
      )

      // Construir la URL con los parámetros
      let url = `http://localhost:3000/api/v1/draft/tempDraft/${ligaId}?roundName=${jornadaValue}`

      // Añadir userId a la URL si está presente
      if (userId) {
        url += `&userId=${userId}`
        console.log("Añadiendo userId a la petición tempDraft:", userId)
      }

      console.log("URL de petición tempDraft:", url)

      const tempDraftRes = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!tempDraftRes.ok) {
        const status = tempDraftRes.status
        console.warn(`Error en respuesta al verificar tempDraft: ${status}`)

        let errorText = ""
        try {
          errorText = await tempDraftRes.text()
        } catch (e) {
          errorText = "No se pudo obtener el texto del error"
        }

        console.error("Detalle del error tempDraft:", errorText)

        // Si el error indica que no se encontró el tempDraft, es un caso normal
        if (errorText.includes("No se encontró") || status === 404) {
          return { found: false, data: null, notFound: true }
        }

        return { found: false, data: null, error: { status, text: errorText } }
      }

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
            return { found: true, data: draftWithFormation }
          } else {
            console.log("No se pudo detectar la formación en el objeto")
            return { found: true, data: draft }
          }
        } else {
          return { found: true, data: draft }
        }
      } else {
        console.log("No se encontró un tempDraft")
        return { found: false, data: null }
      }
    } catch (err) {
      console.error("Error verificando tempDraft:", err)
      return { found: false, data: null, error: err.message }
    }
  }

  // Función para crear un nuevo draft
  const createNewDraft = async (formation, ligaId, token, userId = null) => {
    try {
      console.log(
        `Creando nuevo draft con formación ${formation} para liga ${ligaId}${userId ? `, usuario ${userId}` : ""}`,
      )

      const requestBody = {
        formation: formation,
        ligaId: ligaId,
      }

      // Añadir userId al cuerpo de la petición si está presente
      if (userId) {
        requestBody.userId = userId
        console.log("Añadiendo userId al cuerpo de la petición:", userId)
      }

      console.log("Cuerpo de la petición:", requestBody)

      const res = await fetch("http://localhost:3000/api/v1/draft/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Error response:", errorText)

        // Verificar si el error es porque ya existe un draft
        if (errorText.includes("Ya existe un draft creado para esta liga y jornada")) {
          return { success: false, error: "already_exists", message: "Ya existe un draft para esta liga y jornada" }
        }

        return {
          success: false,
          error: "create_failed",
          message: `Error al crear el draft: ${res.status} ${res.statusText}`,
          details: errorText,
        }
      }

      const data = await res.json()
      console.log("Respuesta de creación de draft:", data)

      if (data.tempDraft) {
        // Asegurarnos de que el tempDraft tenga la formación seleccionada
        const enhancedTempDraft = {
          ...data.tempDraft,
          formation: formation,
          formationSelected: formation,
        }
        return { success: true, data: enhancedTempDraft }
      } else {
        return { success: false, error: "no_data", message: "No se recibió el draft temporal" }
      }
    } catch (err) {
      console.error("Error creando draft:", err)
      return { success: false, error: "exception", message: err.message }
    }
  }

  // Efecto para cargar la jornada actual y el usuario
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!currentLiga || !currentLiga.id) {
        console.warn("No hay una liga seleccionada.")
        setLoading(false)
        return
      }

      try {
        // Obtener el token de autenticación
        const token = localStorage.getItem("webToken")
        if (!token) {
          console.warn("No se encontró el token de autenticación")
          setLoading(false)
          return
        }

        // Obtener información del usuario actual
        const user = await fetchCurrentUser(token)
        if (user) {
          setCurrentUser(user)
          console.log("Usuario actual establecido:", user)
        } else {
          console.warn("No se pudo obtener la información del usuario")
        }

        // Obtener la jornada actual
        console.log("Obteniendo jornada actual...")
        const jornadaRes = await fetch("http://localhost:3000/api/v1/sportmonks/jornadaActual")

        if (!jornadaRes.ok) {
          const errorText = await jornadaRes.text()
          console.error(`Error obteniendo jornada: ${jornadaRes.status}`, errorText)
          throw new Error(`Error obteniendo jornada: ${jornadaRes.status}`)
        }

        const responseData = await jornadaRes.json()
        console.log("Respuesta completa de jornada:", responseData)

        // Extraer la jornada del objeto anidado
        let jornadaData = null

        if (responseData && responseData.jornadaActual) {
          jornadaData = responseData.jornadaActual
          console.log("Datos de jornada encontrados en jornadaActual:", jornadaData)
        } else {
          jornadaData = responseData
          console.log("Usando datos de respuesta directamente:", jornadaData)
        }

        // Verificar si tenemos datos válidos
        if (!jornadaData) {
          console.error("No se encontraron datos de jornada en la respuesta")
          throw new Error("No se encontraron datos de jornada en la respuesta")
        }

        // Extraer el nombre/número de la jornada
        let jornadaValue = null

        if (jornadaData.name) {
          jornadaValue = jornadaData.name
          console.log("Usando name como valor de jornada:", jornadaValue)
        } else if (jornadaData.id) {
          jornadaValue = jornadaData.id
          console.log("Usando id como valor de jornada:", jornadaValue)
        } else {
          console.error("No se encontró name o id en los datos de jornada:", jornadaData)
          throw new Error("No se pudo obtener el número de la jornada actual")
        }

        // Crear un objeto jornada con el valor extraído
        const jornadaObj = {
          value: jornadaValue,
          name: jornadaValue.toString(),
          // Incluir otros datos que puedan ser útiles
          id: jornadaData.id,
          is_current: jornadaData.is_current,
          starting_at: jornadaData.starting_at,
          ending_at: jornadaData.ending_at,
        }

        setJornada(jornadaObj)
        console.log("Jornada establecida:", jornadaObj)

        // Obtener el ID del usuario si está disponible
        const userId = user?.id
        console.log("ID de usuario para verificar draft:", userId || "No disponible")

        // Verificar si ya existe un draft
        const existingDraft = await checkExistingDraft(currentLiga.id, jornadaValue, token, userId)

        if (existingDraft.found) {
          setHasDraft(true)
          setTempDraft(existingDraft.data)
          console.log("Draft existente encontrado y establecido")
        } else if (existingDraft.notFound) {
          // Si no se encontró el draft (error 500 pero realmente es un 404), verificamos el tempDraft
          console.log("No se encontró draft existente, verificando tempDraft...")
          const tempDraftResult = await checkTempDraft(currentLiga.id, jornadaValue, token, userId)

          if (tempDraftResult.found) {
            setHasDraft(true)
            setTempDraft(tempDraftResult.data)
            console.log("TempDraft encontrado y establecido")
          } else {
            setHasDraft(false)
            console.log("No se encontró ningún draft ni tempDraft")
          }
        } else if (existingDraft.error) {
          console.error("Error al verificar draft existente:", existingDraft.error)
          // Si hay un error real (no un 404 disfrazado), verificamos el tempDraft de todos modos
          const tempDraftResult = await checkTempDraft(currentLiga.id, jornadaValue, token, userId)

          if (tempDraftResult.found) {
            setHasDraft(true)
            setTempDraft(tempDraftResult.data)
            console.log("TempDraft encontrado y establecido después de error")
          } else {
            setHasDraft(false)
            console.log("No se encontró ningún draft después de error")
          }
        } else {
          // Si no hay draft completo, verificar tempDraft
          const tempDraftResult = await checkTempDraft(currentLiga.id, jornadaValue, token, userId)

          if (tempDraftResult.found) {
            setHasDraft(true)
            setTempDraft(tempDraftResult.data)
            console.log("TempDraft encontrado y establecido")
          } else {
            setHasDraft(false)
            console.log("No se encontró ningún draft")
          }
        }
      } catch (error) {
        console.error("Error obteniendo datos iniciales:", error)
        setError("No se pudo cargar la jornada actual. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [currentLiga])

  const handleFormationSelect = async (formation) => {
    const token = localStorage.getItem("webToken")

    if (!formation || !currentLiga?.id || !jornada?.value) {
      alert("Faltan datos para crear el draft")
      return
    }

    try {
      setLoading(true)

      // Obtener el ID del usuario si está disponible
      const userId = currentUser?.id
      console.log("ID de usuario para crear draft:", userId || "No disponible")

      // Primero verificamos si ya existe un draft para esta liga y jornada
      const existingDraft = await checkExistingDraft(currentLiga.id, jornada.value, token, userId)

      if (existingDraft.found) {
        // Si ya existe un draft, lo usamos en lugar de crear uno nuevo
        setHasDraft(true)
        setTempDraft(existingDraft.data)
        setLoading(false)
        alert("Ya tienes un draft creado para esta jornada. Se ha cargado correctamente.")
        return
      }

      // Si no existe o es un 404 disfrazado de 500, creamos uno nuevo
      if (existingDraft.notFound || (existingDraft.error && existingDraft.error.status === 500)) {
        console.log("No existe un draft, creando uno nuevo...")
        const createResult = await createNewDraft(formation, currentLiga.id, token, userId)

        if (createResult.success) {
          setTempDraft(createResult.data)
          setHasDraft(true)
          alert("Draft creado correctamente. ¡Ya puedes seleccionar jugadores!")
        } else if (createResult.error === "already_exists") {
          // Si ya existe, intentamos obtenerlo de nuevo
          const retryDraft = await checkExistingDraft(currentLiga.id, jornada.value, token, userId)

          if (retryDraft.found) {
            setHasDraft(true)
            setTempDraft(retryDraft.data)
            alert("Ya tienes un draft creado para esta jornada. Se ha cargado correctamente.")
          } else {
            // Si no podemos obtener el draft existente, intentamos con tempDraft
            const tempDraftResult = await checkTempDraft(currentLiga.id, jornada.value, token, userId)

            if (tempDraftResult.found) {
              setHasDraft(true)
              setTempDraft(tempDraftResult.data)
              alert("Se ha cargado un borrador existente para esta jornada.")
            } else {
              throw new Error("No se pudo cargar el draft existente")
            }
          }
        } else {
          throw new Error(createResult.message || "Error al crear el draft")
        }
      } else {
        throw new Error("Error al verificar si existe un draft")
      }
    } catch (error) {
      console.error("Error en el proceso de draft:", error)
      alert(`No se pudo crear o cargar el draft. ${error.message}`)
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
      const match = tempDraftStr.match(formationPattern)

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
        return (
          <Formation433 tempDraft={tempDraft} setTempDraft={setTempDraft} jornada={jornada} userId={currentUser?.id} />
        )
      case "4-4-2":
        return (
          <Formation442 tempDraft={tempDraft} setTempDraft={setTempDraft} jornada={jornada} userId={currentUser?.id} />
        )
      case "3-4-3":
        return (
          <Formation343 tempDraft={tempDraft} setTempDraft={setTempDraft} jornada={jornada} userId={currentUser?.id} />
        )
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
          {currentUser && (
            <p className="text-gray-600">
              Usuario: {currentUser.name || currentUser.username} (ID: {currentUser.id})
            </p>
          )}
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
          ) : error ? (
            <div className="text-center pt-10">
              <p className="text-lg text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition mt-4"
              >
                Reintentar
              </button>
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
