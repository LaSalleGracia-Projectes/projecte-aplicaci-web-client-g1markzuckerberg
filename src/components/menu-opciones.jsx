"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/languageContext"

export default function Navbar({ currentPage }) {
  const { t } = useLanguage()

  const menuItems = [
    { label: t("menu.home"), key: "home", href: "/components/home_logged" },
    { label: t("menu.classification"), key: "clasificacion", href: "/components/clasificacion" },
    { label: t("menu.matchday"), key: "jornada", href: "/components/jornada" },
    { label: t("menu.players"), key: "jugadores", href: "/components/jugadores" },
  ]

  // Función para determinar si un elemento del menú está activo
  const isActive = (itemKey) => {
    // Normalizar currentPage a minúsculas para comparación
    const normalizedCurrentPage = currentPage ? currentPage.toLowerCase() : ""

    // Verificar si el key del elemento coincide con la página actual
    return itemKey.toLowerCase() === normalizedCurrentPage
  }

  return (
    <nav className="bg-gray-800 text-white px-4 py-3">
      <ul className="flex flex-col sm:flex-row sm:justify-center items-center gap-4 sm:gap-6">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 transition-all duration-200 ${
                isActive(item.key) ? "font-bold border-b-2 border-white pb-1" : "hover:text-gray-300"
              }`}
            >
              <Image
                src={`/images/${item.key.toLowerCase()}-icon.png`}
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
  )
}
