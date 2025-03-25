import Link from "next/link";
import { useRouter } from "next/navigation";

const user = {
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  leagues: ["Liga 1", "Liga 2", "Liga 3"],
};

export default function BurgerMenuContent({ onClose }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("webToken"); // Obtener el token almacenado

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error al cerrar sesión:", data.error);
        return;
      }

      // Eliminar tokens del almacenamiento local
      localStorage.removeItem("webToken");
      localStorage.removeItem("refreshWebToken");

      // Redirigir al usuario a la página de inicio
      router.push("/");
    } catch (error) {
      console.error("Error en el servidor:", error);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {/* Información del usuario */}
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center">
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <Link href="/components/ajustes" className="ml-auto">
          <img src="/images/ajustes.png" alt="ajustes" className="w-4 h-4 cursor-pointer" />
        </Link>
      </div>

      {/* Ligas */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Ligas:</p>
        <ul className="space-y-1">
          {user.leagues.map((league, index) => (
            <li key={index} className="text-sm bg-gray-800 p-2 rounded-md">{league}</li>
          ))}
        </ul>
      </div>

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
        onClick={() => router.push("/components/choose-league")}
      >
        + Añadir Liga
      </button>

      <Link href="/info-ayuda" className="block text-center text-sm text-blue-400 mt-3 hover:underline">
        Información y Ayuda
      </Link>

      {/* Botón de cerrar sesión */}
      <button
        className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-700"
        onClick={handleLogout} // Llama a la función de logout
      >
        Cerrar sesión
      </button>
    </div>
  );
}
