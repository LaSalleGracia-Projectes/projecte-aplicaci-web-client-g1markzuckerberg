export default function ItemRow({ item, onEdit, onDelete }) {
    return (
      <tr className="border-t">
        <td className="p-2">{item.id}</td>
        <td>{item.name}</td>
        <td className="space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:underline"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </td>
      </tr>
    );
  }
  