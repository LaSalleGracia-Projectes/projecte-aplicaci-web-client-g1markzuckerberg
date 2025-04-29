"use client"

import Layout from "@/components/layout"
import { Accordion, AccordionHeader, AccordionBody, Button } from "@material-tailwind/react"
import { useState } from "react"
import AuthGuard from "@/components/authGuard/authGuard"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

const sections = [
  {
    value: "contacto",
    title: "Contacto",
    content: (
      <div className="space-y-4 text-base leading-relaxed">
        <p><span className="font-semibold">Email:</span> fantasydraft@empresa.com</p>
        <p><span className="font-semibold">Teléfono:</span> +34 900 123 456</p>
        <p><span className="font-semibold">Dirección:</span> Calle calle, 12, Barcelona</p>
        <div>
          <p className="font-semibold">Horario de atención:</p>
          <ul className="list-disc pl-6">
            <li>Lunes a Viernes: 9:00 - 18:00</li>
            <li>Sábados: 10:00 - 14:00</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    value: "privacidad",
    title: "Política de privacidad",
    content: (
      <div className="space-y-4 text-base leading-relaxed">
        <p>En cumplimiento del RGPD, sus datos personales serán tratados para gestionar su cuenta y proporcionarle nuestros servicios.</p>
        <h4 className="font-medium">Uso de datos:</h4>
        <ul className="list-disc pl-6">
          <li>Gestión de cuenta de usuario</li>
          <li>Comunicaciones sobre el servicio</li>
          <li>Mejora de la experiencia de usuario</li>
          <li>Análisis estadístico</li>
        </ul>
      </div>
    ),
  },
  {
    value: "sobre-nosotros",
    title: "Sobre nosotros",
    content: (
      <div className="space-y-4 text-base leading-relaxed">
        <p>Somos una empresa en crecimiento en el sector deportivo y de fantasy.</p>
        <h4 className="font-medium">Nuestra misión:</h4>
        <p>Ofrecer experiencias únicas a los aficionados al deporte a través de herramientas digitales de fantasía deportiva.</p>
        <h4 className="font-medium">Valores:</h4>
        <ul className="list-disc pl-6">
          <li>Innovación continua</li>
          <li>Compromiso con el deporte</li>
          <li>Excelencia en el servicio</li>
          <li>Transparencia</li>
        </ul>
      </div>
    ),
  },
  {
    value: "api",
    title: "Conoce nuestra API",
    content: (
      <div className="space-y-4 text-base leading-relaxed">
        <h4 className="font-medium">Características principales:</h4>
        <ul className="list-disc pl-6">
          <li>Autenticación OAuth 2.0</li>
          <li>Endpoints RESTful</li>
          <li>Documentación completa</li>
          <li>Soporte para webhooks</li>
        </ul>
        <p>
          Más información en&nbsp;
          <a href="https://api.ejemplo.com/docs" className="text-blue-600 hover:underline">
            api.ejemplo.com/docs
          </a>
        </p>
      </div>
    ),
  },
]

export default function Info() {
  const [open, setOpen] = useState(null)
  const router = useRouter()

  const handleOpen = (value) => {
    setOpen(open === value ? null : value)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <AuthGuard>
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-gray-800">
          <div className="w-full max-w-2xl space-y-6">
            {sections.map(({ value, title, content }) => (
              <Accordion key={value} open={open === value}>
                <AccordionHeader
                  onClick={() => handleOpen(value)}
                  className="flex items-center justify-between w-full px-6 py-4 bg-gray-200 rounded-lg cursor-pointer text-lg font-semibold text-gray-900"
                >
                  <span>{title}</span>
                  <div className="ml-auto">
                    <img
                      src={open === value ? "/images/replegar.png" : "/images/desplegable.png"}
                      alt={open === value ? "Replegar" : "Desplegar"}
                      className="w-6 h-6"
                    />
                  </div>
                </AccordionHeader>
                <AccordionBody className="px-6 py-4 bg-white rounded-md shadow-md">
                  {content}
                </AccordionBody>
              </Accordion>
            ))}

            <Button
              color="red"
              className="w-full mt-8 text-white font-semibold py-2 text-base hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
