import { useState } from 'react';

export default function EditUserForm({ user, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    role: user.role || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/admin/update-user/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      const updated = await res.json();
      onSave(updated);
    } else {
      console.error('Error actualizando el usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
      <h2 className="text-lg font-semibold mb-2">Editar Usuario</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre"
        className="border p-2 w-full mb-2 rounded"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full mb-2 rounded"
      />
      <input
        name="role"
        value={form.role}
        onChange={handleChange}
        placeholder="Rol (admin, user, etc)"
        className="border p-2 w-full mb-3 rounded"
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
          Guardar
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-1 rounded">
          Cancelar
        </button>
      </div>
    </form>
  );
}
