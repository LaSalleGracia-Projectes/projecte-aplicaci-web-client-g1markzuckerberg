import { useState } from "react";
import Link from "next/link";

const user = {
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  leagues: ["Liga 1", "Liga 2", "Liga 3"],
};

export default function BurgerMenuContent({ onClose }) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
      {/* Información del usuario */}
      <div className="mb-4 border-b border-gray-700 pb-2">
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-gray-400">{user.email}</p>
        <Link href="/components/ajustes/">
          <img src='/images/ajustes.png' alt='ajustes' className="w-4 h-4 ml-auto cursor-pointer">
          </img>
        </Link>
      </div>
      
      {/* Ligas */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Ligas:</p>
        <ul className="space-y-1">
          {user.leagues.map((league, index) => (
            <li key={index} className="text-sm bg-gray-800 p-2 rounded-md">
              {league}
            </li>
          ))}
        </ul>
      </div>
      <Link href="/info-ayuda" className="block text-center text-sm text-blue-400 mt-3 hover:underline">
        Información y Ayuda
      </Link>
      {/* Botones */}
      <button className="w-full bg-red-500 text-white py-2 rounded-md mt-4 hover:bg-red-700">
        Cerrar sesión
      </button>

    </div>
  );
}
