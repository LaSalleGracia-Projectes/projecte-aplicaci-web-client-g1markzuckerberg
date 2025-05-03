"use client"

import { Button } from "@/components/ui"
import { Card } from "@/components/ui"
import { useRouter } from "next/navigation"
import Layout2 from "@/components/layout2"
import AuthGuard from "@/components/authGuard/authGuard"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/context/languageContext"

export default function league() {
  const router = useRouter()
  const { t } = useLanguage()

  return (
    <AuthGuard>
      <Layout2>
        <div className="min-h-screen flex flex-col text-base sm:text-lg md:text-xl">
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
            <Card className="w-full max-w-3xl p-6 sm:p-10 space-y-6 sm:space-y-10">
              {/* Flecha de regreso */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/components/home_logged")}
                  className="text-gray-600 hover:text-black transition"
                  aria-label="Volver"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h2 className="text-xl sm:text-2xl font-semibold">¿Qué deseas hacer?</h2>
              </div>

              {/* Opciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Button
                  variant="outline"
                  className="relative h-36 sm:h-40 text-base flex flex-col p-0 overflow-hidden"
                  onClick={() => router.push("/components/join-league")}
                >
                  <img src="/images/join-league.jpg" alt="icono join league" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-lg sm:text-xl text-center px-2">
                    {t("league.joinLeague")}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="relative h-36 sm:h-40 text-base flex flex-col p-0 overflow-hidden"
                  onClick={() => router.push("/components/create-league")}
                >
                  <img
                    src="/images/create-league.jpg"
                    alt="icono create league"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold text-lg sm:text-xl text-center px-2">
                    {t("league.createLeague")}
                  </span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Layout2>
    </AuthGuard>
  )
}
