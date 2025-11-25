import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading PDF to Blob:", file.name)

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      console.error("[v0] BLOB_READ_WRITE_TOKEN not found")
      return NextResponse.json({ success: false, error: "Blob token not configured" }, { status: 500 })
    }

    const blob = await put(file.name, file, {
      access: "public",
      token: token,
    })

    console.log("[v0] PDF uploaded successfully:", blob.url)

    return NextResponse.json({
      success: true,
      url: blob.url,
    })
  } catch (error: any) {
    console.error("[v0] Error uploading PDF:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
