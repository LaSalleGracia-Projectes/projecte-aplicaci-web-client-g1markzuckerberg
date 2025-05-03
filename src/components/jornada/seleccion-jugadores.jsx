"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui"
import JugadorSeleccionable from "./jugador-seleccionable"

export default function SeleccionJugadores({ tempDraft, formacion, onUpdateDraft, onSaveDraft, onCancel, guardando }) {
  const [posicionActual, setPosicionActual] = useState("portero")
  const [seleccionesCompletas, setSeleccionesCompletas] = useState(false)

  // Verificar si todas las posiciones tienen jugadores seleccionados
  useEffect(() => {
    if (!tempDraft) return

    const todasPosicionesSeleccionadas = Object.keys(tempDraft).every((posicion) => {
      // El último elemento de cada array de posición contiene los índices seleccionados
      const selecciones = tempDraft[posicion][tempDraft[posicion].length - 1]

      // Verificar que todas las selecciones necesarias estén hechas
      if (!selecciones) return false

      const cantidadNecesaria = getCantidadJugadoresPorPosicion(posicion, formacion)
      return selecciones.filter((idx) => idx !== null).length === cantidadNecesaria
    })

    setSeleccionesCompletas(todasPosicionesSeleccionadas)
  }, [tempDraft, formacion])

  // Obtener la cantidad de jugadores necesarios por posición según la formación
  const getCantidadJugadoresPorPosicion = (posicion, formacion) => {
    if (posicion === "portero") return 1

    const [defensas, mediocampistas, delanteros] = formacion.split("-").map(Number)

    if (posicion === "defensa") return defensas
    if (posicion === "mediocampista") return mediocampistas
    if (posicion === "delantero") return delanteros

    return 0
  }

  // Obtener los jugadores disponibles para la posición actual
  const getJugadoresDisponibles = () => {
    if (!tempDraft || !tempDraft[posicionActual]) return []

    // Los jugadores disponibles son los primeros 4 elementos del array
    return tempDraft[posicionActual].slice(0, 4)
  }

  // Obtener los índices de jugadores seleccionados para la posición actual
  const getSeleccionesActuales = () => {
    if (!tempDraft || !tempDraft[posicionActual]) return []

    // El último elemento contiene los índices seleccionados
    return tempDraft[posicionActual][tempDraft[posicionActual].length - 1] || []
  }

  // Verificar si un jugador está seleccionado
  const isJugadorSeleccionado = (index) => {
    const selecciones = getSeleccionesActuales()
    return selecciones.includes(index)
  }

  // Verificar si ya se seleccionaron todos los jugadores necesarios para la posición actual
  const isSeleccionCompleta = () => {
    const selecciones = getSeleccionesActuales()
    const cantidadNecesaria = getCantidadJugadoresPorPosicion(posicionActual, formacion)
    return selecciones.filter((idx) => idx !== null).length >= cantidadNecesaria
  }

  // Manejar la selección de un jugador
  const handleSeleccionarJugador = (jugadorIndex) => {
    const selecciones = getSeleccionesActuales()
    const cantidadNecesaria = getCantidadJugadoresPorPosicion(posicionActual, formacion)

    // Si el jugador ya está seleccionado, encontrar su posición
    const posicionIndex = selecciones.indexOf(jugadorIndex)

    if (posicionIndex !== -1) {
      // Si ya está seleccionado, deseleccionarlo
      onUpdateDraft(posicionActual, null, posicionIndex)
    } else {
      // Si no está seleccionado, buscar una posición libre
      const posicionLibre = selecciones.indexOf(null)

      if (posicionLibre !== -1) {
        // Si hay una posición libre, seleccionar el jugador ahí
        onUpdateDraft(posicionActual, jugadorIndex, posicionLibre)
      } else if (selecciones.length < cantidadNecesaria) {
        // Si no hay posiciones libres pero aún no se han seleccionado todos los necesarios
        onUpdateDraft(posicionActual, jugadorIndex, selecciones.length)
      }
    }
  }

  // Cambiar a la siguiente posición
  const handleSiguientePosicion = () => {
    if (posicionActual === "portero") setPosicionActual("defensa")
    else if (posicionActual === "defensa") setPosicionActual("mediocampista")
    else if (posicionActual === "mediocampista") setPosicionActual("delantero")
  }

  // Cambiar a la posición anterior
  const handleAnteriorPosicion = () => {
    if (posicionActual === "delantero") setPosicionActual("mediocampista")
    else if (posicionActual === "mediocampista") setPosicionActual("defensa")
    else if (posicionActual === "defensa") setPosicionActual("portero")
  }

  // Traducir la posición para mostrarla en la UI
  const traducirPosicion = (posicion) => {
    switch (posicion) {
      case "portero":
        return "Portero"
      case "defensa":
        return "Defensa"
      case "mediocampista":
        return "Mediocampista"
      case "delantero":
        return "Delantero"
      default:
        return posicion
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          Selecciona tus jugadores: <span className="font-bold">{traducirPosicion(posicionActual)}</span>
        </h3>
        <div className="text-sm text-gray-600">
          {getCantidadJugadoresPorPosicion(posicionActual, formacion)} jugador(es) necesario(s)
        </div>
      </div>

      {/* Navegación entre posiciones */}
      <div className="flex justify-between mb-6">
        <Button
          onClick={handleAnteriorPosicion}
          disabled={posicionActual === "portero"}
          className="px-4 py-2"
          variant="outline"
        >
          Anterior
        </Button>

        <div className="flex space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${posicionActual === "portero" ? "bg-blue-500" : "bg-gray-300"}`}
            title="Portero"
          ></div>
          <div
            className={`w-3 h-3 rounded-full ${posicionActual === "defensa" ? "bg-blue-500" : "bg-gray-300"}`}
            title="Defensa"
          ></div>
          <div
            className={`w-3 h-3 rounded-full ${posicionActual === "mediocampista" ? "bg-blue-500" : "bg-gray-300"}`}
            title="Mediocampista"
          ></div>
          <div
            className={`w-3 h-3 rounded-full ${posicionActual === "delantero" ? "bg-blue-500" : "bg-gray-300"}`}
            title="Delantero"
          ></div>
        </div>

        <Button
          onClick={handleSiguientePosicion}
          disabled={posicionActual === "delantero"}
          className="px-4 py-2"
          variant="outline"
        >
          Siguiente
        </Button>
      </div>

      {/* Jugadores disponibles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {getJugadoresDisponibles().map((jugador, index) => (
          <JugadorSeleccionable
            key={jugador.id || index}
            jugador={jugador}
            seleccionado={isJugadorSeleccionado(index)}
            onSeleccionar={() => handleSeleccionarJugador(index)}
            disabled={isSeleccionCompleta() && !isJugadorSeleccionado(index)}
          />
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between mt-8">
        <Button onClick={onCancel} className="px-6 py-2" variant="outline">
          Cancelar
        </Button>

        <Button
          onClick={onSaveDraft}
          disabled={!seleccionesCompletas || guardando}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white"
        >
          {guardando ? "Guardando..." : "Guardar Draft"}
        </Button>
      </div>
    </div>
  )
}
