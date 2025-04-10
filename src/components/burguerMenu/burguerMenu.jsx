'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BurgerMenuContent({ onClose }) {
  const router = useRouter();
  const [user, setUser] = useState(null); // Estado para el usuario

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("webToken");
        const response = await fetch("http://localhost:3000/api/v1/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Error al obtener el usuario:", data.error);
          return;
        }

        setUser(data.user); // Guarda los datos reales del usuario
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("webToken");

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

      localStorage.removeItem("webToken");
      localStorage.removeItem("refreshWebToken");

      router.push("/");
    } catch (error) {
      console.error("Error en el servidor:", error);
    }
  };

  if (!user) {
    return (
      <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
        <p>Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {/* Información del usuario */}
      <div className="mb-4 border-b border-gray-700 pb-2 flex items-center">
        <div>
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-sm text-gray-400">{user.correo}</p>
        </div>
        <Link href="/components/ajustes" className="ml-auto">
          <img src="/images/ajustes.png" alt="ajustes" className="w-4 h-4 cursor-pointer" />
        </Link>
      </div>

      {/* Ligas */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Ligas:</p>
        <ul className="space-y-1">
          {user.leagues?.map((league, index) => (
            <li key={index} className="text-sm bg-gray-800 p-2 rounded-md">{league}</li>
          )) || <p className="text-sm text-gray-400">No hay ligas.</p>}
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

      <button
        className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-700"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
