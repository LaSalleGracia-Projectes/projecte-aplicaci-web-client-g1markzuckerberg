import Image from "next/image";

const players = [
  { id: 1, name: "Jugador 1", score: 95, image: "/images/player1.png" },
  { id: 2, name: "Jugador 2", score: 88, image: "/images/player2.png" },
  { id: 3, name: "Jugador 3", score: 76, image: "/images/player3.png" },
];

export default function PlayerInfoPage() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Sección izquierda con imagen y descripción */}
      <div className="col-span-1 flex flex-col items-center">
        <Image src="/images/team.png" alt="Equipo" width={200} height={200} className="rounded-lg" />
        <h2 className="text-2xl font-bold mt-4">Liga 1</h2>
        <p className="mt-4 text-gray-600 text-center">
          8346734242
        </p>
      </div>
      
      {/* Sección derecha con la información de los jugadores */}
      <div className="col-span-2 flex flex-col space-y-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center bg-gray-100 p-4 rounded-lg shadow">
            <Image src={player.image} alt={player.name} width={50} height={50} className="rounded-full" />
            <div className="ml-4 flex-1">
              <p className="text-lg font-semibold">{player.name}</p>
            </div>
            <img src="/images/vertical.png" alt="barra vertical" className="h-8"/>
            <p className="text-xl font-bold text-blue-500">{player.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
