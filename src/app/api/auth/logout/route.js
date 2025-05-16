import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const response = await fetch("https://subirfantasydraftbackend.onrender.com/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json({ error: data.error || "Error al cerrar sesión" }, { status: response.status });
    }

    return NextResponse.json({ message: "Sesión cerrada exitosamente" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
