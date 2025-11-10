import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("usuarios").select("*").order("id", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching usuarios:", error)
      return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error en GET /api/usuarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, correo, contraseña } = await request.json()

    // Validación
    if (!nombre || !correo || !contraseña) {
      return NextResponse.json({ error: "Campos requeridos" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verificar que el correo no exista
    const { data: existing } = await supabase.from("usuarios").select("id").eq("correo", correo).single()

    if (existing) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 })
    }

    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre,
          correo,
          contraseña, // En producción usar bcrypt
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating usuario:", error)
      return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
    }

    return NextResponse.json({ success: true, usuario: data }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error en POST /api/usuarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, nombre, correo, contraseña } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("usuarios")
      .update({
        nombre,
        correo,
        contraseña,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating usuario:", error)
      return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
    }

    return NextResponse.json({ success: true, usuario: data })
  } catch (error) {
    console.error("[v0] Error en PUT /api/usuarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("usuarios").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting usuario:", error)
      return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error en DELETE /api/usuarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
