'use client';
import { useState } from "react";
import { IconButton, Drawer } from "@/components/ui";
import Image from "next/image";
import BurgerMenuContent from "@/components/burguerMenu/burguerMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white shadow-md">
      <h1 className="text-xl font-bold text-center flex-1">Fantasy Draft</h1>
    </header>
  );
}

import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  return (
    <header className="p-4 bg-gray-800 text-white">
      <h1>Nike FC</h1>
      <LanguageSwitcher />
    </header>
  );
}

