"use client"

import Layout from "@/components/layout"
import { Accordion, AccordionHeader, AccordionBody, Button } from "@material-tailwind/react"
import { useState } from "react"

const sections = [
  {
    value: "contacto",
    title: "Contacto",
    content: (
      <div className="space-y-4">
        <p>Email: contacto@empresa.com</p>
        <p>Teléfono: +34 900 123 456</p>
        <p>Dirección: Calle calle, 12, Barcelona</p>
        <p>Horario de atención:</p>
        <ul className="list-disc pl-5">
          <li>Lunes a Viernes: 9:00 - 18:00</li>
          <li>Sábados: 10:00 - 14:00</li>
        </ul>
      </div>
    ),
  },
  {
    value: "privacidad",
    title: "Política de privacidad",
    content: (
      <div className="space-y-4">
        <h3 className="font-medium">Política de Privacidad</h3>
        <p>En cumplimiento del RGPD, sus datos personales serán tratados para gestionar su cuenta y proporcionarle nuestros servicios.</p>
        <h4 className="font-medium">Uso de datos:</h4>
        <ul className="list-disc pl-5">
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
      <div className="space-y-4">
        <p>Somos una empresa líder en el sector deportivo, dedicada a soluciones innovadoras en gestión de equipos y competiciones.</p>
        <h4 className="font-medium">Nuestra misión:</h4>
        <p>Facilitar la organización y gestión de eventos deportivos.</p>
        <h4 className="font-medium">Valores:</h4>
        <ul className="list-disc pl-5">
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
      <div className="space-y-4">
        <p>Nuestra API permite integrar todas las funcionalidades de la plataforma en tus aplicaciones.</p>
        <h4 className="font-medium">Características principales:</h4>
        <ul className="list-disc pl-5">
          <li>Autenticación OAuth 2.0</li>
          <li>Endpoints RESTful</li>
          <li>Documentación completa</li>
          <li>Soporte para webhooks</li>
        </ul>
        <p>
          Más información en
          <a href="https://api.ejemplo.com/docs" className="text-blue-600 hover:underline"> api.ejemplo.com/docs</a>
        </p>
      </div>
    ),
  },
]

export default function Info() {
  const [open, setOpen] = useState(null)

  const handleOpen = (value) => {
    setOpen(open === value ? null : value)
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl space-y-6">
          {sections.map(({ value, title, content }) => (
            <Accordion key={value} open={open === value}>
              <AccordionHeader 
                onClick={() => handleOpen(value)} 
                className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 rounded-lg cursor-pointer"
              >
                <span className="text-lg font-medium">{title}</span>
                <div className="ml-auto"> {/* Empuja la imagen totalmente a la derecha */}
                  <img 
                    src={open === value ? "/images/replegar.png" : "/images/desplegable.png"} 
                    alt={open === value ? "Replegar" : "Desplegar"} 
                    className="w-6 h-6"
                  />
                </div>
              </AccordionHeader>
              <AccordionBody className="px-4 py-3">{content}</AccordionBody>
            </Accordion>
          ))}

          <Button color="red" className="w-full mt-8" onClick={() => console.log("Cerrar sesión clicked")}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </Layout>
  )
}
