'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Divider,
  Avatar,
  IconButton,
  styled
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslations } from "next-intl";

// Componentes estilizados
const TeamLogo = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  border: '1px solid #d9d9d9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#d9d9d9',
  },
  '&::before': {
    transform: 'rotate(45deg)',
  },
  '&::after': {
    transform: 'rotate(-45deg)',
  }
}));

const PlaceholderImage = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 130,
  border: '1px solid #c4c4c4',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#c4c4c4',
    top: '50%',
    left: 0,
  },
  '&::before': {
    transform: 'rotate(45deg)',
  },
  '&::after': {
    transform: 'rotate(-45deg)',
  }
}));

const NavButton = styled(Button)(({ theme, active }) => ({
  textTransform: 'none',
  padding: '8px 4px',
  backgroundColor: active ? '#eeeeee' : 'transparent',
  color: '#000000',
  '&:hover': {
    backgroundColor: active ? '#eeeeee' : 'rgba(0, 0, 0, 0.04)',
  },
  borderRadius: 0,
  fontSize: '0.75rem',
}));

const LanguageButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#787878',
  color: 'white',
  textTransform: 'none',
  padding: '4px 8px',
  '&:hover': {
    backgroundColor: '#666666',
  },
  borderRadius: 4,
  fontSize: '0.75rem',
}));

const FooterLink = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: '0.75rem',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export default function Page() {
  // Datos de ejemplo
  const leftMatches = [
    { team1: "Equipo 1", team2: "Equipo 2" },
    { team1: "Equipo 3", team2: "Equipo 4" },
    { team1: "Equipo 5", team2: "Equipo 6" },
    { team1: "Equipo 7", team2: "Equipo 8" },
    { team1: "Equipo 9", team2: "Equipo 10" },
  ];

  const rightMatches = [
    { team1: "Equipo 11", team2: "Equipo 12" },
    { team1: "Equipo 13", team2: "Equipo 14" },
    { team1: "Equipo 15", team2: "Equipo 16" },
    { team1: "Equipo 17", team2: "Equipo 18" },
    { team1: "Equipo 19", team2: "Equipo 20" },
  ];

  const goalScorers = [
    { name: "Jugador1", value: 14 },
    { name: "Jugador2", value: 8 },
    { name: "Jugador3", value: 7 },
  ];

  const assistProviders = [
    { name: "Jugador1", value: 7 },
    { name: "Jugador2", value: 6 },
    { name: "Jugador3", value: 5 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#eeeeee' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#d9d9d9', py: 2, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color="#000000">
          FantasyDraft
        </Typography>
      </Box>

      {/* Banner */}
      <Box sx={{ position: 'relative', bgcolor: 'white', width: '100%', height: 250, borderBottom: '1px solid #d9d9d9' }}>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <Box sx={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              '&::before, &::after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: 1,
                backgroundColor: '#d9d9d9',
              },
              '&::before': {
                transform: 'rotate(45deg)',
              },
              '&::after': {
                transform: 'rotate(-45deg)',
              }
            }} />
          </Box>
        </Box>
      </Box>

      {/* Call to action */}
      <Box sx={{ bgcolor: '#d9d9d9', py: 6, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: 'white', 
            color: '#000000', 
            px: 4, 
            py: 1.5, 
            borderRadius: 1,
            border: '1px solid #c4c4c4',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#f5f5f5',
              boxShadow: 'none',
            }
          }}
        >
          COMENZAR A JUGAR
        </Button>
      </Box>

      {/* Next matchday section */}
      <Box sx={{ py: 4, px: 2, bgcolor: 'white' }}>
        <Typography variant="h6" fontWeight="600" textAlign="center" mb={1}>
          PRÓXIMA JORNADA
        </Typography>
        <Divider sx={{ maxWidth: '600px', mx: 'auto', mb: 3 }} />

        {/* Matches grid */}
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {/* Left column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {leftMatches.map((match, index) => (
                  <Paper key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#f5f5f5', boxShadow: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TeamLogo />
                      <Typography sx={{ ml: 1, fontWeight: 500 }}>{match.team1}</Typography>
                    </Box>
                    <Typography sx={{ mx: 1, fontSize: '0.875rem', fontWeight: 500 }}>vs</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 1, fontWeight: 500 }}>{match.team2}</Typography>
                      <TeamLogo />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Grid>

            {/* Right column */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {rightMatches.map((match, index) => (
                  <Paper key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#f5f5f5', boxShadow: 'none' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TeamLogo />
                      <Typography sx={{ ml: 1, fontWeight: 500 }}>{match.team1}</Typography>
                    </Box>
                    <Typography sx={{ mx: 1, fontSize: '0.875rem', fontWeight: 500 }}>vs</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 1, fontWeight: 500 }}>{match.team2}</Typography>
                      <TeamLogo />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats section */}
      <Box sx={{ bgcolor: '#d9d9d9', py: 4, px: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Goal scorers */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="600" mb={2}>
                Goleadores
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {goalScorers.map((player, index) => (
                  <Paper key={index} sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#eeeeee', boxShadow: 'none', borderRadius: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#c4c4c4' }}>
                      <PersonIcon sx={{ color: '#787878', fontSize: 16 }} />
                    </Avatar>
                    <Typography sx={{ flexGrow: 1 }}>{player.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.75rem', mr: 0.5, color: '#787878' }}>G</Typography>
                      <Typography fontWeight="600">{player.value}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Grid>

            {/* Center image */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlaceholderImage />
            </Grid>

            {/* Assist providers */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="600" mb={2}>
                Asistidores
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {assistProviders.map((player, index) => (
                  <Paper key={index} sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#eeeeee', boxShadow: 'none', borderRadius: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#c4c4c4' }}>
                      <PersonIcon sx={{ color: '#787878', fontSize: 16 }} />
                    </Avatar>
                    <Typography sx={{ flexGrow: 1 }}>{player.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontSize: '0.75rem', mr: 0.5, color: '#787878' }}>A</Typography>
                      <Typography fontWeight="600">{player.value}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      

      {/* Footer */}
      <Box sx={{ bgcolor: '#181818', color: 'white', py: 1.5, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', md: 'center' },
            gap: { xs: 1, md: 0 }
          }}>
            <Box sx={{ mb: { xs: 1, md: 0 } }}>
              <LanguageButton startIcon={<LanguageIcon fontSize="small" />} endIcon={<KeyboardArrowDownIcon fontSize="small" />}>
                Español
              </LanguageButton>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: { xs: 1, md: 0 },
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <FooterLink>Política de Privacidad</FooterLink>
              <FooterLink>Contacto</FooterLink>
              <FooterLink>Configuración de Cookies</FooterLink>
            </Box>
            <Typography sx={{ color: '#949494', fontSize: '0.75rem' }}>
              © Noviembre 2024 Mark Zuckerberg S.L
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
