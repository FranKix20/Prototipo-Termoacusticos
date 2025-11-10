import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { correo, contraseña } = await request.json()

    if (!correo || !contraseña) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: usuario, error } = await supabase
      .from("usuarios")
      .select("id, nombre, correo")
      .eq("correo", correo)
      .eq("contraseña", contraseña)
      .single()

    if (error || !usuario) {
      return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: true,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          correo: usuario.correo,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
