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
      <IconButton variant="text" onClick={toggleDrawer} className="ml-auto">
        <Image src="/images/vector.png" alt="Menu" width={30} height={30} />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer} className="p-4 w-70 bg-white shadow-lg">
      <BurgerMenuContent onClose={toggleDrawer} />
      </Drawer>
    </header>
  );
}
