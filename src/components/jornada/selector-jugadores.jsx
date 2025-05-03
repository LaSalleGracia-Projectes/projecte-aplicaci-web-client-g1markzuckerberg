"use client"

import { useState } from "react"
import { Button } from "@/components/ui"

export default function SelectorJugadores({ posicion, indice, jugadores, seleccionActual, onSeleccionar, onCerrar }) {
  const [imageErrors, setImageErrors] = useState({})

  // Crear un placeholder para cuando la imagen falla
  const getPlaceholderImage = (jugador) => {
    if (!jugador) return ""
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' fontFamily='Arial' fontSize='12' textAnchor='middle' dominantBaseline='middle' fill='%23999'%3E${jugador.displayName.charAt(0)}%3C/text%3E%3C/svg%3E`
  }

  // Función para determinar el color de borde según las estrellas
  const getBorderColor = (estrellas) => {
    switch (Number.parseInt(estrellas)) {
      case 5:
        return "border-yellow-400"
      case 4:
        return "border-purple-400"
      case 3:
        return "border-blue-400"
      case 2:
        return "border-green-400"
      default:
        return "border-gray-400"
    }
  }

  // Traducir la posición para mostrarla en la UI
  const traducirPosicion = (pos) => {
    switch (pos) {
      case "portero":
        return "Portero"
      case "defensa":
        return "Defensa"
      case "mediocampista":
        return "Mediocampista"
      case "delantero":
        return "Delantero"
      default:
        return pos.charAt(0).toUpperCase() + pos.slice(1)
    }
  }

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
          <h3 className="font-semibold">
            Seleccionar {traducirPosicion(posicion)} {indice + 1}
          </h3>
          <button
            className="text-white hover:text-gray-200 transition-colors"
            onClick={onCerrar}
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-grow p-4">
          {jugadores && jugadores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {jugadores.map((jugador, index) => (
                <div
                  key={jugador.id}
                  className={`border-2 rounded-lg p-3 flex items-center cursor-pointer transition-all hover:shadow-md ${
                    seleccionActual === index ? "bg-blue-50 border-blue-500" : `border-gray-200 hover:${getBorderColor(jugador.estrellas)}`
                  }`}
                  onClick={() => onSeleccionar(index)}
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={imageErrors[jugador.id] ? getPlaceholderImage(jugador) : jugador.imagePath}
                      alt={jugador.displayName}
                      className="h-full object-contain"
                      onError={() => handleImageError(jugador.id)}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{jugador.displayName}</h4>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        Number.parseInt(jugador.estrellas) >= 4
                          ? "bg-purple-100 text-purple-800"
                          : Number.parseInt(jugador.estrellas) >= 3
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {jugador.estrellas} ★
                      </span>
                      <span className="ml-2 text-sm text-gray-600">{jugador.puntos_totales} puntos</span>
                    </div>
                  </div>
                  {seleccionActual === index && (
                    <div className="ml-2 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No hay jugadores disponibles para esta posición</div>
          )}
        </div>

        <div className="border-t p-4 flex justify-between">
          <Button variant="outline" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button onClick={onCerrar} className="bg-blue-500 hover:bg-blue-600 text-white">
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}