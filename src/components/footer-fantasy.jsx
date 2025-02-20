import { Select, Option } from "@/components/ui";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex justify-between items-center p-4 bg-gray-900 text-white text-sm">
      <div className="flex items-center space-x-4">
        <Select variant="outlined" color="white" className="text-white">
          <Option value="es" className="flex items-center">
            <Image src="/images/spain-flag.png" alt="Español" width={20} height={15} />
            <span className="ml-2">Español</span>
          </Option>
          <Option value="en" className="flex items-center">
            <Image src="/images/uk-flag.png" alt="English" width={20} height={15} />
            <span className="ml-2">English</span>
          </Option>
        </Select>
        <nav className="flex space-x-4">
          <a href="#" className="hover:underline">Política de privacidad</a>
          <a href="#" className="hover:underline">Contacto</a>
          <a href="#" className="hover:underline">Configuración de cookies</a>
        </nav>
      </div>
      <div className="text-gray-400">
        &copy; Noviembre 2024 | Mark Zuckerberg S.L
      </div>
    </footer>
  );
}
