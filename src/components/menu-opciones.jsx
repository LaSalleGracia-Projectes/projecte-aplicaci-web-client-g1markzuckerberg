// components/Navbar.js
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ currentPage }) {
  const menuItems = [
    { label: "Inicio", href: "/components/home_logged" }, // Ruta correcta: /home_logged
    { label: "Clasificacion", href: "/components/clasificacion" }, // Ruta correcta: /clasificacion
    { label: "Jornada", href: "/components/jornada" }, // Ruta correcta: /jornada
    { label: "Jugadores", href: "/components/jugadores" }, // Ruta correcta: /jugadores
  ];

  return (
    <nav className="flex justify-center items-center bg-gray-800 text-white p-4">
      <ul className="flex space-x-6">
        {menuItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {/*Para mostrar diferente en que página nos encontramos */} 
            <Link
              href={item.href}
              className={`flex items-center space-x-2 ${
                item.label === currentPage
                  ? "font-bold border-b-2 border-white-500 pb-1" 
                  : ""
              }`}
            >
              <Image
                src={`/images/${item.label.toLowerCase()}-icon.png`} // Ajusta las rutas de tus íconos
                alt={item.label}
                width={40}
                height={40}
              />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}