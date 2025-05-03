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
    <nav className="bg-gray-800 text-white px-4 py-3">
      <ul className="flex flex-col sm:flex-row sm:justify-center items-center gap-4 sm:gap-6">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 transition-all duration-200 ${
                item.label === currentPage
                  ? "font-bold border-b-2 border-white pb-1"
                  : "hover:text-gray-300"
              }`}
            >
              <Image
                src={`/images/${item.label.toLowerCase()}-icon.png`}
                alt={item.label}
                width={30}
                height={30}
                className="sm:w-6 sm:h-6 w-8 h-8"
              />
              <span className="text-sm sm:text-base">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}