// context/LeagueContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the League context
const LeagueContext = createContext();

export function LeagueProvider({ children }) {
  const [currentLeague, setCurrentLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Load league on initial mount
  useEffect(() => {
    const loadLeague = async () => {
      try {
        // Get token, return early if not logged in
        const token = localStorage.getItem('webToken');
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if we have a saved league code in localStorage
        const savedLeagueCode = localStorage.getItem('currentLeagueCode');
        
        if (savedLeagueCode) {
          // Fetch league details using the code
          const response = await fetch(`http://localhost:3000/api/v1/liga/getByCode/${savedLeagueCode}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const leagueData = await response.json();
            setCurrentLeague(leagueData);
          } else {
            // If league not found, clear saved code
            localStorage.removeItem('currentLeagueCode');
            console.error('Saved league not found');
          }
        }
      } catch (err) {
        console.error('Error loading league:', err);
        setError('Failed to load league information');
      } finally {
        setLoading(false);
      }
    };

    loadLeague();
  }, []);

  // Function to set a new current league
  const setLeague = (league) => {
    if (league && league.code) {
      // Save to state
      setCurrentLeague(league);
      
      // Save code to localStorage for persistence
      localStorage.setItem('currentLeagueCode', league.code);
    }
  };

  // Function to clear current league
  const clearLeague = () => {
    setCurrentLeague(null);
    localStorage.removeItem('currentLeagueCode');
  };

  // Function to get league details by code
  const getLeagueByCode = async (code) => {
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

      const leagueData = await response.json();
      setLeague(leagueData);
      return leagueData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LeagueContext.Provider 
      value={{ 
        currentLeague, 
        setLeague, 
        clearLeague, 
        getLeagueByCode,
        loading,
        error
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
}

// Custom hook to use the league context
export function useLeague() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
}