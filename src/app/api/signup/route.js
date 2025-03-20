import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { correo, username, password } = await req.json()

    if (!correo || !username || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 })
    }

    return NextResponse.json({ token: fakeToken }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
