"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { User } from "lucide-react"

export default function Formation343({ tempDraft, setTempDraft, jornada }) {
  // Inicialmente todos los jugadores son null
  const [selectedPlayers, setSelectedPlayers] = useState([
    null, // Portero
    null,
    null,
    null, // Defensas
    null,
    null,
    null,
    null, // Centrocampistas
    null,
    null,
    null, // Delanteros
  ])
  const [showPlayerSelector, setShowPlayerSelector] = useState(null)
  const [currentPositionIndex, setCurrentPositionIndex] = useState(null)
  const [playerOptions, setPlayerOptions] = useState([])

  useEffect(() => {
    if (!tempDraft) return

    try {
      // Intentar parsear las opciones de jugadores si vienen como string
      let parsedOptions = null

      if (tempDraft.playerOptions && typeof tempDraft.playerOptions === "string") {
        parsedOptions = JSON.parse(tempDraft.playerOptions)
      } else if (tempDraft.playerOptions && Array.isArray(tempDraft.playerOptions)) {
        parsedOptions = tempDraft.playerOptions
      } else if (tempDraft.tempDraft && tempDraft.tempDraft.playerOptions) {
        if (typeof tempDraft.tempDraft.playerOptions === "string") {
          parsedOptions = JSON.parse(tempDraft.tempDraft.playerOptions)
        } else if (Array.isArray(tempDraft.tempDraft.playerOptions)) {
          parsedOptions = tempDraft.tempDraft.playerOptions
        }
      }

      if (!parsedOptions) {
        console.error("No se pudieron encontrar o parsear las opciones de jugadores")
        return
      }

      console.log("Opciones de jugadores parseadas:", parsedOptions)
      setPlayerOptions(parsedOptions)

      // Inicializar jugadores seleccionados basados en el 5º elemento de cada array
      const initialPlayers = [
        null, // Portero (posición 0)
        null,
        null,
        null, // Defensas (posiciones 1-3)
        null,
        null,
        null,
        null, // Centrocampistas (posiciones 4-7)
        null,
        null,
        null, // Delanteros (posiciones 8-10)
      ]

      // Mapear las posiciones a los grupos de jugadores
      const positionMapping = {
        24: [0], // Portero
        25: [1, 2, 3], // Defensas
        26: [4, 5, 6, 7], // Centrocampistas
        27: [8, 9, 10], // Delanteros
      }

      // Para cada grupo de opciones de jugadores
      parsedOptions.forEach((group, groupIndex) => {
        if (!group || !Array.isArray(group) || group.length < 5) return

        // El último elemento (índice 4) indica el jugador seleccionado (0-3) o null
        const selectedIndex = group[4]

        // Verificamos si hay una posición específica asociada a este grupo
        const specificPosition = group[5] // Índice 5 contiene la posición específica en el campo

        if (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < 4) {
          const player = group[selectedIndex]
          if (!player || !player.positionId) return

          // Si existe una posición específica, usamos esa
          if (specificPosition !== undefined && specificPosition >= 0 && specificPosition < initialPlayers.length) {
            initialPlayers[specificPosition] = {
              ...player,
              groupIndex,
              selectedIndex,
            }
          } else {
            // Fallback al comportamiento anterior si no hay posición específica
            const positions = positionMapping[player.positionId]
            if (!positions || !positions.length) return

            for (const pos of positions) {
              if (initialPlayers[pos] === null) {
                initialPlayers[pos] = {
                  ...player,
                  groupIndex,
                  selectedIndex,
                }
                break
              }
            }
          }
        }
      })

      console.log("Jugadores inicializados para 3-4-3:", initialPlayers)
      setSelectedPlayers(initialPlayers)
    } catch (error) {
      console.error("Error al procesar las opciones de jugadores:", error)
    }
  }, [tempDraft])

  const handlePlayerClick = (index, positionId) => {
    // Primero, buscar si ya hay un grupo asociado a esta posición específica
    let foundGroupIndex = -1

    // Buscar en todos los grupos si alguno ya está asociado con esta posición específica
    for (let i = 0; i < playerOptions.length; i++) {
      const group = playerOptions[i]
      if (group && Array.isArray(group) && group.length > 5 && group[5] === index) {
        foundGroupIndex = i
        break
      }
    }

    // Si encontramos un grupo específico para esta posición, usarlo
    if (foundGroupIndex !== -1) {
      setShowPlayerSelector(index)
      setCurrentPositionIndex(foundGroupIndex)
      return
    }

    // Si no encontramos un grupo específico, usar la lógica basada en el tipo de posición
    let groupIndex = -1

    switch (positionId) {
      case "24": // Portero
        groupIndex = 10 // Asumiendo que el portero es el último grupo en el array
        break
      case "25": // Defensas
        if (index >= 1 && index <= 3) {
          groupIndex = 7 + (index - 1) // Grupos 7-9 para defensas
        }
        break
      case "26": // Centrocampistas
        if (index >= 4 && index <= 7) {
          groupIndex = 3 + (index - 4) // Grupos 3-6 para centrocampistas
        }
        break
      case "27": // Delanteros
        if (index >= 8 && index <= 10) {
          groupIndex = index - 8 // Grupos 0-2 para delanteros
        }
        break
    }

    if (groupIndex >= 0 && groupIndex < playerOptions.length) {
      // Si ya hay un jugador seleccionado en esta posición, asegurarse de que el grupo tenga
      // la propiedad de posición específica
      if (selectedPlayers[index]) {
        // Actualizar el grupo para incluir la posición específica
        const updatedOptions = [...playerOptions]
        if (!updatedOptions[groupIndex][5] && updatedOptions[groupIndex][5] !== 0) {
          updatedOptions[groupIndex][5] = index
          setPlayerOptions(updatedOptions)
        }
      }

      setShowPlayerSelector(index)
      setCurrentPositionIndex(groupIndex)
    } else {
      console.error(`No se encontró grupo para posición ${positionId}, índice ${index}`)
    }
  }

  const handlePlayerSelect = (playerIndex, positionIndex) => {
    if (showPlayerSelector === null || currentPositionIndex === null) return

    // Obtener el grupo de jugadores actual
    const currentGroup = playerOptions[currentPositionIndex]
    if (!currentGroup || !Array.isArray(currentGroup) || playerIndex >= currentGroup.length - 1) return

    // Obtener el jugador seleccionado
    const selectedPlayer = currentGroup[playerIndex]
    if (!selectedPlayer) return

    // Actualizar el jugador en la posición seleccionada
    const newSelectedPlayers = [...selectedPlayers]
    newSelectedPlayers[positionIndex] = {
      ...selectedPlayer,
      groupIndex: currentPositionIndex,
      selectedIndex: playerIndex,
    }
    setSelectedPlayers(newSelectedPlayers)

    // Actualizar el 5º elemento del grupo con el índice del jugador seleccionado
    // y el 6º elemento con la posición específica en el campo
    const newPlayerOptions = [...playerOptions]
    newPlayerOptions[currentPositionIndex] = [...currentGroup]
    newPlayerOptions[currentPositionIndex][4] = playerIndex
    newPlayerOptions[currentPositionIndex][5] = positionIndex // Guardar la posición específica
    setPlayerOptions(newPlayerOptions)

    // Actualizar el tempDraft
    if (setTempDraft && tempDraft) {
      const updatedTempDraft = { ...tempDraft }

      if (typeof updatedTempDraft.playerOptions === "string") {
        updatedTempDraft.playerOptions = JSON.stringify(newPlayerOptions)
      } else if (Array.isArray(updatedTempDraft.playerOptions)) {
        updatedTempDraft.playerOptions = newPlayerOptions
      } else if (updatedTempDraft.tempDraft) {
        if (typeof updatedTempDraft.tempDraft.playerOptions === "string") {
          updatedTempDraft.tempDraft.playerOptions = JSON.stringify(newPlayerOptions)
        } else if (Array.isArray(updatedTempDraft.tempDraft.playerOptions)) {
          updatedTempDraft.tempDraft.playerOptions = newPlayerOptions
        }
      }

      setTempDraft(updatedTempDraft)
    }

    setShowPlayerSelector(null)
  }

  const renderPlayerSelector = () => {
    if (showPlayerSelector === null || currentPositionIndex === null) return null

    // Obtener los 4 jugadores disponibles para esta posición (excluyendo el 5º elemento)
    const currentGroup = playerOptions[currentPositionIndex]
    if (!currentGroup || !Array.isArray(currentGroup)) return null

    // Filtrar solo los jugadores válidos (los primeros 4 elementos)
    const players = currentGroup.slice(0, 4).filter((player) => player !== null)

    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto w-80">
        <h3 className="text-lg font-bold mb-2">Seleccionar Jugador</h3>
        <div className="grid gap-2">
          {players.length > 0 ? (
            players.map(
              (player, idx) =>
                player && (
                  <div
                    key={`${player.id}-${idx}`}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handlePlayerSelect(idx, showPlayerSelector)}
                  >
                    <div className="relative w-10 h-10 overflow-hidden rounded-full">
                      {player.imagePath && player.imagePath.includes("cdn.sportmonks.com") ? (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">{player.displayName.charAt(0)}</span>
                        </div>
                      ) : (
                        <Image
                          src={player.imagePath || "/images/player-placeholder.png"}
                          alt={player.displayName}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{player.displayName}</p>
                      <div className="flex items-center">
                        {Array.from({ length: player.estrellas }).map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{player.puntos_totales} pts</span>
                      </div>
                    </div>
                  </div>
                ),
            )
          ) : (
            <p className="text-center py-2">No hay jugadores disponibles para esta posición</p>
          )}
        </div>
        <button
          className="mt-3 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setShowPlayerSelector(null)}
        >
          Cancelar
        </button>
      </div>
    )
  }

  const renderPlayerIcon = (player, index, positionId, top, left) => {
    return (
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ top, left }}
        onClick={() => handlePlayerClick(index, positionId)}
      >
        <div className="relative flex flex-col items-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${player ? "bg-green-500" : "bg-gray-300"} border-2 border-white shadow-lg`}
          >
            {player ? (
              player.imagePath && player.imagePath.includes("cdn.sportmonks.com") ? (
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{player.displayName.charAt(0)}</span>
                </div>
              ) : (
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={player.imagePath || "/images/player-placeholder.png"}
                    alt={player.displayName}
                    fill
                    className="object-cover"
                  />
                </div>
              )
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="mt-1 bg-white px-2 py-1 rounded-full text-xs font-bold shadow">
            {player ? player.displayName.split(" ").pop() : `Pos ${index}`}
          </div>
          {player && (
            <div className="mt-1 flex">
              {Array.from({ length: player.estrellas }).map((_, i) => (
                <span key={i} className="text-yellow-500 text-xs">
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleSaveLineup = async () => {
    if (!tempDraft || !setTempDraft) return

    try {
      const token = localStorage.getItem("webToken")
      if (!token) {
        alert("No se encontró el token de autenticación")
        return
      }

      // Obtener el ID de la plantilla del tempDraft
      const id_plantilla =
        tempDraft.id_plantilla ||
        (tempDraft.tempDraft && tempDraft.tempDraft.id_plantilla) ||
        tempDraft.id ||
        (tempDraft.tempDraft && tempDraft.tempDraft.id)

      if (!id_plantilla) {
        alert("No se pudo obtener el ID de la plantilla")
        return
      }

      // Preparar los datos para guardar con la estructura correcta
      const requestData = {
        tempDraft: {
          id_plantilla: id_plantilla,
          playerOptions: playerOptions,
          formation: "3-4-3",
        },
      }

      console.log("Enviando datos para guardar:", requestData)

      // Llamar a la API para guardar la alineación con el endpoint correcto
      const res = await fetch("http://localhost:3000/api/v1/draft/saveDraft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al guardar la alineación: ${res.status} ${errorText}`)
      }

      const data = await res.json()
      alert("Alineación guardada correctamente")

      // Actualizar el tempDraft con la respuesta si es necesario
      if (data.draft) {
        setTempDraft(data.draft)
      }
    } catch (error) {
      console.error("Error guardando alineación:", error)
      alert(`Error al guardar la alineación: ${error.message}`)
    }
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto h-[600px]">
      {/* Goalkeeper */}
      {renderPlayerIcon(selectedPlayers[0], 0, "24", "90%", "50%")}

      {/* Defenders - 3 */}
      {renderPlayerIcon(selectedPlayers[1], 1, "25", "75%", "30%")}
      {renderPlayerIcon(selectedPlayers[2], 2, "25", "75%", "50%")}
      {renderPlayerIcon(selectedPlayers[3], 3, "25", "75%", "70%")}

      {/* Midfielders - 4 */}
      {renderPlayerIcon(selectedPlayers[4], 4, "26", "55%", "20%")}
      {renderPlayerIcon(selectedPlayers[5], 5, "26", "55%", "40%")}
      {renderPlayerIcon(selectedPlayers[6], 6, "26", "55%", "60%")}
      {renderPlayerIcon(selectedPlayers[7], 7, "26", "55%", "80%")}

      {/* Forwards - 3 */}
      {renderPlayerIcon(selectedPlayers[8], 8, "27", "25%", "30%")}
      {renderPlayerIcon(selectedPlayers[9], 9, "27", "25%", "50%")}
      {renderPlayerIcon(selectedPlayers[10], 10, "27", "25%", "70%")}

      {/* Player selector modal */}
      {renderPlayerSelector()}

      {/* Formation label */}
      <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full shadow text-sm font-bold">
        Formación: 3-4-3
      </div>

      {/* Save button */}
      <div className="absolute bottom-4 right-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          onClick={handleSaveLineup}
        >
          Guardar Alineación
        </button>
      </div>
    </div>
  )
}
