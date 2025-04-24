import { NextResponse } from "next/server"

export async function POST(req, { params }) {
  const { ligaCode } = params
  const token = req.headers.get("authorization")
  const body = await req.text()

  try {
    const backendResponse = await fetch(`http://localhost:3000/api/v1/liga/join/${ligaCode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body,
    })

    const data = await backendResponse.json()
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    return NextResponse.json({ error: "Error conectando al servidor" }, { status: 500 })
  }
}
