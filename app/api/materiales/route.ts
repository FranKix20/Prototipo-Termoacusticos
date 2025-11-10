import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("materiales").select("*").order("id", { ascending: true })

    if (error) throw error
    return Response.json({ data: data || [] })
  } catch (error) {
    console.error("Error fetching materiales:", error)
    return Response.json({ error: "Failed to fetch materiales" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("materiales")
      .insert([
        {
          nombre: body.nombre,
          texto_libre_pdf: body.textoLibrePDF,
          texto1: body.texto1,
          texto2: body.texto2,
        },
      ])
      .select()

    if (error) throw error

    const { data: allMateriales } = await supabase.from("materiales").select("*").order("id", { ascending: true })

    return Response.json({ data: allMateriales || [] })
  } catch (error) {
    console.error("Error creating material:", error)
    return Response.json({ error: "Failed to add material" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { id, ...datos } = await request.json()

    const updateData: Record<string, any> = {}

    if (datos.nombre !== undefined) updateData.nombre = datos.nombre
    if (datos.textoLibrePDF !== undefined) updateData.texto_libre_pdf = datos.textoLibrePDF
    if (datos.texto1 !== undefined) updateData.texto1 = datos.texto1
    if (datos.texto2 !== undefined) updateData.texto2 = datos.texto2

    const { error } = await supabase.from("materiales").update(updateData).eq("id", id)

    if (error) throw error

    const { data: allMateriales } = await supabase.from("materiales").select("*").order("id", { ascending: true })

    return Response.json({ data: allMateriales || [] })
  } catch (error) {
    console.error("Error updating material:", error)
    return Response.json({ error: "Failed to update material" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { id } = await request.json()

    const { error } = await supabase.from("materiales").delete().eq("id", id)

    if (error) throw error

    const { data: allMateriales } = await supabase.from("materiales").select("*").order("id", { ascending: true })

    return Response.json({ data: allMateriales || [] })
  } catch (error) {
    console.error("Error deleting material:", error)
    return Response.json({ error: "Failed to delete material" }, { status: 500 })
  }
}
