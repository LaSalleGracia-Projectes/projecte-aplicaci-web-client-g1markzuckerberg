"use client"

import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/v1/new-players'; 

const initialForm = {
  teamName: '',
  positionId: '',
  name: '',
  imageUrl: ''
};

const teams = [
  'FC Barcelona',
  'Rayo Vallecano'
];
const positions = [24, 25, 26, 27];

function NewPlayersCrud() {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener todos los jugadores
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/`, { credentials: 'include' });
      const data = await res.json();
      // Asegura que siempre sea un array
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar jugadores');
      setPlayers([]); // Evita errores si la petición falla
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear o actualizar jugador
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/update/${editingId}` : `${API_URL}/create`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        let msg = 'Error en la petición';
        try {
          const errData = await res.json();
          msg = errData.message || JSON.stringify(errData);
        } catch {}
        throw new Error(msg);
      }
      setForm(initialForm);
      setEditingId(null);
      fetchPlayers();
    } catch (err) {
      setError(err.message || 'Error al guardar jugador');
    }
    setLoading(false);
  };

  // Editar jugador
  const handleEdit = player => {
    setForm({
      teamName: player.teamName,
      positionId: player.positionId,
      name: player.name,
      imageUrl: player.imageUrl || ''
    });
    setEditingId(player._id);
  };

  // Eliminar jugador
  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar jugador?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Error al eliminar');
      fetchPlayers();
    } catch (err) {
      setError('Error al eliminar jugador');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>CRUD de Jugadores Manuales</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <select
          name="teamName"
          value={form.teamName}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona equipo</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
        <select
          name="positionId"
          value={form.positionId}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona posición</option>
          {positions.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="imageUrl"
          placeholder="URL Imagen (opcional)"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); }}>
            Cancelar
          </button>
        )}
      </form>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Equipo</th>
              <th>Posición</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player._id}>
                <td>{player.name}</td>
                <td>{player.teamName}</td>
                <td>{player.positionId}</td>
                <td>
                  {player.imageUrl ? (
                    <img src={player.imageUrl} alt="img" width={40} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(player)}>Editar</button>
                  <button onClick={() => handleDelete(player._id)} style={{ color: 'red' }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NewPlayersCrud;
