import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("tipos").select("*").order("id", { ascending: true })

    if (error) throw error
    return Response.json({ data: data || [] })
  } catch (error) {
    console.error("Error fetching tipos:", error)
    return Response.json({ error: "Failed to fetch tipos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("tipos")
      .insert([
        {
          descripcion: body.descripcion,
          precio_por_m2: body.precio_por_m2 || 0,
        },
      ])
      .select()

    if (error) throw error

    const { data: allTipos } = await supabase.from("tipos").select("*").order("id", { ascending: true })

    return Response.json({ data: allTipos || [] })
  } catch (error) {
    console.error("Error creating tipo:", error)
    return Response.json({ error: "Failed to add tipo" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { id, ...datos } = await request.json()

    const updateData: Record<string, any> = {}

    if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion
    if (datos.precio_por_m2 !== undefined) updateData.precio_por_m2 = datos.precio_por_m2

    const { error } = await supabase.from("tipos").update(updateData).eq("id", id)

    if (error) throw error

    const { data: allTipos } = await supabase.from("tipos").select("*").order("id", { ascending: true })

    return Response.json({ data: allTipos || [] })
  } catch (error) {
    console.error("Error updating tipo:", error)
    return Response.json({ error: "Failed to update tipo" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { id } = await request.json()

    const { error } = await supabase.from("tipos").delete().eq("id", id)

    if (error) throw error

    const { data: allTipos } = await supabase.from("tipos").select("*").order("id", { ascending: true })

    return Response.json({ data: allTipos || [] })
  } catch (error) {
    console.error("Error deleting tipo:", error)
    return Response.json({ error: "Failed to delete tipo" }, { status: 500 })
  }
}
