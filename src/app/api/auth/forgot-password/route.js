import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { correo } = await request.json()

    if (!correo) {
      return NextResponse.json(
        { error: "El correo electrónico es obligatorio" },
        { status: 400 }
      )
    }

    try {
      const backendResponse = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      })

      const data = await backendResponse.json()

      if (!backendResponse.ok) {
        // Manejamos diferentes tipos de errores del backend
        if (backendResponse.status === 404) {
          return NextResponse.json(
            { error: "No se encontró ninguna cuenta con ese correo" },
            { status: 404 }
          )
        }
        
        return NextResponse.json(
          { error: data.error || "Error al procesar la solicitud" },
          { status: backendResponse.status }
        )
      }

      return NextResponse.json(
        { message: data.message || "Nueva contraseña enviada al correo" },
        { status: 200 }
      )
    } catch (fetchError) {
      console.error("Error al conectar con el backend:", fetchError)
      return NextResponse.json(
        { error: "No se pudo conectar con el servidor" },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error("Error en el procesamiento de la solicitud:", error)
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    )
  }
}