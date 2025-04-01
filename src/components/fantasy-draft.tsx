import Image from "next/image"
import { Globe, ChevronDown } from 'lucide-react'

export default function FantasyDraft() {
  return (
    <div className="flex flex-col min-h-screen bg-[#eeeeee]">
      {/* Header */}
      <header className="bg-[#d9d9d9] py-4 text-center">
        <h1 className="text-3xl font-bold text-[#000000]">FantasyDraft</h1>
      </header>

      {/* Banner */}
      <div className="relative bg-white w-full h-64 border-b border-[#d9d9d9]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative">
            {/* Diagonal lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-[#d9d9d9] rotate-45 origin-center" />
              <div className="w-full h-0.5 bg-[#d9d9d9] -rotate-45 origin-center" />
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-[#d9d9d9] py-12 flex justify-center">
        <button className="bg-white px-8 py-3 rounded-md text-[#000000] font-medium border border-[#c4c4c4]">
          COMENZAR A JUGAR
        </button>
      </div>

      {/* Next matchday section */}
      <div className="py-8 px-4 bg-white">
        <h2 className="text-xl font-semibold text-center mb-2">PRÓXIMA JORNADA</h2>
        <div className="w-full max-w-3xl mx-auto h-px bg-[#d9d9d9] mb-6"></div>

        {/* Matches grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {/* Left column */}
          <div className="space-y-4">
            {[
              { team1: "Equipo 1", team2: "Equipo 2" },
              { team1: "Equipo 3", team2: "Equipo 4" },
              { team1: "Equipo 5", team2: "Equipo 6" },
              { team1: "Equipo 7", team2: "Equipo 8" },
              { team1: "Equipo 9", team2: "Equipo 10" },
            ].map((match, index) => (
              <div key={index} className="flex items-center justify-between bg-[#f5f5f5] p-3 rounded-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 border border-[#d9d9d9] flex items-center justify-center">
                    <div className="w-8 h-8 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-[#d9d9d9] rotate-45 origin-center" />
                        <div className="w-full h-0.5 bg-[#d9d9d9] -rotate-45 origin-center" />
                      </div>
                    </div>
                  </div>
                  <span className="ml-2 font-medium">{match.team1}</span>
                </div>
                <span className="mx-2 text-sm font-medium">vs</span>
                <div className="flex items-center">
                  <span className="mr-2 font-medium">{match.team2}</span>
                  <div className="w-10 h-10 border border-[#d9d9d9] flex items-center justify-center">
                    <div className="w-8 h-8 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-[#d9d9d9] rotate-45 origin-center" />
                        <div className="w-full h-0.5 bg-[#d9d9d9] -rotate-45 origin-center" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {[
              { team1: "Equipo 11", team2: "Equipo 12" },
              { team1: "Equipo 13", team2: "Equipo 14" },
              { team1: "Equipo 15", team2: "Equipo 16" },
              { team1: "Equipo 17", team2: "Equipo 18" },
              { team1: "Equipo 19", team2: "Equipo 20" },
            ].map((match, index) => (
              <div key={index} className="flex items-center justify-between bg-[#f5f5f5] p-3 rounded-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 border border-[#d9d9d9] flex items-center justify-center">
                    <div className="w-8 h-8 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-[#d9d9d9] rotate-45 origin-center" />
                        <div className="w-full h-0.5 bg-[#d9d9d9] -rotate-45 origin-center" />
                      </div>
                    </div>
                  </div>
                  <span className="ml-2 font-medium">{match.team1}</span>
                </div>
                <span className="mx-2 text-sm font-medium">vs</span>
                <div className="flex items-center">
                  <span className="mr-2 font-medium">{match.team2}</span>
                  <div className="w-10 h-10 border border-[#d9d9d9] flex items-center justify-center">
                    <div className="w-8 h-8 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-[#d9d9d9] rotate-45 origin-center" />
                        <div className="w-full h-0.5 bg-[#d9d9d9] -rotate-45 origin-center" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-[#d9d9d9] py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Goal scorers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Goleadores</h3>
            <div className="space-y-2">
              {[
                { name: "Jugador1", value: 14 },
                { name: "Jugador2", value: 8 },
                { name: "Jugador3", value: 7 },
              ].map((player, index) => (
                <div key={index} className="flex items-center bg-[#eeeeee] rounded-md p-2">
                  <div className="w-8 h-8 bg-[#c4c4c4] rounded-full flex items-center justify-center mr-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#787878" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#787878" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="flex-grow">{player.name}</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-1 text-[#787878]">G</span>
                    <span className="font-semibold">{player.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center image */}
          <div className="flex items-center justify-center">
            <div className="w-full h-32 relative">
              <div className="absolute inset-0 flex items-center justify-center border border-[#c4c4c4]">
                <div className="w-full h-0.5 bg-[#c4c4c4] rotate-45 origin-center" />
                <div className="w-full h-0.5 bg-[#c4c4c4] -rotate-45 origin-center" />
              </div>
            </div>
          </div>

          {/* Assist providers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Asistidores</h3>
            <div className="space-y-2">
              {[
                { name: "Jugador1", value: 7 },
                { name: "Jugador2", value: 6 },
                { name: "Jugador3", value: 5 },
              ].map((player, index) => (
                <div key={index} className="flex items-center bg-[#eeeeee] rounded-md p-2">
                  <div className="w-8 h-8 bg-[#c4c4c4] rounded-full flex items-center justify-center mr-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#787878" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#787878" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="flex-grow">{player.name}</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-1 text-[#787878]">A</span>
                    <span className="font-semibold">{player.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white py-2 border-t border-[#d9d9d9]">
        <div className="max-w-5xl mx-auto grid grid-cols-5 text-center text-sm">
          <button className="py-2 px-1 bg-[#eeeeee]">Página principal</button>
          <button className="py-2 px-1">Resultados</button>
          <button className="py-2 px-1">Liga</button>
          <button className="py-2 px-1">Clasificación</button>
          <button className="py-2 px-1">Mi plantilla</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#181818] text-white py-3 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex items-center mb-2 md:mb-0">
            <button className="flex items-center bg-[#787878] rounded px-2 py-1">
              <Globe className="h-4 w-4 mr-1" />
              <span>Español</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="flex space-x-4 mb-2 md:mb-0">
            <a href="#" className="hover:underline">Política de Privacidad</a>
            <a href="#" className="hover:underline">Contacto</a>
            <a href="#" className="hover:underline">Configuración de Cookies</a>
          </div>
          <div className="text-[#949494] text-xs">
            © Noviembre 2024 Mark Zuckerberg S.L
          </div>
        </div>
      </footer>
    </div>
  )
}