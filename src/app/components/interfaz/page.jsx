"use client"

import Layout from "@/components/layout"
import { Accordion, AccordionHeader, AccordionBody, Button } from "@material-tailwind/react"
import { useState } from "react"
import AuthGuard from "@/components/authGuard/authGuard"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/languageContext"
// Importar el servicio de cookies
import { clearAuthCookies } from "@/components/auth/cookie-service"

export default function Info() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)
  const router = useRouter()

  const handleOpen = (value) => {
    setOpen(open === value ? null : value)
  }

  const handleLogout = () => {
    // Usar clearAuthCookies en lugar de localStorage.removeItem
    clearAuthCookies()
    router.push("/") // Redirige a la página principal
  }

  const sections = [
    {
      value: "contacto",
      title: t("interface.contact"),
      content: (
        <div className="space-y-4">
          <p>Email: fantasydraft@empresa.com</p>
          <p>{t("interface.phone")}: +34 900 123 456</p>
          <p>{t("interface.address")}: Calle calle, 12, Barcelona</p>
          <p>{t("interface.officeHours")}:</p>
          <ul className="list-disc pl-5">
            <li>{t("interface.mondayToFriday")}: 9:00 - 18:00</li>
            <li>{t("interface.saturday")}: 10:00 - 14:00</li>
          </ul>
        </div>
      ),
    },
    {
      value: "privacidad",
      title: t("interface.privacyPolicy"),
      content: (
        <div className="space-y-4">
          <h3 className="font-medium">{t("interface.privacyPolicy")}</h3>
          <p>{t("interface.privacyDescription")}</p>
          <h4 className="font-medium">{t("interface.dataUsage")}:</h4>
          <ul className="list-disc pl-5">
            <li>{t("interface.accountManagement")}</li>
            <li>{t("interface.serviceComms")}</li>
            <li>{t("interface.userExperience")}</li>
            <li>{t("interface.statistics")}</li>
          </ul>
        </div>
      ),
    },
    {
      value: "sobre-nosotros",
      title: t("interface.aboutUs"),
      content: (
        <div className="space-y-4">
          <p>{t("interface.companyDescription")}</p>
          <h4 className="font-medium">{t("interface.ourMission")}:</h4>
          <h4 className="font-medium">{t("interface.values")}:</h4>
          <ul className="list-disc pl-5">
            <li>{t("interface.innovation")}</li>
            <li>{t("interface.sportCommitment")}</li>
            <li>{t("interface.serviceExcellence")}</li>
            <li>{t("interface.transparency")}</li>
          </ul>
        </div>
      ),
    },
    {
      value: "api",
      title: t("interface.ourAPI"),
      content: (
        <div className="space-y-4">
          <h4 className="font-medium">{t("interface.mainFeatures")}:</h4>
          <ul className="list-disc pl-5">
            <li>OAuth 2.0 {t("interface.authentication")}</li>
            <li>RESTful Endpoints</li>
            <li>{t("interface.fullDocumentation")}</li>
            <li>Webhooks {t("interface.support")}</li>
          </ul>
          <p>
            {t("interface.moreInfo")}
            <a href="https://api.ejemplo.com/docs" className="text-blue-600 hover:underline">
              {" "}
              api.ejemplo.com/docs
            </a>
          </p>
        </div>
      ),
    },
  ]

  return (
    <AuthGuard>
      <Layout currentPage={t("account.interface")}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-2xl space-y-6">
            {sections.map(({ value, title, content }) => (
              <Accordion key={value} open={open === value}>
                <AccordionHeader
                  onClick={() => handleOpen(value)}
                  className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 rounded-lg cursor-pointer"
                >
                  <span className="text-lg font-medium">{title}</span>
                  <div className="ml-auto">
                    <img
                      src={open === value ? "/images/replegar.png" : "/images/desplegable.png"}
                      alt={open === value ? t("interface.collapse") : t("interface.expand")}
                      className="w-6 h-6"
                    />
                  </div>
                </AccordionHeader>
                <AccordionBody className="px-4 py-3">{content}</AccordionBody>
              </Accordion>
            ))}

            <Button color="red" className="w-full mt-8" onClick={handleLogout}>
              {t("common.logout")}
            </Button>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
