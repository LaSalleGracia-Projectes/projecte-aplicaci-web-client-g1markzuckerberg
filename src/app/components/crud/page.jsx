"use client";

import React, { useEffect, useState } from "react";

const initialForm = {
  equipo_id: "",
  position_id: "",
  displayname: "",
  imagepath: "",
};

const TEAMS = [
  { id: 36, name: "Celta de Vigo" },
  { id: 83, name: "FC Barcelona" },
  { id: 106, name: "Getafe" },
  { id: 214, name: "Valencia" },
  { id: 231, name: "Girona" },
  { id: 844, name: "Leganés" },
  { id: 3468, name: "Real Madrid" },
  { id: 7980, name: "Atlético Madrid" },
  { id: 13258, name: "Athletic Club" },
];

const POSITIONS = [
  { id: 24, name: "Portero" },
  { id: 25, name: "Defensa" },
  { id: 26, name: "Centrocampista" },
  { id: 27, name: "Delantero" },
];

export default function NewPlayersCrud() {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all players
  const fetchPlayers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/v1/new-players", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { players: data } = await res.json();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los jugadores.");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Create or update a player
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:3000/api/v1/new-players/update/${editingId}`
        : "http://localhost:3000/api/v1/new-players/create";

      // Convert ids to numbers before sending
      const payload = {
        equipo_id: Number(form.equipo_id),
        position_id: Number(form.position_id),
        displayname: form.displayname,
        imagepath: form.imagepath || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Petición fallida");
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchPlayers();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prefill form for editing
  const handleEdit = (player) => {
    setForm({
      equipo_id: String(player.equipo_id),
      position_id: String(player.position_id),
      displayname: player.displayname,
      imagepath: player.imagepath || "",
    });
    setEditingId(player.id);
  };

  // Delete a player
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este jugador?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/new-players/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error();
      await fetchPlayers();
    } catch {
      setError("Error al eliminar jugador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Gestión de Jugadores</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded shadow"
      >
        <div>
          <label className="block mb-1 font-medium">Equipo</label>
          <select
            name="equipo_id"
            value={form.equipo_id}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">— Selecciona —</option>
            {TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Posición</label>
          <select
            name="position_id"
            value={form.position_id}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">— Selecciona —</option>
            {POSITIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            name="displayname"
            value={form.displayname}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="Nombre del jugador"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium">
            URL Imagen (opcional)
          </label>
          <input
            name="imagepath"
            value={form.imagepath}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2 flex space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {editingId ? "Actualizar" : "Crear"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setEditingId(null);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-3 py-2 bg-gray-200">Nombre</th>
              <th className="border px-3 py-2 bg-gray-200">Equipo</th>
              <th className="border px-3 py-2 bg-gray-200">Posición</th>
              <th className="border px-3 py-2 bg-gray-200">Imagen</th>
              <th className="border px-3 py-2 bg-gray-200">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {players.map((pl) => {
              const equipo = TEAMS.find((t) => t.id === pl.equipo_id);
              const posicion = POSITIONS.find((p) => p.id === pl.position_id);
              return (
                <tr key={pl.id}>
                  <td className="border px-3 py-2">{pl.displayname}</td>
                  <td className="border px-3 py-2">
                    {equipo ? equipo.name : pl.equipo_id}
                  </td>
                  <td className="border px-3 py-2">
                    {posicion ? posicion.name : pl.position_id}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {pl.imagepath ? (
                      <img
                        src={pl.imagepath}
                        alt={pl.displayname}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="border px-3 py-2 space-x-1 text-center">
                    <button
                      onClick={() => handleEdit(pl)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(pl.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
