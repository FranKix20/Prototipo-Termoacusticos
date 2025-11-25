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

    if (body.tipo === "Logo") {
      const { data: existingLogos } = await supabase.from("imagenes").select("*").eq("tipo", "Logo")

      if (existingLogos && existingLogos.length > 0) {
        return Response.json(
          { error: "Solo puede existir un logo. Por favor elimina el logo existente primero." },
          { status: 400 },
        )
      }
    }

    const insertData: any = {
      nombre: body.nombre,
      url: body.url,
      tipo: body.tipo,
    }

    if (body.tipo === "Producto" && body.producto_id) {
      insertData.producto_id = body.producto_id
    }

    const { data, error } = await supabase.from("imagenes").insert([insertData]).select()

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
