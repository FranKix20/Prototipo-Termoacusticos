import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("imagenes").select("*").order("id", { ascending: true })

    if (error) throw error
    return Response.json({ data: data || [] })
  } catch (error) {
    console.error("Error fetching imagenes:", error)
    return Response.json({ error: "Failed to fetch imagenes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("imagenes")
      .insert([
        {
          nombre: body.nombre,
          url: body.url,
          tipo: body.tipo,
        },
      ])
      .select()

    if (error) throw error

    const { data: allImagenes } = await supabase.from("imagenes").select("*").order("id", { ascending: true })

    return Response.json({ data: allImagenes || [] })
  } catch (error) {
    console.error("Error creating imagen:", error)
    return Response.json({ error: "Failed to add imagen" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { id } = await request.json()

    const { error } = await supabase.from("imagenes").delete().eq("id", id)

    if (error) throw error

    const { data: allImagenes } = await supabase.from("imagenes").select("*").order("id", { ascending: true })

    return Response.json({ data: allImagenes || [] })
  } catch (error) {
    console.error("Error deleting imagen:", error)
    return Response.json({ error: "Failed to delete imagen" }, { status: 500 })
  }
}
