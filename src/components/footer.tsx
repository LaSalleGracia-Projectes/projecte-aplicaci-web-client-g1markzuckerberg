import { Globe, ChevronDown } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#787878] p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto text-sm">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>Español</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          <a href="#" className="hover:underline">
            Política de Privacidad
          </a>
          <a href="#" className="hover:underline">
            Contacto
          </a>
          <a href="#" className="hover:underline">
            Configuración de Cookies
          </a>
        </div>
        <div className="text-center md:text-right">© Noviembre 2024 Mark Zuckerberg S.L.</div>
      </div>
    </footer>
  )
}

