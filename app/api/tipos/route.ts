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
          material_id: body.materialId,
          ancho: body.ancho,
          alto: body.alto,
          cantidad_cristal: body.cantidadCristal,
          porcentaje_quincalleria: body.porcentajeQuincalleria || 0,
          largo_perfiles: body.largoPerfiles || 0,
          minimo: body.minimo || 0,
          maximo: body.maximo || 0,
          ganancia: body.ganancia || 0,
        },
      ])
      .select()

    if (error) throw error

    // Fetch all tipos to return updated list
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
    if (datos.materialId !== undefined) updateData.material_id = datos.materialId
    if (datos.ancho !== undefined) updateData.ancho = datos.ancho
    if (datos.alto !== undefined) updateData.alto = datos.alto
    if (datos.cantidadCristal !== undefined) updateData.cantidad_cristal = datos.cantidadCristal
    if (datos.porcentajeQuincalleria !== undefined) updateData.porcentaje_quincalleria = datos.porcentajeQuincalleria
    if (datos.largoPerfiles !== undefined) updateData.largo_perfiles = datos.largoPerfiles
    if (datos.minimo !== undefined) updateData.minimo = datos.minimo
    if (datos.maximo !== undefined) updateData.maximo = datos.maximo
    if (datos.ganancia !== undefined) updateData.ganancia = datos.ganancia

    const { error } = await supabase.from("tipos").update(updateData).eq("id", id)

    if (error) throw error

    // Fetch all tipos to return updated list
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

    // Fetch all tipos to return updated list
    const { data: allTipos } = await supabase.from("tipos").select("*").order("id", { ascending: true })

    return Response.json({ data: allTipos || [] })
  } catch (error) {
    console.error("Error deleting tipo:", error)
    return Response.json({ error: "Failed to delete tipo" }, { status: 500 })
  }
}
