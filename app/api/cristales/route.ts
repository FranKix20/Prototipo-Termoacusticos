import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("cristales").select("*").order("id", { ascending: true })

    if (error) throw error
    return Response.json({ data: data || [] })
  } catch (error) {
    console.error("Error fetching cristales:", error)
    return Response.json({ error: "Failed to fetch cristales" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("cristales")
      .insert([
        {
          descripcion: body.descripcion,
          precio: body.precio,
        },
      ])
      .select()

    if (error) throw error

    const { data: allCristales } = await supabase.from("cristales").select("*").order("id", { ascending: true })

    return Response.json({ data: allCristales || [] })
  } catch (error) {
    console.error("Error creating cristal:", error)
    return Response.json({ error: "Failed to add cristal" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { id, ...datos } = await request.json()

    const updateData: Record<string, any> = {}

    if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion
    if (datos.precio !== undefined) updateData.precio = datos.precio

    const { error } = await supabase.from("cristales").update(updateData).eq("id", id)

    if (error) throw error

    const { data: allCristales } = await supabase.from("cristales").select("*").order("id", { ascending: true })

    return Response.json({ data: allCristales || [] })
  } catch (error) {
    console.error("Error updating cristal:", error)
    return Response.json({ error: "Failed to update cristal" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { id } = await request.json()

    const { error } = await supabase.from("cristales").delete().eq("id", id)

    if (error) throw error

    const { data: allCristales } = await supabase.from("cristales").select("*").order("id", { ascending: true })

    return Response.json({ data: allCristales || [] })
  } catch (error) {
    console.error("Error deleting cristal:", error)
    return Response.json({ error: "Failed to delete cristal" }, { status: 500 })
  }
}
