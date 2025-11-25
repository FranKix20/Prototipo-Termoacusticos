import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log("[v0] Saving cotizacion to database:", body)

    const { clienteNombre, clienteRut, clienteCorreo, clienteTelefono, clienteDireccion, precioTotal, pdfUrl, items } =
      body

    const { data: cotizacion, error } = await supabase
      .from("cotizaciones")
      .insert({
        cliente_nombre: clienteNombre,
        cliente_rut: clienteRut,
        cliente_correo: clienteCorreo,
        cliente_telefono: clienteTelefono || "",
        cliente_direccion: clienteDireccion || "",
        precio_total: precioTotal,
        estado: "pendiente",
        notas: JSON.stringify({ pdfUrl }),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("[v0] Cotizacion saved with ID:", cotizacion.id)

    return NextResponse.json({
      success: true,
      cotizacion: {
        id: cotizacion.id,
        created_at: cotizacion.created_at,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error saving cotizacion:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    console.log("[v0] Fetching cotizaciones from database")

    const { data: cotizaciones, error } = await supabase
      .from("cotizaciones")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("[v0] Found cotizaciones:", cotizaciones.length)

    return NextResponse.json({
      success: true,
      cotizaciones,
    })
  } catch (error: any) {
    console.error("[v0] Error fetching cotizaciones:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
