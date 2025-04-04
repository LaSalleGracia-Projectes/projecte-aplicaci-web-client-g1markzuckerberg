"use client";

import { createContext, useContext, useState } from "react";

// Crear el contexto de la liga
const LeagueContext = createContext();

// Proveedor del contexto
export function LeagueProvider({ children }) {
  const [leagueCode, setLeagueCode] = useState(null); // Estado global para el código de la liga

  return (
    <LeagueContext.Provider value={{ leagueCode, setLeagueCode }}>
      {children}
    </LeagueContext.Provider>
  );
}

// Hook para acceder al contexto
export function useLeague() {
  return useContext(LeagueContext);
}
