// components/Navbar.js
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ currentPage }) {
  const menuItems = [
    { label: "Inicio", href: "/" },
    { label: "Clasificación", href: "/clasificacion" },
    { label: "Jornada", href: "/jornada" },
    { label: "Clasificación", href: "/clasificacion2" },
  ];

  return (
    <nav className="flex justify-center items-center bg-gray-800 text-white p-4">
      <ul className="flex space-x-6">
        {menuItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <Link
              href={item.href}
              className={`flex items-center space-x-2 ${
                item.label === currentPage ? "font-bold" : "" // Comparamos con currentPage
              }`}
            >
              <Image
                src={`/images/${item.label.toLowerCase()}-icon.png`} // Ajusta las rutas de tus íconos
                alt={item.label}
                width={20}
                height={20}
              />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}