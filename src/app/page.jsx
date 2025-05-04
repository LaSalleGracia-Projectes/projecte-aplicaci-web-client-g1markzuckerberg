'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Divider,
  Grid,
  styled,
  Avatar,
  CardMedia,
  Paper // Asegúrate de importar Paper
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout2';

// Animaciones CSS
const fadeIn = `
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(-20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;
const bounce = `
  @keyframes bounce {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
`;
const slideIn = `
  @keyframes slideIn {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
`;

// Componentes estilizados
const BannerImage = styled(Box)({
  width: '100%',
  height: 250,
  backgroundImage: 'url(/images/bannerf.jpg)', // Ruta relativa a la imagen local
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  animation: 'fadeIn 1s ease-out',
});

const ButtonPrimary = styled(Button)({
  padding: '12px 40px',
  fontSize: '1rem',
  backgroundColor: '#ff6200',
  color: 'white',
  textTransform: 'none',
  '&:hover': { backgroundColor: '#e55e00' },
  animation: 'bounce 1s infinite',
});

const SectionTitle = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: 16,
  animation: 'slideIn 1s ease-out',
});

const MatchCard = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 16,
  marginBottom: 8,
  backgroundColor: '#f5f5f5',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: 8,
  animation: 'fadeIn 1s ease-out',
});

const StatsCard = styled(Paper)({
  padding: 16,
  backgroundColor: '#f9f9f9',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: 8,
  marginBottom: 16,
  animation: 'slideIn 1s ease-out',
});

export default function Page() {
  const router = useRouter();
  const [topPlayers, setTopPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener la jornada actual
    const fetchCurrentRound = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/v1/sportmonks/jornadaActual', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('webToken')}`,
          },
        });
        if (!res.ok) throw new Error('Error al obtener la jornada actual');
        const data = await res.json();
        return data.jornadaActual.name; // Obtenemos el nombre de la jornada actual
      } catch (err) {
        setError('Error al cargar la jornada actual.');
        console.error(err);
        return null;
      }
    };

    // Función para obtener los partidos de la jornada actual
    const fetchMatches = async (roundNumber) => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/sportmonks/jornadas/${roundNumber}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('webToken')}`,
          },
        });
        if (!res.ok) throw new Error('Error al obtener los partidos');
        const data = await res.json();
        setMatches(data.fixtures || []); // Suponemos que la respuesta tiene un campo "fixtures"
      } catch (err) {
        setError('Error al cargar los partidos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Función para obtener el top 10 de jugadores
    const fetchTopPlayers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/player/?points=down&limit=20", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('webToken')}`,
          },
        });
        if (!res.ok) throw new Error('Error al obtener el top 10 de jugadores');
        const data = await res.json();
        setTopPlayers(data.players.slice(0, 20)); // Nos aseguramos de tomar solo los 10 primeros
      } catch (err) {
        setError('Error al cargar el top de jugadores.');
        console.error(err);
      }
    };

    // Función principal
    const fetchData = async () => {
      const roundNumber = await fetchCurrentRound();
      if (roundNumber) {
        await Promise.all([fetchMatches(roundNumber), fetchTopPlayers()]);
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }
  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#eeeeee' }}>
        {/* BANNER CON IMAGEN DE FÚTBOL */}
        <BannerImage>
          <Typography variant="h3" color="white" fontWeight="600">
            ¡Bienvenidos a Fantasy Draft!
          </Typography>
        </BannerImage>

        {/* BOTÓN "COMENZAR A JUGAR" CON GRADIENTE COMO EL HEADER */}
        <Box
          sx={{
            bgcolor: 'transparent', // Fondo transparente para que el gradiente sea visible
            py: 6,
            display: 'flex',
            justifyContent: 'center',
            background: 'linear-gradient(90deg, #082FB9 0%, #021149 100%)', // Gradiente igual al header
          }}
        >
          <ButtonPrimary onClick={() => router.push("/components/login")}>
            COMENZAR A JUGAR
          </ButtonPrimary>
        </Box>

        {/* PRÓXIMA JORNADA */}
        <Box sx={{ py: 4, px: 2, bgcolor: 'white' }}>
          <SectionTitle>PRÓXIMA JORNADA</SectionTitle>
          <Divider sx={{ maxWidth: '600px', mx: 'auto', mb: 3 }} />
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              {matches.length > 0 ? (
                matches.map((match, index) => {
                  // Dividimos el campo "name" para obtener los nombres de los equipos
                  const [team1, team2] = match.name.split(' vs ');
                  // Convertimos el timestamp a una fecha legible
                  const date = new Date(match.starting_at_timestamp * 1000).toLocaleString();
                  // Determinamos el resultado del partido
                  let resultText = '';
                  if (match.result_info) {
                    if (match.result_info.includes('Game ended in draw')) {
                      resultText = <strong>Empate</strong>;
                    } else if (match.result_info.includes('won after full-time')) {
                      const winner = match.result_info.split(' ')[0]; // Extraemos el equipo ganador
                      resultText = <strong style={{ color: 'green' }}>{winner} ganó</strong>;
                    }
                  }
                  return (
                    <Grid item xs={12} md={6} key={index}>
                      <MatchCard>
                        {/* Equipo local */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <CardMedia
                            component="img"
                            src={match.local_team_image}
                            alt={team1}
                            sx={{
                              width: 40,
                              height: 40,
                              objectFit: 'contain',
                              borderRadius: '50%',
                            }}
                            onError={(e) => { e.target.src = "/default-team.png"; }}
                          />
                          <Typography sx={{ fontWeight: 500 }}>{team1}</Typography>
                        </Box>
                        {/* Versus y resultado */}
                        <Typography sx={{ fontWeight: 500 }}>
                          {resultText ? resultText : 'vs'}
                        </Typography>
                        {/* Equipo visitante */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                          <CardMedia
                            component="img"
                            src={match.visitant_team_image}
                            alt={team2}
                            sx={{
                              width: 40,
                              height: 40,
                              objectFit: 'contain',
                              borderRadius: '50%',
                            }}
                            onError={(e) => { e.target.src = "/default-team.png"; }}
                          />
                          <Typography sx={{ fontWeight: 500 }}>{team2}</Typography>
                        </Box>
                        {/* Fecha del partido */}
                        <Typography variant="caption" color="textSecondary" mt={2}>
                          Fecha: {date}
                        </Typography>
                      </MatchCard>
                    </Grid>
                  );
                })
              ) : (
                <Typography>No hay partidos disponibles.</Typography>
              )}
            </Grid>
          </Container>
        </Box>

        {/* TOP 10 JUGADORES */}
        <Box sx={{ py: 6, px: 2, bgcolor: '#f0f8ff' }}>
          <SectionTitle>🏆 Jugadores con más puntos 🏆</SectionTitle>
          <Divider sx={{ maxWidth: '600px', mx: 'auto', mb: 3 }} />
          <Container maxWidth="lg">
            <Box sx={{
              display: 'flex',
              overflowX: 'auto', // Habilita desplazamiento horizontal si no cabe
              gap: 2,
              pb: 2, // Espaciado inferior para evitar que los jugadores queden cortados
            }}>
              {topPlayers.map((player, index) => (
                <Box
                  key={player.id}
                  sx={{
                    flex: '0 0 auto', // Evita que los elementos se ajusten automáticamente
                    minWidth: 150, // Ancho mínimo para cada jugador
                    maxWidth: 200, // Ancho máximo para cada jugador
                    textAlign: 'center',
                  }}
                >
                  <StatsCard>
                    <Typography variant="body2" color="textSecondary" fontWeight={600}>
                      #{index + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                      <Avatar
                        src={player.playerImage || "/default-player.png"}
                        alt={player.displayName}
                        sx={{ width: 64, height: 64, mb: 1 }}
                        onError={(e) => { e.target.src = "/default-player.png"; }}
                      />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {player.displayName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {player.teamName}
                      </Typography>
                      <Typography variant="h6" color="primary" mt={1}>
                        {player.points} pts
                      </Typography>
                    </Box>
                  </StatsCard>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
}