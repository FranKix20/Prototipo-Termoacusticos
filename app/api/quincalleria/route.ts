import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("quincalleria").select("*").order("id", { ascending: true })

    if (error) throw error
    return Response.json({ data: data || [] })
  } catch (error) {
    console.error("Error fetching quincalleria:", error)
    return Response.json({ error: "Failed to fetch quincalleria" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("quincalleria")
      .insert([
        {
          nombre: body.nombre,
          descripcion: body.descripcion,
          precio: body.precio,
        },
      ])
      .select()

    if (error) throw error

    const { data: allQuincalleria } = await supabase.from("quincalleria").select("*").order("id", { ascending: true })

    return Response.json({ data: allQuincalleria || [] })
  } catch (error) {
    console.error("Error creating quincalleria:", error)
    return Response.json({ error: "Failed to add quincalleria" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { id, ...datos } = await request.json()

    const updateData: Record<string, any> = {}

    if (datos.nombre !== undefined) updateData.nombre = datos.nombre
    if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion
    if (datos.precio !== undefined) updateData.precio = datos.precio

    const { error } = await supabase.from("quincalleria").update(updateData).eq("id", id)

    if (error) throw error

    const { data: allQuincalleria } = await supabase.from("quincalleria").select("*").order("id", { ascending: true })

    return Response.json({ data: allQuincalleria || [] })
  } catch (error) {
    console.error("Error updating quincalleria:", error)
    return Response.json({ error: "Failed to update quincalleria" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { id } = await request.json()

    const { error } = await supabase.from("quincalleria").delete().eq("id", id)

    if (error) throw error

    const { data: allQuincalleria } = await supabase.from("quincalleria").select("*").order("id", { ascending: true })

    return Response.json({ data: allQuincalleria || [] })
  } catch (error) {
    console.error("Error deleting quincalleria:", error)
    return Response.json({ error: "Failed to delete quincalleria" }, { status: 500 })
  }
}
