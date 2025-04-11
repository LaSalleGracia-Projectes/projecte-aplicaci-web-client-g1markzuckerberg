import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LigaContext = createContext();

export function LigaProvider({ children }) {
  const [currentLiga, setCurrentLiga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Load liga on initial mount
  useEffect(() => {
    const loadLiga = async () => {
      try {
        // Get token, return early if not logged in
        const token = localStorage.getItem('webToken');
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if we have a saved liga code in localStorage
        const savedLigaCode = localStorage.getItem('currentLigaCode');
        
        if (savedLigaCode) {
          // Fetch liga details using the code
          const response = await fetch(`http://localhost:3000/api/v1/liga/getByCode/${savedLigaCode}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const ligaData = await response.json();
            setCurrentLiga(ligaData);
          } else {
            // If liga not found, clear saved code
            localStorage.removeItem('currentLigaCode');
            console.error('Saved liga not found');
          }
        }
      } catch (err) {
        console.error('Error loading liga:', err);
        setError('Failed to load liga information');
      } finally {
        setLoading(false);
      }
    };

    loadLiga();
  }, []);

  // Function to set a new current liga
  const setLiga = (liga) => {
    if (liga && liga.code) {
      // Save to state
      setCurrentLiga(liga);
      
      // Save code to localStorage for persistence
      localStorage.setItem('currentLigaCode', liga.code);
    }
  };

  // Function to clear current liga
  const clearLiga = () => {
    setCurrentLiga(null);
    localStorage.removeItem('currentLigaCode');
  };

  // Function to get liga details by code
  const getLigaByCode = async (code) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('webToken');
      if (!token) {
        throw new Error('No estás autenticado');
      }

      const response = await fetch(`http://localhost:3000/api/v1/liga/getByCode/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener la información de la liga');
      }

      const ligaData = await response.json();
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
        getLigaByCode,
        loading,
        error
      }}
    >
      {children}
    </LigaContext.Provider>
  );
}

// Custom hook to use the liga context
export function useLiga() {
  const context = useContext(LigaContext);
  if (context === undefined) {
    throw new Error('useLiga must be used within a LigaProvider');
  }
  return context;
}