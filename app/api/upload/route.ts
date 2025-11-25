import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    const blob = await put(file.name, file, {
      access: "public",
    })

    return Response.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
