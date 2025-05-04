"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui"
import FormacionEditable from "./formacion-editable"
import SelectorJugadores from "./selector-jugadores"

export default function EditorFormacion({ tempDraft, formacion, onUpdateDraft, onSaveDraft, onCancel, guardando }) {
  const [posicionSeleccionada, setPosicionSeleccionada] = useState(null)
  const [indiceSeleccionado, setIndiceSeleccionado] = useState(null)
  const [playerOptions, setPlayerOptions] = useState({})
  const [selecciones, setSelecciones] = useState({})
  const [todasPosicionesCompletas, setTodasPosicionesCompletas] = useState(false)
  const [formacionDetails, setFormacionDetails] = useState({ defensas: 0, mediocampistas: 0, delanteros: 0 })
  const [currentLiga, setCurrentLiga] = useState(null) // Added currentLiga state
  const [error, setError] = useState(null) // Added error state
  const [guardandoDraft, setGuardandoDraft] = useState(false) // Added guardandoDraft state

  // Function to simulate getting the auth token (replace with your actual implementation)
  const getAuthToken = () => {
    return "your_auth_token_here"
  }

  // Extraer los números de jugadores por posición según la formación
  useEffect(() => {
    if (!formacion) return

    const [defensas, mediocampistas, delanteros] = formacion.split("-").map(Number)
    setFormacionDetails({ defensas, mediocampistas, delanteros })
  }, [formacion])

  // Procesar los datos del tempDraft cuando cambia
  useEffect(() => {
    if (!tempDraft || !tempDraft.playerOptions) return

    try {
      // Parsear las opciones de jugadores si es una cadena
      const parsedOptions =
        typeof tempDraft.playerOptions === "string" ? JSON.parse(tempDraft.playerOptions) : tempDraft.playerOptions

      // Mapear IDs de posición a nombres
      const positionIdToName = {
        24: "portero",
        25: "defensa",
        26: "mediocampista",
        27: "delantero",
      }

      // Organizar las opciones por posición
      const options = {
        portero: [],
        defensa: [],
        mediocampista: [],
        delantero: [],
      }

      const selections = {
        portero: [],
        defensa: [],
        mediocampista: [],
        delantero: [],
      }

      // Agrupar por posiciones
      let currentPosition = null
      let currentPositionCount = -1

      parsedOptions.forEach((grupo) => {
        // Asegurarse de que el grupo tiene elementos
        if (grupo.length > 0 && grupo[0]) {
          const posicion = positionIdToName[grupo[0].positionId]

          if (posicion) {
            // Si cambiamos de posición, reiniciar el contador
            if (currentPosition !== posicion) {
              currentPosition = posicion
              currentPositionCount = 0
            } else {
              currentPositionCount++
            }

            // Añadir jugadores a las opciones
            options[posicion][currentPositionCount] = grupo.slice(0, 4)

            // Añadir la selección actual
            selections[posicion][currentPositionCount] = grupo[4] !== undefined ? grupo[4] : null
          }
        }
      })

      setPlayerOptions(options)
      setSelecciones(selections)

      console.log("Opciones de jugadores organizadas:", options)
      console.log("Selecciones procesadas:", selections)

      // Verificar si todas las posiciones están completas
      verificarSeleccionesCompletas(selections, formacionDetails)
    } catch (error) {
      console.error("Error al procesar los datos del draft:", error)
    }
  }, [tempDraft, formacionDetails])

  // Verificar si todas las posiciones tienen jugadores seleccionados
  const verificarSeleccionesCompletas = (selections, formacion) => {
    if (!selections || !formacion) return false

    // Verificar que haya suficientes selecciones para cada posición
    const porteroCompleto =
      selections.portero && selections.portero.filter((idx) => idx !== null && idx !== undefined).length >= 1

    const defensasCompleto =
      selections.defensa &&
      selections.defensa.filter((idx) => idx !== null && idx !== undefined).length >= formacion.defensas

    const mediocampistasCompleto =
      selections.mediocampista &&
      selections.mediocampista.filter((idx) => idx !== null && idx !== undefined).length >= formacion.mediocampistas

    const delanterosCompleto =
      selections.delantero &&
      selections.delantero.filter((idx) => idx !== null && idx !== undefined).length >= formacion.delanteros

    const completo = porteroCompleto && defensasCompleto && mediocampistasCompleto && delanterosCompleto

    console.log("Verificación de posiciones completas:", {
      portero: porteroCompleto,
      defensas: defensasCompleto,
      mediocampistas: mediocampistasCompleto,
      delanteros: delanterosCompleto,
      completo,
    })

    setTodasPosicionesCompletas(completo)
    return completo
  }

  // Manejar la selección de una posición en la formación
  const handleSeleccionarPosicion = (posicion, indice) => {
    console.log(`Seleccionando posición: ${posicion}, índice: ${indice}`)
    setPosicionSeleccionada(posicion)
    setIndiceSeleccionado(indice)
  }

  // Manejar la selección de un jugador
  const handleSeleccionarJugador = (jugadorIndex) => {
    if (posicionSeleccionada === null || indiceSeleccionado === null) return

    console.log(
      `Seleccionando jugador: índice ${jugadorIndex} para posición ${posicionSeleccionada} ${indiceSeleccionado}`,
    )

    // Llamar a la función de actualización del draft
    onUpdateDraft(posicionSeleccionada, jugadorIndex, indiceSeleccionado)

    // Actualizar localmente las selecciones para reflejar el cambio inmediatamente
    const nuevasSelecciones = { ...selecciones }
    nuevasSelecciones[posicionSeleccionada][indiceSeleccionado] = jugadorIndex
    setSelecciones(nuevasSelecciones)

    // Verificar si ahora están todas las posiciones completas
    verificarSeleccionesCompletas(nuevasSelecciones, formacionDetails)

    // Cerrar el selector
    setPosicionSeleccionada(null)
    setIndiceSeleccionado(null)
  }

  // Cerrar el selector de jugadores
  const handleCerrarSelector = () => {
    setPosicionSeleccionada(null)
    setIndiceSeleccionado(null)
  }

  // Obtener las opciones de jugadores para la posición seleccionada
  const getJugadoresParaSeleccion = () => {
    if (!posicionSeleccionada || !playerOptions[posicionSeleccionada]) return []

    // Si tenemos un índice válido y hay opciones para esa posición específica
    if (indiceSeleccionado !== null && playerOptions[posicionSeleccionada].length > indiceSeleccionado) {
      return playerOptions[posicionSeleccionada][indiceSeleccionado]
    }

    return []
  }

  // Obtener la selección actual para la posición seleccionada
  const getSeleccionActual = () => {
    if (!posicionSeleccionada || indiceSeleccionado === null) return null

    return selecciones[posicionSeleccionada]?.[indiceSeleccionado] || null
  }

  // Modificar la función handleSaveDraft para recargar la página después de guardar
  const handleSaveDraft = async () => {
    if (!currentLiga?.id || !tempDraft) {
      setError("No hay una liga seleccionada o no hay draft temporal")
      return
    }

    setGuardandoDraft(true)

    try {
      const token = getAuthToken()

      // Asegurarse de que tempDraft tiene todas las propiedades necesarias
      if (!tempDraft.id_plantilla) {
        throw new Error("El draft temporal no tiene un ID de plantilla")
      }

      console.log("Enviando tempDraft para guardar:", tempDraft)

      const saveResponse = await fetch("http://localhost:3000/api/v1/draft/saveDraft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tempDraft: tempDraft,
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${saveResponse.status}: No se pudo guardar el draft`)
      }

      // Recargar la página después de guardar exitosamente
      window.location.reload()
    } catch (err) {
      console.error("Error al guardar el draft:", err)
      setError(err.message || "Error al guardar el draft")
    } finally {
      setGuardandoDraft(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Formación editable */}
      <FormacionEditable
        formacion={formacion}
        selecciones={selecciones}
        playerOptions={playerOptions}
        onSeleccionarPosicion={handleSeleccionarPosicion}
      />

      {/* Selector de jugadores (modal) */}
      {posicionSeleccionada && (
        <SelectorJugadores
          posicion={posicionSeleccionada}
          indice={indiceSeleccionado}
          jugadores={getJugadoresParaSeleccion()}
          seleccionActual={getSeleccionActual()}
          onSeleccionar={handleSeleccionarJugador}
          onCerrar={handleCerrarSelector}
        />
      )}

      {/* Botones de acción */}
      <div className="flex justify-between mt-8">
        <Button onClick={onCancel} className="px-6 py-2" variant="outline">
          Cancelar
        </Button>

        <Button
          onClick={onSaveDraft}
          disabled={!todasPosicionesCompletas || guardando}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white"
        >
          {guardando ? "Guardando..." : "Guardar Draft"}
        </Button>
      </div>
    </div>
  )
}
