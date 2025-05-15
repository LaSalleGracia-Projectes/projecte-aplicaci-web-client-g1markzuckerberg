'use client';
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white shadow-md"
    style={{
        background: "linear-gradient(90deg, #082FB9 0%, #021149 100%)", // Gradiente de izquierda a derecha
      }}>
      <h1 className="text-xl font-bold text-center flex-1">Fantasy Draft</h1>
    </header>
  );
}
