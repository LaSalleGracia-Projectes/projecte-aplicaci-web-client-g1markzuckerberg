import PlayerCard from "./player-card"

export default function Formacion442({ jugadores }) {
  const { portero, defensas, mediocampistas, delanteros } = jugadores

  return (
    <div className="relative bg-green-800 rounded-lg p-4 h-[500px] sm:h-[600px] overflow-hidden">
      {/* Campo de fútbol con líneas */}
      <div className="absolute inset-0 flex flex-col">
        <div className="h-1/2 border-b-2 border-white border-opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white border-opacity-30 rounded-full"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-white border-opacity-30"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-white border-opacity-30"></div>
      </div>

      {/* Formación 4-4-2 */}
      <div className="relative h-full flex flex-col justify-between">
        {/* Portero */}
        <div className="flex justify-center mb-4">
          <PlayerCard player={portero[0]} />
        </div>

        {/* Defensas (4) */}
        <div className="flex justify-around mb-4">
          {defensas.slice(0, 4).map((defensa, index) => (
            <PlayerCard key={defensa.id || index} player={defensa} />
          ))}
        </div>

        {/* Mediocampistas (4) */}
        <div className="flex justify-around mb-4">
          {mediocampistas.slice(0, 4).map((medio, index) => (
            <PlayerCard key={medio.id || index} player={medio} />
          ))}
        </div>

        {/* Delanteros (2) */}
        <div className="flex justify-around mb-4">
          <div className="flex-1"></div>
          {delanteros.slice(0, 2).map((delantero, index) => (
            <PlayerCard key={delantero.id || index} player={delantero} />
          ))}
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  )
}
