import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("perfiles").select("*").order("id", { ascending: true })

    if (error) throw error
    return Response.json({ data: data || [] })
  } catch (error) {
    console.error("Error fetching perfiles:", error)
    return Response.json({ error: "Failed to fetch perfiles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("perfiles")
      .insert([
        {
          nombre: body.nombre,
          descripcion: body.descripcion,
          grosor: body.grosor,
        },
      ])
      .select()

    if (error) throw error

    const { data: allPerfiles } = await supabase.from("perfiles").select("*").order("id", { ascending: true })

    return Response.json({ data: allPerfiles || [] })
  } catch (error) {
    console.error("Error creating perfil:", error)
    return Response.json({ error: "Failed to add perfil" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { id, ...datos } = await request.json()

    const updateData: Record<string, any> = {}

    if (datos.nombre !== undefined) updateData.nombre = datos.nombre
    if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion
    if (datos.grosor !== undefined) updateData.grosor = datos.grosor

    const { error } = await supabase.from("perfiles").update(updateData).eq("id", id)

    if (error) throw error

    const { data: allPerfiles } = await supabase.from("perfiles").select("*").order("id", { ascending: true })

    return Response.json({ data: allPerfiles || [] })
  } catch (error) {
    console.error("Error updating perfil:", error)
    return Response.json({ error: "Failed to update perfil" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { id } = await request.json()

    const { error } = await supabase.from("perfiles").delete().eq("id", id)

    if (error) throw error

    const { data: allPerfiles } = await supabase.from("perfiles").select("*").order("id", { ascending: true })

    return Response.json({ data: allPerfiles || [] })
  } catch (error) {
    console.error("Error deleting perfil:", error)
    return Response.json({ error: "Failed to delete perfil" }, { status: 500 })
  }
}
