"use client"

import { Select, Option } from "@/components/ui"
import Image from "next/image"
import { useLanguage } from "@/context/languageContext"

export default function Footer() {
  const { language, changeLanguage, t } = useLanguage()

  const handleLanguageChange = (value) => {
    changeLanguage(value)
  }

  return (
    <footer className="flex flex-col sm:flex-row sm:justify-between items-center p-4 bg-gray-900 text-white text-sm w-full">
      {/* Recuadro de idioma (alineado a la izquierda) */}
      <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4 sm:mb-0">
        <Select
          variant="outlined"
          color="white"
          className="text-white w-32"
          value={language}
          onChange={handleLanguageChange}
        >
          <Option value="es" className="flex items-center">
            <Image src="/images/spain-flag.png" alt="Español" width={20} height={15} />
            <span className="ml-2">ES</span>
          </Option>
          <Option value="ca" className="flex items-center">
            <Image src="/images/catalonia-flag.png" alt="Català" width={20} height={15} />
            <span className="ml-2">CA</span>
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
          {t("footer.privacyPolicy")}
        </a>
        <a href="#" className="hover:underline whitespace-nowrap">
          {t("footer.contact")}
        </a>
        <a href="#" className="hover:underline whitespace-nowrap">
          {t("footer.cookieSettings")}
        </a>
      </nav>

      {/* Derechos reservados (alineado a la derecha) */}
      <div className="text-gray-400 text-center sm:text-right">&copy; {t("footer.copyright")}</div>
    </footer>
  )
}
