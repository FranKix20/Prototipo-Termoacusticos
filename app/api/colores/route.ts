import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("colores").select("*").order("id", { ascending: true })

    if (error) throw error
    return Response.json({ data: data || [] })
  } catch (error) {
    console.error("Error fetching colores:", error)
    return Response.json({ error: "Failed to fetch colores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("colores")
      .insert([{ nombre: body.nombre }])
      .select()

    if (error) throw error

    const { data: allColores } = await supabase.from("colores").select("*").order("id", { ascending: true })

    return Response.json({ data: allColores || [] })
  } catch (error) {
    console.error("Error creating color:", error)
    return Response.json({ error: "Failed to add color" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { id, ...datos } = await request.json()

    const updateData: Record<string, any> = {}

    if (datos.nombre !== undefined) updateData.nombre = datos.nombre

    const { error } = await supabase.from("colores").update(updateData).eq("id", id)

    if (error) throw error

    const { data: allColores } = await supabase.from("colores").select("*").order("id", { ascending: true })

    return Response.json({ data: allColores || [] })
  } catch (error) {
    console.error("Error updating color:", error)
    return Response.json({ error: "Failed to update color" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { id } = await request.json()

    const { error } = await supabase.from("colores").delete().eq("id", id)

    if (error) throw error

    const { data: allColores } = await supabase.from("colores").select("*").order("id", { ascending: true })

    return Response.json({ data: allColores || [] })
  } catch (error) {
    console.error("Error deleting color:", error)
    return Response.json({ error: "Failed to delete color" }, { status: 500 })
  }
}
