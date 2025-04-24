import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET_KEY || "secret123"

export async function GET(req) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Token faltante o incorrecto" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ message: "Token válido", user: decoded }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }
}
