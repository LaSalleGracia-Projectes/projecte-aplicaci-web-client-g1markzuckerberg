import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { correo, password } = await request.json()

    if (!correo || !password) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      )
    }

    const backendResponse = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.error || "Credenciales inválidas" },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(
      {
        tokens: {
          webToken: data.tokens.webToken,
          refreshWebToken: data.tokens.refreshWebToken,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    )
  }
}
