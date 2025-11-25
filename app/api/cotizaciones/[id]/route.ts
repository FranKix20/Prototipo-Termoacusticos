import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const maxDuration = 60

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()
    const { estado } = body

    console.log("[v0] Updating cotizacion", id, "to estado:", estado)

    const { error } = await supabase.from("cotizaciones").update({ estado }).eq("id", id)

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error updating cotizacion:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await params

    console.log("[v0] Deleting cotizacion", id)

    const { error } = await supabase.from("cotizaciones").delete().eq("id", id)

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error deleting cotizacion:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
