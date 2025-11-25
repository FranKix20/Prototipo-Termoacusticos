"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Imagen, Tipo } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export default function ModificarImagenesPage() {
  const [imagenes, setImagenes] = useState<Imagen[]>([])
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newImage, setNewImage] = useState({
    nombre: "",
    url: "",
    tipo: "Producto" as "Logo" | "Producto" | "Pie de pagina" | "Encabezado",
    producto_id: "",
  })
  const [open, setOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchImagenes()
    fetchTipos()
  }, [])

  const fetchImagenes = async () => {
    try {
      const res = await fetch("/api/imagenes")
      const { data } = await res.json()
      setImagenes(data)
      setLoading(false)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar las imágenes", variant: "destructive" })
      setLoading(false)
    }
  }

  const fetchTipos = async () => {
    try {
      const res = await fetch("/api/tipos")
      const { data } = await res.json()
      setTipos(data || [])
    } catch (error) {
      console.error("Error loading tipos:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        console.log("[v0] Uploaded image URL:", url)
        setNewImage((prev) => ({
          ...prev,
          url: url,
          nombre: prev.nombre || file.name.replace(/\.[^/.]+$/, ""),
        }))
        toast({ title: "Imagen subida exitosamente" })
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast({ title: "Error al subir imagen", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleAdd = async () => {
    console.log("[v0] handleAdd called, newImage:", newImage)

    if (!newImage.url) {
      toast({ title: "Error", description: "Debes subir una imagen primero", variant: "destructive" })
      return
    }

    if (!newImage.nombre.trim()) {
      toast({ title: "Error", description: "Ingresa un nombre para la imagen", variant: "destructive" })
      return
    }

    if (newImage.tipo === "Producto" && !newImage.producto_id) {
      toast({ title: "Error", description: "Selecciona un producto específico", variant: "destructive" })
      return
    }

    const payload: any = {
      nombre: newImage.nombre.trim(),
      url: newImage.url,
      tipo: newImage.tipo,
    }

    if (newImage.tipo === "Producto" && newImage.producto_id) {
      payload.producto_id = Number.parseInt(newImage.producto_id)
    }

    console.log("[v0] Sending payload:", payload)
    setUploading(true)

    try {
      const res = await fetch("/api/imagenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log("[v0] Response:", data)

      if (res.ok) {
        await fetchImagenes()
        setNewImage({ nombre: "", url: "", tipo: "Producto", producto_id: "" })
        setOpen(false)
        toast({ title: "Éxito", description: "Imagen agregada correctamente" })
      } else {
        toast({ title: "Error", description: data.error || "No se pudo agregar la imagen", variant: "destructive" })
      }
    } catch (error) {
      console.error("[v0] Error:", error)
      toast({ title: "Error", description: "No se pudo agregar la imagen", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      try {
        await fetch("/api/imagenes", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        fetchImagenes()
        toast({ title: "Éxito", description: "Imagen eliminada correctamente" })
      } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar la imagen", variant: "destructive" })
      }
    }
  }

  const getProductoNombre = (productoId?: number) => {
    if (!productoId) return "N/A"
    const tipo = tipos.find((t) => t.id === productoId)
    return tipo ? tipo.descripcion : "N/A"
  }

  const imagesByType = {
    Logo: imagenes.filter((img) => img.tipo === "Logo"),
    Encabezado: imagenes.filter((img) => img.tipo === "Encabezado"),
    Producto: imagenes.filter((img) => img.tipo === "Producto"),
    "Pie de pagina": imagenes.filter((img) => img.tipo === "Pie de pagina"),
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/admin" className="hover:text-foreground">
          Home
        </Link>
        <span>›</span>
        <Link href="/admin/modificar" className="hover:text-foreground">
          Modificar
        </Link>
        <span>›</span>
        <span>Imágenes</span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Imágenes</h2>
          <p className="text-sm text-muted-foreground">
            Administra las imágenes que aparecerán en los PDFs de cotización
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPreview(!showPreview)}
            variant="outline"
            className="border-teal-600 text-teal-600 hover:bg-teal-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? "Ver Tabla" : "Vista Previa PDF"}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Imagen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Imagen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Subir Imagen</Label>
                  <Input id="file" type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                  {newImage.url && (
                    <div className="mt-2 p-2 border rounded bg-gray-50">
                      <img src={newImage.url || "/placeholder.svg"} alt="Preview" className="max-h-40 mx-auto" />
                      <p className="text-xs text-center text-green-600 mt-2">✓ Imagen cargada correctamente</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre descriptivo"
                    value={newImage.nombre}
                    onChange={(e) => setNewImage({ ...newImage, nombre: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Imagen *</Label>
                  <Select
                    value={newImage.tipo}
                    onValueChange={(value: any) => setNewImage({ ...newImage, tipo: value, producto_id: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Logo">Logo (Solo 1 permitido)</SelectItem>
                      <SelectItem value="Encabezado">Encabezado</SelectItem>
                      <SelectItem value="Producto">Producto</SelectItem>
                      <SelectItem value="Pie de pagina">Pie de Página</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {newImage.tipo === "Logo" && "Solo puede existir un logo"}
                    {newImage.tipo === "Encabezado" && "Se muestra en la parte superior del PDF"}
                    {newImage.tipo === "Producto" && "Se muestra junto al producto específico"}
                    {newImage.tipo === "Pie de pagina" && "Se muestra al final del PDF"}
                  </p>
                </div>

                {newImage.tipo === "Producto" && (
                  <div className="space-y-2">
                    <Label htmlFor="producto">Producto Específico *</Label>
                    <Select
                      value={newImage.producto_id}
                      onValueChange={(value) => setNewImage({ ...newImage, producto_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipos.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id.toString()}>
                            {tipo.descripcion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Esta imagen aparecerá junto a este producto en el PDF
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={uploading}
                  className="bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-400"
                >
                  {uploading ? "Procesando..." : "Agregar Imagen"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {imagenes.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-gray-50">
          <p className="text-muted-foreground mb-4">No hay imágenes cargadas</p>
        </div>
      ) : (
        <>
          {showPreview ? (
            <div className="space-y-6">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg max-w-4xl mx-auto">
                <div className="border-b-2 border-gray-200 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Previsualización en PDF</h3>
                  <p className="text-sm text-gray-500">Así es como se verán las imágenes en las cotizaciones</p>
                </div>

                {imagesByType.Logo.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-2">Logo</span>
                      <span className="text-xs text-gray-500">(Superior del PDF)</span>
                    </h4>
                    <div className="bg-muted p-4 rounded-lg flex justify-center">
                      <img
                        src={imagesByType.Logo[0].url || "/placeholder.svg"}
                        alt="Logo"
                        className="h-20 object-contain"
                      />
                    </div>
                  </div>
                )}

                {imagesByType.Encabezado.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-2">
                        Encabezado
                      </span>
                    </h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        {imagesByType.Encabezado.map((img) => (
                          <img
                            key={img.id}
                            src={img.url || "/placeholder.svg"}
                            alt={img.nombre}
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {imagesByType.Producto.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">Productos</span>
                      <span className="text-xs text-gray-500">(Junto a cada item)</span>
                    </h4>
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      {imagesByType.Producto.map((img) => (
                        <div key={img.id} className="flex items-center gap-4 bg-background p-3 rounded">
                          <img
                            src={img.url || "/placeholder.svg"}
                            alt={img.nombre}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{getProductoNombre(img.producto_id)}</p>
                            <p className="text-sm text-muted-foreground">La imagen aparece junto a este producto</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imagesByType["Pie de pagina"].length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm mr-2">
                        Pie de Página
                      </span>
                      <span className="text-xs text-gray-500">(Inferior del PDF)</span>
                    </h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="grid grid-cols-3 gap-2">
                        {imagesByType["Pie de pagina"].map((img) => (
                          <img
                            key={img.id}
                            src={img.url || "/placeholder.svg"}
                            alt={img.nombre}
                            className="w-full h-16 object-contain"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t-2 border-gray-200 pt-4 mt-6">
                  <p className="text-xs text-gray-500 text-center">
                    Esta previsualización muestra cómo se organizarán las imágenes en el PDF de cotización
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[100px]">Vista Previa</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {imagenes.map((imagen) => (
                    <TableRow key={imagen.id}>
                      <TableCell>
                        <div className="w-16 h-16 border border-gray-200 rounded overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img
                            src={imagen.url || "/placeholder.svg"}
                            alt={imagen.nombre}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{imagen.nombre}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            imagen.tipo === "Logo"
                              ? "bg-purple-100 text-purple-800"
                              : imagen.tipo === "Encabezado"
                                ? "bg-green-100 text-green-800"
                                : imagen.tipo === "Producto"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {imagen.tipo}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {imagen.tipo === "Producto" ? getProductoNombre(imagen.producto_id) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(imagen.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
