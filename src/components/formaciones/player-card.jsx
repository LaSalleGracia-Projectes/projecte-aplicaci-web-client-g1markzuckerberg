"use client"

import { useState } from "react"

export default function PlayerCard({ player }) {
  const [imageError, setImageError] = useState(false)

  if (!player) {
    return (
      <div className="w-20 h-28 sm:w-24 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-xs">Vacío</span>
      </div>
    )
  }

  // Placeholder para cuando la imagen falla
  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' fontFamily='Arial' fontSize='12' textAnchor='middle' dominantBaseline='middle' fill='%23999'%3E${player.displayName.charAt(0)}%3C/text%3E%3C/svg%3E`

  // Función para determinar el color de fondo según las estrellas
  const getBackgroundColor = () => {
    switch (Number.parseInt(player.estrellas)) {
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
      className={`w-20 h-28 sm:w-24 sm:h-32 rounded-lg shadow-md overflow-hidden flex flex-col ${getBackgroundColor()}`}
    >
      <div className="h-16 sm:h-20 bg-white flex items-center justify-center p-1">
        <img
          src={imageError ? placeholderImage : player.imagePath}
          alt={player.displayName}
          className="h-full object-contain"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-1 text-white">
        <p className="text-xs font-bold truncate w-full text-center">{player.displayName}</p>
        <div className="flex items-center justify-center mt-1">
          <span className="text-xs font-semibold">{player.puntos_jornada} pts</span>
        </div>
      </div>
    </div>
  )
}
