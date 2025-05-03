"use client"

import { useState } from "react"
import { Button } from "@/components/ui"

export default function SeleccionFormacion({ onSeleccionarFormacion }) {
  const [formacionSeleccionada, setFormacionSeleccionada] = useState("4-3-3")
  const [loading, setLoading] = useState(false)

  const formaciones = [
    {
      id: "4-3-3",
      nombre: "4-3-3",
      descripcion: "4 defensas, 3 mediocampistas, 3 delanteros",
    },
    {
      id: "4-4-2",
      nombre: "4-4-2",
      descripcion: "4 defensas, 4 mediocampistas, 2 delanteros",
    },
    {
      id: "3-4-3",
      nombre: "3-4-3",
      descripcion: "3 defensas, 4 mediocampistas, 3 delanteros",
    },
  ]

  const handleSeleccionarFormacion = () => {
    setLoading(true)
    onSeleccionarFormacion(formacionSeleccionada)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-lg font-medium text-center mb-6">Selecciona una formación para tu equipo</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {formaciones.map((formacion) => (
          <div
            key={formacion.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              formacionSeleccionada === formacion.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setFormacionSeleccionada(formacion.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{formacion.nombre}</h4>
              <div
                className={`w-5 h-5 rounded-full border ${
                  formacionSeleccionada === formacion.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                }`}
              >
                {formacionSeleccionada === formacion.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">{formacion.descripcion}</p>

            {/* Visualización simple de la formación */}
            <div className="mt-3 bg-green-100 p-2 rounded-md">
              <div className="flex justify-around mb-1">
                <div className="w-2 h-2 rounded-full bg-green-700"></div>
              </div>

              {formacion.id === "4-3-3" && (
                <>
                  <div className="flex justify-around mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                  <div className="flex justify-around mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                  <div className="flex justify-around">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                </>
              )}

              {formacion.id === "4-4-2" && (
                <>
                  <div className="flex justify-around mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                  <div className="flex justify-around mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                  <div className="flex justify-around">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                </>
              )}

              {formacion.id === "3-4-3" && (
                <>
                  <div className="flex justify-around mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                  <div className="flex justify-around mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                  <div className="flex justify-around">
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                    <div className="w-2 h-2 rounded-full bg-green-700"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSeleccionarFormacion}
          disabled={loading}
          className="px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          {loading ? "Creando..." : "Crear Draft"}
        </Button>
      </div>
    </div>
  )
}
