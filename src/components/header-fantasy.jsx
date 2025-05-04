"use client";
import { useState } from "react";
import { IconButton, Drawer } from "@/components/ui";
import Image from "next/image";
import BurgerMenuContent from "@/components/burguerMenu/burguerMenu";
import { useLanguage } from "@/context/languageContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const toggleDrawer = () => setOpen(!open);

  return (
    <header
      className="relative flex items-center justify-between px-4 py-3 text-white shadow-md w-full max-w-screen"
      style={{
        background: "linear-gradient(90deg, #082FB9 0%, #021149 100%)", // Gradiente de izquierda a derecha
      }}
    >
      {/* Título centrado en móviles */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-lg sm:text-xl font-bold text-center whitespace-nowrap">
          {t("header.title")}
        </h1>
      </div>

      {/* Botón de menú */}
      <IconButton variant="text" onClick={toggleDrawer} className="ml-auto z-10">
        <Image
          src="/images/vector.png"
          alt="Menu"
          width={28}
          height={28}
          className="sm:w-8 sm:h-8"
        />
      </IconButton>

      {/* Drawer lateral */}
      <Drawer
        open={open}
        onClose={toggleDrawer}
        className="p-4 w-64 sm:w-72 bg-white text-black shadow-lg"
      >
        <BurgerMenuContent onClose={toggleDrawer} />
      </Drawer>
    </header>
  );
}