import { put } from "@vercel/blob"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    console.log("[v0] Upload request received")

    const token = process.env.BLOB_READ_WRITE_TOKEN

    if (!token) {
      console.error("[v0] BLOB_READ_WRITE_TOKEN not found in environment variables")
      return Response.json(
        { error: "Blob storage not configured. Please add BLOB_READ_WRITE_TOKEN environment variable." },
        { status: 500 },
      )
    }

    console.log("[v0] Token found, length:", token.length)

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("[v0] No file in request")
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading file:", file.name, "size:", file.size, "type:", file.type)

    const blob = await put(file.name, file, {
      access: "public",
      token: token,
    })

    console.log("[v0] Upload successful, URL:", blob.url)
    return Response.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return Response.json(
      { error: `Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
