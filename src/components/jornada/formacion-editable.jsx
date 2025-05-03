"use client"

import { useState, useEffect } from "react"
import PosicionEditable from "./posicion-editable"

export default function FormacionEditable({ formacion, selecciones, playerOptions, onSeleccionarPosicion }) {
  const [formacionArray, setFormacionArray] = useState([])

  // Convertir la formación a un array de números
  useEffect(() => {
    if (formacion) {
      const [defensas, mediocampistas, delanteros] = formacion.split("-").map(Number)
      setFormacionArray([1, defensas, mediocampistas, delanteros]) // 1 portero + defensas + mediocampistas + delanteros
    }
  }, [formacion])

  // Obtener jugador seleccionado para una posición e índice
  const getJugadorSeleccionado = (posicion, indice) => {
    if (!selecciones || !selecciones[posicion] || !playerOptions || !playerOptions[posicion]) {
      return null
    }

    // Obtener el índice del jugador seleccionado
    const seleccionIndice = selecciones[posicion][indice]
    
    // Si no hay selección, retornar null
    if (seleccionIndice === null || seleccionIndice === undefined) {
      return null
    }

    // Obtener las opciones de jugadores para esta posición e índice específico
    const jugadoresGrupo = playerOptions[posicion][indice]
    
    // Si no hay opciones para esta posición e índice, retornar null
    if (!jugadoresGrupo || jugadoresGrupo.length === 0) {
      return null
    }

    // Retornar el jugador seleccionado
    return jugadoresGrupo[seleccionIndice]
  }

  return (
    <div className="relative bg-green-800 rounded-lg p-4 h-[500px] sm:h-[600px] overflow-hidden">
      {/* Campo de fútbol con líneas */}
      <div className="absolute inset-0 flex flex-col">
        <div className="h-1/2 border-b-2 border-white border-opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white border-opacity-30 rounded-full"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-white border-opacity-30"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-white border-opacity-30"></div>
      </div>

      {/* Formación editable */}
      <div className="relative h-full flex flex-col justify-between">
        {/* Portero */}
        <div className="flex justify-center mb-4">
          <PosicionEditable
            jugador={getJugadorSeleccionado("portero", 0)}
            posicion="portero"
            indice={0}
            onSeleccionar={onSeleccionarPosicion}
          />
        </div>

        {/* Defensas */}
        {formacionArray[1] > 0 && (
          <div className="flex justify-around mb-4">
            {Array.from({ length: formacionArray[1] }).map((_, index) => (
              <PosicionEditable
                key={`defensa-${index}`}
                jugador={getJugadorSeleccionado("defensa", index)}
                posicion="defensa"
                indice={index}
                onSeleccionar={onSeleccionarPosicion}
              />
            ))}
          </div>
        )}

        {/* Mediocampistas */}
        {formacionArray[2] > 0 && (
          <div className="flex justify-around mb-4">
            {Array.from({ length: formacionArray[2] }).map((_, index) => (
              <PosicionEditable
                key={`mediocampista-${index}`}
                jugador={getJugadorSeleccionado("mediocampista", index)}
                posicion="mediocampista"
                indice={index}
                onSeleccionar={onSeleccionarPosicion}
              />
            ))}
          </div>
        )}

        {/* Delanteros */}
        {formacionArray[3] > 0 && (
          <div className="flex justify-around mb-4">
            {Array.from({ length: formacionArray[3] }).map((_, index) => (
              <PosicionEditable
                key={`delantero-${index}`}
                jugador={getJugadorSeleccionado("delantero", index)}
                posicion="delantero"
                indice={index}
                onSeleccionar={onSeleccionarPosicion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}