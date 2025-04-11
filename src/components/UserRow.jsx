export default function UserRow({ user, onEdit }) {
    return (
      <tr className="border-t">
        <td className="p-2">{user.id}</td>
        <td>{user.email}</td>
        <td>{user.name}</td>
        <td>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:underline"
          >
            Editar
          </button>
        </td>
      </tr>
    );
  }
  