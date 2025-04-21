'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LigaContext = createContext();

export function LigaProvider({ children }) {
  const [currentLiga, setCurrentLiga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLiga = async () => {
      try {
        // 💡 Solo en cliente
        if (typeof window === "undefined") return;

        const token = localStorage.getItem('webToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const savedLigaId = localStorage.getItem('currentLigaId');
        if (!savedLigaId) {
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:3000/api/v1/liga/${savedLigaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Liga no encontrada");
          localStorage.removeItem("currentLigaId");
          return;
        }

        const ligaData = await res.json();
        setCurrentLiga(ligaData);
      } catch (err) {
        console.error("Error cargando liga:", err);
        setError("No se pudo cargar la liga");
      } finally {
        setLoading(false);
      }
    };

    loadLiga();
  }, []);

  const setLiga = (liga) => {
    if (!liga?.id) return;
    setCurrentLiga(liga);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentLigaId", liga.id);
    }
  };

  const clearLiga = () => {
    setCurrentLiga(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentLigaId");
    }
  };

  const getLigaById = async (id) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("webToken");
      if (!token) throw new Error("No autenticado");

      const res = await fetch(`http://localhost:3000/api/v1/liga/code/${liga.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("No se pudo obtener la liga");

      const ligaData = await res.json();
      setLiga(ligaData);
      return ligaData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LigaContext.Provider
      value={{
        currentLiga,
        setLiga,
        clearLiga,
        getLigaById,
        loading,
        error,
      }}
    >
      {children}
    </LigaContext.Provider>
  );
}

export function useLiga() {
  const context = useContext(LigaContext);
  if (context === undefined) {
    throw new Error("useLiga debe usarse dentro de LigaProvider");
  }
  return context;
}
