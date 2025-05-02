"use client"

import { useEffect, useState } from "react"
import Layout from "@/components/layout"
import AuthGuard from "@/components/authGuard/authGuard"

const PLAYERS_PER_PAGE = 20

export default function Jugadores() {
  const [players, setPlayers] = useState([])
  const [filteredPlayers, setFilteredPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/sportmonks/teams")
        const data = await res.json()
        setTeams(data)
      } catch (error) {
        console.error("Error fetching teams:", error)
      }
    }
    fetchTeams()
  }, [])

  // Fetch players (with team filter)
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const url = selectedTeam
          ? `http://localhost:3000/api/v1/player/?points=down&team=${selectedTeam}`
          : "http://localhost:3000/api/v1/player/?points=down"

        const res = await fetch(url)
        const data = await res.json()
        setPlayers(data.players || [])
        setCurrentPage(1)
      } catch (error) {
        console.error("Error fetching players:", error)
      }
    }

    fetchPlayers()
  }, [selectedTeam])

  // Filter by name
  useEffect(() => {
    const filtered = players.filter(player =>
      player.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPlayers(filtered)
    setCurrentPage(1)
  }, [searchTerm, players])

  const totalPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE)
  const currentPlayers = filteredPlayers.slice(
    (currentPage - 1) * PLAYERS_PER_PAGE,
    currentPage * PLAYERS_PER_PAGE
  )

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))

  return (
    <AuthGuard>
      <Layout currentPage="Jugadores">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtro por equipo */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setSelectedTeam(null)}
              className={`px-3 py-2 rounded-full text-sm ${
                selectedTeam === null ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Todos
            </button>
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.name)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${
                  selectedTeam === team.name ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                <img src={team.imagePath} alt={team.name} className="w-5 h-5" />
                <span>{team.name}</span>
              </button>
            ))}
          </div>

          {/* Buscador por nombre */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar jugador..."
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Grid de jugadores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentPlayers.map(player => (
              <div
                key={player.id}
                className="bg-white shadow rounded-2xl p-4 flex flex-col items-center text-center"
              >
                <img
                  src={player.playerImage}
                  alt={player.displayName}
                  className="w-24 h-24 object-cover rounded-full mb-4"
                  onError={(e) => { e.target.src = "/default-player.png" }}
                />
                <h2 className="text-lg font-semibold">{player.displayName}</h2>
                <p className="text-gray-500">{player.teamName}</p>
                <span className="mt-2 text-blue-600 font-bold">{player.points} pts</span>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  )
}
