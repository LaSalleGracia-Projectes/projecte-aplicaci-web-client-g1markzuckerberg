"use client"

import { createContext, useContext, useState, useEffect } from "react"
import es from "@/translations/es.json"
import en from "@/translations/en.json"
import ca from "@/translations/ca.json"

// Objeto con todas las traducciones disponibles
const translations = { es, en, ca }

// Crear el contexto
const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  // Intentar obtener el idioma guardado en localStorage, o usar 'es' por defecto
  const [language, setLanguage] = useState("es")

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language") || "es"
      setLanguage(savedLanguage)
    }
  }, [])

  // Función para cambiar el idioma
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    // Guardar en localStorage para persistencia
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage)
    }
  }

  // Obtener las traducciones para el idioma actual
  const t = (key) => {
    // Dividir la clave por puntos para acceder a objetos anidados
    const keys = key.split(".")
    let value = translations[language]

    // Navegar por el objeto de traducciones
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        // Si no se encuentra la clave, devolver la clave original
        return key
      }
    }

    return value
  }

  return <LanguageContext.Provider value={{ language, changeLanguage, t }}>{children}</LanguageContext.Provider>
}

// Hook personalizado para usar el contexto
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage debe usarse dentro de LanguageProvider")
  }
  return context
}
