'use client';
import { useState } from "react";
import { IconButton, Drawer } from "@/components/ui";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white shadow-md">
      <h1 className="text-xl font-bold text-center flex-1">Mi Aplicación</h1>
      <IconButton variant="text" onClick={toggleDrawer} className="ml-auto">
        <Image src="/images/vector.png" alt="Menu" width={30} height={30} />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer} className="p-4 w-64 bg-white shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Menú</h2>
        <ul className="space-y-2">
          <li className="p-2 hover:bg-gray-100 rounded">Inicio</li>
          <li className="p-2 hover:bg-gray-100 rounded">Acerca de</li>
          <li className="p-2 hover:bg-gray-100 rounded">Contacto</li>
        </ul>
      </Drawer>
    </header>
  );
}
