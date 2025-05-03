"use client"

import { useState } from "react"

export default function JugadorSeleccionable({ jugador, seleccionado, onSeleccionar, disabled }) {
  const [imageError, setImageError] = useState(false)

  if (!jugador) {
    return (
      <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-xs">No disponible</span>
      </div>
    )
  }

  // Placeholder para cuando la imagen falla
  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' fontFamily='Arial' fontSize='12' textAnchor='middle' dominantBaseline='middle' fill='%23999'%3E${jugador.displayName?.charAt(0) || "?"}%3C/text%3E%3C/svg%3E`

  // Función para determinar el color de fondo según las estrellas
  const getBackgroundColor = () => {
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

  return (
    <div
      className={`w-full rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer transition-all ${
        seleccionado ? "ring-2 ring-blue-500 transform scale-105" : disabled ? "opacity-50" : "hover:shadow-lg"
      }`}
      onClick={disabled ? undefined : onSeleccionar}
    >
      <div className={`h-24 flex items-center justify-center p-2 ${getBackgroundColor()}`}>
        <img
          src={imageError ? placeholderImage : jugador.imagePath}
          alt={jugador.displayName}
          className="h-full object-contain"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="flex-1 flex flex-col p-3 bg-white">
        <p className="font-bold text-sm truncate">{jugador.displayName}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex">
            {[...Array(Number.parseInt(jugador.estrellas || 0))].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold">{jugador.puntos_totales || 0} pts</span>
        </div>

        {seleccionado && (
          <div className="mt-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded text-center">
            Seleccionado
          </div>
        )}
      </div>
    </div>
  )
}
