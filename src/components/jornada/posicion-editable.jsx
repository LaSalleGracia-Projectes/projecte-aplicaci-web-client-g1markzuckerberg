"use client"

import { useState } from "react"

export default function PosicionEditable({ jugador, posicion, indice, onSeleccionar }) {
  const [imageError, setImageError] = useState(false)

  // Placeholder para cuando la imagen falla
  const placeholderImage = jugador
    ? `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' fontFamily='Arial' fontSize='12' textAnchor='middle' dominantBaseline='middle' fill='%23999'%3E${jugador.displayName.charAt(0)}%3C/text%3E%3C/svg%3E`
    : null

  // Función para determinar el color de fondo según las estrellas
  const getBackgroundColor = () => {
    if (!jugador) return "bg-gray-400 bg-opacity-50"

    switch (Number.parseInt(jugador.estrellas)) {
      case 5:
        return "bg-gradient-to-b from-yellow-400 to-yellow-300"
      case 4:
        return "bg-gradient-to-b from-purple-400 to-purple-300"
      case 3:
        return "bg-gradient-to-b from-blue-400 to-blue-300"
      case 2:
        return "bg-gradient-to-b from-green-400 to-green-300"
      default:
        return "bg-gradient-to-b from-gray-400 to-gray-300"
    }
  }

  // Traducir la posición para mostrarla en la UI
  const traducirPosicion = (pos) => {
    switch (pos) {
      case "portero":
        return "POR"
      case "defensa":
        return "DEF"
      case "mediocampista":
        return "MED"
      case "delantero":
        return "DEL"
      default:
        return pos.substring(0, 3).toUpperCase()
    }
  }

  return (
    <div
      className={`w-20 h-28 sm:w-24 sm:h-32 rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-all ${getBackgroundColor()}`}
      onClick={() => onSeleccionar(posicion, indice)}
    >
      {jugador ? (
        <>
          <div className="h-16 sm:h-20 bg-white flex items-center justify-center p-1">
            <img
              src={imageError ? placeholderImage : jugador.imagePath}
              alt={jugador.displayName}
              className="h-full object-contain"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-1 text-white">
            <p className="text-xs font-bold truncate w-full text-center">{jugador.displayName}</p>
            <div className="flex items-center justify-center mt-1">
              <span className="text-xs font-semibold">{jugador.puntos_totales} pts</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <div className="w-10 h-10 rounded-full border-2 border-white border-dashed flex items-center justify-center mb-2">
            <span className="text-2xl">+</span>
          </div>
          <p className="text-xs font-medium">{traducirPosicion(posicion)}</p>
        </div>
      )}
    </div>
  )
}