"use client"

import { Select, Option } from "@/components/ui"
import Image from "next/image"
import { useLanguage } from "@/context/languageContext"

export default function Footer() {
  const { language, changeLanguage, t } = useLanguage()

  const handleLanguageChange = (value) => {
    changeLanguage(value)
  }

  // Arreglar el selector de idiomas en el footer
  return (
    <footer className="flex flex-col sm:flex-row sm:justify-between items-center p-4 bg-gray-900 text-white text-sm w-full">
      {/* Recuadro de idioma (alineado a la izquierda) */}
      <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-0">
        <Select
          variant="outlined"
          color="white"
          className="text-white min-w-[120px]"
          value={language}
          onChange={handleLanguageChange}
          label={t("footer.language")}
        >
          <Option value="es" className="flex items-center gap-2">
            <Image src="/images/españa.png" alt="Español" width={20} height={15} />
            <span>ES</span>
          </Option>
          <Option value="ca" className="flex items-center gap-2">
            <Image src="/images/catalan.png" alt="Català" width={20} height={15} />
            <span>CA</span>
          </Option>
          <Option value="en" className="flex items-center gap-2">
            <Image src="/images/english.png" alt="English" width={20} height={15} />
            <span>EN</span>
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
