'use client';
import { useEffect, useState } from 'react';
import UserRow from '../../components/UserRow';
import EditUserForm from '../../components/EditUserForm';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch('/admin/users') // GET all users
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleEditClick = async (userId) => {
    const res = await fetch(`/admin/user/${userId}`);
    const data = await res.json();
    setEditingUser(data);
  };

  const handleUpdate = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onSave={handleUpdate}
          onCancel={() => setEditingUser(null)}
        />
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="text-left">Email</th>
            <th className="text-left">Nombre</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={() => handleEditClick(user.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
