import { Select, Option } from "@/components/ui";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row sm:justify-between items-center p-4 bg-gray-900 text-white text-sm w-full">
      {/* Recuadro de idioma (alineado a la izquierda) */}
      <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4 sm:mb-0">
        <Select variant="outlined" color="white" className="text-white w-32">
          <Option value="es" className="flex items-center">
            <Image src="/images/spain-flag.png" alt="Español" width={20} height={15} />
            <span className="ml-2">ES</span>
          </Option>
          <Option value="en" className="flex items-center">
            <Image src="/images/uk-flag.png" alt="English" width={20} height={15} />
            <span className="ml-2">EN</span>
          </Option>
        </Select>
      </div>

      {/* Enlaces importantes (distribuidos uniformemente) */}
      <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4 sm:mb-0">
        <a href="#" className="hover:underline whitespace-nowrap">
          Política de privacidad
        </a>
        <a href="#" className="hover:underline whitespace-nowrap">
          Contacto
        </a>
        <a href="#" className="hover:underline whitespace-nowrap">
          Configuración de cookies
        </a>
      </nav>

      {/* Derechos reservados (alineado a la derecha) */}
      <div className="text-gray-400 text-center sm:text-right">
        &copy; Noviembre 2024 | Mark Zuckerberg S.L
      </div>
    </footer>
  );
}