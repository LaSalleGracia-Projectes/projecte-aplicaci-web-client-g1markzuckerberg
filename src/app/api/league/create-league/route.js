import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // ✅ Verificar autenticación
    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // ✅ Validar nombre de la liga
    const { name } = await req.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "El nombre de la liga es obligatorio" }, { status: 400 });
    }

    // ✅ Obtener la jornada actual
    const currentJornada = await getCurrentJornada();
    if (!currentJornada) {
      return NextResponse.json({ error: "No se pudo obtener la jornada actual" }, { status: 500 });
    }

    // ✅ Crear la liga
    const newLiga = {
      id: 0,
      name,
      jornada_id: currentJornada.id,
      created_by: user.correo,
      created_jornada: Number(currentJornada.name),
      code: "", // Se generará automáticamente
    };

    const ligaCreated = await createLigaService(newLiga);
    if (!ligaCreated) {
      return NextResponse.json({ error: "No se pudo crear la liga" }, { status: 500 });
    }

    // ✅ Añadir usuario como capitán de la liga
    const success = await addUserToLigaService(user.id, ligaCreated.id, true);
    if (!success) {
      return NextResponse.json({ error: "Error al unirse a la liga" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Liga creada y usuario añadido como capitán", liga: ligaCreated },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
